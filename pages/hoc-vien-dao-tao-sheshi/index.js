import configPageApis from "@/apis/configPageApis";
import { SEO, Title } from "@/components";
import Head from "next/head";
import React from "react";
import { CONTENT_PAGE, SLIDE_PAGE } from "./../../constants/index";
import Image from "next/image";

const ShiShe = ({ data }) => {
  const { contents, images } = data;
  console.log(contents, images);
  return (
    <>
      <SEO title="HỌC VIỆN SHESHI" href="/logosheshe.png"></SEO>
      {/* <Head>
        <link rel="icon" href="/logosheshe.png" />
        <title>HỌC VIỆN SHESHI</title>
      </Head> */}
      <div className="bg-light-pink py-5">
        <Title className="text-4xl font-bold">
          học viện đào tạo thẩm mĩ sheshi
        </Title>
      </div>
      <section className="mt-14 mb-14">
        <div className="mx-32 flex items-center gap-20">
          <div className="w-full flex-col items-center px-10">
            <div className="mb-5">
              <span className="text-lg font-medium">Học viện Đào tạo</span>
              <h2 className="text-5xl font-bold mb-3">Đào tạo thẩm mĩ </h2>
              <strong className="uppercase text-5xl text-regal-red font-bold">
                sheshi
              </strong>
            </div>
            <div
              className="text-lg font-sans leading-8 mb-10"
              dangerouslySetInnerHTML={{
                __html: contents.find(
                  (content) =>
                    content.pageCode === CONTENT_PAGE.SCHOOL_PAGE_OVERVIEW
                ).content,
              }}
            ></div>
            <div className="h-[700px]">
              <Image
                src={contents.find(
                  (content) =>
                    content.pageCode === CONTENT_PAGE.SCHOOL_PAGE_OVERVIEW
                ).image || ''}
                alt=""
                width={100}
                height={500}
                className="w-full h-full object-cover"
              ></Image>
            </div>
          </div>
          <div className="w-full flex-col items-center px-10">
            <div className="h-[700px] mt-10">
              <Image
                src={contents.find(
                  (content) =>
                    content.pageCode === CONTENT_PAGE.SCHOOL_PAGE_PROCESS
                ).image || ''}
                alt=""
                width={100}
                height={500}
                className="w-full h-full object-cover"
              ></Image>
            </div>
             <div
              className="text-lg font-sans leading-8 mt-8"
              dangerouslySetInnerHTML={{
                __html: contents.find(
                  (content) =>
                    content.pageCode === CONTENT_PAGE.SCHOOL_PAGE_PROCESS
                ).content,
              }}
            ></div>
          </div>
          
          
        </div>
      </section>
    </>
  );
};

export async function getStaticProps() {
  const contents = await configPageApis.getListConfigPageContent({
    pageCode: [
      CONTENT_PAGE.SCHOOL_PAGE_OVERVIEW,
      CONTENT_PAGE.SCHOOL_PAGE_PROCESS,
    ],
  });
  const images = await configPageApis.getListConfigPageSlide({
    pageCode: [SLIDE_PAGE.SCHOOL_PAGE],
  });
  const data = { contents: contents.data, images: images.data };

  return {
    props: {
      data,
    },
  };
}

export default ShiShe;
