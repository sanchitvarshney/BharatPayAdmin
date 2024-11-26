import React from "react";
import { Box, Button, InputLabel, MenuItem, TextField } from "@mui/material";
import Modal from "@mui/material/Modal";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddTabType } from "@/features/menu/menuType";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import {
    addTab,
  getMenuList,
} from "@/features/menu/menuSlice";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import { showToast } from "@/utills/toasterContext";

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

const AddTab: React.FC<AddTabProps> = ({
  open,
  onClose,
  menuId,
}) => {
  const dispatch = useAppDispatch();

  const { createMenuLoading } = useAppSelector((state) => state.menu);
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    // defaultValues: {
    //   role: "",
    //   type: "",
    // },
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
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    // width: 400,
    bgcolor: "background.paper",
    fontSize: "11px",
    //   border: "2px solid #000",
    boxShadow: 24,
    width: 650,
    p: 4,
  };

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Tab
            {/* Against
            <span style={{ color: "#1976d2", fontWeight: "bold" }}>
              {selectedRow.name}
            </span> */}
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mt-[20px] grid grid-cols-2 max-w-[95%] gap-[30px]">
              {/* Project Name */}

              {/* Page Name */}
              <div className="grid gap-2">
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Name"
                      variant="standard"
                      error={!!errors.name}
                      helperText={errors.name ? errors.name.message : ""}
                    />
                  )}
                />
              </div>

              {/* Is Parent */}
              <div className="grid gap-2">
                <FormControl variant="standard" error={!!errors.status}>
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
                  {errors.status && (
                    <p className="text-red-600">{errors.status.message}</p>
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
                      label="URL"
                      variant="standard"
                      error={!!errors.url}
                      // helperText={errors.username?.message}
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
    </>
  );
};

export default AddTab;
