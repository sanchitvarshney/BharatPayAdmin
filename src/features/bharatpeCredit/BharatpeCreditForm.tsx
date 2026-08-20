import React from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import {
  createBharatpeCredit,
  updateBharatpeCredit,
} from "@/features/bharatpeCredit/bharatpeCreditSlice";
import LoadingButton from "@mui/lab/LoadingButton";
import { Box, Card, CardContent, Divider, MenuItem, Select, Typography } from "@mui/material";
import { Icons } from "@/components/icons/icons";
import SelectComponent from "@/components/reusable/SelectComponent";
import { showToast } from "@/utills/toasterContext";

const optionSchema = z
  .object({
    id: z.string(),
    text: z.string(),
    part_code: z.string(),
  })
  .nullable()
  .refine((val) => val !== null, {
    message: "This field is required",
  });

const schema = z.object({
  show: optionSchema,

  calculate: optionSchema,

  type: z
    .string()
    .nullable()
    .refine((value) => value !== null && value !== "", {
      message: "This field is required",
    }),
});

type BharatpeCreditFormValues = {
  show:
    | {
        id: string;
        text: string;
        part_code: string;
      }
    | null;

  calculate:
    | {
        id: string;
        text: string;
        part_code: string;
      }
    | null;

  type: string | null;
};

export const BLANK_BHARATPE_CREDIT_FORM: BharatpeCreditFormValues = {
 show: null,
  calculate: null,
  type: null,
};

type Props = {
  mode?: "create" | "edit";
  recordKey?: string;
  defaultValues?: BharatpeCreditFormValues;
  onSuccess?: () => void;
};

const BharatpeCreditForm: React.FC<Props> = ({
  mode = "create",
  recordKey,
  defaultValues = BLANK_BHARATPE_CREDIT_FORM,
  onSuccess,
}) => {
  const dispatch = useAppDispatch();
  const { createBharatpeCreditLoading, updateBharatpeCreditLoading } =
    useAppSelector((state) => state.bharatpeCredit);
  const submitLoading =
    mode === "edit" ? updateBharatpeCreditLoading : createBharatpeCreditLoading;

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<BharatpeCreditFormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as BharatpeCreditFormValues,
  });

  const onSubmit = (data: BharatpeCreditFormValues) => {
    const payload = {
      display_item: data.show!.id,
      source_item: data.calculate!.id,
      operation: data.type,
    };

    if(payload.display_item === payload.source_item){
      showToast("Show Part Code and Calculate  Part Code From should be different", "error");
      return
    }

    if (mode === "edit" && recordKey) {
      dispatch(
        updateBharatpeCredit({
          payload: { item_id: recordKey, ...payload },
        }),
      ).then((res: any) => {
        if (res.payload?.data?.success) {
          onSuccess?.();
        }
      });
    } else {
      dispatch(createBharatpeCredit(payload)).then((res: any) => {
        if (res.payload?.data?.success) {
          reset();
          onSuccess?.();
        }
      });
    }
  };

  const fields = (
    <div className="grid grid-cols-1 gap-[10px]">
      <div className="flex flex-col gap-[4px]">
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          Part Code <span style={{ color: "red" }}>*</span>
        </Typography>
        <Controller
          name="show"
          control={control}
          render={({ field }) => (
            <SelectComponent
              required
              value={field.value}
              onChange={field.onChange}
              error={!!errors.show}
              helperText={errors.show?.message}
            />
          )}
        />
      </div>
      <div className="flex flex-col gap-[4px]">
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          Calculate Part Code From <span style={{ color: "red" }}>*</span>
        </Typography>
        <Controller
          name="calculate"
          control={control}
          render={({ field }) => (
            <SelectComponent
              required
              value={field.value}
              onChange={field.onChange}
              error={!!errors.calculate}
              helperText={errors.calculate?.message}
            />
          )}
        />
      </div>
      <div className="flex flex-col gap-[4px]">
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          Type <span style={{ color: "red" }}>*</span>
        </Typography>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              required
              fullWidth
              error={!!errors.type}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              size="small"
              //@ts-ignore
              helperText={errors.type?.message}
            >
              <MenuItem value="INWARD">INWARD</MenuItem>
              <MenuItem value="CONSUMPTION">CONSUMPTION</MenuItem>
            </Select>
          )}
        />
      </div>
    </div>
  );

  const submitButton = (
    <LoadingButton
      startIcon={<Icons.save fontSize="small" />}
      loading={submitLoading}
      variant="contained"
      type="submit"
      fullWidth={mode === "edit"}
    >
      {mode === "edit" ? "Update" : "Submit"}
    </LoadingButton>
  );

  if (mode === "edit") {
    return (
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-[20px]">
        {fields}
        <Divider sx={{ borderColor: "divider" }} />
        {submitButton}
      </form>
    );
  }

  return (
    <Box sx={{ display: "flex", justifyContent: "center", width: "100%", alignItems: "center" , height:"calc(100vh - 160px)"}}>
      <Card
        variant="outlined"
        sx={{
          width: "100%",
          maxWidth: 620,
          borderRadius: "12px",
          borderColor: "divider",
        }}
      >
        <CardContent sx={{ p: "24px" }}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-[20px]"
          >
            <div>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>Create BharatPe Credit</Typography>

            </div>

            {fields}

            <Divider sx={{ borderColor: "divider" }} />

            <div className="flex items-center justify-end gap-[10px]">
              {submitButton}
            </div>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default BharatpeCreditForm;
