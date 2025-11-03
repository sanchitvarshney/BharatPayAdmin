import { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import NotificationTable from "@/components/table/Notification/NotificationTable";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { sendNotification } from "@/features/user/userSlice";
import { Icons } from "@/components/icons/icons";
import { showToast } from "@/utills/toasterContext";

const Notification = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const dispatch = useAppDispatch();
  const { sendNotificationLoading } = useAppSelector((state) => state.user);

  const handleSendNotification = () => {
    if (!title.trim()) {
      showToast("Please enter a title", "error");
      return;
    }
    if (!description.trim()) {
      showToast("Please enter a description", "error");
      return;
    }

    dispatch(sendNotification({ title, description })).then((res: any) => {
      if (res?.payload?.data?.success) {
        setTitle("");
        setDescription("");
      }
    });
  };

  const handleReset = () => {
    setTitle("");
    setDescription("");
  };

  return (
    <div className="p-[20px]">
      <div className="grid grid-cols-[400px_1fr] gap-[20px]">
        {/* Left Side - Send Notification Form */}
        <div className="rounded-sm shadow shadow-stone-400 p-[20px]">
          <Typography
            variant="h6"
            sx={{ mb: 3, fontWeight: 600, color: "stone.800" }}
          >
            Send Notification
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <TextField
              label="Title"
              variant="filled"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter notification title"
              sx={{
                "& .MuiFilledInput-root": {
                  backgroundColor: "rgba(0, 0, 0, 0.02)",
                },
              }}
            />

            <TextField
              label="Description"
              variant="filled"
              fullWidth
              multiline
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter notification description"
              sx={{
                "& .MuiFilledInput-root": {
                  backgroundColor: "rgba(0, 0, 0, 0.02)",
                },
              }}
            />

            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <Button
                variant="outlined"
                onClick={handleReset}
                disabled={sendNotificationLoading}
                sx={{
                  flex: 1,
                  borderColor: "#d6d3d1",
                  color: "stone.700",
                  "&:hover": {
                    borderColor: "#a8a29e",
                    backgroundColor: "#f5f5f4",
                  },
                }}
              >
                Reset
              </Button>

              <LoadingButton
                variant="contained"
                onClick={handleSendNotification}
                loading={sendNotificationLoading}
                loadingPosition="start"
                startIcon={<Icons.send fontSize="small" />}
                disabled={!title.trim() || !description.trim()}
                sx={{
                  flex: 1,
                  "&:disabled": {
                    backgroundColor: "rgba(0, 0, 0, 0.12)",
                  },
                }}
              >
                Send Notification
              </LoadingButton>
            </Box>
          </Box>
        </div>

        {/* Right Side - Notification Table */}
        <div className="rounded-sm shadow shadow-stone-400 p-[20px]">
          <Typography
            variant="h6"
            sx={{ mb: 2, fontWeight: 600, color: "stone.800" }}
          >
            Notification History
          </Typography>
          <NotificationTable />
        </div>
      </div>
    </div>
  );
};

export default Notification;
