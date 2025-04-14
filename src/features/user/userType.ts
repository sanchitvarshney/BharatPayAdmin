export type AddUserPayload = {
  name: string;
  email: string;
  mobileNo: string;
  password: string;
  gender: "F" | "M";
  asktochange: "off" | "on";
  newsletterSubscription: "yes" | "no";
  // userStatus: "active" | "inactive";
  type: "developer" | "admin" | "user";
  verification: "E" | "M" | "1" | "0";
  role: string;
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

export type UserProfileData = {
  type: string;
  userID: string;
  user_name: string;
  fullName: string;
  email: string;
  mobile: string;
  status: string;
  gender: string;
  twoFactoryAuth: string;
  registerDt: string;
  newsLetterSubscription: string; // Assuming this field is either 'YES' or 'NO'
};

export type UserProfileResponse = {
  success: boolean;
  data: any;
};

export type ChangeUserPasswordPayload = {
  userId: string;
  password: string;
  ask_password_change: boolean;
};
export type ChangePasswordResponse = {
  success: boolean;
  message: string;
};

export type UpdateEmailPayload = {
  userId: string;
  emailId: string;
  isVarified: string;
};

export type Modify2FactorAuthPayload = {
  userId: string;
  status: string;
};

export type UpdateMobilePayload = {
  userId: string;
  mobileNo: string;
  isVarified: string;
};
export type UpdateuserProfilePayload = {
  userId: any;
  name: string;
  gender: string;
};

export type AdduserSatates = {
  addUserloading: boolean;
  userList: UserType[] | null;
  getUserListLoading: boolean;
  getUserProfileLoading: boolean;
  userProfile: any;
  cahngeUserPasswordLoading: boolean;
  updateUserEmailLoading: boolean;
  updateUserMobileLoading: boolean;
  suspendUserLoading: boolean;
  activateUserLoading: boolean;
  updateUserProfileLoading: boolean;
  rolelistData: any;
  loading: boolean;
  activityData:any,
  activityLoading: boolean
};
