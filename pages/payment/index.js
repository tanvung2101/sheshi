import { SEO } from "@/components";
import CartTabs from "@/components/CartTabs";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";


const Payment = () => {
  const [methodPayment, setMethodPayment] = useState(0);
  const handlerMethodPayment = (e) => {
    console.log(e.target.value)
    setMethodPayment(e.target.value);
  };
  console.log('methodPayment',methodPayment)
  return (
    <>
      <SEO title="Thanh toán"></SEO>
      <CartTabs className="pt-12" tabs={3} />
      <div className="mb-16 px-20">
        <form>
          <div className="flex items-start justify-start gap-8">
            <div className="w-[70%]">
              <div className="flex flex-col">
                <div className="px-3 pt-1 pb-3 border border-gray-300 border-b-0 bg-gray-100 rounded-t-md">
                  <span className="text-[18px] font-medium">
                    Phương thức giao hàng
                  </span>
                </div>
                <label className="flex items-center justify-start gap-5 pl-4 pt-6 pb-3 border-b-0 border border-gray-300 cursor-pointer">
                  <div id="">
                    <input
                      className="radio checked:bg-blue-500 w-5 h-5"
                      checked
                      name="ship"
                      type="radio"
                      value="1"
                    />
                  </div>
                  <div>
                    <Image
                      src="https://play-lh.googleusercontent.com/Q874CkbeX3wp72FaPE-MxGhvkiPOVrpQwNSlYA4za6_WmftSHi4arWI--s5zHF7oejE"
                      alt=""
                      width="100"
                      height="100"
                      className="w-[75px] h-[75px]"
                    />
                  </div>
                  <div>
                    <strong className="text-[18px]">Giao hàng nhanh</strong>
                  </div>
                </label>
                <label className="flex items-center justify-start gap-5 pl-4 pt-6 pb-3 border border-gray-300 cursor-pointer">
                  <div id="">
                    <input
                      className="radio checked:bg-blue-500 w-5 h-5"
                      checked
                      name="ship"
                      type="radio"
                      value="1"
                    />
                  </div>
                  <div>
                    <Image
                      src="https://play-lh.googleusercontent.com/Q874CkbeX3wp72FaPE-MxGhvkiPOVrpQwNSlYA4za6_WmftSHi4arWI--s5zHF7oejE"
                      alt=""
                      width="100"
                      height="100"
                      className="w-[75px] h-[75px]"
                    />
                  </div>
                  <div>
                    <strong className="text-[18px]">Giao hàng tiết kiệm</strong>
                  </div>
                </label>
              </div>
              <div className="flex flex-col">
                <div className="px-3 pt-1 pb-3 border border-gray-300 border-b-0 bg-gray-100 rounded-t-md">
                  <span className="text-[18px] font-medium">
                    Phương thức giao hàng
                  </span>
                </div>
                <div className="border border-gray-300">
                  <label className="flex items-center justify-start gap-5 pl-4 pt-6 pb-3 cursor-pointer">
                    <input
                      className="radio checked:bg-blue-500 w-5 h-5"
                      checked={methodPayment == 0}
                      name="paymentMethod"
                      type="radio"
                      value="0"
                    />
                    <div>
                      <strong className="text-[18px]">
                        Nhận hàng trả tiền
                      </strong>
                    </div>
                  </label>
                  <div>
                    <label className="flex items-center justify-start gap-5 pl-4 pt-6 pb-3 cursor-pointer">
                      <div id="">
                        <input
                          className="radio checked:bg-blue-500 w-5 h-5"
                          name="paymentMethod"
                          checked={methodPayment == 1}
                          type="radio"
                          value="1"
                          onChange={handlerMethodPayment}
                        />
                      </div>
                      <div>
                        <strong className="text-[18px]">Chuyển khoản</strong>
                      </div>
                    </label>
                    {methodPayment == '1' && (
                      <>
                        <label className="flex items-start justify-start gap-5 pl-4 pt-6 pb-3 cursor-pointer">
                          <div className="self-center">
                            <input
                              className="radio checked:bg-blue-500 w-5 h-5"
                              checked
                              name="bank"
                              type="radio"
                              value="1"
                            />
                          </div>
                          <div>
                            <Image
                              src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png"
                              alt=""
                              width="100"
                              height="100"
                              className="w-[75px] h-[75px]"
                            />
                          </div>
                          <div className="flex flex-col">
                            <strong className="text-[18px]">MOMO</strong>
                            <span className="text-[18px] font-sans">
                              Tên: Sheshi Shop
                            </span>
                          </div>
                        </label>
                        <label className="flex items-start justify-start gap-5 pl-4 pt-6 pb-3 cursor-pointer">
                          <div className="self-center">
                            <input
                              className="radio checked:bg-blue-500 w-5 h-5"
                              checked
                              name="bank"
                              type="radio"
                              value="1"
                            />
                          </div>
                          <div>
                            <Image
                              src="https://news.khangz.com/wp-content/uploads/2021/07/VNPAY-la-gi-1.jpg"
                              alt=""
                              width="100"
                              height="100"
                              className="w-[75px] h-[75px] rounded-md object-cover"
                            />
                          </div>
                          <div className="flex flex-col">
                            <strong className="text-[18px]">VNPAY</strong>
                            <span className="text-[18px] font-sans">
                              Tên: Sheshi Shop
                            </span>
                          </div>
                        </label>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="w-[30%]">
              <div className="mt-0">
                <div className="px-4 py-6 flex flex-col gap-8 shadow-md max-h-[450px]">
                  <p className="text-xl font-sans font-normal">
                    Bạn đang 1 có sản phẩm trong giỏ hàng
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-sans font-normal">
                      Thành Tiền:
                    </span>
                    <span className="text-3xl text-regal-red font-sans font-bold">
                      {/* {totalPrice?.toLocaleString("vi", {
                          style: "currency",
                          currency: "VND",
                        })} */}
                      250.000 đ
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-sans font-normal">
                      Phí giao hàng:
                    </span>
                    <span className="text-3xl text-regal-red font-sans font-bold">
                      {/* {totalPrice?.toLocaleString("vi", {
                          style: "currency",
                          currency: "VND",
                        })} */}
                      250.000 đ
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-sans font-normal">
                      Tổng:
                    </span>
                    <span className="text-3xl text-regal-red font-sans font-bold">
                      {/* {totalPrice?.toLocaleString("vi", {
                          style: "currency",
                          currency: "VND",
                        })} */}
                      250.000 đ
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-5">
                    <button className="py-2 px-3 rounded-md bg-white text-regal-red border border-regal-red text-base font-light font-serif hover:bg-regal-red transition-all hover:text-white">
                      <Link href="/cart">Trở về nhập địa chỉ</Link>
                    </button>
                    <button
                      type="submit"
                      // disabled={isSubmitting}
                      className="py-2 px-3 rounded-md bg-regal-red text-white text-base font-light font-serif"
                    >
                      {/* <Link href="/payment-confirm"> */}
                      Tiến hàng thanh toán
                      {/* </Link> */}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Payment;
