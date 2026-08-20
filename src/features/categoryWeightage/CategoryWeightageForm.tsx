import React from "react";
import { IconButton } from "@mui/material";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import {
  createCategoryWeightage,
  updateCategoryWeightage,
} from "@/features/categoryWeightage/categoryWeightageSlice";
import LoadingButton from "@mui/lab/LoadingButton";
import { Icons } from "@/components/icons/icons";
import CategoryWeightageEntriesGrid from "@/features/categoryWeightage/CategoryWeightageEntriesGrid";
import {
  GridRenderCellParams,
  GridRenderEditCellParams,
} from "@mui/x-data-grid";
import { NumericEditCell } from "@/features/masterRate/MasterRateEntriesGrid";
import SelectComponent, {
  ComponentType,
} from "@/components/reusable/SelectComponent";

export const COMPONENT_STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
};

const componentSchema = z
  .object({
    id: z.string(),
    text: z.string(),
    part_code: z.string(),
  })
  .nullable()
  .superRefine((value, ctx) => {
    if (value === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Component is required",
      });
    }
  });

const entrySchema = z.object({
  component: componentSchema,
  percentage: z
    .number()
    .min(0, "Percentage cannot be negative")
    .max(100, "Percentage cannot exceed 100"),
  status: z.string().nonempty("Status is required"),
});

const schema = z.object({
  components: z.array(entrySchema).min(1, "At least one component is required"),
});

export type CategoryWeightageFormValues = z.infer<typeof schema>;

export const BLANK_CATEGORY_WEIGHTAGE_FORM: CategoryWeightageFormValues = {
  components: [
    { component: null, percentage: 0, status: COMPONENT_STATUS.ACTIVE },
  ],
};

type Props = {
  mode?: "create" | "edit";
  categoryKey?: string;
  defaultValues?: CategoryWeightageFormValues;
  onSuccess?: () => void;
};

const CategoryWeightageForm: React.FC<Props> = ({
  mode = "create",
  categoryKey,
  defaultValues = BLANK_CATEGORY_WEIGHTAGE_FORM,
  onSuccess,
}) => {
  const handleAddComponent = () => {
    append({ component: null, percentage: 0, status: COMPONENT_STATUS.ACTIVE });
  };

  const handleRemoveComponent = (index: number) => {
    remove(index);
  };

  const dispatch = useAppDispatch();
  const { createCategoryWeightageLoading, updateCategoryWeightageLoading } =
    useAppSelector((state) => state.categoryWeightage);
  const submitLoading =
    mode === "edit"
      ? updateCategoryWeightageLoading
      : createCategoryWeightageLoading;
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CategoryWeightageFormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as CategoryWeightageFormValues,
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "components",
  });
  const watchedComponents = useWatch({ control, name: "components" });

  const onSubmit = (data: CategoryWeightageFormValues) => {
    if (mode === "edit" && categoryKey) {
      dispatch(
        updateCategoryWeightage({
          payload: {
            items: data.components.map((component) => ({
              part_code: component.component!.part_code,
              wastage_percent: component.percentage,
            })),
          },
        }),
      ).then((res: any) => {
        if (res.payload?.data?.success) {
          onSuccess?.();
        }
      });
    } else {
      dispatch(
        createCategoryWeightage({
          items: data.components.map((component) => ({
            part_code: component.component!.part_code,
            wastage_percent: component.percentage,
          })),
        }),
      ).then((res: any) => {
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
        <IconButton
          size="small"
          onClick={handleAddComponent}
          title="Add component"
          color="success"
        >
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
        <div className="w-full h-full" onKeyDown={(e) => e.stopPropagation()}>
          <SelectComponent
            value={params.row.component}
            varient="standard"
            size="medium"
            onChange={(value) =>
              setValue(
                `components.${params.row.index}.component`,
                value as ComponentType,
                {
                  shouldValidate: true,
                  shouldDirty: true,
                },
              )
            }
          />
        </div>
      ),
      cellClassName: (params: any) =>
        errors.components?.[params.row.index]?.component ? "bg-red-50" : "",
    },
    {
      field: "percentage",
      headerName: "Percentage",
      flex: 1,
      editable: true,
      type: "number",
      renderEditCell: (params: GridRenderEditCellParams) => (
        <NumericEditCell {...params} />
      ),
      cellClassName: (params: any) =>
        errors.components?.[params.row.index]?.percentage ? "bg-red-50" : "",
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
      <div className="mt-[20px]">
        <CategoryWeightageEntriesGrid
          data={(watchedComponents || []).map((component, index) => ({
            ...component,
            id: fields[index]?.id ?? String(index),
            index,
          }))}
          onUpdate={(index, value) => {
            setValue(`components.${index}`, value, {
              shouldValidate: false,
              shouldDirty: true,
            });
          }}
          columns={columns}
          h={mode === "edit" ? "calc(100vh - 245px)" : "calc(100vh - 250px)"}
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

export default CategoryWeightageForm;
