import Head from "next/head";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y, EffectCube } from "swiper";
import "swiper/swiper-bundle.min.css";
import "swiper/css";
import feed1 from "../public/feed1.jpg";
import Slider from "react-slick";
import { GrPrevious, GrNext } from "react-icons/gr";

import {
  Button,
  CartSlide,
  Footer,
  ItemSlide,
  Menu,
  SEO,
  Title,
} from "@/components";
import logosheshe from "../public/logosheshe.png";
import { useRouter } from "next/router";
import axios from "axios";
import configPageApis from "@/apis/configPageApis";
import { CONTENT_PAGE, GLOBAL_STATUS, SLIDE_PAGE } from "@/constants";
import { useEffect, useState } from "react";
import Link from "next/link";

const OUTSTANDING_PRODUCTS = 1;
const fetcher = (...args) => fetch(...args).then((res) => res.json());
export default function Home({ data }) {
  const { contents, slideImageHome, slideImageAdvert } = data;
  // console.log("slideImageAdvert", slideImageAdvert);
  const router = useRouter();
  const [product, setProduct] = useState();
  console.log('product', product)
  // console.log('product',product)
  const [productNew, setProductNew] = useState();
  const getOutstandingProducts = async () => {
    const params = {
      size: 5,
      outstanding: OUTSTANDING_PRODUCTS,
      getMainImage: true,
      status: GLOBAL_STATUS.ACTIVE,
    };
    // console.log(params)

    const result = await axios.get("http://localhost:3001/api/product", {
      params,
    });
    // console.log(result.data);
    setProduct(result.data.rows);
  };
  const getProductRelated = async () => {
    const params = {
      size: 5,
      getMainImage: true,
      status: GLOBAL_STATUS.ACTIVE,
    };

    // const return1 =
    const result = await axios.get("http://localhost:3001/api/product", {
      params,
    });
    setProductNew(result.data.rows);
  };

  useEffect(() => {
    getOutstandingProducts(), getProductRelated();
  }, []);
  function addProductJsonLd() {
    return {
      __html: `{
      "@context": "http://localhost:3000/",
      "@type": "Product",
      "name": "CÔNG TY CỔ PHẦN TẬP ĐOÀN SHESHI",
      "image": [${product?.map((item) =>
        item?.productCategory?.image
      )}],
      "description": "Sleeker than ACME's Classic Anvil, the Executive Anvil is perfect for the business traveler looking for something to drop from a height.",
      "sku": "0446310786",
      "mpn": "925872",
      "brand": {
        "@type": "Brand",
        "name": "ACME"
      },
      "review": {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "4",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Fred Benson"
        }
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.4",
        "reviewCount": "89"
      },
      "offers": {
        "@type": "Offer",
        "url": "https://example.com/anvil",
        "priceCurrency": "USD",
        "price": "119.99",
        "priceValidUntil": "2020-11-20",
        "itemCondition": "https://schema.org/UsedCondition",
        "availability": "https://schema.org/InStock"
      }
    }
  `,
    };
  }
  // console.log("product", product);

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
  const settingsSlideImage = {
    dots: false,
    infinite: false,
    className: 'slide-home',
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: <SlickArrowLeft className="slick-prev1" />,
    nextArrow: <SlickArrowRight />,
  };
  const settings_news = {
    infinite: true,
    speed: 500,
    className: "center",
    centerMode: true,
    centerPadding: "60px",
    slidesToShow: 3,
    slidesToScroll: 3,
    prevArrow: <SlickArrowLeft />,
    nextArrow: <SlickArrowRight />,
    responsive: [
      {
        breakpoint: 1198,
        settings: {
          infinite: true,
          slidesToShow: 3,
          slidesToScroll: 3,
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
      <Head>
        <meta charSet="UTF-8" />
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logosheshe.png" />
        <title>CÔNG TY CỔ PHẦN TẬP ĐOÀN SHESHI</title>
        {product?.map((item) => (
          <meta
            name="description"
            content={item?.description?.replace(/(<([^>]+)>)/gi, "")}
            key="desc"
          />
        ))}
        {product?.map((item) => (
          <meta
            key={item.id}
            property="og:image"
            content={item?.productCategory?.image}
          />
        ))}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={addProductJsonLd()}
          key="product-jsonld"
        />
      </Head>
      <div className="mx-auto">
        <Slider {...settingsSlideImage}>
          {slideImageHome.map((item) => {
            return (
              <div key={item.id} className="bg-light-pink">
                <div className="h-[800px]">
                  <Image
                    src={item?.urlPc || ""}
                    alt=""
                    width={500}
                    height={0}
                    className="w-full h-[100%] object-cover"
                  ></Image>
                </div>
              </div>
            );
          })}
        </Slider>
      </div>
      {/* SẢN PHẨM NỔI BẬT */}
      <div className="bg-light-pink pt-16 pb-16 ">
        <Title className="mb-5">sản phẩm nổi bật</Title>
        <div className="px-14 my-10">
          <Slider {...settings}>
            {product?.length > 0 &&
              product?.map((item) => {
                // console.log('item',item)
                return (
                  <div key={item?.id}>
                    <ItemSlide
                      propProduct={item}
                    ></ItemSlide>
                  </div>
                );
              })}
          </Slider>
        </div>
        <Button
          onClick={() => router.push("/san-pham")}
          className="bg-regal-red text-[#fef9f2] p-2 rounded-lg mx-auto block"
        >
          xem thêm
        </Button>
      </div>
      {/* HỌC VIỆN ĐÀO TẠO SHESHI */}
      <div className="mt-14 px-28 flex gap-10 h-[370px]">
        {contents.length > 0 &&
          contents.map((item) => {
            // console.log("item", item);
            return (
              <div key={item.id}>
                <h3 className="uppercase text-3xl text-regal-red font-bold mb-5">
                  học viện đào tạo sheshi
                </h3>
                <div
                  className="mb-5 text-lg font-sans font-normal"
                  dangerouslySetInnerHTML={{ __html: item?.content }}
                ></div>
                <Link
                  href="/hoc-vien-dao-tao-sheshi"
                  className="uppercase text-lg text-regal-red font-bold hover:text-yellow-200"
                >
                  Xem chi tiết
                </Link>
              </div>
            );
          })}
        <div>
          <iframe
            width="500"
            height="400"
            src="https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2Fsheshipharma%2Fvideos%2F709801732988589%2F&show_text=false&width=560&t=0"
            title="Học viện đào tạo Meta Group"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="h-[500px]"
          ></iframe>
        </div>
      </div>
      {/* SHESHI CHUYỂN GIAO CÔNG NGHỆ CỦA TẬP ĐOÀN MỸ PHẨM ML.S HÀN QUỐC */}
      <div className="pt-14 bg-light-pink h-[700px]">
        <Title className='mb-14 text-3xl'>{slideImageAdvert[0]?.title}</Title>
        <Slider {...settings_news}>
          {slideImageAdvert.map((item) => (
            <div key={item.id} className=''>
              <Image
                src={item?.image || ""}
                alt=""
                width={400}
                height={300}
                // className="w-[80%] h-[80%] object-cover"
              ></Image>
            </div>
          ))}
        </Slider>
      </div>
      {/* SẢN PHẨM MỚI */}
      <div className="mt-10">
        <div>
          <h2 className="uppercase text-regal-red font-bold text-2xl text-center mb-5">
            sản phẩm mới
          </h2>
          <div className="px-14 my-10">
            <div className="px-14 my-10">
              <Slider {...settings}>
                {productNew?.length > 0 &&
                  productNew?.map((item) => {
                    // console.log('item',item)
                    return (
                      <div key={item.id}>
                        <ItemSlide
                          propProduct={item}
                        ></ItemSlide>
                      </div>
                    );
                  })}
              </Slider>
            </div>
          </div>
          <Button
            onClick={() => router.push("/san-pham")}
            className="bg-regal-red text-light-pink p-2 rounded-lg mx-auto block"
          >
            xem thêm
          </Button>
        </div>
        <div className="mt-20">
          <h2 className="uppercase text-regal-red font-bold text-2xl text-center mb-5">
            cảm nhận khách hàng
          </h2>
          <p className="text-center w-[800px] mx-auto">
            Cảm nhận của khách hàng đã sử dụng sản phẩm và dịch vụ mỹ phẩm
            SHESHI. Bạn thì sao? Hãy cho chúng tôi biết cảm nhận của bạn về sản
            phẩm hoặc đến với chúng tôi để cảm nhận và trải nghiệm sản phẩm.
          </p>
        </div>

        <Swiper
          modules={[Navigation, Pagination, Scrollbar, A11y, EffectCube]}
          spaceBetween={50}
          slidesPerView={1}
          navigation
          onSlideChange={() => console.log("slide change")}
          onSwiper={(swiper) => swiper}
        >
          <SwiperSlide className="mt-14 flex items-center">
            <div className="flex items-center justify-between p-10">
              <CartSlide
                src={`${feed1.src}`}
                width={50}
                height={50}
                name="mrs.m lê thúy"
                comment="Cảm nhận của khách hàng đã sử dụng sản phẩm và dịch vụ mỹ phẩm
                  SHESHI. Bạn thì sao? Hãy cho chúng tôi biết cảm nhận của bạn
                  về sản phẩm hoặc đến với chúng tôi để cảm nhận và trải nghiệm
                  sản phẩm."
                face="facebook"
                className='hover:shadow-md'
              ></CartSlide>
              <CartSlide
                src={`${feed1.src}`}
                width={50}
                height={50}
                name="mrs.m lê thúy"
                comment="Cảm nhận của khách hàng đã sử dụng sản phẩm và dịch vụ mỹ phẩm
                  SHESHI. Bạn thì sao? Hãy cho chúng tôi biết cảm nhận của bạn
                  về sản phẩm hoặc đến với chúng tôi để cảm nhận và trải nghiệm
                  sản phẩm."
                face="facebook"
                className='hover:shadow-md'
              ></CartSlide>
              <CartSlide
                src={`${feed1?.src}`}
                width={50}
                height={50}
                name="mrs.m lê thúy"
                comment="Cảm nhận của khách hàng đã sử dụng sản phẩm và dịch vụ mỹ phẩm
                  SHESHI. Bạn thì sao? Hãy cho chúng tôi biết cảm nhận của bạn
                  về sản phẩm hoặc đến với chúng tôi để cảm nhận và trải nghiệm
                  sản phẩm."
                face="facebook"
                className='hover:shadow-md'
              ></CartSlide>
            </div>
          </SwiperSlide>
          <SwiperSlide className="mt-14 flex items-center">
            <div className="flex items-center justify-between p-10">
              <CartSlide
                src={`${feed1.src}`}
                width={50}
                height={50}
                name="mrs.m lê thúy"
                comment="Cảm nhận của khách hàng đã sử dụng sản phẩm và dịch vụ mỹ phẩm
                  SHESHI. Bạn thì sao? Hãy cho chúng tôi biết cảm nhận của bạn
                  về sản phẩm hoặc đến với chúng tôi để cảm nhận và trải nghiệm
                  sản phẩm."
                face="facebook"
                className='hover:shadow-md'
              ></CartSlide>
              <CartSlide
                src={`${feed1.src}`}
                width={50}
                height={50}
                name="mrs.m lê thúy"
                comment="Cảm nhận của khách hàng đã sử dụng sản phẩm và dịch vụ mỹ phẩm
                  SHESHI. Bạn thì sao? Hãy cho chúng tôi biết cảm nhận của bạn
                  về sản phẩm hoặc đến với chúng tôi để cảm nhận và trải nghiệm
                  sản phẩm."
                face="facebook"
                className='hover:shadow-md'
              ></CartSlide>
              <CartSlide
                src={`${feed1.src}`}
                width={50}
                height={50}
                name="mrs.m lê thúy"
                comment="Cảm nhận của khách hàng đã sử dụng sản phẩm và dịch vụ mỹ phẩm
                  SHESHI. Bạn thì sao? Hãy cho chúng tôi biết cảm nhận của bạn
                  về sản phẩm hoặc đến với chúng tôi để cảm nhận và trải nghiệm
                  sản phẩm."
                face="facebook"
                className='hover:shadow-md'
              ></CartSlide>
            </div>
          </SwiperSlide>
          <SwiperSlide className="mt-14 flex items-center">
            <div className="w-full flex items-center justify-between p-10">
              <CartSlide
                src={`${feed1.src}`}
                width={50}
                height={50}
                name="mrs.m lê thúy"
                comment="Cảm nhận của khách hàng đã sử dụng sản phẩm và dịch vụ mỹ phẩm
                  SHESHI. Bạn thì sao? Hãy cho chúng tôi biết cảm nhận của bạn
                  về sản phẩm hoặc đến với chúng tôi để cảm nhận và trải nghiệm
                  sản phẩm."
                face="facebook"
                className='hover:shadow-md'
              ></CartSlide>
              <CartSlide
                src={`${feed1.src}`}
                width={50}
                height={50}
                name="mrs.m lê thúy"
                comment="Cảm nhận của khách hàng đã sử dụng sản phẩm và dịch vụ mỹ phẩm
                  SHESHI. Bạn thì sao? Hãy cho chúng tôi biết cảm nhận của bạn
                  về sản phẩm hoặc đến với chúng tôi để cảm nhận và trải nghiệm
                  sản phẩm."
                face="facebook"
                className='hover:shadow-md'
              ></CartSlide>
              <CartSlide
                src={`${feed1.src}`}
                width={50}
                height={50}
                name="mrs.m lê thúy"
                comment="Cảm nhận của khách hàng đã sử dụng sản phẩm và dịch vụ mỹ phẩm
                  SHESHI. Bạn thì sao? Hãy cho chúng tôi biết cảm nhận của bạn
                  về sản phẩm hoặc đến với chúng tôi để cảm nhận và trải nghiệm
                  sản phẩm."
                face="facebook"
                className='hover:shadow-md'
              ></CartSlide>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </>
  );
}
// const OUTSTANDING_PRODUCTS = 1;
// export async function getStaticProps() {
//   const params = {
//     size: 5,
//     outstanding: OUTSTANDING_PRODUCTS,
//     getMainImage: true,
//     status: GLOBAL_STATUS.ACTIVE,
//   };

//   const data = await axios.get("http://0.0.0.0:3001/api/product", { params });
//   const product = data.data;
//   return {
//     props: { product },
//   };
// }

export async function getStaticProps() {
  const contents = await configPageApis.getListConfigPageContent({
    pageCode: [CONTENT_PAGE.SCHOOL_PAGE_OVERVIEW],
  });
  const images = await configPageApis.getListConfigPageSlide({
    pageCode: [
      SLIDE_PAGE.HOME_PAGE_ADVERTMENT,
      SLIDE_PAGE.HOME_PAGE_MAIN_PC,
      SLIDE_PAGE.HOME_PAGE_MAIN_SMARTPHONE,
    ],
  });
  // console.log(contents.data)
  const imagePc = images?.data?.filter(
    (image) => image.pageCode === SLIDE_PAGE.HOME_PAGE_MAIN_PC
  );
  const imageSmp = images?.data?.filter(
    (image) => image.pageCode === SLIDE_PAGE.HOME_PAGE_MAIN_SMARTPHONE
  );
  if (imageSmp.length !== imageSmp.length) return;
  const slideImageHome = imagePc.map((imgPc, i) => ({
    id: i,
    urlPc: imgPc.image,
    urlSmp: imageSmp[i].image,
  }));
  const slideImageAdvert = images?.data?.filter(
    (image) => image.pageCode === SLIDE_PAGE.HOME_PAGE_ADVERTMENT
  );
  const data = { contents: contents.data, slideImageHome, slideImageAdvert };
  return {
    props: { data },
    revalidate: 60,
  };
}
