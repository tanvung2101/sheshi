import { SEO, Title } from "@/components";
import Head from "next/head";
import React from "react";

const TinTuc = () => {
  return (
    <>
      <SEO title="TIN TỨC CÔNG TY CỔ PHẦN TẬP ĐOÀN SHESHI" href="/logosheshe.png"></SEO>
      {/* <Head>
        <link rel="icon" href="/logosheshe.png" />
        <title>TIN TỨC CÔNG TY CỔ PHẦN TẬP ĐOÀN SHESHI</title>
      </Head> */}
      <div className="bg-light-pink py-5">
        <Title className="text-3xl font-bold">tin tức</Title>
      </div>
    </>
  );
};

export default TinTuc;
