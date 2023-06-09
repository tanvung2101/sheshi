import { SEO } from "@/components";
import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { BiErrorCircle } from "react-icons/bi";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import AuthApis from "@/apis/authApis";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";


const schema = yup
  .object()
  .shape({
    referralCode: yup
      .string()
      .notRequired()
      .nullable()
      .matches(/(^\s*$|(^SS)[0-9]{6}$)/, "ID giới thiệu không đúng định dạng"),
    email: yup
      .string()
      .email("Email không hợp lệ")
      .required("Trường bắt buộc")
      .max(255)
      .matches(
        /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
        "Vui long nhap email hop le"
      )
      .trim(),
    fullName: yup
      .string()
      .required("Trường bắt buộc")
      .min(3, "Tối thiểu 3 kí tự")
      .max(50, "Tối đa 50 kí tự")
      .trim(),
    password: yup.string().required("Trường bắt buộc").min(6, 'Tối thiểu 6 kí tự').max(30, 'Tối đa 30 kí tự').trim(),
    confirmPass: yup
      .string()
      .when("password", {
        is: (val) => (val && val.length > 0 ? true : false),
        then: () =>
          yup
            .string()
            .oneOf([yup.ref("password")], "Mật khẩu không giống nhau"),
      })
      .required("Trường bắt buộc")
      .trim(),
  })
  .required();

const Register = () => {
  const router = useRouter();

  const [hiddentPass, setHiddentPass] = useState(true);
  const [hiddentConfirmPass, setHiddentConfirmPass] = useState(true);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const onSubmit = (data) => {
    console.log(isValid)
    const { fullName, email, password, referralCode, username } = data;
    console.log( data)
    AuthApis.signUpUser({email, password, fullName, referralCode})
      .then(() => { 
        toast.success('Đăng kí thành công')
        router.push('/login') 
      })
      .catch((err) => {
        toast.error(err.response.data.message)
        console.log(err)
      })
      // .finally(() => console.log("thành công"));
  };

  return (
    <>
      <SEO title="Đăng kí"></SEO>
      <div className="flex items-center my-20">
        <div className="mx-auto min-w-[30%]">
          <h3>Đăng kí</h3>
          <div>
            <form
              className="inline-block w-full bg-white"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="flex-col mt-4">
                <label
                  className="inline-block mb-3 text-sm font-normal text-black"
                  htmlFor=""
                >
                  Họ và tên
                </label>
                <div className="relative">
                  <input
                    {...register("fullName")}
                    placeholder="Họ và tên"
                    type="text"
                    className={` w-full py-2 pl-4 pr-10 bg-[#fff] rounded-md outline-none border text-sm ${
                      errors?.fullName?.message
                        ? "focus:ring-2 focus:ring-red-300 border border-red-500 "
                        : "border border-slate-300 hover:border hover:border-slate-500"
                    }`}
                  />
                  {errors?.fullName?.message && (
                    <span className="absolute top-0 right-0 -translate-x-1/2 translate-y-1/2">
                      <BiErrorCircle className="text-lg text-red-500" />
                    </span>
                  )}
                </div>
                <span className="font-sans text-sm font-normal text-red-500">
                  {errors?.fullName?.message}
                </span>
              </div>
              <div className="flex-col mt-4">
                <label
                  className="inline-block mb-3 text-sm font-normal text-black"
                  htmlFor=""
                >
                  Email
                </label>
                <div className="relative">
                  <input
                    {...register("email")}
                    placeholder="Nhập email của bạn"
                    type="text"
                    className={`inline-block w-full py-2 pl-4 pr-10 bg-[#fff] rounded-md outline-none border text-sm${
                      errors?.email?.message
                        ? "focus:ring-2 focus:ring-red-300 border border-red-500 "
                        : "border border-slate-300 hover:border hover:border-slate-500"
                    }`}
                  />
                  {errors?.email?.message && (
                    <span className="absolute top-0 right-0 -translate-x-1/2 translate-y-1/2">
                      <BiErrorCircle className="text-lg text-red-500" />
                    </span>
                  )}
                </div>
                <span className="font-sans text-sm font-normal text-red-500">
                  {errors?.email?.message}
                </span>
              </div>
              <div className="flex-col mt-4">
                <label
                  className="inline-block mb-3 text-sm font-normal text-black"
                  htmlFor=""
                >
                  Mật khẩu
                </label>
                <div className="relative">
                  <input
                    {...register("password")}
                    placeholder="Mật khẩu"
                    type={hiddentPass ? "password" : "text"}
                    className={`inline-block w-full py-2 pl-4 pr-10 bg-[#fff] rounded-md outline-none border text-sm ${
                      errors?.password?.message
                        ? "focus:ring-2 focus:ring-red-300 border border-red-500 "
                        : "border border-slate-300 hover:border hover:border-slate-500"
                    }`}
                  />
                  <span
                    className="absolute right-0 -translate-x-1/2 -translate-y-1/2 top-1/2"
                    onClick={() => setHiddentPass(!hiddentPass)}
                  >
                    {hiddentPass ? (
                      <AiOutlineEyeInvisible className="opacity-60"></AiOutlineEyeInvisible>
                    ) : (
                      <AiOutlineEye className="opacity-60"></AiOutlineEye>
                    )}
                  </span>
                </div>
                <span className="font-sans text-sm font-normal text-red-500">
                  {errors?.password?.message}
                </span>
              </div>
              <div className="flex-col mt-4">
                <label
                  className="inline-block mb-3 text-sm font-normal text-black"
                  htmlFor=""
                >
                  Xác nhật mật khẩu
                </label>
                <div className="relative">
                  <input
                    {...register("confirmPass")}
                    placeholder="Xác nhật mật khẩu"
                    type={hiddentConfirmPass ? "password" : "text"}
                    className={`inline-block w-full py-2 pl-4 pr-10 bg-[#fff] rounded-md outline-none border text-sm ${
                      errors?.confirmPass?.message
                        ? "focus:ring-2 focus:ring-red-300 border border-red-500 "
                        : "border border-slate-300 hover:border hover:border-slate-500"
                    }`}
                  />
                  <span
                    className="absolute right-0 -translate-x-1/2 -translate-y-1/2 top-1/2"
                    onClick={() => setHiddentConfirmPass(!hiddentConfirmPass)}
                  >
                    {hiddentConfirmPass ? (
                      <AiOutlineEyeInvisible className="opacity-60"></AiOutlineEyeInvisible>
                    ) : (
                      <AiOutlineEye className="opacity-60"></AiOutlineEye>
                    )}
                  </span>
                </div>
                <span className="font-sans text-sm font-normal text-red-500">
                  {errors?.confirmPass?.message}
                </span>
              </div>
              <div className="flex-col mt-4">
                <label
                  className="inline-block mb-3 text-sm font-normal text-black"
                  htmlFor="referralCode"
                >
                  ID giới thiệu
                </label>
                <div>
                  <input
                    {...register("referralCode")}
                    placeholder="ID giới thiệu"
                    type="referralCode"
                    className={`inline-block w-full py-2 pl-4 pr-10 bg-[#fff] rounded-md outline-none border text-sm ${
                      errors?.referralCode?.message
                        ? "focus:ring-2 focus:ring-red-300 border border-red-500 "
                        : "border border-slate-300 hover:border hover:border-slate-500"
                    }`}
                  />
                </div>
                <span className="font-sans text-sm font-normal text-red-500">
                  {errors?.referralCode?.message}
                </span>
              </div>
              <button className="inline-block w-full py-2 mt-10 text-lg text-white rounded-md cursor-pointer bg-regal-red">
                Đăng kí
              </button>
              <div className="flex items-center justify-center mt-5">
                <span className="text-xs text-center">
                  Bạn đã có tài khoản SHESHI?
                  <strong className="ml-1 text-[14px] text-regal-red hover:text-yellow-400 cursor-pointer">
                    Đăng kí
                  </strong>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
