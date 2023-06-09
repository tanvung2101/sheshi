import axiosClient from "./axiosClient";

const AuthApis = {
  login: ({ email, password }) =>
    axiosClient.post("/api/user/auth/sign-in", {
      email,
      password,
    }),
  signUpUser: ({
    email,
    password,
    username,
    fullName,
    emailOtp,
    referralCode,
  }) =>
    axiosClient.post("/api/user/auth/register-user-email", {
      email,
      password,
      username,
      fullName,
      emailOtp,
      referralCode,
    }),
  sendOtp: (payload) => axiosClient.post("/api/otp/send", payload),
  restPassword: ({ email, otpCode, password, rePassword }) =>
    axiosClient.post("/api/user/auth/forgot-password/reset", {
      email,
      otpCode,
      password,
      rePassword,
    }),
  getProfile: () => axiosClient.get("/api/user/auth/information"),
  updateProfileUser: ({ id, ...payload }) =>
    axiosClient.put(`/api/user/user-info/${id}`, payload),
};

export default AuthApis;
