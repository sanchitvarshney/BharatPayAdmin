import { FormControl, IconButton, Input, InputAdornment, InputLabel, TextField } from "@mui/material";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LoadingButton from "@mui/lab/LoadingButton";
import { showToast } from "@/utills/toasterContext";
import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { loginUserAsync } from "@/features/authentication/authSlice";
import { Link, useNavigate } from "react-router-dom";

interface LoginFormInputs {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.auth);
  
  const navigate = useNavigate();
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const onSubmit: SubmitHandler<LoginFormInputs> = (data) => {
    const payload = {
      username: data.username,
      password: data.password,
    };
    dispatch(loginUserAsync(payload)).then((res: any) => {
      if (res.payload.data.success) {
        navigate("/");
      } else {
        showToast(res.payload.data.message, "error");
      }
    });
  };

  return (
    <>
      <div className="h-[100vh] w-[100%] bg-blue-800 p-[10px]">
        <main className="h-[calc(100vh-20px)] bg-white rounded-md overflow-hidden flex items-center justify-center">
          <form onSubmit={handleSubmit(onSubmit)} className="w-[500px] shadow shadow-stone-400 p-[20px] rounded-md">
            <h1 className="text-2xl font-[600] text-zinc-600">Login</h1>
            <p className="text-zinc-500">Enter your username and password below to login to your account</p>
            <div className="mt-[20px] flex flex-col gap-[30px]">
              <TextField label="Username" variant="standard" {...register("username", { required: "Username is required" })} error={!!errors.username} helperText={errors.username ? errors.username.message : ""} />
              <FormControl sx={{ width: "100%" }} variant="standard">
                <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
                <Input
                  id="standard-adornment-password"
                  type={showPassword ? "text" : "password"}
                  {...register("password", { required: "Password is required" })}
                  error={!!errors.password}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} onMouseUp={handleMouseUpPassword}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
                {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
              </FormControl>
            </div>
            <div className="flex justify-end mt-[5px]">
              <Link to={"/forgot-password"} className="text-[15px] text-slate-600 underline">
                Forgot Password
              </Link>
            </div>
            <div className="mt-[20px]">
              <LoadingButton sx={{ width: "100%" }} variant="contained" type="submit" loading={loading}>
                Login
              </LoadingButton>
            </div>
          </form>
        </main>
      </div>
    </>
  );
};

export default Login;
