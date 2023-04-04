import { SEO, Title } from "@/components";
import Head from "next/head";
import React from "react";

const ShiShe = () => {
  return (
    <>
       <SEO title="HỌC VIỆN SHESHI" href="/logosheshe.png"></SEO>
      {/* <Head>
        <link rel="icon" href="/logosheshe.png" />
        <title>HỌC VIỆN SHESHI</title>
      </Head> */}
      <div className="bg-light-pink py-5">
        <Title className="text-3xl font-bold">
          học viện đào tạo thẩm mĩ sheshi
        </Title>
      </div>
    </>
  );
};

export default ShiShe;
