import { useState } from "react";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import LoadingButton from "@mui/lab/LoadingButton";

// Define the data structure for editing the profile
type ProfileFormData = {
  name: string;
  email: string;
  mobile: string;
  bio: string;
};

// Define the data structure for changing the password
type PasswordFormData = {
  newPassword: string;
  confirmPassword: string;
};

const UserProfile = () => {
  const [user, setUser] = useState({
    name: "John Doe",
    username: "@johndoe",
    email: "johndoe@example.com",
    mobile: "+1234567890",
    bio: "Software Developer",
    profilePicture: "https://www.w3schools.com/w3images/avatar2.png",
    is2faActive: false,
  });

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useState(false);
  const [is2faActive, setIs2faActive] = useState(user.is2faActive);

  // Form states for editing profile
  const {
    control: controlProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
    // reset: resetProfile,
  } = useForm<ProfileFormData>({
    defaultValues: {
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      bio: user.bio,
    },
  });

  const {
    control: controlPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    // reset: resetPassword,
  } = useForm<PasswordFormData>({
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Toggle 2FA
  const toggle2FA = () => {
    setIs2faActive(!is2faActive);
    alert(`2FA has been ${!is2faActive ? "enabled" : "disabled"}`);
  };

  const handleEditProfileSubmit = (data: ProfileFormData) => {
    setUser({
      ...user,
      name: data.name,
      email: data.email,
      mobile: data.mobile,
      bio: data.bio,
    });
    setIsEditModalOpen(false);
  };

  const handleChangePasswordSubmit = (data: PasswordFormData) => {
    if (data.newPassword !== data.confirmPassword) {
      alert("Passwords don't match!");
    } else {
      alert("Password updated successfully!");
      setIsChangePasswordModalOpen(false);
    }
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    fontSize: "11px",
    boxShadow: 24,
    width: 650,
    p: 4,
  };

  return (
    <div className="bg-gray-100 flex justify-center items-center p-4">
      <div className="bg-white w-full p-6 rounded-lg shadow-lg h-screen">
        {/* Profile Picture */}
        <div className="flex justify-center mb-6">
          <img
            src={user.profilePicture}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-gray-200"
          />
        </div>

        {/* Profile Info */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-semibold text-gray-800">{user.name}</h2>
          <p className="text-sm text-gray-500">{user.username}</p>
        </div>

        {/* User Info */}
        <div className="space-y-4 mb-6">
          <div className="flex justify-between">
            <span className="font-semibold text-gray-600">Email:</span>
            <span className="text-gray-800">{user.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-600">Mobile:</span>
            <span className="text-gray-800">{user.mobile}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-600">Bio:</span>
            <span className="text-gray-800">{user.bio}</span>
          </div>
        </div>

        {/* Edit Profile, Change Password, Toggle 2FA */}
        <div className="space-x-2 text-center mb-6 pt-20">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="bg-blue-500 text-white py-2 px-6 rounded-full hover:bg-blue-600 transition duration-200"
          >
            Edit Profile
          </button>
          <button
            onClick={() => setIsChangePasswordModalOpen(true)}
            className="bg-green-500 text-white py-2 px-6 rounded-full hover:bg-green-600 transition duration-200"
          >
            Change Password
          </button>
          <button
            onClick={toggle2FA}
            className={`py-2 px-6 rounded-full ${
              is2faActive ? "bg-red-500" : "bg-yellow-500"
            } text-white hover:bg-opacity-90 transition duration-200`}
          >
            {is2faActive ? "Disable 2FA" : "Enable 2FA"}
          </button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <Box sx={{ ...style, width: 400 }}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Edit Profile
          </Typography>
          <form onSubmit={handleSubmitProfile(handleEditProfileSubmit)}>
            <div className="mt-[20px] grid grid-cols-1 gap-[20px]">
              {/* Name */}
              <Controller
                name="name"
                control={controlProfile}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Name"
                    variant="standard"
                    fullWidth
                    error={!!profileErrors.name}
                    helperText={profileErrors.name?.message}
                  />
                )}
              />

              {/* Email */}
              <Controller
                name="email"
                control={controlProfile}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email"
                    variant="standard"
                    fullWidth
                    error={!!profileErrors.email}
                    helperText={
                      profileErrors.email ? profileErrors.email.message : ""
                    }
                  />
                )}
              />

              {/* Mobile */}
              <Controller
                name="mobile"
                control={controlProfile}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Mobile"
                    variant="standard"
                    fullWidth
                    error={!!profileErrors.mobile}
                    helperText={
                      profileErrors.mobile ? profileErrors.mobile.message : ""
                    }
                  />
                )}
              />

              {/* Bio */}
              <Controller
                name="bio"
                control={controlProfile}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Bio"
                    variant="standard"
                    fullWidth
                    error={!!profileErrors.bio}
                    helperText={
                      profileErrors.bio ? profileErrors.bio.message : ""
                    }
                    multiline
                    rows={4}
                  />
                )}
              />
            </div>
            <div className="mt-[20px] flex justify-between gap-[10px]">
              <Button onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
              <LoadingButton type="submit" variant="contained">
                Save Changes
              </LoadingButton>
            </div>
          </form>
        </Box>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        open={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
      >
        <Box sx={{ ...style, width: 400 }}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Change Password
          </Typography>
          <form onSubmit={handleSubmitPassword(handleChangePasswordSubmit)}>
            <div className="mt-[20px] grid grid-cols-1 gap-[20px]">
              {/* New Password */}
              <Controller
                name="newPassword"
                control={controlPassword}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="New Password"
                    type="password"
                    variant="standard"
                    fullWidth
                    error={!!passwordErrors.newPassword}
                    helperText={
                      passwordErrors.newPassword
                        ? passwordErrors.newPassword.message
                        : ""
                    }
                  />
                )}
              />

              {/* Confirm Password */}
              <Controller
                name="confirmPassword"
                control={controlPassword}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Confirm Password"
                    type="password"
                    variant="standard"
                    fullWidth
                    error={!!passwordErrors.confirmPassword}
                    helperText={
                      passwordErrors.confirmPassword
                        ? passwordErrors.confirmPassword.message
                        : ""
                    }
                  />
                )}
              />
            </div>
            <div className="mt-[20px] flex justify-between gap-[10px]">
              <Button onClick={() => setIsChangePasswordModalOpen(false)}>
                Cancel
              </Button>
              <LoadingButton type="submit" variant="contained">
                Change Password
              </LoadingButton>
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default UserProfile;
