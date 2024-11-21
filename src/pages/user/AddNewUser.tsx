import React, { useEffect } from "react";
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
import { addUser, getRoleList } from "@/features/user/userSlice";
import { showToast } from "@/utills/toasterContext";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z
    .string()
    .min(8, "Confirm password must be at least 8 characters"),
  mobile: z.string().regex(/^([6-9]\d{9})$/, "Invalid Indian mobile number"),
  gender: z.enum(["M", "F"]),
  askPasswordChange: z.boolean(),
  subscribeNewsletter: z.boolean(),
  userType: z.enum(["user", "admin", "developer"]),
  authtype: z.enum(["E", "M", "1", "0"]),
  role: z.string().optional(),
});

// Define the form input types using TypeScript
type FormData = z.infer<typeof schema>;

const AddNewUser: React.FC = () => {

  const userTypes = [
    { label: "User", value: "user" },
    { label: "Admin", value: "admin" },
    { label: "Developer", value: "developer" },
  ];

  const authTypes = [
    { label: "Email", value: "E" },
    { label: "Mobile", value: "M" },
    { label: "Both OK", value: "1" },
    { label: "None", value: "0" },
  ];
  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      gender: "M",
      askPasswordChange: false,
      subscribeNewsletter: false,
      userType: "user",
      authtype: "E",
      mobile: "",
    },
  });
  const dispatch = useAppDispatch();
  const { addUserloading, rolelistData } = useAppSelector(
    (state) => state.user
  );

  const onSubmit = (data: FormData) => {
    const payload: AddUserPayload = {
      name: data.name,
      email: data.email,
      mobileNo: data.mobile,
      password: data.password,
      gender: data.gender,
      asktochange: data.askPasswordChange ? "on" : "off",
      newsletterSubscription: data.subscribeNewsletter ? "yes" : "no",
      type: data.userType,
      verification: data.authtype,
      role:data.role||"",
    };
    dispatch(addUser(payload)).then((res: any) => {
      if (res.payload.data.code == 200) {
        showToast(res.payload.data.message, "success");
        reset();
      } else {
        showToast(res.payload.data.message, "error");
      }
    });
  };
  useEffect(() => {
    dispatch(getRoleList());
  }, []);
  console.log(rolelistData);
  return (
    <div className="p-[20px] overflow-y-auto h-[calc(100vh-70px)]">
      <div className="rounded-sm shadow shadow-stone-400 p-[20px]">
        <h2 className="text-[20px] font-[600] text-slate-600">Add New User</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mt-[20px] grid grid-cols-2 max-w-[70%] gap-[20px]">
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="First Name"
                  variant="standard"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  variant="standard"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              )}
            />
            <Controller
              name="mobile"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Mobile No."
                  variant="standard"
                  error={!!errors.mobile}
                  helperText={errors.mobile?.message}
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Password"
                  type="password"
                  variant="standard"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />
              )}
            />
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Confirm Password"
                  type="password"
                  variant="standard"
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                />
              )}
            />
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <FormControl>
                  <FormLabel>Gender</FormLabel>
                  <RadioGroup {...field} row>
                    <FormControlLabel
                      value="F"
                      control={<Radio />}
                      label="Female"
                    />
                    <FormControlLabel
                      value="M"
                      control={<Radio />}
                      label="Male"
                    />
                  </RadioGroup>
                </FormControl>
              )}
            />
            <Controller
              name="askPasswordChange"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox {...field} />}
                  label="Change Password after first login"
                />
              )}
            />
            <Controller
              name="subscribeNewsletter"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox {...field} />}
                  label="Subscribe to Newsletter"
                />
              )}
            />

            {/* Status Select */}
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <FormControl variant="standard" error={!!errors.role}>
                  <FormLabel>Role</FormLabel>
                  <Select
                    {...field}
                    value={field.value || ""}
                    onChange={field.onChange}
                  >
                    {rolelistData?.length > 0 ? (
                      rolelistData.map((role:any) => (
                        <MenuItem key={role.role_id} value={role.role_id}>
                          {role.role_name}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>No roles available</MenuItem>
                    )}
                  </Select>
                  <p className="text-red-500">{errors.role?.message}</p>
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
                  <Select
                    {...field}
                    value={field.value || ""}
                    onChange={field.onChange}
                  >
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
                  <Select
                    {...field}
                    value={field.value || ""}
                    onChange={field.onChange}
                  >
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
            <LoadingButton
              loading={addUserloading}
              type="submit"
              variant="contained"
            >
              Submit
            </LoadingButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewUser;
