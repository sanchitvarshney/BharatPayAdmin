import React from "react";
import { IconButton, InputLabel, MenuItem } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useForm, Controller, useFieldArray, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { createMasterRate, updateMasterRate } from "@/features/masterRate/masterRateSlice";
import LoadingButton from "@mui/lab/LoadingButton";
import { Icons } from "@/components/icons/icons";
import SelectSKU from "@/components/reusable/SelectSKU";
import MasterRateEntriesGrid, {
  NumericEditCell,
} from "@/features/masterRate/MasterRateEntriesGrid";
import { GridRenderCellParams, GridRenderEditCellParams } from "@mui/x-data-grid";
import { showToast } from "@/utills/toasterContext";

export const DEVICE_TYPES = {
  SOUND_BOX: "soundBox",
  SWIPE_MACHINE: "swipeMachine",
};

// Returns a message describing the first overlapping pair of ranges, or null if none overlap
const findOverlapMessage = (
  entries: { minRange: number; maxRange: number }[],
): string | null => {
  const sorted = entries
    .map((entry, index) => ({ ...entry, index }))
    .sort((a, b) => a.minRange - b.minRange);

  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1];
    const curr = sorted[i];
    if (curr.minRange <= prev.maxRange) {
      return `Range ${curr.minRange} - ${curr.maxRange} overlaps with ${prev.minRange} - ${prev.maxRange}`;
    }
  }
  return null;
};

const entrySchema = z.object({
  rateId: z.number().optional(),
  minRange: z.number().min(0, "Min range must be a positive number"),
  maxRange: z.number().min(0, "Max range must be a positive number"),
  rate: z.number().min(0, "Rate must be a positive number"),
});

const skuSchema = z
  .object({
    id: z.string(),
    text: z.string(),
  })
  .nullable()
  .superRefine((value, ctx) => {
    if (value === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Product SKU is required",
      });
    }
  });
const schema = z.object({
  type: z.string().nonempty("Device type is required"),
  sku: skuSchema,
  entries: z
    .array(entrySchema)
    .min(1, "At least one entry is required")
    .superRefine((entries, ctx) => {
      entries.forEach((entry, index) => {
        if (entry.maxRange <= entry.minRange) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Max range must be greater than min range",
            path: [index, "maxRange"],
          });
        }
      });

      const sorted = entries.map((entry, index) => ({ ...entry, index })).sort((a, b) => a.minRange - b.minRange);

      for (let i = 1; i < sorted.length; i++) {
        const prev = sorted[i - 1];
        const curr = sorted[i];
        if (curr.minRange <= prev.maxRange) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Range overlaps with ${prev.minRange} - ${prev.maxRange}`,
            path: [curr.index, "minRange"],
          });
        }
      }
    }),
});

export type MasterRateFormValues = z.infer<typeof schema>;

export const BLANK_MASTER_RATE_FORM: MasterRateFormValues = {
  type: "",
  sku: null,
  entries: [{ minRange: 0, maxRange: 1000, rate: 0 }],
};

type Props = {
  mode?: "create" | "edit";
  productKey?: string;
  defaultValues?: MasterRateFormValues;
  onSuccess?: () => void;
};


const MasterRateForm: React.FC<Props> = ({ mode = "create", productKey, defaultValues = BLANK_MASTER_RATE_FORM, onSuccess,  }) => {
    const handleAddRange = () => {
    const entries = getValues("entries") || [];
    const last = entries[entries.length - 1];
    const nextMin = last ? last.maxRange + 1 : 0;
    append({ minRange: nextMin, maxRange: nextMin + 100, rate: 0 });
  };

  const handleRemoveRange = (index: number) => {
    remove(index);
  };

  const dispatch = useAppDispatch();
  const { createMasterRateLoading, updateMasterRateLoading } = useAppSelector((state) => state.masterRate);
  const submitLoading = mode === "edit" ? updateMasterRateLoading : createMasterRateLoading;
  const {
    handleSubmit,
    control,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<MasterRateFormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as MasterRateFormValues,
  });
  const { fields, append, remove } = useFieldArray({ control, name: "entries" });
  const type = useWatch({ control, name: "type" });
  const watchedEntries = useWatch({ control, name: "entries" });



const onSubmit = (data: MasterRateFormValues) => {

  for (let i = 1; i < data.entries.length; i++) {
    const previous = data.entries[i - 1];
    const current = data.entries[i];

    const expectedMin = Number(previous.maxRange) + 1;
    const currentMin = Number(current.minRange);

    if (currentMin !== expectedMin) {
      showToast(`Range ${i + 1} must start from ${expectedMin}.`, "error");
      return;
    }


    if (Number(current.maxRange) < currentMin) {
      showToast(
        `Range ${i + 1}: Count To must be greater than or equal to Count From.`,
        "error",
      );
      return;
    }
  }

  const payload = {
    device_type: data.type,
    product_sku: data.sku?.id as string,
    entries: data.entries.map((entry) => ({
      rate_id: entry.rateId,
      count_from: entry.minRange,
      count_to: entry.maxRange,
      rate: entry.rate,
    })),
  };

  if (mode === "edit" && productKey) {
    dispatch(updateMasterRate({ payload })).then((res: any) => {
      if (res.payload?.data?.success) {
        onSuccess?.();
      }
    });
  } else {
    dispatch(createMasterRate(payload)).then((res: any) => {
      if (res.payload?.data?.success) {
        reset();
        onSuccess?.();
      }
    });
  }
};

    const columns: any[] = [
    {
      field: "action",
      headerName: (
        <IconButton size="small" onClick={handleAddRange} title="Add range" color="success">
          <Icons.add fontSize="small" />
        </IconButton>
      ),
      headerClassName: "w-10",
      width: 60,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams<any>) => (
        <div className="flex flex-col items-center justify-center h-full py-1">
          <IconButton
            size="small"
            onClick={() => handleRemoveRange(params.row.index)}
            disabled={fields.length === 1}
            title="Remove range"
            color="error"
          >
            <Icons.delete fontSize="small" />
          </IconButton>
        </div>
      ),
    },
    {
      field: "minRange",
      headerName: "Min Range",
      flex: 1,
      editable: true,
      type: "number",
      renderEditCell: (params: GridRenderEditCellParams) => (
        <NumericEditCell {...params} />
      ),
      cellClassName: (params:any) =>
        errors.entries?.[params.row.index]?.minRange ? "bg-red-50" : "",
    },
    {
      field: "maxRange",
      headerName: "Max Range",
      flex: 1,
      editable: true,
      type: "number",
      renderEditCell: (params: GridRenderEditCellParams) => (
        <NumericEditCell {...params} />
      ),
      cellClassName: (params:any) =>
        errors.entries?.[params.row.index]?.maxRange ? "bg-red-50" : "",
    },
    {
      field: "rate",
      headerName: "Rate",
      flex: 1,
      editable: true,
      type: "number",
      renderEditCell: (params: GridRenderEditCellParams) => (
        <NumericEditCell {...params} />
      ),
      cellClassName: (params:any) =>
        errors.entries?.[params.row.index]?.rate ? "bg-red-50" : "",
    },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mt-[20px] grid grid-cols-2 gap-[30px]">
        {/* Device Type */}
        <div className=" gap-2 ">
          <FormControl variant="filled" sx={{ minWidth: "100%" }} error={!!errors.type}>
            <InputLabel>Device Type</InputLabel>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select {...field} label="Device Type" fullWidth>
                  <MenuItem value={DEVICE_TYPES.SOUND_BOX}>Sound Box</MenuItem>
                  <MenuItem value={DEVICE_TYPES.SWIPE_MACHINE}>Swipe Machine</MenuItem>
                </Select>
              )}
            />
            {errors.type && <p className="text-red-600 text-[13px]">{errors.type.message}</p>}
          </FormControl>
        </div>

        <div className=" gap-2 ">
          <Controller
            name="sku"
            control={control}
            render={({ field }) => (
              <SelectSKU
                varient="filled"
                label="Product SKU"
                onChange={field.onChange}
                value={field.value}
                error={!!errors.sku}
                helperText={errors.sku?.message}
                quaryValue={type === DEVICE_TYPES.SOUND_BOX ? "soundBox" : "swipeMachine"}
              />
            )}
          />
        </div>

     
      </div>
         <div className=" mt-[20px] ">
          <MasterRateEntriesGrid
            data={(watchedEntries || []).map((entry, index) => ({
              ...entry,
              id: fields[index]?.id ?? String(index),
              index,
            }))}
            onUpdate={(index, value) => {
              setValue(`entries.${index}`, value, { shouldValidate: false, shouldDirty: true });
              const updatedEntries = (getValues("entries") || []).map((entry, i) =>
                i === index ? value : entry,
              );
              const overlapMessage = findOverlapMessage(updatedEntries);
              if (overlapMessage) {
                showToast(overlapMessage, "error");
              }
            }}
            columns={columns}
            h= { mode === "edit" ? "calc(100vh - 245px)" : "calc(100vh - 320px)"}
          />
        </div>

      <div className="mt-[20px] flex items-center justify-end gap-[10px]">
        <LoadingButton startIcon={<Icons.save fontSize="small" />} loading={submitLoading} variant="contained" type="submit">
          {mode === "edit" ? "Update" : "Submit"}
        </LoadingButton>
      </div>
    </form>
  );
};

export default MasterRateForm;
