import React from "react";
import { IconButton, TextField } from "@mui/material";
import { useForm, Controller, useFieldArray, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { createCategoryRate, updateCategoryRate } from "@/features/categoryRate/categoryRateSlice";
import LoadingButton from "@mui/lab/LoadingButton";
import { Icons } from "@/components/icons/icons";
import CategoryRateEntriesGrid from "@/features/categoryRate/CategoryRateEntriesGrid";
import { GridRenderCellParams, GridRenderEditCellParams } from "@mui/x-data-grid";
import { NumericEditCell } from "@/features/masterRate/MasterRateEntriesGrid";
import SelectComponent, { ComponentType } from "@/components/reusable/SelectComponent";

export const COMPONENT_STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
};

const componentSchema = z
  .object({ id: z.string(), text: z.string(), part_code: z.string() })
  .nullable()
  .refine((val) => !!val, { message: "Component is required" });

const entrySchema = z.object({
  component: componentSchema,
  rate: z.number().min(0, "Rate must be a positive number"),
  status: z.string().nonempty("Status is required"),
});

const schema = z.object({
  categoryName: z
    .string()
    .min(1, "Category Name is required")
    .max(200, "Category Name must be 200 characters or less"),
  components: z.array(entrySchema).min(1, "At least one component is required"),
});

export type CategoryRateFormValues = z.infer<typeof schema>;

export const BLANK_CATEGORY_RATE_FORM: CategoryRateFormValues = {
  categoryName: "",
  components: [{ component: null, rate: 0, status: COMPONENT_STATUS.ACTIVE }],
};

type Props = {
  mode?: "create" | "edit";
  categoryKey?: string;
  defaultValues?: CategoryRateFormValues;
  onSuccess?: () => void;
};

const CategoryRateForm: React.FC<Props> = ({ mode = "create", categoryKey, defaultValues = BLANK_CATEGORY_RATE_FORM, onSuccess }) => {
  const handleAddComponent = () => {
    append({ component: null, rate: 0, status: COMPONENT_STATUS.ACTIVE });
  };

  const handleRemoveComponent = (index: number) => {
    remove(index);
  };

  const dispatch = useAppDispatch();
  const { createCategoryRateLoading, updateCategoryRateLoading } = useAppSelector((state) => state.categoryRate);
  const submitLoading = mode === "edit" ? updateCategoryRateLoading : createCategoryRateLoading;
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CategoryRateFormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as CategoryRateFormValues,
  });
  const { fields, append, remove } = useFieldArray({ control, name: "components" });
  const watchedComponents = useWatch({ control, name: "components" });

  const onSubmit = (data: CategoryRateFormValues) => {
    const components = data.components.map((component) => ({
      component_key: component.component!.id,
      rate: component.rate,
      status: component.status,
    }));

    if (mode === "edit" && categoryKey) {
      dispatch(
        updateCategoryRate({
          payload: { category_key: categoryKey, category_name: data.categoryName, components },
        }),
      ).then((res: any) => {
        if (res.payload?.data?.success) {
          onSuccess?.();
        }
      });
    } else {
      dispatch(createCategoryRate({ category_name: data.categoryName, components })).then((res: any) => {
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
        <IconButton size="small" onClick={handleAddComponent} title="Add component" color="success">
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
            onClick={() => handleRemoveComponent(params.row.index)}
            disabled={fields.length === 1}
            title="Remove component"
            color="error"
          >
            <Icons.delete fontSize="small" />
          </IconButton>
        </div>
      ),
    },
    {
      field: "component",
      headerName: "Component",
      flex: 1.5,
      editable: false,
     renderCell: (params: GridRenderCellParams<any>) => (
  <SelectComponent
    value={params.row.component}
    
    varient="standard"
    size="medium"
    onChange={(value) =>
      setValue(`components.${params.row.index}.component`, value as ComponentType, {
        shouldValidate: true,
        shouldDirty: true,
      })
    }
  />
),
      cellClassName: (params: any) =>
        errors.components?.[params.row.index]?.component ? "bg-red-50" : "",
    },
    {
      field: "rate",
      headerName: "Rate",
      flex: 1,
      editable: true,
      type: "number",
      renderEditCell: (params: GridRenderEditCellParams) => <NumericEditCell {...params} />,
      cellClassName: (params: any) =>
        errors.components?.[params.row.index]?.rate ? "bg-red-50" : "",
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      editable: true,
      type: "singleSelect",
      valueOptions: [COMPONENT_STATUS.ACTIVE, COMPONENT_STATUS.INACTIVE],
      cellClassName: (params: any) =>
        errors.components?.[params.row.index]?.status ? "bg-red-50" : "",
    },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mt-[20px] grid grid-cols-2 gap-[30px]">
        <div className="gap-2">
          <Controller
            name="categoryName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                variant="filled"
                label="Category Name"
                fullWidth
                error={!!errors.categoryName}
                helperText={errors.categoryName?.message}
              />
            )}
          />
        </div>
      </div>

      <div className="mt-[20px]">
        <CategoryRateEntriesGrid
          data={(watchedComponents || []).map((component, index) => ({
            ...component,
            id: fields[index]?.id ?? String(index),
            index,
          }))}
          onUpdate={(index, value) => {
            setValue(`components.${index}`, value, { shouldValidate: false, shouldDirty: true });
          }}
          columns={columns}
          h={mode === "edit" ? "calc(100vh - 245px)" : "calc(100vh - 320px)"}
        />
      </div>

      <div className="mt-[20px] flex items-center justify-end gap-[10px]">
        <LoadingButton
          startIcon={<Icons.save fontSize="small" />}
          loading={submitLoading}
          variant="contained"
          type="submit"
        >
          {mode === "edit" ? "Update" : "Submit"}
        </LoadingButton>
      </div>
    </form>
  );
};

export default CategoryRateForm;
