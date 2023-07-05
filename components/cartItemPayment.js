import { removeItem, updateItem } from "@/redux/cartItemSlice";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const CartItemPayment = ({ item, value, index }) => {
  console.log(item.product.productInventory.slug)
  const [quantity, setQuantity] = useState(+item.quantity);
  const [totalItem, setTotalItem] = useState(item.totalQuantity)
  const dispath = useDispatch();
  const checkQuantity = (quantityInput, totalQuantity, item) => {
    if (+quantityInput > totalQuantity) {
      setQuantity(totalQuantity);
      dispath(updateItem({ ...item, quantity: totalQuantity }));
      return false;
    }
  };
  const updateQuantity = () => {
    setQuantity(quantity + 1)
    if (+quantity + 1 > totalItem) {
      setQuantity(totalItem);
      dispath(updateItem({ ...item, quantity: totalItem }));
      toast.error("Sản phẩm đã hết");
      return
    }
    dispath(updateItem({ ...item, quantity: quantity + 1 }));
  };
  const reduceQuantity = () => {
    if (+quantity - 1 === 0) {
      setQuantity(1);
      dispath(updateItem({ ...item, quantity: quantity }));
    } else {
      setQuantity(+quantity - 1)
      console.log("quantity", quantity);
      dispath(updateItem({ ...item, quantity: +quantity - 1 }));
    }
  };
  return (
    <div className="px-32 flex items-center justify-start gap-8 mt-4 max-lg:px-0">
      <div
        className={`flex items-center justify-start gap-5 relative max-h-[300px] pb-4 ${value === index + 1 ? "" : "border-b-2 border-gray-400"
          } max-lg:w-full `}
      >
        <div className="w-[180px] h-[150px]">
          <Image
            src={item?.product?.productImage[0]?.image}
            alt=""
            width="100"
            height="100"
            className="w-full h-full object-fill"
            sizes="(max-width: 768px) 50vw, 50vw"
          // fill={true}
          ></Image>
        </div>
        <div className="flex items-center justify-center gap-5 max-md:flex-col">
          <div className="w-40">
            <Link href={`/san-pham/${item.product.slug}`} prefetch={true} className="text-black text-2xl font-bold text-left mt-1/2 hover:text-[#ecbe26] cursor-pointer">
              {item?.product?.name + " - " + item?.capacity}
            </Link>
          </div>
          <p className="text-regal-red text-2xl font-bold text-center mt-1/2">
            {item?.price?.toLocaleString("vi", {
              style: "currency",
              currency: "VND",
            })}
          </p>
          <div className="flex-col mb-4">
            <div className="flex justify-between text-center text-2xl font-medium ">
              <div
                className="w-12 h-12 flex items-center justify-center bg-[#faf9f5] cursor-pointer"
                onClick={() => reduceQuantity()}
              >
                -
              </div>
              <input
                className="w-12 h-12 bg-[#faf9f5] text-center"
                readOnly
                value={quantity}
                onChange={(e) => {
                  if (!+e.target.value) return;
                  if (+e.target.value > item.totalQuantity)
                    return toast.error("sản phẩm hết hàng");
                }}
              />
              <div
                className="w-12 h-12 flex items-center justify-center bg-[#faf9f5] cursor-pointer"
                onClick={() => updateQuantity()}
              >
                +
              </div>
            </div>
          </div>
        </div>
        <div
          className="absolute top-0 right-0 cursor-pointer"
          onClick={() => dispath(removeItem(item))}
        >
          <AiFillCloseCircle className="ml-auto text-3xl transition-all hover:text-red-600"></AiFillCloseCircle>
        </div>
      </div>
    </div>
  );
};

export default CartItemPayment;
