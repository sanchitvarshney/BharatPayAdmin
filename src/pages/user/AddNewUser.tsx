import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Checkbox, TextField, MenuItem, Select } from "@mui/material";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { AddUserPayload } from "@/features/user/userType";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import LoadingButton from "@mui/lab/LoadingButton";
import { addUser } from "@/features/user/userSlice";
import { showToast } from "@/utills/toasterContext";


const schema = z.object({
  fName: z.string().min(1, "First name is required"),
  lName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Confirm password must be at least 8 characters"),
  mobile: z.string().regex(/^([6-9]\d{9})$/, "Invalid Indian mobile number"),
  gender: z.enum(["m", "f"]),
  askPasswordChange: z.boolean(),
  subscribeNewsletter: z.boolean(),
  status: z.enum(["active", "inactive"]),
  userType: z.enum(["user", "admin", "developer"]),
  authtype: z.enum(["email", "mobile", "bothOK", "none"]),
});

// Define the form input types using TypeScript
type FormData = z.infer<typeof schema>;

const AddNewUser: React.FC = () => {
  const options = [
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
  ];

  const userTypes = [
    { label: "User", value: "user" },
    { label: "Admin", value: "admin" },
    { label: "Developer", value: "developer" },
  ];

  const authTypes = [
    { label: "Email", value: "email" },
    { label: "Mobile", value: "mobile" },
    { label: "Both OK", value: "bothOk" },
    { label: "None", value: "none" },
  ];
  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      fName: "",
      lName: "",
      email: "",
      password: "",
      confirmPassword: "",
      gender: "m",
      askPasswordChange: false,
      subscribeNewsletter: false,
      status: "active",
      userType: "user",
      authtype: "email",
      mobile: "",
    },
  });
  const dispatch = useAppDispatch();
  const { addUserloading } = useAppSelector((state) => state.user);

  const onSubmit = (data: FormData) => {
    const payload: AddUserPayload = {
      fName: data.fName,
      lName: data.lName,
      email: data.email,
      password: data.password,
      gender: data.gender,
      askPasswordChange: data.askPasswordChange ? "yes" : "no",
      newsletterSubscription: data.subscribeNewsletter ? "yes" : "no",
      userStatus: data.status,
      userType: data.userType,
      authtype: data.authtype,
      mobile: data.mobile,
    };
    dispatch(addUser(payload)).then((res: any) => {
      if (res.payload.data.success) {
        showToast(res.payload.data.message, "success");
        reset();
      } else {
        showToast(res.payload.data.message, "error");
      }
    });
  };

  return (
    <div className="p-[20px] overflow-y-auto h-[calc(100vh-70px)]">
      <div className="rounded-sm shadow shadow-stone-400 p-[20px]">
        <h2 className="text-[20px] font-[600] text-slate-600">Add New User</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mt-[20px] grid grid-cols-2 max-w-[70%] gap-[20px]">
            <Controller name="fName" control={control} render={({ field }) => <TextField {...field} label="First Name" variant="standard" error={!!errors.fName} helperText={errors.fName?.message} />} />
            <Controller name="lName" control={control} render={({ field }) => <TextField {...field} label="Last Name" variant="standard" error={!!errors.lName} helperText={errors.lName?.message} />} />
            <Controller name="email" control={control} render={({ field }) => <TextField {...field} label="Email" variant="standard" error={!!errors.email} helperText={errors.email?.message} />} />
            <Controller name="mobile" control={control} render={({ field }) => <TextField {...field} label="Mobile No." variant="standard" error={!!errors.mobile} helperText={errors.mobile?.message} />} />
            <Controller name="password" control={control} render={({ field }) => <TextField {...field} label="Password" type="password" variant="standard" error={!!errors.password} helperText={errors.password?.message} />} />
            <Controller name="confirmPassword" control={control} render={({ field }) => <TextField {...field} label="Confirm Password" type="password" variant="standard" error={!!errors.confirmPassword} helperText={errors.confirmPassword?.message} />} />
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <FormControl>
                  <FormLabel>Gender</FormLabel>
                  <RadioGroup {...field} row>
                    <FormControlLabel value="f" control={<Radio />} label="Female" />
                    <FormControlLabel value="m" control={<Radio />} label="Male" />
                  </RadioGroup>
                </FormControl>
              )}
            />
            <Controller name="askPasswordChange" control={control} render={({ field }) => <FormControlLabel control={<Checkbox {...field} />} label="Change Password after first login" />} />
            <Controller name="subscribeNewsletter" control={control} render={({ field }) => <FormControlLabel control={<Checkbox {...field} />} label="Subscribe to Newsletter" />} />

            {/* Status Select */}
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <FormControl variant="standard" error={!!errors.status}>
                  <FormLabel>Status</FormLabel>
                  <Select {...field} value={field.value || ""} onChange={field.onChange}>
                    {options.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  <p className="text-red-500">{errors.status?.message}</p>
                </FormControl>
              )}
            />

            {/* Verification Select */}
            <Controller
              name="authtype"
              control={control}
              render={({ field }) => (
                <FormControl variant="standard" error={!!errors.authtype}>
                  <FormLabel>Verification</FormLabel>
                  <Select {...field} value={field.value || ""} onChange={field.onChange}>
                    {authTypes.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                  <p className="text-red-500">{errors.authtype?.message}</p>
                </FormControl>
              )}
            />

            {/* User Type Select */}
            <Controller
              name="userType"
              control={control}
              render={({ field }) => (
                <FormControl variant="standard" error={!!errors.userType}>
                  <FormLabel>User Type</FormLabel>
                  <Select {...field} value={field.value || ""} onChange={field.onChange}>
                    {userTypes.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                  <p className="text-red-500">{errors.userType?.message}</p>
                </FormControl>
              )}
            />
          </div>
          <div className="mt-[20px]">
            <LoadingButton loading={addUserloading} type="submit" variant="contained">
              Submit
            </LoadingButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewUser;
