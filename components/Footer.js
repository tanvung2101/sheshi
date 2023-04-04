import Image from "next/image";
import React, { useEffect, useState } from "react";
import logosheshe from "../public/logosheshe.png";
import useSWR from "swr";
import { CONTACT_PAGE } from "@/constants";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const Footer = ({ users }) => {
  const [contact, setContact] = useState();
  const { data, error, isLoading } = useSWR(
    "http://localhost:3001/api/config-page/contact",
    fetcher
  );
  useEffect(() => {
    setContact(data?.find((ct) => ct.type === CONTACT_PAGE.ADDRESS_FOOTER));
  }, [data]);

  return (
    <>
      <div className="pt-10 pb-10 bg-regal-red z-0 text-white">
        <div className="flex items-start justify-around">
          <div className="flex items-center justify-between gap-20">
            <Image
              src={`${logosheshe.src}`}
              alt=""
              width={140}
              height={120}
            ></Image>
            <div>
              <strong className="uppercase text-white text-xl">công ty cổ phần tập đoàn shishe</strong>
              <p className="uppercase mb-5 font-medium">số gpkd: {contact?.businessLicense}</p>
              <p className="mb-5 font-medium">Địa chỉ: {contact?.address}</p>
              <p className="mb-5 font-medium">Điện thoại: {contact?.telephone}</p>
              <p>Email: {contact?.email}</p>
            </div>
          </div>
          <div className="flex-col items-center">
            <span className="mb-5 block uppercase font-bold text-[#fefcfc]">
              hướng dẫn mua hàng
            </span>
            <span className="mb-5 block uppercase font-bold text-[#fefcfc]">
              chính sách đổi trả
            </span>
            <span className="mb-5 block uppercase font-bold text-[#fefcfc]">
              chính sách giao hàng
            </span>
            <span className="block uppercase font-bold text-[#fefcfc]">
              chính sách bảo mật
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

// export async function getServerSideProps() {
//   const contact = await fetch("http://localhost:3001/api/config-page/contact")
//   console.log(contact.data)

//   console.log(contact);
//   return {
//     props: { contact }, // will be passed to the page component as props
//   };
// }

export default Footer;
