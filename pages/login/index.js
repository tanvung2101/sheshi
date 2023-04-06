import { Input, SEO } from "@/components";
import React from "react";

const Login = () => {
  return (
    <>
    <SEO title="Đăng nhập"></SEO>
      <div className="my-20 flex items-center">
        <div className="mx-auto w-[19%]">
          <h3>Đăng nhập</h3>
          <form className="inline-block w-full bg-white">
            <div className="flex-col mb-4">
              <label className="text-base inline-block mb-3" htmlFor="">
                Email
              </label>
              <Input
                placeholder="Nhập email của bản"
                type="email"
                className="inline-block w-full p-2 pl-4 bg-[#fff] rounded-md outline-none border border-slate-400 hover:border-slate-600"
              />
            </div>
            <div className="flex-col">
              <label className="text-base inline-block mb-3" htmlFor="">
                Mật khẩu
              </label>
              <Input
                placeholder="Nhập mật khẩu của bạn"
                type="password"
                className="inline-block w-full p-2 pl-4 bg-[#fff] rounded-md outline-none border border-slate-400 hover:border-slate-600"
              />
            </div>
            <div className="mt-4 cursor-pointer">
              <span className="text-regal-red hover:text-yellow-400">
                Quên mật khẩu
              </span>
            </div>
            <button className="inline-block w-full mt-5 bg-regal-red py-2 rounded-md text-white text-lg cursor-pointer">
              Đăng nhập
            </button>
            <div className="flex items-center justify-center mt-5">
              <span className="text-center text-xs">
                Bạn đã có tài khoản SHESHI?{" "}
                <strong className="ml-1 text-[14px] text-regal-red hover:text-yellow-400">
                  Đăng kí
                </strong>
              </span>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
