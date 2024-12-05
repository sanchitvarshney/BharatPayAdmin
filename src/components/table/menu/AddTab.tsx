import React from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, InputLabel, LinearProgress, MenuItem, TextField } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddTabType } from "@/features/menu/menuType";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { addTab, getMenuList } from "@/features/menu/menuSlice";
import LoadingButton from "@mui/lab/LoadingButton";
import { showToast } from "@/utills/toasterContext";
import { Icons } from "@/components/icons/icons";

// Define Zod schema
const schema = z.object({
  name: z.string().nonempty("Page name is required"),
  url: z.string().nonempty("Page URL is required"),
  icon: z.string().nonempty("Icon is required"),
  order: z.string().min(1, "Order must be at least 1"),
  description: z.string().nonempty("Description is required"),
  status: z.string().nonempty("Please select Status"),
});

// Infer the form values from Zod schema
type FormValues = z.infer<typeof schema>;

interface AddTabProps {
  open: any;
  onClose: () => void;
  selectedRow: any;
  data?: any;
  menuId?: any;
}

const AddTab: React.FC<AddTabProps> = ({ open, onClose, menuId }) => {
  const dispatch = useAppDispatch();

  const { addTabLoading } = useAppSelector((state) => state.menu);
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      url: "",
      icon: "",
      order: "",
      description: "",
      status: "", // Ensure default values are set correctly
    },
  });

  const onSubmit = (data: FormValues) => {
    const payload: AddTabType = {
      menuId: menuId,
      name: data.name,
      url: data.url,
      icon: data.icon,
      order: data.order,
      description: data.description,
      status: data.status,
    };

    dispatch(addTab(payload)).then((res: any) => {
      if (res.payload.data?.success) {
        showToast(res.payload.data.message, "success");
        reset();
        onClose();
        dispatch(getMenuList());
      }
    });
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="lg">
        <div className="absolute top-0 left-0 right-0">{addTabLoading && <LinearProgress />}</div>
        <DialogTitle fontWeight={600}>Add Tab</DialogTitle>
        <Divider />
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <div className=" grid grid-cols-2  gap-[20px]">
              {/* Project Name */}

              {/* Page Name */}
              <div className="grid gap-2">
                <Controller name="name" control={control} render={({ field }) => <TextField {...field} label="Name" variant="filled" error={!!errors.name} helperText={errors.name ? errors.name.message : ""} />} />
              </div>

              {/* Is Parent */}
              <div className="grid gap-2 w-[300px]">
                <FormControl variant="filled" error={!!errors.status}>
                  <InputLabel>Status?</InputLabel>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Select {...field} label="Status">
                        <MenuItem value={"1"}>Active</MenuItem>
                        <MenuItem value={"0"}>Not Active</MenuItem>
                      </Select>
                    )}
                  />
                  {errors.status && <p className="text-red-600">{errors.status.message}</p>}
                </FormControl>
              </div>

              {/* Page URL */}
              <div className="grid gap-2 w-[300px]">
                <Controller
                  name="url"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="URL"
                      variant="filled"
                      error={!!errors.url}
                      // helperText={errors.username?.message}
                    />
                  )}
                />
              </div>

              {/* Icon */}
              <div className="grid gap-2 w-[300px]">
                <Controller name="icon" control={control} render={({ field }) => <TextField {...field} label="Icon" variant="filled" error={!!errors.icon} helperText={errors.icon ? errors.icon.message : ""} />} />
              </div>

              {/* Order No. */}
              <div className="grid gap-2 w-[300px]">
                <Controller
                  name="order"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      slotProps={{ input: { inputProps: { min: 1 } } }}
                      value={field.value}
                      onChange={(e) => {
                        if (/^[0-9]*$/.test(e.target.value)) {
                          field.onChange(e);
                        }
                      }}
                      label="Order No."
                      variant="filled"
                      error={!!errors.order}
                      helperText={errors.order ? errors.order.message : ""}
                    />
                  )}
                />
              </div>

              {/* Description */}
              <div className="grid col-span-2 gap-2">
                <Controller name="description" control={control} render={({ field }) => <TextField multiline rows={2} {...field} label="Description" variant="filled" error={!!errors.description} helperText={errors.description ? errors.description.message : ""} />} />
              </div>
            </div>
          </DialogContent>
          <Divider />
          <DialogActions>
            <Button disabled={addTabLoading} startIcon={<Icons.close fontSize="small" />} variant="contained" sx={{ background: "white", color: "red" }} onClick={() => onClose()}>
              Close
            </Button>
            <LoadingButton startIcon={<Icons.save fontSize="small" />} loadingPosition="start" disabled={addTabLoading} variant="contained" type="submit">
              Submit
            </LoadingButton>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default AddTab;
