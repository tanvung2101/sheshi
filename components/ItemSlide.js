/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { BsFillBagPlusFill } from "react-icons/bs";

const ItemSlide = ({ image = "", name, price, link = "/" }) => {
  return (
    <div className="relative flex-col items-center justify-center w-[290px] mx-auto hover:text-regal-red group">
      <div className="w-full mb-2">
        <Link href={link}>
          {image && <Image
            src={image}
            alt=""
            width="100"
            height={300}
            className="w-full h-[280px] object-cover hover:scale-95 transition duration-150 ease-in-out"
          />}
        </Link>
      </div>
      <div
        className="w-[45px] h-[45px] mx-auto border bg-regal-red rounded-full flex items-center justify-center opacity-0
        group-hover:opacity-100 active:border-black active:bg-light-pink"
      >
        <BsFillBagPlusFill className="w-5 h-5 text-white active:text-black"></BsFillBagPlusFill>
      </div>
      <div className="flex-col items-center justify-center mt-6">
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
