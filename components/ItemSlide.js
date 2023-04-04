/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { BsFillBagPlusFill } from "react-icons/bs";

const ItemSlide = ({image = '', name, price, link = '/'}) => {
  return (
    <div className="relative flex-col items-center justify-center w-[290px] mx-auto hover:text-regal-red gap-10 group">
      <div className="w-full">
        {/* <Image
          src={image}
          alt=""
          width="100"
          height="100"
          className="w-full"
        /> */}
        <Link href={link}><img src={image} alt=""/></Link>
      </div>
      <div className="py-5 opacity-0 w-[45px] h-[45px] border bg-regal-red rounded-full flex items-center justify-center absolute top-[65%] left-[50%] 
      -translate-x-[50%] group-hover:opacity-100 active:border-black active:bg-light-pink">
        <BsFillBagPlusFill className="w-5 h-5 text-white group-active:text-black"></BsFillBagPlusFill>
      </div>
      <div className="mt-20 flex-col items-center justify-center">
        <span className="block text-[20px] font-bold text-center text-span">
          <Link href={link}>{name}</Link>
        </span>
        <span className="block text-[20px] text-regal-red font-bold text-center">
          {price}
        </span>
      </div>
    </div>
  );
};

export default ItemSlide;
