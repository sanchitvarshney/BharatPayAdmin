import React, { useEffect } from "react";
import { Box, Button, InputLabel, MenuItem, TextField } from "@mui/material";
import Modal from "@mui/material/Modal";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateMenuType } from "@/features/menu/menuType";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import {
  createMenu,
  getMenuList,
  updateUserMenu,
} from "@/features/menu/menuSlice";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";

// Define Zod schema
const schema = z.object({
  project: z.string().nonempty("Project name is required"),
  name: z.string().nonempty("Page name is required"),
  is_parent: z.string().nonempty("Please select if it's a parent"),
  parent_menu_key: z.string().optional(),
  url: z.string().optional(), // Initially optional
  icon: z.string().nonempty("Icon is required"),
  order: z.string().min(1, "Order must be at least 1"),
  description: z.string().nonempty("Description is required"),
}).superRefine((data, ctx) => {
  // Custom validation to conditionally require the URL field
  if (data.is_parent === "N" && !data.url) {
    ctx.addIssue({
      path: ['url'],
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
}

const CreateMenu: React.FC<CreateMenuProps> = ({
  open,
  onClose,
  selectedRow,
  data,
  menuId,
}) => {
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
        }
      });
    } else {
      dispatch(createMenu(payload)).then((res: any) => {
        if (res.payload.data?.success) {
          reset();
          onClose();
          dispatch(getMenuList());
        }
      });
    }
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    fontSize: "11px",
    boxShadow: 24,
    width: 650,
    p: 4,
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
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {data ? "Update Menu" : "Add New Menu"}
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mt-[20px] grid grid-cols-2 max-w-[95%] gap-[30px]">
            {/* Project Name */}
            <div className="grid gap-2">
              <FormControl
                variant="standard"
                sx={{ minWidth: 150 }}
                error={!!errors.project}
              >
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
                {errors.project && (
                  <p className="text-red-600 text-[13px]">
                    {errors.project.message}
                  </p>
                )}
              </FormControl>
            </div>

            {/* Page Name */}
            <div className="grid gap-2">
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Page Name"
                    variant="standard"
                    error={!!errors.name}
                    helperText={errors.name ? errors.name.message : ""}
                  />
                )}
              />
            </div>

            {/* Is Parent */}
            <div className="grid gap-2">
              <FormControl variant="standard" error={!!errors.is_parent}>
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
                {errors.is_parent && (
                  <p className="text-red-600">{errors.is_parent.message}</p>
                )}
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
                    variant="standard"
                    error={!!errors.url}
                    disabled={parent === "Y"}  // Disable if Parent is Yes
                    helperText={errors.url ? errors.url.message : ""}
                  />
                )}
              />
            </div>

            {/* Icon */}
            <div className="grid gap-2">
              <Controller
                name="icon"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Icon"
                    variant="standard"
                    error={!!errors.icon}
                    helperText={errors.icon ? errors.icon.message : ""}
                  />
                )}
              />
            </div>

            {/* Order No. */}
            <div className="grid gap-2">
              <Controller
                name="order"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Order No."
                    variant="standard"
                    type="number"
                    error={!!errors.order}
                    helperText={errors.order ? errors.order.message : ""}
                  />
                )}
              />
            </div>

            {/* Description */}
            <div className="grid gap-2">
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Description"
                    variant="standard"
                    error={!!errors.description}
                    helperText={
                      errors.description ? errors.description.message : ""
                    }
                  />
                )}
              />
            </div>
          </div>

          <div className="mt-[20px] justify-end flex gap-[10px]">
            <LoadingButton
              loading={createMenuLoading}
              variant="contained"
              type="submit"
            >
              Submit
            </LoadingButton>
            <Button onClick={() => onClose()}>Close</Button>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default CreateMenu;
