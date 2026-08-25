import { Button, Chip, Divider, IconButton, InputAdornment, LinearProgress, ListItem, TextField, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import React, { useState } from "react";
import Grid from "@mui/material/Grid2";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import PersonIcon from "@mui/icons-material/Person";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import SecurityIcon from "@mui/icons-material/Security";
import CreateIcon from "@mui/icons-material/Create";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import SystemUpdateAltIcon from "@mui/icons-material/SystemUpdateAlt";
import CloseIcon from "@mui/icons-material/Close";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, XCircle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { showToast } from "@/utills/toasterContext";
import { changePasswordAsync } from "@/features/authentication/authSlice";
// import { useUser } from "@/hooks/useUser";
import UpadteEmail from "@/pages/profile/UpdateEmail";
import { Icons } from "@/components/icons/icons";
import { useUser } from "@/hooks/useUser";

const schema = z
  .object({
    oldPassword: z.string().min(1, "Old password is required"), // Old password must be filled
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string().min(1, "password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // This highlights confirmPassword in case of an error
  });
type FormValues = z.infer<typeof schema>;

const getInitials = (name?: string) => {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "U";
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase()).join("");
};

const strengthColor = (label: string) => (label === "Strong" ? "#16a34a" : label === "Medium" ? "#d97706" : "#dc2626");

const ProfilePage: React.FC = () => {
  const dispatch = useAppDispatch();
  // const userDetails = localStorage.getItem("loggedinUser");
  // const user = userDetails ? JSON.parse(userDetails||{} as any) : null;
  const { user } = useUser();
  const { changepasswordloading } = useAppSelector((state) => state.auth);
  const [tab, setTab] = React.useState("P");
  const [editFullName, setEditFullName] = React.useState(false);
  const [editEmail, setEditEmail] = React.useState(false);
  const [editPhone, setEditPhone] = React.useState(false);
  const [changePassword, setChangePassword] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState<boolean>(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: "",
  });
  const [passwordChecks, setPasswordChecks] = useState({
    hasUpperCase: false,
    hasNumber: false,
    hasSpecialChar: false,
    isValidLength: false,
  });
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      oldPassword: "",
      password: "",
      confirmPassword: "",
    },
  });

  const checkPasswordStrength = (password: string) => {
    const checks = {
      hasUpperCase: /[A-Z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[^a-zA-Z0-9]/.test(password),
      isValidLength: password.length >= 8 && password.length <= 16,
    };

    const score = Object.values(checks).filter((check) => check).length;

    setPasswordChecks(checks);

    let label = "";
    if (score <= 2) label = "Weak";
    else if (score === 3) label = "Medium";
    else label = "Strong";

    setPasswordStrength({ score, label });
  };

  const onSubmit = (data: FormValues) => {
    const payload: any = {
      oldPassword: data.oldPassword,
      newPassword: data.password,
      confirmPassword: data.confirmPassword,
      userId: user?.crn_id || "",
    };
    if (data.oldPassword === data.password) {
      showToast("New password cannot be same as old password", "error");
    } else {
      dispatch(changePasswordAsync(payload)).then((res: any) => {
        if (res.payload?.data?.success) {
          setChangePassword(false);
          reset();
        }
      });
    }
  };

  const closePasswordDialog = () => {
    setChangePassword(false);
    reset();
    setPasswordStrength({ score: 0, label: "" });
    setPasswordChecks({ hasUpperCase: false, hasNumber: false, hasSpecialChar: false, isValidLength: false });
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const requirementRows = [
    { key: "hasUpperCase", label: "At least one uppercase letter" },
    { key: "hasNumber", label: "At least one number" },
    { key: "hasSpecialChar", label: "At least one special character" },
    { key: "isValidLength", label: "8-16 characters in length" },
  ] as const;

  return (
    <>
      <UpadteEmail open={editEmail} handleClose={() => setEditEmail(false)} />
      <Dialog
        open={editFullName}
        onClose={(_event, reason) => {
          if (reason === "backdropClick") return;
          setEditFullName(false);
        }}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          component: "form",
          sx: { borderRadius: "12px" },
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            // const formData = new FormData(event.currentTarget);
            // const formJson = Object.fromEntries((formData as any).entries());
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Update Name</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 1 }}>Please enter your new name below. This will be displayed on your profile.</DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="name"
            label="Name"
            type="text"
            fullWidth
            variant="filled"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Icons.person fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: "20px", pb: "16px" }}>
          <Button startIcon={<CloseIcon fontSize="small" />} variant="outlined" color="inherit" onClick={() => setEditFullName(false)}>
            Cancel
          </Button>
          <Button startIcon={<SystemUpdateAltIcon fontSize="small" />} variant="contained" type="submit" disableElevation>
            Update
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={editPhone}
        onClose={(_event, reason) => {
          if (reason === "backdropClick") return;
          setEditPhone(false);
        }}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          component: "form",
          sx: { borderRadius: "12px" },
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Update Phone No.</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 1 }}>Please enter your new phone number to keep your contact information up to date. We’ll use this to reach you if needed.</DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="phone"
            name="phone"
            label="Phone No."
            type="text"
            fullWidth
            variant="filled"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Icons.call fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: "20px", pb: "16px" }}>
          <Button startIcon={<CloseIcon fontSize="small" />} variant="outlined" color="inherit" onClick={() => setEditPhone(false)}>
            Cancel
          </Button>
          <Button startIcon={<SystemUpdateAltIcon fontSize="small" />} variant="contained" type="submit" disableElevation>
            Update
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        maxWidth="lg"
        fullWidth
        open={changePassword}
        onClose={(_event, reason) => {
          if (reason === "backdropClick") return;
          closePasswordDialog();
        }}
        PaperProps={{ sx: { borderRadius: "14px" } }}
      >
        <div className="relative">{changepasswordloading && <LinearProgress className="absolute top-0 left-0 right-0" />}</div>
        <div className="flex items-center justify-between w-full pl-[24px] pr-[12px] pt-[8px]">
          <DialogTitle sx={{ p: 0, fontWeight: 600, fontSize: "20px" }}>Reset Password</DialogTitle>
          <IconButton onClick={closePasswordDialog}>
            <Icons.close />
          </IconButton>
        </div>
        <Divider sx={{ mt: "16px" }} />
        <DialogContent className="w-full sm:min-w-[600px] lg:min-w-[700px]">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[8px]">
              <div className="flex flex-col gap-[18px] px-[8px] pt-[4px]">
                <TextField
                  {...register("oldPassword")}
                  error={!!errors.oldPassword}
                  helperText={errors.oldPassword?.message}
                  margin="dense"
                  label="Current Password"
                  type="text"
                  fullWidth
                  variant="filled"
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <Icons.code fontSize="small" />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      value={field.value}
                      onChange={(e) => {
                        checkPasswordStrength(e.target.value);
                        field.onChange(e);
                      }}
                      slotProps={{
                        input: {
                          endAdornment: (
                            <InputAdornment position="end">
                              {showPassword ? (
                                <IconButton onClick={() => setShowPassword(false)} size="small">
                                  <Icons.visible fontSize="small" />
                                </IconButton>
                              ) : (
                                <IconButton size="small" onClick={() => setShowPassword(true)}>
                                  <Icons.invisible fontSize="small" />
                                </IconButton>
                              )}
                            </InputAdornment>
                          ),
                        },
                      }}
                      error={!!errors.password}
                      helperText={errors.password?.message}
                      margin="dense"
                      label="New Password"
                      type={showPassword ? "text" : "password"}
                      fullWidth
                      variant="filled"
                    />
                  )}
                />
                <TextField
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          {showConfirmPassword ? (
                            <IconButton onClick={() => setShowConfirmPassword(false)} size="small">
                              <Icons.visible fontSize="small" />
                            </IconButton>
                          ) : (
                            <IconButton size="small" onClick={() => setShowConfirmPassword(true)}>
                              <Icons.invisible fontSize="small" />
                            </IconButton>
                          )}
                        </InputAdornment>
                      ),
                    },
                  }}
                  {...register("confirmPassword")}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                  margin="dense"
                  label="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  fullWidth
                  variant="filled"
                />
                <Button disabled={changepasswordloading} variant="contained" type="submit" disableElevation size="large" sx={{ mt: "4px" }}>
                  {changepasswordloading ? "Updating..." : "Update Password"}
                </Button>
              </div>

              <div className="px-[20px] pt-[20px] sm:pt-0 mt-[20px] sm:mt-0 border-t sm:border-t-0 sm:border-l border-gray-200 min-w-0 sm:min-w-[320px] lg:min-w-[400px]">
                <Typography gutterBottom variant="h3" fontWeight={600} fontSize={16}>
                  Password Requirements
                </Typography>

                <ul className="space-y-3 text-sm text-gray-600">
                  {requirementRows.map((row) => {
                    const met = passwordChecks[row.key];
                    return (
                      <li key={row.key} className={`flex items-center gap-[10px] transition-colors ${met ? "text-green-600" : "text-gray-500"}`}>
                        {met ? <CheckCircle2 className="w-[18px] h-[18px] shrink-0" /> : <XCircle className="w-[18px] h-[18px] shrink-0 text-gray-300" />}
                        <span>{row.label}</span>
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-8">
                  <div className="flex items-center justify-between">
                    <Typography variant="h4" fontWeight={600} fontSize={14}>
                      Password Strength
                    </Typography>
                    {passwordStrength.label && (
                      <Typography fontSize={13} fontWeight={600} sx={{ color: strengthColor(passwordStrength.label) }}>
                        {passwordStrength.label}
                      </Typography>
                    )}
                  </div>
                  <div className="w-full h-[8px] mt-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${passwordStrength.score * 25}%`, backgroundColor: strengthColor(passwordStrength.label || "Weak") }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <div className="h-full bg-[#f4f6f8] p-[12px] md:p-[16px]">
        <Grid
          container
          spacing={0}
          sx={{
            height: { xs: "auto", md: "calc(100vh - 82px)" },
            overflow: { xs: "visible", md: "hidden" },
            bgcolor: "background.paper",
            borderRadius: "12px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          }}
        >
          <Grid
            size={{ xs: 12, md: 3 }}
            sx={{
              borderRight: { xs: "none", md: "1px solid #eef0f2" },
              borderBottom: { xs: "1px solid #eef0f2", md: "none" },
              bgcolor: "#fafbfc",
              height: { xs: "auto", md: "100%" },
              overflowY: { xs: "visible", md: "auto" },
            }}
          >
            <div className="flex items-center justify-center py-[28px] flex-col gap-[6px]">
              <Avatar className="h-[76px] w-[76px] border-[3px] border-white shadow-md ring-1 ring-gray-200">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback className="text-lg font-semibold bg-primary/10">{getInitials(user?.username)}</AvatarFallback>
              </Avatar>
              <Typography variant="h6" fontWeight={600} sx={{ mt: "4px" }}>
                {user?.username}
              </Typography>
              {user?.department && (
                <Chip
                  size="small"
                  label={user.department}
                  sx={{
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                    color: "primary.main",
                    fontWeight: 500,
                    height: "22px",
                    fontSize: "12px",
                  }}
                />
              )}
              <div className="w-full px-[24px] mt-[18px] flex flex-col gap-[10px]">
                <div className="flex items-center gap-[10px] text-gray-500">
                  <Icons.call fontSize="small" />
                  <Typography fontSize={13} className="truncate">
                    {user?.crn_mobile || "—"}
                  </Typography>
                </div>
                <div className="flex items-center gap-[10px] text-gray-500">
                  <Icons.email fontSize="small" />
                  <Typography fontSize={13} className="truncate">
                    {user?.crn_email || "—"}
                  </Typography>
                </div>
              </div>
            </div>
            <Divider />
            <Box sx={{ width: "100%", bgcolor: "transparent", py: "8px" }}>
              <List component="nav" aria-label="main mailbox folders" sx={{ px: "10px" }}>
                <ListItemButton
                  selected={tab === "P"}
                  onClick={() => setTab("P")}
                  sx={{
                    borderRadius: "8px",
                    mb: "4px",
                    "&.Mui-selected": {
                      bgcolor: "primary.main",
                      color: "#fff",
                      "& .MuiListItemIcon-root": { color: "#fff" },
                      "&:hover": { bgcolor: "primary.dark" },
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: "36px" }}>
                    <PersonIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primaryTypographyProps={{ fontSize: "14px", fontWeight: 500 }} primary="Personal Information" />
                  <ListItemIcon sx={{ minWidth: "20px", color: "inherit" }}>
                    <KeyboardArrowRightIcon fontSize="small" />
                  </ListItemIcon>
                </ListItemButton>
                <ListItemButton
                  selected={tab === "S"}
                  onClick={() => setTab("S")}
                  sx={{
                    borderRadius: "8px",
                    "&.Mui-selected": {
                      bgcolor: "primary.main",
                      color: "#fff",
                      "& .MuiListItemIcon-root": { color: "#fff" },
                      "&:hover": { bgcolor: "primary.dark" },
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: "36px" }}>
                    <SecurityIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primaryTypographyProps={{ fontSize: "14px", fontWeight: 500 }} primary="Security Setting" />
                  <ListItemIcon sx={{ minWidth: "20px", color: "inherit" }}>
                    <KeyboardArrowRightIcon fontSize="small" />
                  </ListItemIcon>
                </ListItemButton>
              </List>
            </Box>
          </Grid>
          <Grid
            size={{ xs: 12, md: 9 }}
            sx={{ height: { xs: "auto", md: "100%" }, overflowY: { xs: "visible", md: "auto" }, paddingY: "20px" }}
          >
            {tab === "P" && (
              <div className="p-[16px] md:p-[30px]">
                <Typography variant="h1" fontSize={"22px"} fontWeight={600}>
                  Personal Information
                </Typography>
                <Typography variant="h2" fontSize={"14px"} sx={{ color: "text.secondary", mt: "4px" }}>
                  Basic info, like your name and phone number, that you use on BharatPe Platform.
                </Typography>
                <div className="mt-[32px] border border-gray-200 rounded-[12px] overflow-hidden">
                  <List sx={{ width: "100%", bgcolor: "background.paper", py: 0 }}>
                    <ListItem sx={{ paddingX: "20px", paddingY: "14px" }}>
                      <ListItemText
                        primary={
                          <Typography variant="h4" fontSize={"13px"} sx={{ color: "text.secondary" }}>
                            Name
                          </Typography>
                        }
                        secondary={
                          <Typography fontSize={"15px"} fontWeight={500} sx={{ color: "text.primary" }}>
                            {user?.username || "—"}
                          </Typography>
                        }
                      />
                    </ListItem>
                    <Divider />
                    <ListItem
                      className="group"
                      sx={{ ":hover": { backgroundColor: "#f8f9fa" }, paddingX: "20px", paddingY: "14px" }}
                      secondaryAction={
                        <IconButton onClick={() => setEditEmail(true)} aria-label="edit email" size="small" className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                          <CreateIcon fontSize="small" />
                        </IconButton>
                      }
                    >
                      <ListItemText
                        primary={
                          <Typography variant="h4" fontSize={"13px"} sx={{ color: "text.secondary" }}>
                            Email
                          </Typography>
                        }
                        secondary={
                          <Typography fontSize={"15px"} fontWeight={500} sx={{ color: "text.primary" }}>
                            {user?.crn_email || "—"}
                          </Typography>
                        }
                      />
                    </ListItem>
                    <Divider />
                    <ListItem sx={{ paddingX: "20px", paddingY: "14px", display: "block" }}>
                      <ListItemText
                        primary={
                          <Typography variant="h4" fontSize={"13px"} sx={{ color: "text.secondary" }}>
                            Phone Number
                          </Typography>
                        }
                        secondary={
                          <Typography fontSize={"15px"} fontWeight={500} sx={{ color: "text.primary" }}>
                            {user?.crn_mobile || "—"}
                          </Typography>
                        }
                      />
                      {editPhone && <TextField sx={{ mt: "8px" }} fullWidth size="small" value={user?.crn_mobile} label="Update Mobile No." />}
                    </ListItem>
                  </List>
                </div>
              </div>
            )}
            {tab === "S" && (
              <div className="p-[16px] md:p-[30px]">
                <Typography variant="h1" fontSize={"22px"} fontWeight={600}>
                  Security Settings
                </Typography>
                <Typography variant="h2" fontSize={"14px"} sx={{ color: "text.secondary", mt: "4px" }}>
                  These settings help you keep your account secure.
                </Typography>
                <div className="mt-[32px] border border-gray-200 rounded-[12px] overflow-hidden">
                  <List sx={{ width: "100%", bgcolor: "background.paper", py: 0 }}>
                    <ListItem
                      className="group"
                      sx={{ ":hover": { backgroundColor: "#f8f9fa" }, paddingX: "20px", paddingY: "14px" }}
                      secondaryAction={
                        <IconButton onClick={() => setChangePassword(true)} aria-label="reset password" size="small" className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                          <CreateIcon fontSize="small" />
                        </IconButton>
                      }
                    >
                      <ListItemText
                        primary={
                          <Typography variant="h4" fontSize={"15px"} fontWeight={500}>
                            Reset Password
                          </Typography>
                        }
                        secondary="Set a unique password to protect your account."
                      />
                    </ListItem>
                  </List>
                </div>
              </div>
            )}
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default ProfilePage;
