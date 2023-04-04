import { SEO, Title } from "@/components";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";

const SamPham = () => {
  const router = useRouter();
  console.log(router);
  return (
    <>
      <SEO title="SẢN PHẨM SHESHI" href="/logosheshe.png"></SEO>
      {/* <Head>
        <link rel="icon" href="/logosheshe.png" />
        <title>SẢN PHẨM SHESHI</title>
      </Head> */}
      <div className="bg-light-pink py-5">
        <Title className="text-3xl font-bold">sản phẩm</Title>
      </div>
    </>
  );
};

export default SamPham;
