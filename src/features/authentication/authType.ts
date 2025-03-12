export interface LoginCredentials {
  username: string;
  password: string;
}

export type LoginResponse = {
  data: LoginData;
  message: string;
  success: boolean;
  type: string;
};

export type OTPResponse = {
  emailId: string,
  otp: string, 
  password: string                                                                       
}
export type LoginData = {
  token: string;
  status: {
    m: string;
    e: string;
  };
};

export interface AuthState {
  user: LoginResponse | null;
  loading: boolean;
  token: string | null;
  changepasswordloading: boolean;
  updateEmailLoading: boolean;
  emailOtpLoading: boolean;
  qrStatus: any | null;
  qrCodeLoading: boolean;
}
