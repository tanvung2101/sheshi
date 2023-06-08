import { Button, ItemSlide, SEO } from "@/components";
import { GLOBAL_STATUS } from "@/constants";
import axios from "axios";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState, useMemo  } from "react";
import { GrNext, GrPrevious } from "react-icons/gr";
import Slider from "react-slick";
import { useDispatch, useSelector } from "react-redux";
import { IMAGE_TYPE, MASTER_DATA_NAME } from "@/constants";
import { toast } from "react-toastify";
import { addItem } from "@/redux/cartItemSlice";
import { notFound } from 'next/navigation';

const introduce = [
  {
    id: 1,
    title: "Mô tả sản phẩm ",
  },
  {
    id: 2,
    title: "Thành phần",
  },
  {
    id: 3,
    title: "Công dụng",
  },
  {
    id: 4,
    title: "Hướng dẫn sử dụng",
  },
];

async function fetchMasterCapacity(params) {
  const res = await axios.get(`http://localhost:3001/api/master`, {
    params: {
      idMaster: params,
    },
  });
  return res.data.rows;
}

const Item = ({ productDetail }, params) => {
  // console.log(productDetail)
  const [productItem, itemSlug] = productDetail;
  const [productIt, setProductIt] = useState();
  console.log("itemSlug", productItem);
  const { value } = useSelector((state) => state.cartItem);
  const dispatch = useDispatch();
  const router = useRouter();
  const [product, setProduct] = useState();
  const [masterCapacity, setMasterCapacity] = useState();
  const [masterUnit, setMasterUnit] = useState();
  const [quantity, setQuantity] = useState(1);
  const [detailProductQuantity, setDetailProductQuantity] = useState();
  const [productDetailOption, setProductDetailOption] = useState();

  const [hidden, setHidden] = useState(1);
  useEffect(() => {
    setProductIt(itemSlug);
  }, [itemSlug]);
  const updateQuantity = (type) => {
    if (type === "plus") {
      if (+quantity === 999) return;
      setQuantity(+quantity + 1);
    } else {
      setQuantity(+quantity - 1 < 1 ? 1 : +quantity - 1);
    }
  };
  console.log(productIt);
  const fetchMasterData = async () => {
    const DataMasterCapacity = await fetchMasterCapacity(
      MASTER_DATA_NAME.CAPACITY_PRODUCT
    );
    const DataMasterUnit = await fetchMasterCapacity(
      MASTER_DATA_NAME.UNIT_PRODUCT
    );
    setMasterCapacity(DataMasterCapacity);
    setMasterUnit(DataMasterUnit);
  };
  console.log("masterCapacity", masterCapacity);
  console.log("masterUnit", masterUnit);
  useEffect(() => {
    fetchMasterData();
  }, []);
console.log('product', product)
  useEffect(() => {
    const productDetailOption = [];
    if (masterCapacity?.length > 0) {
      itemSlug?.productDetail?.map((e) => {
        const capacity = masterCapacity?.find((cap) => cap.id === e.capacityId);
        const unit = masterUnit?.find((un) => un.id === e.unitId);
        
        productDetailOption.push({
            capacityId: capacity?.id,
            unitId: unit?.id,
            price: e.price,
            quantity: productIt?.productInventory?.find(
              (q) => q.subProductId === e.id && q.productId === e.productId
            )?.quantity,
            value: capacity?.id + " " + unit?.id,
            name: capacity?.name + " " + unit?.name,
          });
        });
        
      setProduct({
        id: productIt?.id,
        name: productIt?.name,
      price: productIt?.price,
      content: productIt?.content,
      categorySlug: productIt?.productCategory?.categorySlug,
      slug: productIt?.productSlug,
      acronym: productIt?.acronym,
      expiry: productIt?.expiry,
      nameVi: productIt?.nameVi,
      description: productIt?.description,
      element: productIt?.element,
      uses: productIt?.uses,
      guide: productIt?.guide,
      productCategory: productIt?.productCategory,
      productImage:productIt?.productImage,
      productDetail:productIt?.productDetail,
      productInventory:productIt?.productInventory,
      })
    }
    setDetailProductQuantity(productDetailOption[0]?.quantity);
    setProductDetailOption(productDetailOption)
  }, [productIt, masterCapacity, masterUnit, itemSlug,]);
  const addCartItem = () => {
    let newItem = {
      slug: productIt.productSlug,
      product: product,
      capacityId: productDetailOption[0]?.capacityId,
      unitId: productDetailOption[0]?.unitId,
      price: productDetailOption[0]?.price,
      quantity: quantity,
      capacity: productDetailOption[0]?.name,
      totalQuantity: detailProductQuantity,
    };
    console.log("newItem", newItem);
    if (+quantity > detailProductQuantity) {
      setQuantity(detailProductQuantity);
      toast.error(
        `Sản phẩm hiện tại không đủ, chỉ còn ${detailProductQuantity} trong kho`
      );
    }
    const item = value.find(
      (e) =>
        e.slug === newItem?.slug &&
        e.capacityId === newItem?.capacityId &&
        e.unitId === newItem?.unitId
    );
    if (item) {
      if (item.quantity + quantity > detailProductQuantity) {
        toast.error(
          `Sản phẩm hiện tại không đủ, chỉ còn ${detailProductQuantity} trong kho`
        );
        return;
      }
    }
    dispatch(addItem(newItem));
    toast.success("Sản phẩm đẫ thêm vào vỏ hàng");
  };
  const goToCart = () => {
    let newItem = {
      slug: productIt.productSlug,
      product: product,
      capacityId: productDetailOption[0]?.capacityId,
      unitId: productDetailOption[0]?.unitId,
      price: productDetailOption[0]?.price,
      quantity: quantity,
      capacity: productDetailOption[0]?.name,
      totalQuantity: detailProductQuantity,
    };
    console.log("newItem", newItem);
    if (+quantity > detailProductQuantity) {
      setQuantity(detailProductQuantity);
      toast.error(
        `Sản phẩm hiện tại không đủ, chỉ còn ${detailProductQuantity} trong kho`
      );
    }
    const item = value.find(
      (e) =>
        e.slug === newItem?.slug &&
        e.capacityId === newItem?.capacityId &&
        e.unitId === newItem?.unitId
    );
    if (item) {
      if (item.quantity + quantity > detailProductQuantity) {
        toast.error(
          `Sản phẩm hiện tại không đủ, chỉ còn ${detailProductQuantity} trong kho`
        );
        return;
      }
    }
    dispatch(addItem(newItem));
    router.push('/cart')
    toast.success("Sản phẩm đẫ thêm vào vỏ hàng");
  };
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
      <div className="pb-8 bg-light-pink">
        <div className="flex gap-16 py-5 px-28 bg-light-pink">
          <div className="flex justify-center gap-5 mt-4">
            <div>
              {productIt?.productImage?.slice(0, 3).map((item) => {
                return (
                  <div
                    key={item.id}
                    className="w-[78px] h-[80px] bg-white py-3 mb-3"
                  >
                    {item?.image && (
                      <Image
                        src={item.image}
                        alt=""
                        width={100}
                        height={100}
                        className="w-full h-full"
                      />
                    )}
                  </div>
                );
              })}
            </div>
            <div>
              {productIt?.productImage[0]?.image && (
                <Image
                  src={`${productIt?.productImage[0]?.image}`}
                  alt=""
                  width={500}
                  height={500}
                  className='max-w-[500px] max-h-[600px]'
                />
              )}
            </div>
          </div>
          <div className="flex-col mt-4 text-black">
            <div>
              <h2 className="block mt-4 text-4xl font-bold">
                {productIt?.name}
              </h2>
              <span className="block mt-4 font-sans text-base">
                {productIt?.nameVi}
              </span>
              <span className="block mt-4 font-sans text-base">
                Mã: {productIt?.acronym}
              </span>
              <span className="block mt-4 font-sans text-3xl font-bold text-regal-red">
                {productIt?.price}
              </span>
              <span className="block mt-4 text-lg">
                Tình trạng:{" "}
                <label className="text-[#8fc83c] font-bold">Còn hàng</label>
              </span>
              <span className="block mt-4 mb-4 text-lg">
                Hạn sử dụng: {productIt?.expiry}
              </span>
            </div>
            <div className="flex-col">
              <span className="inline-block font-sans text-xl font-semibold">
                Số lượng
              </span>
              <div className="flex text-2xl font-medium text-center">
                <div
                  className="flex items-center justify-center w-12 h-12 bg-white cursor-pointer"
                  onClick={() => updateQuantity()}
                >
                  -
                </div>
                <input
                  type="text"
                  className="w-12 h-12 text-center bg-white"
                  value={quantity}
                  readOnly
                />
                <div
                  className="flex items-center justify-center w-12 h-12 bg-white cursor-pointer"
                  onClick={() => updateQuantity("plus")}
                >
                  +
                </div>
              </div>
            </div>
            <div className="text-lg text-white uppercase mt-7 ">
              <span className="bg-[#dc3545] p-3 rounded-lg">50 ml</span>
            </div>
            <div className="flex items-start gap-5 mt-5 text-center">
              <Button
                className="py-3 px-6 uppercase border border-regal-red rounded-lg text-[#bc2029] font-bold hover:bg-regal-red hover:text-white transition-all"
                onClick={() => addCartItem()}
              >
                Thêm vào giỏ
              </Button>
              <Button className="px-8 py-3 font-bold text-white uppercase rounded-lg bg-regal-red" onClick={() => goToCart()}>
                mua ngay
              </Button>
            </div>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-center py-2 mx-auto mt-5">
            {introduce.length > 0 &&
              introduce.map((item) => (
                <div
                  key={item.id}
                  className={`${
                    hidden === item.id
                      ? "text-regal-red border-b-[3px] border-regal-red"
                      : ""
                  } p-4  cursor-pointer hover:text-regal-red hover:border-b-[3px] hover:border-regal-red`}
                  onClick={() => setHidden(item.id)}
                >
                  <span className="font-sans text-2xl">{item.title}</span>
                </div>
              ))}
          </div>
          <div className="mt-4 px-28">
            {hidden === 1 && (
              <div
                className="flex-col mb-4 font-sans text-base leading-4 gap-y-4"
                dangerouslySetInnerHTML={{ __html: productIt?.description }}
              ></div>
            )}
            {hidden === 2 && (
              <div
                className="mb-4 font-sans text-base leading-4"
                dangerouslySetInnerHTML={{ __html: productIt?.element }}
              ></div>
            )}
            {/*  */}
            {hidden === 3 && (
              <div
                className="mb-4 font-sans text-base leading-4"
                dangerouslySetInnerHTML={{ __html: productIt?.guide }}
              ></div>
            )}
            {/*  */}
            {hidden === 4 && (
              <div
                className="mb-4 font-sans text-base leading-4"
                dangerouslySetInnerHTML={{ __html: productIt?.uses }}
              ></div>
            )}
          </div>
        </div>
      </div>
      <div>
        {/* slider bar */}
        <div className="my-10 px-14">
          <Slider {...settings}>
            {productItem?.length > 0 &&
              productItem?.map((item) => {
                return (
                  <div key={item.id}>
                    <ItemSlide propProduct={item}></ItemSlide>
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
  const params = {
    size: 16,
  };
  const data = await axios.get("http://0.0.0.0:3001/api/product", { params });
  const allEvents = data.data.rows;
  const allPaths = allEvents?.map((path) => {
    return {
      params: {
        slug: path.productSlug,
      },
    };
  });
  if(!allPaths){
    notFound();
  }
  return {
    paths: allPaths,
    fallback: false,
  };
}

export async function getStaticProps(context) {
  const slug = context?.params?.slug;
  const data = await axios.get(`http://0.0.0.0:3001/api/product?size=6&productSlug=${slug}`);
  const params = {
    size: 16,
    productSlug: slug,
  }
  const product1 = await axios.get(
    "http://0.0.0.0:3001/api/product/get-by-slug",
    { params }
  );
  if(!product1){
    return notFound();
  }
  const productDetail = [data.data.rows, product1.data];
  return {
    props: { productDetail },
    revalidate: 100,
  };
}

export default Item;
