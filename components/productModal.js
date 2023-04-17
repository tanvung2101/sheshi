import Image from "next/image";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Button from "./Button";
import { AiOutlineClose } from "react-icons/ai";
import Link from "next/link";

const Portal = ({ ClassName = "", active, onClick,image, name,price, qty, capacity }) => {
  //   const [active, setActive] = useState(false);
  //   useEffect(() => {
  //     document.getElementById('__next');
  //   }, []);
  const renderContent = (
    <div
      className={`${ClassName} ${
        active ? "hidden" : ""
      }w-full h-full fixed top-0 left-1/2 -translate-x-1/2 flex items-center justify-center overflow-hidden bg-black bg-opacity-30`}
    >
      <div
        className={`flex items-center justify-center gap-6 bg-white p-8 relative transition-all -translate-y-2/3 ${
          active ? "" : "translate-y-0 transition-all"
        }`}
      >
        <span
          onClick={onClick}
          className={`absolute top-0 right-0 text-4xl hover:text-red-500 cursor-pointer`}
        >
          <AiOutlineClose />
        </span>
        <div className="">
          <Image
            src={image}
            alt=""
            width={500}
            height={500}
          ></Image>
        </div>
        <div className="flex-col">
          <div>
            <h4>{name}</h4>
            <span className="block mt-4 text-3xl font-bold text-regal-red font-sans">
              {price}
            </span>
            <div className="flex-col mt-4">
              <span className="text-xl font-semibold font-sans inline-block">
                Số lượng
              </span>
              <div className="flex text-center text-2xl font-medium ">
                <div className="w-12 h-12 flex items-center justify-center bg-[#faf9f5] cursor-pointer">
                  -
                </div>
                <input
                  type="text"
                  className="w-12 h-12 bg-[#faf9f5] text-center"
                  value={qty || 0}
                  readOnly
                />
                <div className="w-12 h-12 flex items-center justify-center bg-[#faf9f5] cursor-pointer">
                  +
                </div>
              </div>
              <div className="uppercase mt-7 text-lg text-white ">
                <span className="bg-[#dc3545] p-3 rounded-lg">{capacity}</span>
              </div>
              <div className="flex items-start gap-5 mt-5 text-center">
                <Button className="py-3 px-6 uppercase border border-regal-red rounded-lg text-[#bc2029] font-bold hover:bg-regal-red hover:text-white transition-all">
                  Thêm vào giỏ
                </Button>
                <Button className="py-3 px-8 uppercase bg-regal-red rounded-lg text-white font-bold">
                  <Link href={'/cart'}>mua ngay</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  return createPortal(renderContent, document.getElementById("__next"));
};

export default Portal;
