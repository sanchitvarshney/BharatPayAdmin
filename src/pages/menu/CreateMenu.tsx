import React from "react";
import { InputLabel, MenuItem, TextField } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateMenuType } from "@/features/menu/menuType";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { createMenu } from "@/features/menu/menuSlice";
import LoadingButton from "@mui/lab/LoadingButton";

// Define Zod schema
const schema = z.object({
  project: z.string().nonempty("Project name is required"),
  name: z.string().nonempty("Page name is required"),
  is_parent: z.string().nonempty("Please select if it's a parent"),
  parent_menu_key: z.string().optional(),
  url: z.string().nonempty("Page URL is required"),
  icon: z.string().nonempty("Icon is required"),
  order: z.string().min(1, "Order must be at least 1"),
  description: z.string().nonempty("Description is required"),
});

// Infer the form values from Zod schema
type FormValues = z.infer<typeof schema>;

const CreateMenu: React.FC = () => {
  const dispatch = useAppDispatch();
  const { createMenuLoading } = useAppSelector((state) => state.menu);
  const {
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      project: "",
      name: "",
      is_parent: "N",
      parent_menu_key: "",
      url: "",
      icon: "",
      order: undefined,
      description: "",
    },
  });

  const parent = watch("is_parent");

  const onSubmit = (data: FormValues) => {
    const payload: CreateMenuType = {
      project: data.project,
      name: data.name,
      is_parent: data.is_parent === "N" ? false : true,
      parent_menu_key: data.parent_menu_key || "",
      url: data.url,
      description: data.description,
      icon: data.icon,
      order: data.order,
      is_active: true,
    };
    dispatch(createMenu(payload)).then((res: any) => {
      if (res.payload.data?.success) {
        reset();
      }
    });
  };

  return (
    <div className="p-[20px] overflow-y-auto h-[calc(100vh-70px)]">
      <div className="rounded-sm shadow shadow-stone-400 p-[20px]">
        <h2 className="text-[20px] font-[600] text-slate-600">Add New Menu</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mt-[20px] grid grid-cols-2 max-w-[70%] gap-[30px]">
            {/* Project Name */}
            <div className="grid gap-2">
              <FormControl variant="standard" sx={{ minWidth: 120 }} error={!!errors.project}>
                <InputLabel>Project Name</InputLabel>
                <Controller
                  name="project"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} label="Project Name">
                      <MenuItem value={"IMS"}>IMS</MenuItem>
                      <MenuItem value={"Spigen"}>Spigen</MenuItem>
                      <MenuItem value={"Vans"}>Vans</MenuItem>
                    </Select>
                  )}
                />
                {errors.project && <p className="text-red-600 text-[13px]">{errors.project.message}</p>}
              </FormControl>
            </div>

            {/* Page Name */}
            <div className="grid gap-2">
              <Controller name="name" control={control} render={({ field }) => <TextField {...field} label="Name Of Page" variant="standard" error={!!errors.name} helperText={errors.name ? errors.name.message : ""} />} />
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
                {errors.is_parent && <p className="text-red-600">{errors.is_parent.message}</p>}
              </FormControl>
            </div>

            {/* Parent Menu */}
            <div>
              {parent === "Y" && (
                <div>
                  <FormControl variant="standard" sx={{ width: "100%" }}>
                    <InputLabel>Parent Page</InputLabel>
                    <Controller
                      name="parent_menu_key"
                      control={control}
                      render={({ field }) => (
                        <Select {...field} label="Parent Page">
                          <MenuItem value={"location"}>Location</MenuItem>
                          <MenuItem value={"menu"}>Menu</MenuItem>
                          <MenuItem value={"user"}>User</MenuItem>
                          <MenuItem value={"permission"}>Permission</MenuItem>
                          <MenuItem value={"setting"}>Setting</MenuItem>
                        </Select>
                      )}
                    />
                  </FormControl>
                </div>
              )}
            </div>

            {/* Page URL */}
            <div className="grid gap-2">
              <Controller name="url" control={control} render={({ field }) => <TextField {...field} label="Page URL" variant="standard" error={!!errors.url} helperText={errors.url ? errors.url.message : ""} />} />
            </div>

            {/* Icon */}
            <div className="grid gap-2">
              <Controller name="icon" control={control} render={({ field }) => <TextField {...field} label="Icon" variant="standard" error={!!errors.icon} helperText={errors.icon ? errors.icon.message : ""} />} />
            </div>

            {/* Order No. */}
            <div className="grid gap-2">
              <Controller name="order" control={control} render={({ field }) => <TextField {...field} label="Order No." variant="standard" type="number" error={!!errors.order} helperText={errors.order ? errors.order.message : ""} />} />
            </div>

            {/* Description */}
            <div className="grid gap-2">
              <Controller name="description" control={control} render={({ field }) => <TextField {...field} label="Description" variant="standard" error={!!errors.description} helperText={errors.description ? errors.description.message : ""} />} />
            </div>
          </div>

          <div className="mt-[20px]">
            <LoadingButton loading={createMenuLoading} variant="contained" type="submit">
              Submit
            </LoadingButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateMenu;
