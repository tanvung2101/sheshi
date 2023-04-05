import { Button, ItemSlide, SEO } from "@/components";
import { GLOBAL_STATUS } from "@/constants";
import axios from "axios";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { GrNext, GrPrevious } from "react-icons/gr";
import Slider from "react-slick";

const introduce = [
  {
    id: 1,
    title: "Mô tả sản phẩm "
  },
  {
    id: 2,
    title: "Thành phần"
  },
  {
    id: 3,
    title: "Công dụng"
  },
  {
    id: 4,
    title: "Hướng dẫn sử dụng"
  },
]

const Item = ({ product }, params) => {
  const [productItem, itemSlug] = product;
  const [productIt, setProduct] = useState({});
  useEffect(() => {
    setProduct(itemSlug);
  }, [itemSlug]);
  const [hidden, setHidden] = useState(1);
  // --------------------------------------
  const SlickArrowLeft = ({ currentSlide, slideCount, ...props }) => (
    <div {...props}>
      <GrPrevious></GrPrevious>
    </div>
  );
  const SlickArrowRight = ({ currentSlide, slideCount, ...props }) => (
    <div {...props}>
      <GrNext></GrNext>
    </div>
  );
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    prevArrow: <SlickArrowLeft />,
    nextArrow: <SlickArrowRight />,
    responsive: [
      {
        breakpoint: 1198,
        settings: {
          infinite: true,
          slidesToShow: 2,
          slidesToScroll: 2,
          rows: 1,
          dots: false,
        },
      },
      {
        breakpoint: 576,
        settings: {
          infinite: true,
          slidesToShow: 1,
          slidesToScroll: 1,
          rows: 1,
          dots: false,
        },
      },
    ],
  };
  return (
    <>
      <SEO
        image={productIt?.productCategory?.image}
        title={productIt?.name}
        href={productIt?.productCategory?.image}
        content={productIt?.description?.replace(/(<([^>]+)>)/gi, "")}
      ></SEO>
      {/* <Head>
      <link rel="icon" href={productIt?.productCategory?.image} />
        <title>{productIt?.name}</title>
        <meta property="og:title" content={productIt?.name} />
        <meta
          name="description"
          content={productIt?.description?.replace(/(<([^>]+)>)/gi, "")}
        />
        <meta
          property="og:image"
          content={productIt?.productCategory?.image}
        />
      </Head> */}
      <div className="bg-light-pink pb-8">
        <div className="px-28 bg-light-pink flex gap-16 py-5">
          <div className="flex justify-center mt-4 gap-5">
            <div>
              {productIt?.productImage?.map((item) => {
                return (
                  <div
                    key={item.id}
                    className="w-[78px] h-[80px] bg-white py-3 mb-3"
                  >
                    {item?.image && (
                      <Image src={item.image} alt="" width={100} height={100} className="w-full h-full"/>
                    )}
                  </div>
                );
              })}
            </div>
            <div>
              {productIt?.productCategory?.image && (
                <Image
                  src={`${productIt?.productCategory?.image || ""}`}
                  alt=""
                  width={616}
                  height={415}
                />
              )}
            </div>
          </div>
          <div className="flex-col mt-4 text-black">
            <div>
              <h2 className="block mt-4 text-4xl font-bold">
                {productIt?.name}
              </h2>
              <span className="block mt-4 text-base font-sans">
                {productIt?.nameVi}
              </span>
              <span className="block mt-4 text-base font-sans">
                Mã: {productIt?.acronym}
              </span>
              <span className="block mt-4 text-3xl font-bold text-regal-red font-sans">
                {productIt?.price}
              </span>
              <span className="block mt-4 text-lg">
                Tình trạng:{" "}
                <label className="text-[#8fc83c] font-bold">Còn hàng</label>
              </span>
              <span className="block mt-4 text-lg mb-4">
                Hạn sử dụng: {productIt?.expiry}
              </span>
            </div>
            <div className="flex-col">
              <span className="text-xl font-semibold font-sans inline-block">
                Số lượng
              </span>
              <div className="flex text-center text-2xl font-medium">
                <div className="w-12 h-12 flex items-center justify-center bg-white cursor-pointer">
                  -
                </div>
                <input
                  type="text"
                  className="w-12 h-12 bg-white text-center"
                  defaultValue={1}
                  readOnly
                />
                <div className="w-12 h-12 flex items-center justify-center bg-white cursor-pointer">
                  +
                </div>
              </div>
            </div>
            <div className="uppercase mt-7 text-lg text-white ">
              <span className="bg-[#dc3545] p-3 rounded-lg">50 ml</span>
            </div>
            <div className="flex items-start gap-5 mt-5 text-center">
              <Button className="py-3 px-6 uppercase border border-regal-red rounded-lg text-[#bc2029] font-bold hover:bg-regal-red hover:text-white transition-all">
                Thêm vào giỏ
              </Button>
              <Button className="py-3 px-8 uppercase bg-regal-red rounded-lg text-white font-bold">
                mua ngay
              </Button>
            </div>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-center mx-auto mt-5 py-2">
            {introduce.length > 0 && introduce.map((item) => (
              <div
              key={item.id}
              className={`${
                hidden === item.id
                  ? "text-regal-red border-b-[3px] border-regal-red"
                  : ""
              } p-4  cursor-pointer hover:text-regal-red hover:border-b-[3px] hover:border-regal-red`}
              onClick={() => setHidden(item.id)}
            >
              <span className="text-2xl font-sans">{item.title}</span>
            </div>
            ))}
            {/* <div
              className={`${
                hidden === 1
                  ? "text-regal-red border-b-[3px] border-regal-red"
                  : ""
              } p-4  cursor-pointer`}
              onClick={() => setHidden(1)}
            >
              <span className="text-2xl font-sans">Mô tả sản phẩm</span>
            </div>
            <div
              className={`${
                hidden === 2
                  ? "text-regal-red border-b-[3px] border-regal-red"
                  : ""
              } p-4  cursor-pointer`}
              onClick={() => setHidden(2)}
            >
              <span className="text-2xl font-sans">Thành phần</span>
            </div>
            <div
              className={`${
                hidden === 3
                  ? "text-regal-red border-b-[3px] border-regal-red"
                  : ""
              } p-4  cursor-pointer`}
              onClick={() => setHidden(3)}
            >
              <span className="text-2xl font-sans">Công dụng</span>
            </div>
            <div
              className={`${
                hidden === 4
                  ? "text-regal-red border-b-[3px] border-regal-red"
                  : ""
              } p-4  cursor-pointer`}
              onClick={() => setHidden(4)}
            >
              <span className="text-2xl font-sans">Hướng dẫn sử dụng</span>
            </div> */}
          </div>
          <div className="px-28 mt-4">
            {hidden === 1 && (
              <div
                className="text-base leading-4 mb-4 font-sans flex-col gap-y-4"
                dangerouslySetInnerHTML={{ __html: productIt?.description }}
              ></div>
            )}

            {hidden === 2 && (
              <div
                className="text-base leading-4 mb-4 font-sans"
                dangerouslySetInnerHTML={{ __html: productIt?.element }}
              ></div>
            )}
            {/*  */}
            {hidden === 3 && (
              <div
                className="text-base leading-4 mb-4 font-sans"
                dangerouslySetInnerHTML={{ __html: productIt?.guide }}
              ></div>
            )}
            {/*  */}
            {hidden === 4 && (
              <div
                className="text-base leading-4 mb-4 font-sans"
                dangerouslySetInnerHTML={{ __html: productIt?.uses }}
              ></div>
            )}
          </div>
        </div>
      </div>
      <div>
        {/* slider bar */}
        <div className="px-14 my-10">
          <Slider {...settings}>
            {productItem?.length > 0 &&
              productItem?.map((item) => {
                return (
                  <div key={item.id}>
                    <ItemSlide
                      link={`/san-pham/${item.productSlug}`}
                      image={item?.productImage[0]?.image || ""}
                      name={item.name}
                      price={Number(item.productDetail[0]?.price)}
                    ></ItemSlide>
                  </div>
                );
              })}
          </Slider>
        </div>
      </div>
    </>
  );
};

export async function getStaticPaths() {
  // const params = {
  //   size: 8,
  //   status: GLOBAL_STATUS.ACTIVE,
  // };
  const data = await axios.get("http://0.0.0.0:3001/api/product/");
  const allEvents = data.data.rows;
  // console.log(allEvents.rows);
  const allPaths = allEvents?.map((path) => {
    return {
      params: {
        slug: path.productSlug,
        id: path.id,
      },
    };
  });
  return {
    paths: allPaths,
    fallback: false,
  };
}

export async function getStaticProps(context) {
  const params1 = {
    size: 8,
    status: GLOBAL_STATUS.ACTIVE,
  };
  const data = await axios.get("http://0.0.0.0:3001/api/product?size=8", {
    params1,
  });
  // ---------------------------------
  const slug = context?.params?.slug;
  const params = {
    productSlug: slug,
  };
  const product1 = await axios.get(
    "http://0.0.0.0:3001/api/product/get-by-slug",
    { params }
  );
  const product = [data.data.rows, product1.data];
  // console.log(product);
  return {
    // props: { data: product.data },
    props: { product },
  };
}

export async function generateMetadata({ params }) {
  const data = await axios.get("http://0.0.0.0:3001/api/product/");
  const allEvents = data.data.rows;
  // const allPaths = allEvents?.map((path) => {
  //   return {
  //     params: {
  //       title: path.name,
  //       description: path.id,
  //     },
  //   };
  // });

  return {
    title: allEvents.name,
    description: allEvents.id,
  };
}

export default Item;
