import { SEO, Title } from "@/components";
import { CONTENT_PAGE } from "@/constants";
import axios from "axios";
import Head from "next/head";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const GioiThieu = ({ product }) => {
  const [content, setContent] = useState();
  // console.log("content", content);
  useEffect(() => {
    setContent(product);
  }, [product]);
  // console.log(content)
  function addProductJsonLd() {
    return {
      __html: `{
      "@context": "http://localhost:3000",
      "@type": "giới thiệu về sheshi",
      "name": "Executive Anvil",
      "image": [
        ${content?.find(
          (item) => item?.pageCode === CONTENT_PAGE.INTRODUCE_PAGE
        ).image}
        ${content?.find(
          (item) => item?.pageCode === CONTENT_PAGE.INTRODUCE_PAGE
        ).image},
        ${content?.find(
          (item) => item?.pageCode === CONTENT_PAGE.INTRODUCE_PAGE
        ).image}
       ],
      "description": "Sleeker than ACME's Classic Anvil, the Executive Anvil is perfect for the business traveler looking for something to drop from a height.",
      "sku": "0446310786",
      "mpn": "925872",
      "brand": {
        "@type": "Brand",
        "name": "ACME"
      },
  `,
    };
  }
  return (
    <>
    <SEO title="GIỚI THIỆU SHESHI" href="/logosheshe.png"></SEO>
      {/* <Head>
        <link rel="icon" href="/logosheshe.png" />
        <title>GIỚI THIỆU SHESHI</title>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={addProductJsonLd()}
          key="product-jsonld"
        />
      </Head> */}
      <div className="bg-light-pink py-5">
        <Title className="text-3xl font-bold">giới thiệu</Title>
      </div>
      <div className="px-40 mt-10">
        <div className="flex justify-center gap-32">
          <div className="mt-8">
            <h3 className="uppercase text-3xl font-bold">
              giới thiệu về <span className="text-regal-red">sheshi</span>
            </h3>
            <span
              className="text-lg"
              dangerouslySetInnerHTML={{
                __html: content?.find(
                  (item) => item?.pageCode === CONTENT_PAGE.INTRODUCE_PAGE
                ).content,
              }}
            ></span>
          </div>
          <div>
            {content && (
              <Image
                src={
                  content?.find(
                    (item) => item?.pageCode === CONTENT_PAGE.INTRODUCE_PAGE
                  ).image
                }
                alt=""
                width={2500}
                height={400}
              ></Image>
            )}
          </div>
        </div>
        <div className="flex flex-row-reverse justify-center gap-32 mt-10">
          <div className="mt-8">
            <h3 className="uppercase text-3xl font-bold">
              giới thiệu về <span className="text-regal-red">sheshi</span>
            </h3>
            <span
              className="text-lg"
              dangerouslySetInnerHTML={{
                __html: content?.find(
                  (item) => item?.pageCode === CONTENT_PAGE.INTRODUCE_PAGE
                ).content,
              }}
            ></span>
          </div>
          <div>
            {content && (
              <Image
                src={
                  content?.find(
                    (item) => item?.pageCode === CONTENT_PAGE.INTRODUCE_PAGE
                  ).image
                }
                alt=""
                width={2500}
                height={400}
              ></Image>
            )}
          </div>
        </div>
        <div className="flex justify-center gap-32 mt-10 mb-16">
          <div className="mt-8">
            <h3 className="uppercase text-3xl font-bold">
              giới thiệu về <span className="text-regal-red">sheshi</span>
            </h3>
            <span
              className="text-lg"
              dangerouslySetInnerHTML={{
                __html: content?.find(
                  (item) => item?.pageCode === CONTENT_PAGE.INTRODUCE_PAGE
                ).content,
              }}
            ></span>
          </div>
          <div>
            {content && (
              <Image
                src={
                  content?.find(
                    (item) => item?.pageCode === CONTENT_PAGE.INTRODUCE_PAGE
                  ).image
                }
                alt=""
                width={2500}
                height={400}
              ></Image>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export async function getStaticProps() {
  const params = {
    pageCode: [
      CONTENT_PAGE.INTRODUCE_PAGE,
      CONTENT_PAGE.INTRODUCE_PAGE_CUSTOMER,
      CONTENT_PAGE.INTRODUCE_PAGE_STORY,
    ],
  };

  const data = await axios.get(
    "http://0.0.0.0:3001/api/config-page/content-page",
    { params }
  );
  const product = data.data;
  return {
    props: { product },
  };
}

export default GioiThieu;
