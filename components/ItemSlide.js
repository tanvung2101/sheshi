/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { BsFillBagPlusFill } from "react-icons/bs";
import Portal from "./productModal";
import Button from "./Button";
import { AiOutlineClose } from "react-icons/ai";
import { IMAGE_TYPE, MASTER_DATA_NAME } from "@/constants";
import axios from "axios";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { addItem, removeItem, updateItem } from "@/redux/cartItemSlice";
import { useRouter } from "next/router";

async function fetchMasterCapacity(params) {
  const res = await axios.get(`http://localhost:3001/api/master`, {
    params: {
      idMaster: params,
    },
  });
  return res.data.rows;
}

const ItemSlide = ({ propProduct }) => {
  const dispatch = useDispatch();
  const value = useSelector((state) => state.cartItem.value);
  // useEffect(() => {
  //   if(value.length === 0){
  //     JSON.parse(localStorage.getItem('cartItems'))
  //   }else{
  //     const data = localStorage.setItem('cartItems', JSON.stringify(value))
  //   }
  // }, [value])
  // console.log(value);
  const router = useRouter();
  // console.log(value)
  const [active, setActive] = useState(false);
  const [product, setProduct] = useState();
  const [masterCapacity, setMasterCapacity] = useState();
  const [masterUnit, setMasterUnit] = useState();
  const [price, setPrice] = useState();
  const [capacity, setCapcity] = useState();
  const [quantity, setQuantity] = useState(1);
  const [detailProduct, setDetailProduct] = useState();
  const [detailProductQuantity, setDetailProductQuantity] = useState();
  

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
  useEffect(() => {
    fetchMasterData();
  }, []);
  useEffect(() => {
    const productDetailOption = [];

    if (masterCapacity?.length > 0) {
      propProduct?.productDetail?.map((e) => {
        // console.log("e", e);
        const capacity = masterCapacity?.find((cap) => cap.id === e.capacityId);
        // console.log(capacity);
        const unit = masterUnit?.find((cap) => cap.id === e.unitId);
        productDetailOption.push({
          capacityId: capacity?.id,
          unitId: unit?.id,
          price: e.price,
          quantity: propProduct?.productInventory?.find(
            (q) => q.subProductId === e.id && q.productId === e.productId
          )?.quantity,
          value: capacity?.id + "-" + unit?.id,
          name: capacity?.name + " " + unit?.name,
        });
      });
    }

    setProduct({
      name: propProduct?.name,
      price: propProduct?.price,
      content: propProduct?.content,
      imageMain: propProduct?.productImage?.find(
        (e) => e.isMain === IMAGE_TYPE.MAIN
      ).image,
      imageSub: propProduct?.productImage?.filter(
        (e) => e.isMain === IMAGE_TYPE.SUB
      ).image,
      categorySlug: propProduct?.productCategory?.categorySlug,
      slug: propProduct?.productSlug,
      acronym: propProduct?.acronym,
      expiry: propProduct?.expiry,
      nameVi: propProduct?.nameVi,
      description: propProduct?.description,
      element: propProduct?.element,
      uses: propProduct?.uses,
      guide: propProduct?.guide,
      productDetailOption,
    });
    setPrice(productDetailOption[0]?.price);
    setCapcity(
      productDetailOption[0]?.capacityId + "-" + productDetailOption[0]?.unitId
    );
    setDetailProduct(productDetailOption[0]?.quantity);
    setDetailProductQuantity(productDetailOption[0]?.quantity);
  }, [
    masterCapacity,
    masterUnit,
    propProduct?.acronym,
    propProduct?.content,
    propProduct?.description,
    propProduct?.element,
    propProduct?.expiry,
    propProduct?.guide,
    propProduct?.name,
    propProduct?.nameVi,
    propProduct?.price,
    propProduct?.productCategory?.categorySlug,
    propProduct?.productDetail,
    propProduct?.productImage,
    propProduct?.productInventory,
    propProduct?.productSlug,
    propProduct?.uses,
  ]);

  const updateQuantity = (type) => {
    if (type === "plus") {
      if (+quantity === 999) return;
      setQuantity(+quantity + 1);
    } else {
      setQuantity(+quantity - 1 < 1 ? 1 : +quantity - 1);
    }
  };
  const addCartItem = () => {
    let newItem = {
      name: product.name,
      slug: product.slug,
      capacityId: product.productDetailOption[0]?.capacityId,
      unitId: product.productDetailOption[0]?.unitId,
      price: product.productDetailOption[0]?.price,
      quantity: quantity,
      capacity: product.productDetailOption[0]?.name,
      totalQuantity: detailProductQuantity,
      imageMain: product.imageMain,
      imageSub: product.imageSub,
    };
    if (+quantity > detailProductQuantity) {
      setQuantity(detailProductQuantity);
      toast.error(
        `Sản phẩm hiện tại không đủ, chỉ còn ${detailProductQuantity} trong kho`
      );
    }
    const item = value.find(
      (e) =>
        e.slug === newItem.slug &&
        e.capacityId === newItem.capacityId &&
        e.unitId === newItem.unitId
    );
    if (item) {
      if (item.quantity + quantity > detailProductQuantity) {
        toast.error(
          `Sản phẩm hiện tại không đủ, chỉ còn ${detailProductQuantity} trong kho`
        );
        return
      }
    }
    dispatch(addItem(localStorage.setItem('cartItems', JSON.stringify(value))));
    toast.success("Sản phẩm đã thêm vào vỏ hàng");
  };
  const goToCart = () => {
    let newItem = {
      name: product.name,
      slug: product.slug,
      capacityId: product.productDetailOption[0]?.capacityId,
      unitId: product.productDetailOption[0]?.unitId,
      price: product.productDetailOption[0]?.price,
      quantity: quantity,
      capacity: product.productDetailOption[0]?.name,
      totalQuantity: detailProductQuantity,
      imageMain: product.imageMain,
      imageSub: product.imageSub,
    };
    if (+quantity > detailProductQuantity) {
      setQuantity(detailProductQuantity);
      toast.error(
        `Sản phẩm hiện tại không đủ, chỉ còn ${detailProductQuantity} trong kho`
      );
      return
    }
    const item = value.find(
      (e) =>
        e.slug === newItem.slug &&
        e.capacityId === newItem.capacityId &&
        e.unitId === newItem.unitId
    );
    if (item) {
      if (+item.quantity + +quantity > detailProductQuantity) {
        toast.error(
          `Sản phẩm hiện tại không đủ, chỉ còn ${detailProductQuantity} trong kho`
        );
        return
      }
    }
    dispatch(addItem(newItem))
    router.push('/cart')
    toast.success("Sản phẩm đã thêm vào vỏ hàng");
    
  };
  const renderContent = (
    <div
      className={`${
        active ? "" : "hidden"
      } w-full h-full fixed top-0 left-1/2 -translate-x-1/2 flex items-center justify-center overflow-hidden bg-black bg-opacity-30`}
    >
      <div
        className={`w-[1000px] box-border flex items-center justify-center gap-6 bg-white p-8 relative transition-all ${
          active ? "" : "translate-y-0 transition-all"
        }`}
      >
        <span
          className={`absolute top-2 right-2 text-4xl hover:text-red-500 cursor-pointer`}
          onClick={() => setActive(false)}
        >
          <AiOutlineClose className="text-slate-500" />
        </span>
        <div className="w-1/2">
          <div className="box-border">
            <Image
              src={product?.imageMain}
              alt=""
              width={400}
              height={450}
              className="w-full max-h-[350px] object-cover"
            ></Image>
          </div>
        </div>
        <div className="flex-col w-1/2">
          <div>
            <h4>{product?.name}</h4>
            <span className="block mt-4 text-3xl font-bold text-regal-red font-sans">
              {price?.toLocaleString("vi", {
                style: "currency",
                currency: "VND",
              })}
            </span>
            <div className="flex-col mt-4">
              <span className="text-xl font-semibold font-sans inline-block">
                Số lượng
              </span>
              <div className="flex text-center text-2xl font-medium ">
                <div
                  className="w-12 h-12 flex items-center justify-center bg-[#faf9f5] cursor-pointer"
                  onClick={() => updateQuantity()}
                >
                  -
                </div>
                <input
                  className="w-12 h-12 bg-[#faf9f5] text-center"
                  value={quantity}
                  onChange={(e) => {
                    if (!+e.target.value) return 1;
                    setQuantity(+e.target.value);
                  }}
                />
                <div
                  className="w-12 h-12 flex items-center justify-center bg-[#faf9f5] cursor-pointer"
                  onClick={() => updateQuantity("plus")}
                >
                  +
                </div>
              </div>
              <div className="uppercase mt-7 text-lg text-white ">
                <span className="bg-[#dc3545] p-3 rounded-lg">
                  {product?.productDetailOption[0]?.name}
                </span>
              </div>
              <div className="flex items-start gap-5 mt-5 text-center">
                <Button
                  onClick={() => addCartItem()}
                  className="py-3 px-6 uppercase border border-regal-red rounded-lg text-[#bc2029] font-bold hover:bg-regal-red hover:text-white transition-all"
                >
                  Thêm vào giỏ
                </Button>
                <Button
                  type="submit"
                  onClick={() => goToCart()}
                  className="py-3 px-8 uppercase bg-regal-red rounded-lg text-white font-bold"
                >
                  {/* <Link href={"/cart"}>mua ngay</Link> */} Mua ngay
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  return (
    <>
      <div className="relative flex-col items-center justify-center p-5 mx-auto hover:text-regal-red group">
        <div className="w-full mb-2">
          <Link href={`/san-pham/${product?.slug}`}>
            {product?.imageMain && (
              <Image
                src={product?.imageMain}
                alt=""
                width={100}
                height={100}
                className="w-full h-[300px] object-cover hover:scale-95 transition duration-150 ease-in-out"
              />
            )}
          </Link>
        </div>
        <div
          onClick={() => setActive(true)}
          className="w-[45px] h-[45px] mx-auto border bg-regal-red rounded-full flex items-center justify-center opacity-0
        group-hover:opacity-100 active:border-black active:bg-light-pink cursor-pointer"
        >
          <BsFillBagPlusFill className="w-5 h-5 text-white active:text-black"></BsFillBagPlusFill>
        </div>
        <div className="flex-col items-center justify-center mt-6">
          <span className="block text-[20px] font-bold text-center text-span">
            <Link href={`/san-pham/${product?.slug}`}>{product?.name}</Link>
          </span>
          <span className="block text-[20px] text-regal-red font-bold text-center">
            {price &&
              price.toLocaleString("vi", {
                style: "currency",
                currency: "VND",
              })}
          </span>
        </div>
        {active &&
          createPortal(renderContent, document.getElementById("__next"))}
      </div>
    </>
  );
};

export default ItemSlide;
