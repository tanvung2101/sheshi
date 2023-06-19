import { Button, Input, SEO } from "@/components";
import React, { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { BiErrorCircle } from "react-icons/bi";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { LOGIN_TYPE } from "@/constants";
import AuthApis from "@/apis/authApis";
import axiosClient from "@/apis/axiosClient";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setProfileAuth, setToken } from "@/redux/accountSlice";
import { STORAGE_KEY } from "@/constants/storage-key";
import { checkConditionLevelUp } from "@/utils/funcs";
import dynamic from "next/dynamic";
import axios from "axios";
import Link from "next/link";

// const Login = dynamic(() => import("./../../components/Login"), {
//   ssr: false,
// });

const schema = yup
  .object({
    email: yup
      .string()
      .email("Email không hợp lệ")
      .required("Trường bắt buộc")
      .max(255)
      .matches(
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Email không đúng định dạng"
      ),
    password: yup
      .string()
      .required("Trường bắt buộc")
      .min(6, "Tối thiểu 6 kí tự")
      .max(30, "Tối đa 30 kí tự")
      .trim(),
    type: yup.number().required(),
  })
  .required("Trường bắt buộc");

const PageLogin = ({ login }) => {
  console.log(login);
  const router = useRouter();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.account);

  const [loading, setLoading] = useState(false);
  const [hiddentPass, setHiddentPass] = useState(false);
  const [data, setData] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      type: LOGIN_TYPE.USER,
    },
  });



  const onSubmit = (values) => {
    const { type, email, password } = values;
    // window.localStorage.getItem(STORAGE_KEY.TOKEN)
    setLoading(true);
    AuthApis.login({ type, email, password })
      .then(({ token }) => {
        axiosClient.defaults.headers.common = {
          Authorization: `Bearer ${token}`,
        };
        window.localStorage.setItem(STORAGE_KEY.TOKEN, token);
        dispatch(setToken(token));

        return AuthApis.getProfile();
      })
      .then((res) => {
        console.log('ress', res);
        checkConditionLevelUp(res)
        dispatch(setProfileAuth(res));
        router.push("/");
      })
      .catch((err) => {
        // toast.error(err?.response?.data?.message);
        toast.error('Mật khẩu hoặc email sai ');
      })
      .finally(() => {
        setLoading(false);
      });
  };
  if (token) return router.push("/");
  // }, [token])
  return (
    <>
      <SEO title="Đăng nhập"></SEO>

      <div className="flex items-center my-20">
        <div className="mx-auto min-w-[25%]">
          <h3>Đăng nhập</h3>
          <form
            className="inline-block w-full bg-white"
            onSubmit={handleSubmit(onSubmit)}
          >
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
                  className={`inline-block w-full py-2 pl-4 pr-10 bg-[#fff] rounded-md outline-none border text-sm ${errors?.email?.message
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
                  className={`inline-block w-full py-2 pl-4 pr-10 bg-[#fff] rounded-md outline-none border text-sm ${errors?.password?.message
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
            <div className="mt-4 cursor-pointer mb-10">
              <Link href='/forgot-password' className="text-sm text-regal-red hover:text-yellow-400">
                Quên mật khẩu
              </Link>
            </div>
            <Button className='w-full' loading={loading} disabled={loading}>Đăng nhập</Button>
            <div className="flex items-center justify-center mt-5">
              <span className="text-xs text-center">
                Bạn đã có tài khoản SHESHI?{" "}
                <Link href='/sign-up' className="ml-1 text-[14px] text-regal-red font-medium hover:text-yellow-400">
                  Đăng kí
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};


export default PageLogin;
