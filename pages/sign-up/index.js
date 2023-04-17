import { SEO } from "@/components";
import React from "react";

const Register = () => {
  return (
    <>
      <SEO title="Đăng kí"></SEO>
      <div className="my-20 flex items-center">
        <div className="mx-auto">
          <h3>Đăng kí</h3>
          <div>
            <form className="inline-block w-full bg-white">
             
              <div className="flex-col mt-4">
                <label className="text-base inline-block mb-3" htmlFor="">
                  Họ và tên 
                </label>
                <input
                  placeholder="Họ và tên"
                  type="text"
                  className="inline-block w-full p-2 pl-4 bg-[#fff] rounded-md outline-none border border-slate-400 hover:border-slate-600"
                />
              </div>
              <div className="flex-col mt-4">
                <label className="text-base inline-block mb-3" htmlFor="">
                  Email
                </label>
                <input
                  placeholder="Nhập email của bạn"
                  type="email"
                  className="inline-block w-full p-2 pl-4 bg-[#fff] rounded-md outline-none border border-slate-400 hover:border-slate-600"
                />
              </div>
              <div className="flex-col mt-4">
                <label className="text-base inline-block mb-3" htmlFor="">
                  Mật khẩu
                </label>
                <input
                  placeholder="Mật khẩu"
                  type="password"
                  className="inline-block w-full p-2 pl-4 bg-[#fff] rounded-md outline-none border border-slate-400 hover:border-slate-600"
                />
              </div>
              <div className="flex-col mt-4">
                <label className="text-base inline-block mb-3" htmlFor="">
                  Xác nhật mật khẩu
                </label>
                <input
                  placeholder="Xác nhật mật khẩu"
                  type="password"
                  className="inline-block w-full p-2 pl-4 bg-[#fff] rounded-md outline-none border border-slate-400 hover:border-slate-600"
                />
              </div>
              <div className="flex-col mt-4">
                <label className="text-base inline-block mb-3" htmlFor="">
                  ID giới thiệu
                </label>
                <input
                  placeholder="ID giới thiệu"
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
                Đăng kí
              </button>
              <div className="flex items-center justify-center mt-5">
                <span className="text-center text-xs">
                  Bạn đã có tài khoản SHESHI?{" "}
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
