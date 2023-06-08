import Image from "next/image";
import React, { useEffect, useState } from "react";
import logosheshe from "../public/logosheshe.png";
import useSWR from "swr";
import { CONTACT_PAGE } from "@/constants";
import Link from "next/link";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const Footer = () => {
  const [contact, setContact] = useState();
  const { data, error, isLoading } = useSWR(
    "http://localhost:3001/api/config-page/contact",
    fetcher
  );
  useEffect(() => {
    setContact(data?.find((ct) => ct.type === CONTACT_PAGE.ADDRESS_FOOTER));
  }, [data]);

  return (
    <div className="relative bottom-0 left-0 right-0">
      <div className="z-0 pt-10 pb-10 text-white bg-regal-red">
        <div className="flex items-start justify-around">
          <div className="flex items-center justify-between gap-20">
            <Link href="/">
              <Image
                src={`${logosheshe.src}`}
                alt=""
                width={140}
                height={120}
                className="cursor-pointer"
              ></Image>
            </Link>
            <div>
              <strong className="text-xl text-white uppercase">
                công ty cổ phần tập đoàn shishe
              </strong>
              <p className="mb-5 font-medium uppercase">
                số gpkd: {contact?.businessLicense}
              </p>
              <p className="mb-5 font-medium">Địa chỉ: {contact?.address}</p>
              <p className="mb-5 font-medium">
                Điện thoại: {contact?.telephone}
              </p>
              <p>Email: {contact?.email}</p>
            </div>
          </div>
          <div className="flex-col items-center">
            <span className="mb-5 block uppercase font-bold text-[#fefcfc] hover:text-yellow-300">
              <Link href="/huong-dan-mua-hang">hướng dẫn mua hàng</Link>
            </span>
            <span className="mb-5 block uppercase font-bold text-[#fefcfc] hover:text-yellow-300">
              <Link href="/chinh-sach-doi-tra">chính sách đổi trả</Link>
            </span>
            <span className="mb-5 block uppercase font-bold text-[#fefcfc] hover:text-yellow-300">
              <Link href="/chinh-sach-giao-hang">chính sách giao hàng</Link>
            </span>
            <span className="block uppercase font-bold text-[#fefcfc] hover:text-yellow-300">
              <Link href="/chinh-sach-bao-mat">chính sách bảo mật</Link>
            </span>
          </div>
        </div>
      </div>
    </div>
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
