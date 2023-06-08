import { SEO } from "@/components";
import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { BiErrorCircle } from "react-icons/bi";

const Register = () => {
  const [hiddent, setHiddent] = useState(true);
  return (
    <>
      <SEO title="Đăng kí"></SEO>
      <div className="flex items-center my-20">
        <div className="mx-auto min-w-[35%]">
          <h3>Đăng kí</h3>
          <div>
            <form className="inline-block w-full bg-white">
             
              <div className="flex-col mt-4">
                <label className="inline-block mb-3 text-base" htmlFor="">
                  Họ và tên 
                </label>
                <div className="relative">
                  <input
                    placeholder="Họ và tên"
                    type="text"
                    className="inline-block w-full p-2 pl-4 bg-[#fff] rounded-md outline-none border border-slate-400 hover:border-slate-600"
                  />
                  <span className="absolute top-0 right-0 translate-x-1/2">
                        <BiErrorCircle className="text-lg text-red-500" />
                  </span>
                </div>
              </div>
              <div className="flex-col mt-4">
                <label className="inline-block mb-3 text-base" htmlFor="">
                  Email
                </label>
                <input
                  placeholder="Nhập email của bạn"
                  type="email"
                  className="inline-block w-full p-2 pl-4 bg-[#fff] rounded-md outline-none border border-slate-400 hover:border-slate-600"
                />
              </div>
              <div className="flex-col mt-4">
                <label className="inline-block mb-3 text-base" htmlFor="">
                  Mật khẩu
                </label>
                <div className="relative">
                  <input
                    placeholder="Mật khẩu"
                    type={hiddent ? 'password' : 'text'}
                    className="inline-block w-full p-2 pl-4 bg-[#fff] rounded-md outline-none border border-slate-400 hover:border-slate-600"
                  />
                  <span className="absolute right-0 -translate-x-1/2 -translate-y-1/2 top-1/2" onClick={() => setHiddent(!hiddent)}>
                    {hiddent ? <AiOutlineEyeInvisible className="opacity-60"></AiOutlineEyeInvisible>: <AiOutlineEye className="opacity-60"></AiOutlineEye>}
                  </span>
                </div>
              </div>
              <div className="flex-col mt-4">
                <label className="inline-block mb-3 text-base" htmlFor="">
                  Xác nhật mật khẩu
                </label>
                <div className="relative">
                  <input
                    placeholder="Xác nhật mật khẩu"
                    type={hiddent ? 'password' : 'text'}
                    className="inline-block w-full p-2 pl-4 bg-[#fff] rounded-md outline-none border border-slate-400 hover:border-slate-600"
                  />
                  <span className="absolute right-0 -translate-x-1/2 -translate-y-1/2 top-1/2" onClick={() => setHiddent(!hiddent)}>
                    {hiddent ? <AiOutlineEyeInvisible className="opacity-60"></AiOutlineEyeInvisible>: <AiOutlineEye className="opacity-60"></AiOutlineEye>}
                  </span>
                </div>
              </div>
              <div className="flex-col mt-4">
                <label className="inline-block mb-3 text-base" htmlFor="">
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
              <button className="inline-block w-full py-2 mt-5 text-lg text-white rounded-md cursor-pointer bg-regal-red">
                Đăng kí
              </button>
              <div className="flex items-center justify-center mt-5">
                <span className="text-xs text-center">
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
