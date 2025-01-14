import React, { useEffect, useMemo } from "react";
import { InputLabel, MenuItem, TextField, Typography } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { createMasterMenu } from "@/features/menu/menuSlice";
import LoadingButton from "@mui/lab/LoadingButton";
import { Icons } from "@/components/icons/icons";
import { findMenuKey } from "@/general";

// Define Zod schema
const schema = z.object({
  project: z.string().nonempty("Project name is required"),
  name: z.string().nonempty("Page name is required"),
  icon: z.string().optional(),
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
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      project: "",
      name: "",
      icon: "",
      order: undefined,
      description: "",
    },
  }); const { menuList } = useAppSelector((state: any) => state.menu); 

  // UseMemo to memoize the menuKey based on the current URL
  const menuKey = useMemo(() => findMenuKey(window.location.pathname, menuList), [menuList]);
  // Store menuKey in localStorage whenever it changes
  useEffect(() => {
    if (menuKey) {
      localStorage.setItem("menuKey", menuKey);
    }
  }, [menuKey]);

  const onSubmit = (data: FormValues) => {
    const payload: any = {
      project: data.project,
      name: data.name,
      isParent: true,
      has_parent: false,
      description: data.description,
      icon: data.icon,
      order: data.order,
      is_active: true,
    };
    dispatch(createMasterMenu(payload)).then((res: any) => {
      if (res.payload.data?.success) {
        reset();
      }
    });
  };

  return (
    <div className=" overflow-y-auto h-[calc(100vh-72px)] p-[20px]">
      <div className="rounded-sm ">
        <Typography variant="h2" fontSize={20} fontWeight={500}>
          Add New Menu
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mt-[20px] grid grid-cols-2 max-w-[70%] gap-[30px]">
            {/* Project Name */}
            <div className="grid gap-2">
              <FormControl variant="filled" sx={{ minWidth: 120 }} error={!!errors.project}>
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
              <Controller name="description" control={control} render={({ field }) => <TextField multiline rows={4} {...field} label="Description" variant="filled" error={!!errors.description} helperText={errors.description ? errors.description.message : ""} />} />
            </div>
          </div>

          <div className="mt-[20px]">
            <LoadingButton startIcon={<Icons.save fontSize="small" />} loading={createMenuLoading} variant="contained" type="submit">
              Submit
            </LoadingButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateMenu;
