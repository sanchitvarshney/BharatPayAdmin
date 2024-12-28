import React, { useEffect } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, InputLabel, LinearProgress, MenuItem, TextField } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateMenuType } from "@/features/menu/menuType";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { createMenu, getMenuList, updateUserMenu } from "@/features/menu/menuSlice";
import LoadingButton from "@mui/lab/LoadingButton";
import { Icons } from "@/components/icons/icons";

// Define Zod schema
const schema = z
  .object({
    project: z.string().nonempty("Project name is required"),
    name: z.string().nonempty("Page name is required"),
    is_parent: z.string().nonempty("Please select if it's a parent"),
    parent_menu_key: z.string().optional(),
    url: z.string().optional(), // Initially optional
    icon: z.string().nonempty("Icon is required"),
    order: z.string().min(1, "Order must be at least 1"),
    description: z.string().nonempty("Description is required"),
  })
  .superRefine((data, ctx) => {
    // Custom validation to conditionally require the URL field
    if (data.is_parent === "N" && !data.url) {
      ctx.addIssue({
        path: ["url"],
        message: "Page URL is required",
        code: z.ZodIssueCode.custom,
      });
    }
  });

// Infer the form values from Zod schema
type FormValues = z.infer<typeof schema>;

interface CreateMenuProps {
  open: any;
  onClose: () => void;
  selectedRow: any;
  data?: any;
  menuId?: any;
  setMenu: any;
}

const CreateMenu: React.FC<CreateMenuProps> = ({ open, onClose, selectedRow, data, menuId,setMenu }) => {
  const dispatch = useAppDispatch();

  const { createMenuLoading } = useAppSelector((state) => state.menu);
  const {
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const parent = watch("is_parent");

  useEffect(() => {
    if (parent == "Y") {
      setValue("parent_menu_key", selectedRow.name);
      setValue("url", undefined); // Clear the URL field if it's a parent
    }
  }, [parent]);

  const onSubmit = (data: FormValues) => {
    const payload: CreateMenuType = {
      project: data.project,
      name: data.name,
      isParent: data.is_parent === "N" ? false : true,
      parent_menu_key: menuId ? menuId : selectedRow.menu_key,
      url: data.url,
      description: data.description,
      icon: data.icon,
      order: data.order,
      is_active: true,
      has_parent: true,
    };

    if (menuId) {
      dispatch(updateUserMenu(payload)).then((res: any) => {
        if (res.payload.data?.success) {
          reset();
          onClose();
          dispatch(getMenuList());
          setMenu("1")
        }
      });
    } else {
      dispatch(createMenu(payload)).then((res: any) => {
        if (res.payload.data?.success) {
          reset();
          onClose();
          dispatch(getMenuList());
          setMenu("1")
        }
      });
    }
  };

  useEffect(() => {
    if (data && menuId) {
      setValue("project", data.project_name);
      setValue("parent_menu_key", selectedRow.menu_key);
      setValue("is_parent", data?.url ? "N" : "Y");
      setValue("name", data?.name);
      setValue("url", data.url);
      setValue("description", data.description);
      setValue("icon", data.icon);
      setValue("order", data.order + "");
    }
  }, [data]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg">
      <div className="absolute top-0 left-0 right-0">{createMenuLoading && <LinearProgress />}</div>
      <DialogTitle fontWeight={600}>{data ? "Update Menu" : "Add New Menu"}</DialogTitle>
      <Divider />
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <div className=" grid grid-cols-2 min-w-[650px] gap-[20px]">
            {/* Project Name */}
            <div className="grid gap-2">
              <FormControl variant="filled" sx={{ minWidth: 150 }} error={!!errors.project}>
                <InputLabel>Project Name</InputLabel>
                <Controller
                  name="project"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} label="Project Name">
                      <MenuItem value={"IMS"}>IMS</MenuItem>
                      <MenuItem value={"Admin"}>Admin</MenuItem>
                    </Select>
                  )}
                />
                {errors.project && <p className="text-red-600 text-[13px]">{errors.project.message}</p>}
              </FormControl>
            </div>

            {/* Page Name */}
            <div className="grid gap-2">
              <Controller name="name" control={control} render={({ field }) => <TextField {...field} label="Page Name" variant="filled" error={!!errors.name} helperText={errors.name ? errors.name.message : ""} />} />
            </div>

            {/* Is Parent */}
            <div className="grid gap-2">
              <FormControl variant="filled" error={!!errors.is_parent}>
                <InputLabel>Is Parent?</InputLabel>
                <Controller
                  name="is_parent"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} label="Is Parent?">
                      <MenuItem value={"Y"}>Yes</MenuItem>
                      <MenuItem value={"N"}>No</MenuItem>
                    </Select>
                  )}
                />
                {errors.is_parent && <p className="text-red-600">{errors.is_parent.message}</p>}
              </FormControl>
            </div>

            {/* Page URL */}
            <div className="grid gap-2">
              <Controller
                name="url"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Page URL"
                    variant="filled"
                    error={!!errors.url}
                    disabled={parent === "Y"} // Disable if Parent is Yes
                    helperText={errors.url ? errors.url.message : ""}
                  />
                )}
              />
            </div>

            {/* Icon */}
            <div className="grid gap-2">
              <Controller name="icon" control={control} render={({ field }) => <TextField {...field} label="Icon" variant="filled" error={!!errors.icon} helperText={errors.icon ? errors.icon.message : ""} />} />
            </div>

            {/* Order No. */}
            <div className="grid gap-2">
              <Controller name="order" control={control} render={({ field }) => <TextField {...field} label="Order No." variant="filled" type="number" error={!!errors.order} helperText={errors.order ? errors.order.message : ""} />} />
            </div>

            {/* Description */}
            <div className="grid col-span-2 gap-2">
              <Controller name="description" control={control} render={({ field }) => <TextField multiline rows={3} {...field} label="Description" variant="filled" error={!!errors.description} helperText={errors.description ? errors.description.message : ""} />} />
            </div>
          </div>
        </DialogContent>
        <Divider />

        <DialogActions>
          <Button disabled={createMenuLoading} startIcon={<Icons.close fontSize="small" />} variant="contained" sx={{ background: "white", color: "red" }} onClick={() => onClose()}>
            Close
          </Button>
          <LoadingButton startIcon={<Icons.save fontSize="small" />} loadingPosition="start" disabled={createMenuLoading} variant="contained" type="submit">
            Submit
          </LoadingButton>
        </DialogActions>
      </form>

      <Divider />
    </Dialog>
  );
};

export default CreateMenu;
