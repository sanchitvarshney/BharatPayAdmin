export type AddUserPayload = {
  fName: string;
  lName: string;
  email: string;
  mobile: string;
  password: string;
  gender: "m" | "f" | "other";
  askPasswordChange: "yes" | "no";
  newsletterSubscription: "yes" | "no";
  userStatus: "active" | "inactive";
  userType: "admin" | "user" | "developer";
  authtype: "email" | "mobile" | "bothOK" | "none";
};
export type AdduserApiResponse = {
  message: string;
  success: boolean;
};
type UserType = {
  userID: string;
  type: string; // The "type" field can be restricted to known values
  gender: string;
  fullName: string;
  emailID: string;
  mobileNo: string;
};

export type UserApiResponse = {
  success: boolean;
  data: UserType[];
};

export type UserProfile = {
  status: string;
  userID: string;
  type: string;
  gender: string;
  fullName: string;
  emailID: string;
  mobileNo: string;
  secondaryEmail: string;
  secondaryMobile: string;
  twoFactoryAuth: string;
  registerDt: string;
  newsLetterSubscription: string; // Assuming this field is either 'YES' or 'NO'
};

export type UserProfileResponse = {
  success: boolean;
  data: UserProfile[];
};

export type ChangeUserPasswordPayload = {
  userID: string;
  new_password: string;
  ask_password_change: string;
};
export type ChangePasswordResponse = {
  success: boolean;
  message: string;
};

export type UpdateEmailPayload = {
  userID: string;
  email: string;
  ask_to_verify: string;
};

export type UpdateMobilePayload = {
  userID: string;
  mobile: string;
  ask_to_verify: string;
};
export type UpdateuserProfilePayload = {
  userID: string;
  first_name: string;
  last_name: string;
};


export type AdduserSatates = {
  addUserloading: boolean;
  userList: UserType[] | null;
  getUserListLoading: boolean;
  getUserProfileLoading: boolean;
  userProfile: UserProfile[] | null;
  cahngeUserPasswordLoading: boolean;
  updateUserEmailLoading: boolean;
  updateUserMobileLoading: boolean;
  suspendUserLoading: boolean;
  activateUserLoading: boolean;
  updateUserProfileLoading: boolean;

};
