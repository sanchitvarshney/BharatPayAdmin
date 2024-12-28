import {
  Tabs,
  Box,
  Tab,
  Button,
  SelectChangeEvent,
  FormControl,
  Select,
  MenuItem,
  Modal,
  Typography,
  TextField,
  LinearProgress,
  Popover,
  Switch,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel,
  ListItemButton,
  List,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  InputAdornment,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import { CalendarIcon } from "@radix-ui/react-icons";
import { FaChevronDown } from "react-icons/fa";
import { RiPencilFill } from "react-icons/ri";
import { FaChevronLeft } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa6";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { useForm, Controller } from "react-hook-form";
import {
  activateUser,
  changeuserPasword,
  getUserProfile,
  requirePasswordChange,
  suspendUser,
  updateUserEmail,
  updateUserMobile,
  updateUserProfile,
  updateUserStatus,
  updateUserVerification,
} from "@/features/user/userSlice";
import { Skeleton } from "@/components/ui/skeleton";
import { ChangeUserPasswordPayload } from "@/features/user/userType";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import LoadingButton from "@mui/lab/LoadingButton";
import { showToast } from "@/utills/toasterContext";
import { Icons } from "../../components/icons/icons";
import ShowLog from "./ShowLog";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const verificationTypes = [
  { label: "Email", value: "E" },
  { label: "Mobile", value: "M" },
  { label: "Both OK", value: "1" },
  { label: "None", value: "0" },
];

const schema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
  passwordMatch: z.boolean(),

  ask_password_change: z.boolean(),
  user_id: z.string(),
});
type ResetPasswordType = z.infer<typeof schema>;
function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      className="p-0"
    >
      {value === index && children}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
const UserProfile = () => {
  const [value, setValue] = React.useState(0);
  const [age, setAge] = React.useState("");
  const [resetpassword, setResetPassword] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [mobile, setMobile] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [verification, setVerification] = useState<string>("");
  const [suspend, setSuspend] = useState<boolean>(false);
  const [updateUser, setUpdateUser] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const [requiredChangePass, setRequiredChangePass] =
    React.useState<HTMLButtonElement | null>(null);
  const [changePhone, setChangePhone] = React.useState<HTMLDivElement | null>(
    null
  );
  const [changeEmail, setChangeEmail] = React.useState<HTMLDivElement | null>(
    null
  );
  const [passwordChange, setPasswordChange] = useState<boolean>(false);
  const [updateStatus, setUpdateStatus] = useState<boolean>(false);
  const [updateVerification, setUpdateVerification] = useState<boolean>(false);
  const [askToVerify, setAskToVerify] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [open, setOpen] = useState<any>(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const ref = React.useRef<HTMLDivElement>(null);
  const ref2 = React.useRef<HTMLDivElement>(null);
  const params = useParams();
  const dispatch = useAppDispatch();
  const {
    userProfile,
    getUserProfileLoading,
    cahngeUserPasswordLoading,
    suspendUserLoading,
    activateUserLoading,
    updateUserMobileLoading,
    updateUserEmailLoading,
    updateUserProfileLoading,
  } = useAppSelector((state) => state.user);

  const {
    handleSubmit,
    reset,
    control,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<ResetPasswordType>({
    resolver: zodResolver(schema),
    defaultValues: {
      password: "",
      confirmPassword: "",
      ask_password_change: false,
      user_id: userProfile ? userProfile[0]?.userID || "" : "",
    },
  });
  // Watch the password and confirm password fields
  const password = watch("password");
  const confirmPassword = watch("confirmPassword");
  const handleSelectChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    console.log(event);
  };

  const handleClick = () => {
    // setAnchorEl(event.currentTarget);
    setResetPassword(true);
  };
  const onSubmit = (data: ResetPasswordType) => {
    const payload: ChangeUserPasswordPayload = {
      userId: userProfile ? userProfile?.id || "" : "",

      password: data.password,
      ask_password_change: data.ask_password_change,
    };
    console.log("payload", payload);
    // return;
    dispatch(changeuserPasword(payload)).then((res: any) => {
      if (res.payload.data?.success) {
        setResetPassword(false);
        reset();
      }
    });
  };

  const handleRequirePasswordChange = (status: any) => {
    setRequiredChangePass(status);
    console.log(userProfile);
    // setResetPassword(true);
    const payload = {
      userId: userProfile ? userProfile?.id || "" : "",
      requirePasswordChange: passwordChange ? "Y" : "N",
    };
    setRequiredChangePass(null);
    dispatch(requirePasswordChange(payload)).then((res: any) => {
      if (res?.payload?.data?.success) {
        showToast(res.payload.data.message, "success");
      }
    });
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handlePaste = (event: any) => {
    event.preventDefault();
    showToast("Pasting is disabled in this field.");
  };

  useEffect(() => {
    dispatch(getUserProfile(params.id || ""));
  }, [params]);
  useEffect(() => {
    if (errors.password || errors.confirmPassword) {
      clearErrors("passwordMatch");
    }

    // If the passwords don't match, set a custom error
    setPasswordsMatch(true);
    if (confirmPassword?.length && password !== confirmPassword) {
      setPasswordsMatch(false);
      setError("passwordMatch", {
        type: "manual",
        message: "Passwords do not match",
      });
    }
  }, [password, confirmPassword, setError, clearErrors, errors]);
  return (
    <>
      <div>
        <Popover
          disableScrollLock={true}
          id={Boolean(anchorEl) ? "simple" : undefined}
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          sx={{
            "& .MuiPopover-paper": {
              width: "57%", // Custom width here
            },
          }}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <div className="flex items-start gap-[300px] py-[30px] px-[20px]">
            <Typography>Password</Typography>
            <div>
              <Button
                onClick={() => setResetPassword(true)}
                variant="contained"
                sx={{ background: "#fff", color: "#2563eb" }}
              >
                Reset Password
              </Button>
              {/* <p className="text-[14px] text-zinc-400 mt-[5px] text-center">
                Reset Sachin's Password
              </p> */}
            </div>
          </div>
          <div className="h-[50px] flex items-center justify-end px-[20px] border-t">
            <Button onClick={() => setAnchorEl(null)}>Close</Button>
          </div>
        </Popover>
      </div>
      <div>
        <Popover
          disableScrollLock={true}
          id={Boolean(changePhone) ? "simple" : undefined}
          open={Boolean(changePhone)}
          anchorEl={changePhone}
          onClose={() => setChangePhone(null)}
          sx={{
            "& .MuiPopover-paper": {
              width: "57%", // Custom width here
            },
          }}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <div className="absolute top-0 left-0 right-0 bg-white h-[20-px]">
            {updateUserMobileLoading && <LinearProgress />}
          </div>
          <div className="flex items-start justify-between py-[30px] px-[20px]">
            <Typography>Phone Number</Typography>
            <div className="flex flex-col">
              <TextField
                sx={{ width: "300px" }}
                required
                value={mobile}
                onChange={(e) => {
                  const value = e.target.value;
                  if (isNaN(Number(value))) {
                    showToast("Please enter valid number", "error");
                  } else {
                    setMobile(value);
                  }
                }}
                variant="filled"
                label="Mobile No."
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={askToVerify}
                    onChange={(e) => setAskToVerify(e.target.checked)}
                  />
                }
                label="Ask to Verify Mobile No. "
              />
            </div>
            <div></div>
          </div>
          <div className="h-[50px] flex items-center justify-end px-[20px] border-t">
          <Button onClick={() => {setChangePhone(null);setAskToVerify(false);}} variant="text">
              Close
            </Button>
            <Button
              disabled={updateUserMobileLoading}
              onClick={() => {
                if (!mobile) {
                  showToast("Please enter mobile number", "error");
                } else if (mobile.length < 10) {
                  showToast("Please enter valid mobile number", "error");
                } else {
                  dispatch(
                    updateUserMobile({
                      userId: userProfile ? userProfile?.id : "",
                      mobileNo: mobile,
                      isVarified: askToVerify ? "1" : "0",
                    })
                  ).then((res: any) => {
                    if (res.payload.data?.success) {
                      setMobile("");
                      setAskToVerify(false);
                      setChangePhone(null);
                      dispatch(getUserProfile(params.id || ""));
                    }
                  });
                }
              }}
            >
              Submit
            </Button>
            
          </div>
        </Popover>
      </div>
      <div>
        <Popover
          disableScrollLock={true}
          id={Boolean(changeEmail) ? "simple" : undefined}
          open={Boolean(changeEmail)}
          anchorEl={changeEmail}
          onClose={() => setChangeEmail(null)}
          sx={{
            "& .MuiPopover-paper": {
              width: "57%", // Custom width here
            },
          }}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <div className="absolute top-0 left-0 right-0 bg-white h-[20-px]">
            {updateUserEmailLoading && <LinearProgress />}
          </div>
          <div className="flex items-start gap-[300px] py-[20px] px-[20px]">
            <Typography>Email</Typography>
            <div className="space-y-2">
              <TextField
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="filled"
                label="Email"
                sx={{ width: "100%" }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={askToVerify}
                    onChange={(e) => setAskToVerify(e.target.checked)}
                  />
                }
                label="Ask to Verify Email "
              />
            </div>
          </div>
          <div className="h-[50px] flex items-center justify-end px-[20px] border-t">
            <Button
              disabled={updateUserEmailLoading}
              onClick={() => {
                if (!email) {
                  showToast("Please enter an email", "error");
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                  showToast("Please enter a valid email", "error");
                } else {
                  dispatch(
                    updateUserEmail({
                      emailId: email,
                      userId: userProfile ? userProfile.id || "" : "",
                      isVarified: askToVerify ? "1" : "0",
                    })
                  ).then((res: any) => {
                    if (res.payload.data?.success) {
                      setEmail("");
                      setAskToVerify(false);
                      setChangeEmail(null);
                      dispatch(getUserProfile(params.id || ""));
                    }
                  });
                }
              }}
              type="submit"
            >
              Close
            </Button>
          </div>
        </Popover>
      </div>
      <div>
        <Popover
          disableScrollLock={true}
          id={Boolean(requiredChangePass) ? "requiredChangePass" : undefined}
          open={Boolean(requiredChangePass)}
          anchorEl={requiredChangePass}
          onClose={() => setAnchorEl(null)}
          sx={{
            "& .MuiPopover-paper": {
              width: "57%", // Custom width here
            },
          }}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <div className="p-[20px] flex  gap-[50px]">
            <p className=" text-[15px] whitespace-nowrap">
              Require password change
            </p>
            <div>
              <div className="flex items-center">
                <Switch onChange={(e) => setPasswordChange(e.target.checked)} />
                {passwordChange ? "Yes" : "No"}{" "}
              </div>
              <p className="text-[14px] text-zinc-400 mt-[5px]">
                Turn on require password change so that this password will need
                to be changed.
              </p>
            </div>
          </div>
          <div className="h-[50px] flex items-center justify-end px-[20px] border-t">
            <Button onClick={() => handleRequirePasswordChange(passwordChange)}>
              Close
            </Button>
          </div>
        </Popover>
      </div>
      <Modal
        open={resetpassword}
        onClose={setResetPassword}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute" as "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: "5px",
            overflow: "hidden",
          }}
        >
          <div className="h-[50px] bg-blue-800 text-white flex items-center px-[20px]">
            <h2
              className="text-white text-[17px] font-[500]"
              id="modal-modal-title"
            >
              Reset Password- {userProfile ? userProfile?.email : "---"}
            </h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="p-[30px] relative flex flex-col gap-[30px]">
              <div className="space-y-5">
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      required
                      sx={{ width: "100%" }}
                      {...field}
                      label="New Password"
                      variant="standard"
                      type={showPassword ? "text" : "password"}
                      error={!!errors.password}
                      helperText={errors.password?.message}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={handleClickShowPassword}>
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
                <Controller
                  name="confirmPassword"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      required
                      sx={{ width: "100%" }}
                      {...field}
                      label="Confirm Password"
                      variant="standard"
                      type={showConfirmPassword ? "text" : "password"}
                      error={!!errors.confirmPassword || !passwordsMatch}
                      helperText={
                        errors.confirmPassword?.message ||
                        (!passwordsMatch ? "Passwords do not match" : "")
                      }
                      onPaste={handlePaste}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={handleClickShowConfirmPassword}
                            >
                              {showConfirmPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
                <Controller
                  name="ask_password_change"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Checkbox {...field} />}
                      label="Change Password after first login"
                    />
                  )}
                />
              </div>
              <div className="flex items-center justify-end gap-[10px]">
                <Button
                  type="button"
                  disabled={cahngeUserPasswordLoading}
                  onClick={() => {
                    setResetPassword(false), reset();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={cahngeUserPasswordLoading}
                  variant="contained"
                  // onClick={() => setResetPassword(false)}
                >
                  Continue
                </Button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-white h-[20-px]">
                {cahngeUserPasswordLoading && <LinearProgress />}
              </div>
            </div>
          </form>
        </Box>
      </Modal>
      <Modal
        open={suspend}
        onClose={setSuspend}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute" as "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: "5px",
            overflow: "hidden",
          }}
        >
          <div className="h-[50px] bg-blue-800 text-white flex items-center px-[20px]">
            <h2
              className="text-white text-[17px] font-[500]"
              id="modal-modal-title"
            >
              {userProfile
                ? userProfile?.status === "A"
                  ? "Deactivate User"
                  : "Activate User"
                : "---"}{" "}
            </h2>
          </div>

          <div className="p-[30px] relative flex flex-col gap-[30px]">
            <div className="space-y-5">
              <p className="text-[14px]">
                To confirm type "
                <span className="font-[500]">
                  {userProfile ? userProfile?.email : "---"}
                </span>
                " in the box below
              </p>
              <TextField
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="standard"
                label=""
                sx={{ width: "100%" }}
                placeholder="---"
              />
            </div>
            <div className="flex items-center justify-end gap-[10px]">
              <Button
                disabled={activateUserLoading || suspendUserLoading}
                onClick={() => {
                  setSuspend(false);
                  setEmail("");
                }}
              >
                Cancel
              </Button>
              <LoadingButton
                disabled={
                  activateUserLoading ||
                  suspendUserLoading ||
                  (!userProfile || userProfile?.email !== email ? true : false)
                }
                onClick={() => {
                  if (userProfile) {
                    if (userProfile[0]?.status === "A") {
                      dispatch(
                        suspendUser(userProfile ? userProfile[0]?.userID : "")
                      ).then((res: any) => {
                        if (res.payload.data?.success) {
                          setSuspend(false);
                          setEmail("");
                        }
                      });
                    } else {
                      dispatch(
                        activateUser(userProfile ? userProfile[0]?.userID : "")
                      ).then((res: any) => {
                        if (res.payload.data?.success) {
                          setSuspend(false);
                          setEmail("");
                        }
                      });
                    }
                  }
                }}
                variant="contained"
              >
                Continue
              </LoadingButton>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-white h-[20-px]">
              {(activateUserLoading || suspendUserLoading) && (
                <LinearProgress />
              )}
            </div>
          </div>
        </Box>
      </Modal>

      <Dialog
        open={updateUser}
        onClose={setUpdateUser}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="absolute top-0 left-0 right-0 ">
          {updateUserProfileLoading && <LinearProgress />}
        </div>
        <div className="flex items-center justify-between pr-[10px]">
          <DialogTitle fontWeight={600}>
            Update User - {userProfile ? userProfile?.user_name : "---"}
          </DialogTitle>
          <IconButton onClick={() => setUpdateUser(false)}>
            <Icons.close />
          </IconButton>
        </div>
        <Divider />
        <DialogContent sx={{ minWidth: "600px" }}>
          <div className="space-y-5">
            <TextField
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              required
              variant="filled"
              label="Name"
              sx={{ width: "100%" }}
            />

            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              sx={{
                display: "flex",
                alignItems: "center", // Ensures vertical alignment
                gap: 2, // Adds spacing between elements
              }}
            >
              <FormControlLabel
                value="M"
                control={<Radio />}
                label="Male"
                checked={gender === "M"}
                onChange={() => setGender("M")}
                sx={{ marginRight: 2 }} // Space between options
              />
              <FormControlLabel
                value="F"
                control={<Radio />}
                label="Female"
                checked={gender === "F"}
                onChange={() => setGender("F")}
              />
            </RadioGroup>
          </div>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button
            startIcon={<Icons.save />}
            disabled={updateUserProfileLoading}
            onClick={() => {
              if (!name) {
                showToast("Please enter first and last name", "error");
              } else {
                dispatch(
                  updateUserProfile({
                    userId: userProfile ? userProfile?.id : "",
                    name: name,
                    gender: gender,
                  })
                ).then((res: any) => {
                  if (res.payload.data?.success) {
                    showToast(res.payload.data.message, "success");
                    setUpdateUser(false);
                    setName("");
                    dispatch(getUserProfile(params.id || ""));
                  }
                });
              }
            }}
            variant="contained"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Modal
        open={updateStatus}
        onClose={setUpdateStatus}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute" as "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: "5px",
            overflow: "hidden",
          }}
        >
          <div className="h-[50px] bg-blue-800 text-white flex items-center px-[20px]">
            <h2
              className="text-white text-[17px] font-[500]"
              id="modal-modal-title"
            >
              Update Status of user -{" "}
              {userProfile ? userProfile?.user_name : "---"}
            </h2>
          </div>

          <div className="p-[30px] relative flex flex-col gap-[30px]">
            <div className="space-y-5">
              <Typography sx={{ marginRight: 2 }}>Status</Typography>
              <FormControlLabel
                value="1"
                control={<Radio />}
                label="Active"
                checked={status === "1"}
                onChange={() => setStatus("1")}
              />
              <FormControlLabel
                value="0"
                control={<Radio />}
                label="Inactive"
                checked={status === "0"}
                onChange={() => setStatus("0")}
              />
            </div>
            <div className="flex items-center justify-end gap-[10px]">
              <Button
                disabled={updateUserProfileLoading}
                onClick={() => {
                  setUpdateStatus(false);
                }}
              >
                Cancel
              </Button>
              <Button
                disabled={updateUserProfileLoading}
                onClick={() => {
                  dispatch(
                    updateUserStatus({
                      userId: userProfile ? userProfile?.id : "",

                      status: status,
                    })
                  ).then((res: any) => {
                    if (res.payload.data?.success) {
                      showToast(res.payload.data.message, "success");
                      setUpdateStatus(false);
                      setName("");
                      dispatch(getUserProfile(params.id || ""));
                    }
                  });
                }}
                variant="contained"
              >
                Continue
              </Button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-white h-[20-px]">
              {updateUserProfileLoading && <LinearProgress />}
            </div>
          </div>
        </Box>
      </Modal>
      <Modal
        open={updateVerification}
        onClose={setUpdateVerification}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute" as "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: "5px",
            overflow: "hidden",
          }}
        >
          <div className="h-[50px] bg-blue-800 text-white flex items-center px-[20px]">
            <h2
              className="text-white text-[17px] font-[500]"
              id="modal-modal-title"
            >
              Update Status of user -{" "}
              {userProfile ? userProfile?.user_name : "---"}
            </h2>
          </div>

          <div className="p-[30px] relative flex flex-col gap-[30px]">
            <div className="space-y-5">
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <FormLabel sx={{ marginBottom: 1 }}>Verification</FormLabel>
                <Select
                  value={verification}
                  onChange={(e) => setVerification(e.target.value)}
                  sx={{ width: 200 }} // You can adjust the width as needed
                >
                  {verificationTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </div>
            <div className="flex items-center justify-end gap-[10px]">
              <Button
                disabled={updateUserProfileLoading}
                onClick={() => {
                  setUpdateVerification(false);
                }}
              >
                Cancel
              </Button>
              <Button
                disabled={updateUserProfileLoading}
                onClick={() => {
                  dispatch(
                    updateUserVerification({
                      userId: userProfile ? userProfile?.id : "",

                      status: verification,
                    })
                  ).then((res: any) => {
                    if (res.payload.data?.success) {
                      showToast(res.payload.data.message, "success");
                      setUpdateVerification(false);
                      setName("");
                      dispatch(getUserProfile(params.id || ""));
                    }
                  });
                }}
                variant="contained"
              >
                Continue
              </Button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-white h-[20-px]">
              {updateUserProfileLoading && <LinearProgress />}
            </div>
          </div>
        </Box>
      </Modal>
      <div className=" grid grid-cols-[330px_1fr]">
        <div className="h-[calc(100vh-70px)]   overflow-y-auto p-[20px] ">
          <div className="w-full h-full rounded-sm shadow shadow-stone-400">
            <div className="profile p-[20px] flex overflow-hidden gap-[10px] border-b h-[200px]">
              <Avatar className="border h-[50px] w-[50px]">
                {getUserProfileLoading ? (
                  <Skeleton className="w-full h-full" />
                ) : (
                  <>
                    <AvatarImage src="https://material-ui.com/static/images/avatar/1.jpg" />
                    <AvatarFallback>CN</AvatarFallback>
                  </>
                )}
              </Avatar>

              <div className="w-full">
                <h1 className="text-[20px] font-[500] text-stone-700">
                  {getUserProfileLoading ? (
                    <Skeleton className="w-full h-[25px]" />
                  ) : userProfile ? (
                    userProfile?.fullName
                  ) : (
                    "--"
                  )}
                </h1>
                <p className="break-all whitespace-normal text-stone-600 text-[15px]">
                  {getUserProfileLoading ? (
                    <Skeleton className="w-full h-[18px] mt-[5px]" />
                  ) : userProfile ? (
                    userProfile?.emailID
                  ) : (
                    "--"
                  )}
                </p>
                <p className="text-green-600 text-[13px]">
                  {getUserProfileLoading ? (
                    <Skeleton className="w-full h-[13px] mt-[5px]" />
                  ) : userProfile ? (
                    userProfile?.status === "1" ? (
                      "Active"
                    ) : (
                      "Inactive"
                    )
                  ) : (
                    "---"
                  )}
                </p>
                <p className="text-stone-500 text-[13px]">
                  {getUserProfileLoading ? (
                    <Skeleton className="w-full h-[13px] mt-[5px]" />
                  ) : (
                    "Last sign in : " +
                    (userProfile ? userProfile?.lastLogin : "---")
                  )}
                </p>
                <p className="text-stone-500 text-[13px]">
                  {" "}
                  {getUserProfileLoading ? (
                    <Skeleton className="w-full h-[13px] mt-[5px]" />
                  ) : userProfile ? (
                    "Created: " + userProfile?.reg_date
                  ) : (
                    "Created:  --"
                  )}
                </p>
              </div>
            </div>
            <div className="p-[20px] border-b">
              <p className="text-[13px] text-stone-500">Organizational unit</p>
              <h2 className="font-[500] text-stone-700">mscorpres.in</h2>
            </div>
            <div
              className={` relative ${
                !userProfile
                  ? "opacity-60 cursor-not-allowed pointer-events-none"
                  : ""
              }`}
            >
              <List>
                <ListItemButton
                  disabled={!userProfile}
                  onClick={() => {
                    setUpdateUser(true);
                    setName(userProfile?.user_name || "");
                  }}
                >
                  <Typography fontSize={15} fontWeight={500} variant="inherit">
                    UPDATE USER
                  </Typography>
                </ListItemButton>
                <ListItemButton
                  disabled={!userProfile}
                  onClick={() => setUpdateVerification(true)}
                >
                  <Typography fontSize={15} fontWeight={500} variant="inherit">
                    UPDATE VERIFICATION
                  </Typography>
                </ListItemButton>
                <ListItemButton
                  disabled={!userProfile}
                  onClick={() => setUpdateStatus(true)}
                >
                  <Typography fontSize={15} fontWeight={500}>
                    UPDATE STATUS
                  </Typography>
                </ListItemButton>
              </List>
            </div>
          </div>
        </div>
        <div className="h-[calc(100vh-72px)] overflow-y-auto">
          <div className="h-[50px] border-b bg-white sticky top-0">
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab
                sx={{
                  textTransform: "capitalize",
                  fontWeight: "bold",
                  color: "#78716c",
                }}
                label="User detail"
                {...a11yProps(0)}
              />
              <Tab
                sx={{
                  textTransform: "capitalize",
                  fontWeight: "bold",
                  color: "#78716c",
                }}
                label="Security"
                {...a11yProps(1)}
              />
              <Tab
                sx={{
                  textTransform: "capitalize",
                  fontWeight: "bold",
                  color: "#78716c",
                }}
                label="Investigate"
                {...a11yProps(2)}
              />
            </Tabs>
          </div>
          <div className="py-[20px]">
            <CustomTabPanel value={value} index={0}>
              <div className="flex flex-col gap-[10px] px-[5px]">
                {/* <div className="border flex justify-between py-[10px] px-[20px]">
                  <div className="flex items-center gap-[3px] text-[15px]">
                    <span className="flex items-center gap-[5px]">
                      <BellIcon className="h-[18px] w-[18px]" />
                      Alerts
                    </span>
                    <span className="text-stone-600">in the last 7 days</span>
                  </div>
                  <Link to={"#"} className="text-[15px] text-blue-600 font-[500]">
                    View alerts
                  </Link>
                </div> */}

                <div className="py-[20px] px-[20px] rounded-sm shadow shadow-stone-400">
                  <div className="flex items-end justify-between">
                    <p className="text-stone-500">User information</p>

                    <Button
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        minWidth: 0,
                        padding: 0,
                      }}
                    >
                      <FaChevronDown className="h-[18px] w-[18px] text-stone-400" />
                    </Button>
                  </div>

                  <div className="mt-[20px] space-y-[10px]">
                    <div className="flex justify-between items-center gap-[30px]">
                      <p className="font-medium text-gray-700">User Name</p>
                      <p className="text-sm text-stone-500">
                        {getUserProfileLoading ? (
                          <Skeleton className="w-[150px] h-[13px]" />
                        ) : userProfile ? (
                          userProfile.user_name
                        ) : (
                          "--"
                        )}
                      </p>
                    </div>

                    <div className="flex justify-between items-center gap-[30px]">
                      <p className="font-medium text-gray-700">Email</p>
                      <p className="text-sm text-stone-500">
                        {getUserProfileLoading ? (
                          <Skeleton className="w-[150px] h-[13px]" />
                        ) : userProfile ? (
                          userProfile.email
                        ) : (
                          "--"
                        )}
                      </p>
                    </div>

                    <div className="flex justify-between items-center gap-[30px]">
                      <p className="font-medium text-gray-700">Phone Number</p>
                      <p className="text-sm text-stone-500">
                        {getUserProfileLoading ? (
                          <Skeleton className="w-[150px] h-[13px]" />
                        ) : userProfile ? (
                          userProfile?.mobile
                        ) : (
                          "--"
                        )}
                      </p>
                    </div>

                    <div className="flex justify-between items-center gap-[30px]">
                      <p className="font-medium text-gray-700">Gender</p>
                      <p className="text-sm text-stone-500">
                        {getUserProfileLoading ? (
                          <Skeleton className="w-[150px] h-[13px]" />
                        ) : userProfile ? (
                          userProfile?.gender === "M" ? (
                            "Male"
                          ) : (
                            "Female"
                          )
                        ) : (
                          "--"
                        )}
                      </p>
                    </div>

                    {/* <div className="flex justify-between items-center gap-[30px]">
                      <p className="font-medium text-gray-700">User Type</p>
                      <p className="text-sm text-stone-500">{getUserProfileLoading ? <Skeleton className="w-[150px] h-[13px]" /> : userProfile ? userProfile?.type : "--"}</p>
                    </div> */}
                  </div>
                </div>

                <div
                  className="py-[20px] px-[20px] rounded-sm shadow shadow-stone-400"
                  ref={ref}
                >
                  <div className="flex items-end justify-between">
                    <p className="text-stone-500">Update Phone Number</p>
                    <Button
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        minWidth: 0,
                        padding: 0,
                      }}
                    >
                      <FaChevronDown className="h-[18px] w-[18px] text-stone-400" />
                    </Button>
                  </div>

                  <div className="mt-[20px] py-[10px] flex gap-[100px]">
                    <div>
                      <p>Phone Number | Work</p>
                      <p className="text-stone-500 text-[14px]">
                        {getUserProfileLoading ? (
                          <Skeleton className="w-full h-[13px] mt-[5px]" />
                        ) : userProfile ? (
                          userProfile?.mobile
                        ) : (
                          "--"
                        )}
                      </p>
                    </div>
                    <IconButton
                      onClick={() => {
                        setChangePhone(ref.current);
                        setMobile(userProfile?.mobile || "");
                      }}
                      color="primary"
                    >
                      <Icons.edit fontSize="small" />
                    </IconButton>
                  </div>
                </div>

                {/* Second Button Section */}
                <div
                  ref={ref2}
                  className="py-[20px] px-[20px] rounded-sm shadow shadow-stone-400"
                >
                  <div className="flex items-end justify-between">
                    <p className="text-stone-500">Update Email</p>
                    <Button
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        minWidth: 0,
                        padding: 0,
                      }}
                    >
                      <FaChevronDown className="h-[18px] w-[18px] text-stone-400" />
                    </Button>
                  </div>

                  <div className="mt-[20px] py-[10px] flex gap-[100px]">
                    <div>
                      <p>Email</p>
                      <p className="text-stone-500 text-[14px]">
                        {getUserProfileLoading ? (
                          <Skeleton className="w-full h-[13px] mt-[5px]" />
                        ) : userProfile ? (
                          userProfile?.email
                        ) : (
                          "--"
                        )}
                      </p>
                    </div>
                    <IconButton
                      onClick={() => {
                        setChangeEmail(ref2.current);
                        setEmail(userProfile?.email || "");
                      }}
                      color="primary"
                    >
                      <Icons.edit fontSize="small" />
                    </IconButton>
                  </div>
                </div>
                <button className="items-start w-full p-0 m-0 rounded-sm text-start hover:bg-zinc-100"></button>
              </div>
            </CustomTabPanel>

            <CustomTabPanel value={value} index={1}>
              <div className="flex flex-col gap-[10px] rounded-sm shadow  shadow-stone-400">
                <div className="h-[50px] flex items-center px-[20px] bg-zinc-50 text-zinc-500 border-b">
                  Security
                </div>
                <p className="text-zinc-400 ml-[20px]">Password settings</p>
                <button
                  className="items-start w-full p-0 m-0 text-start"
                  aria-describedby={Boolean(anchorEl) ? "simple" : undefined}
                  onClick={handleClick}
                >
                  <div className="grid grid-cols-3 py-[20px] hover:bg-zinc-100 px-[20px] group">
                    <p>Password</p>
                    <p className="text-zinc-400 font-[300]">Reset PASSWORD</p>
                    <div className="flex items-end justify-end">
                      <RiPencilFill className="h-[20px] w-[20px] text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer" />
                    </div>
                  </div>
                </button>
                <button
                  className="items-start w-full p-0 m-0 text-start"
                  aria-describedby={
                    Boolean(requiredChangePass)
                      ? "requiredChangePass"
                      : undefined
                  }
                  // onClick={(e) => setRequiredChangePass(e.currentTarget)}
                  onClick={() => setResetPassword(true)}
                >
                  <div className="grid grid-cols-3 py-[20px] hover:bg-zinc-100 px-[20px] group">
                    <p>Require password change</p>
                    <div>
                      <p className=" font-[300]">OFF</p>
                      <p className="text-[13px] text-zinc-500">
                        This password wont't to be changed once sign in.
                      </p>
                    </div>
                    <div className="flex items-center justify-end">
                      <RiPencilFill className="h-[20px] w-[20px] text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer" />
                    </div>
                  </div>
                </button>
                <div className="grid grid-cols-3 py-[20px] hover:bg-zinc-100 px-[20px] group">
                  <p>2-step verification</p>
                  <p className=" font-[300]">OFF</p>
                  <div className="flex items-end justify-end">
                    <RiPencilFill className="h-[20px] w-[20px] text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer" />
                  </div>
                </div>
              </div>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
              <div>
                <p>Check log events for user login logs.</p>
                <div className="border rounded-sm shadow shadow-stone-400 mt-[20px] max-h-[450px] relative">
                  <div className="h-full pb-[40px] overflow-y-auto">
                    <div className=" grid grid-cols-[60px_1fr_150px] px-[20px] py-[10px] items-center hover:bg-zinc-100">
                      <CalendarIcon className="h-[20px] w-[20px] text-zinc-600" />
                      <p>Calendar log events</p>
                      <Button onClick={() => setOpen("login")}>
                        View Logs
                      </Button>
                    </div>
                  </div>
                  <div className="h-[40px] absolute bottom-0 w-full flex justify-end items-center px-[20px] gap-[20px]">
                    <div className="">
                      <div className="flex items-center gap-[10px]">
                        <p className="whitespace-nowrap">Rows per page</p>
                        <FormControl fullWidth>
                          <Select
                            inputProps={{ "aria-label": "Without label" }}
                            labelId="demo-simple-select-label"
                            sx={{
                              padding: "0px",
                              height: "30px",
                              width: "80px",
                            }}
                            id="demo-simple-select"
                            value={age}
                            label=""
                            onChange={handleSelectChange}
                          >
                            <MenuItem value={10}>10</MenuItem>
                            <MenuItem value={20}>40</MenuItem>
                            <MenuItem value={30}>30</MenuItem>
                          </Select>
                        </FormControl>
                      </div>
                    </div>
                    <div>
                      <p>1‑22 of 22</p>
                    </div>
                    <div className="flex items-center gap-[20px]">
                      <Button
                        sx={{
                          padding: "0px",
                          width: "30px",
                          minWidth: "0px",
                          height: "30px",
                        }}
                      >
                        <FaChevronLeft className="h-[18px] w-[18px] text-zinc-700" />
                      </Button>
                      <Button
                        sx={{
                          padding: "0px",
                          width: "30px",
                          minWidth: "0px",
                          height: "30px",
                        }}
                      >
                        <FaChevronRight className="h-[18px] w-[18px] text-zinc-700" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-[50px]">
                <p>Check log events for issues related to this user.</p>
                <div className="border rounded-sm shadow shadow-stone-400 mt-[20px] max-h-[450px] relative">
                  <div className="h-full pb-[40px] overflow-y-auto">
                    <div className=" grid grid-cols-[60px_1fr_150px] px-[20px] py-[10px] items-center hover:bg-zinc-100">
                      <CalendarIcon className="h-[20px] w-[20px] text-zinc-600" />
                      <p>Calendar log events</p>
                      <Button>View Logs</Button>
                    </div>
                  </div>
                  <div className="h-[40px] absolute bottom-0 w-full flex justify-end items-center px-[20px] gap-[20px]">
                    <div className="">
                      <div className="flex items-center gap-[10px]">
                        <p className="whitespace-nowrap">Rows per page</p>
                        <FormControl fullWidth>
                          <Select
                            inputProps={{ "aria-label": "Without label" }}
                            labelId="demo-simple-select-label"
                            sx={{
                              padding: "0px",
                              height: "30px",
                              width: "80px",
                            }}
                            id="demo-simple-select"
                            value={age}
                            label=""
                            onChange={handleSelectChange}
                          >
                            <MenuItem value={10}>10</MenuItem>
                            <MenuItem value={20}>40</MenuItem>
                            <MenuItem value={30}>30</MenuItem>
                          </Select>
                        </FormControl>
                      </div>
                    </div>
                    <div>
                      <p>1‑22 of 22</p>
                    </div>
                    <div className="flex items-center gap-[20px]">
                      <Button
                        sx={{
                          padding: "0px",
                          width: "30px",
                          minWidth: "0px",
                          height: "30px",
                        }}
                      >
                        <FaChevronLeft className="h-[18px] w-[18px] text-zinc-700" />
                      </Button>
                      <Button
                        sx={{
                          padding: "0px",
                          width: "30px",
                          minWidth: "0px",
                          height: "30px",
                        }}
                      >
                        <FaChevronRight className="h-[18px] w-[18px] text-zinc-700" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-[50px]">
                <p>Audit logs related to this user.</p>
                <div className="border rounded-sm shadow shadow-stone-400 mt-[20px] max-h-[450px] relative">
                  <div className="h-full pb-[40px] overflow-y-auto">
                    <div className=" grid grid-cols-[60px_1fr_150px] px-[20px] py-[10px] items-center hover:bg-zinc-100">
                      <CalendarIcon className="h-[20px] w-[20px] text-zinc-600" />
                      <p>Calendar log events</p>
                      <Button>View Logs</Button>
                    </div>
                  </div>
                  <div className="h-[40px] absolute bottom-0 w-full flex justify-end items-center px-[20px] gap-[20px]">
                    <div className="">
                      <div className="flex items-center gap-[10px]">
                        <p className="whitespace-nowrap">Rows per page</p>
                        <FormControl fullWidth>
                          <Select
                            inputProps={{ "aria-label": "Without label" }}
                            labelId="demo-simple-select-label"
                            sx={{
                              padding: "0px",
                              height: "30px",
                              width: "80px",
                            }}
                            id="demo-simple-select"
                            value={age}
                            label=""
                            onChange={handleSelectChange}
                          >
                            <MenuItem value={10}>10</MenuItem>
                            <MenuItem value={20}>40</MenuItem>
                            <MenuItem value={30}>30</MenuItem>
                          </Select>
                        </FormControl>
                      </div>
                    </div>
                    <div>
                      <p>1‑22 of 22</p>
                    </div>
                    <div className="flex items-center gap-[20px]">
                      <Button
                        sx={{
                          padding: "0px",
                          width: "30px",
                          minWidth: "0px",
                          height: "30px",
                        }}
                      >
                        <FaChevronLeft className="h-[18px] w-[18px] text-zinc-700" />
                      </Button>
                      <Button
                        sx={{
                          padding: "0px",
                          width: "30px",
                          minWidth: "0px",
                          height: "30px",
                        }}
                      >
                        <FaChevronRight className="h-[18px] w-[18px] text-zinc-700" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CustomTabPanel>
          </div>
        </div>
      </div>
      <ShowLog open={open} handleClose={handleClose} />
    </>
  );
};

export default UserProfile;
