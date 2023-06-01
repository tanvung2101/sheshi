import { SEO } from "@/components";
import CartEmpty from "@/components/CartEmpty";
import CartTabs from "@/components/CartTabs";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import shipApis from "@/apis/shipApi";
import { TOKEN_API } from "@/constants";
import axios from "axios";
import data from '../../components/locations/cities.json'

const schema = yup
  .object({
    notes: yup.string().max(255).trim().nullable(),
    deliveryMethod: yup.mixed().required(),
  })
  .required();

const Payment = () => {
  const { value } = useSelector((state) => state.cartItem);
  const { information } = useSelector((state) => state.cartItem);
  console.log(information);

  const [totalPrice, setTotalPrice] = useState(0);

  const [unitGhn, setUnitGhn] = useState();
  const [unitGhtk, setUnitGhtk] = useState();
  const [fee, setFee] = useState(0);

  const [selectMethodPayment, setSelectMethodPayment] = useState(0);
  const [selectBank, setSelectBank] = useState();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const onSubmit = (data) => {
    const {notes, deliveryMethod, paymentMethod} = data;
    let typePayment = paymentMethod === '0' ? '0' : `${selectBank}`;
    console.log(typePayment)
  };
  // console.log("selectMethodPayment", selectMethodPayment);

  useEffect(() => {
    setTotalPrice(
      value?.reduce((total, currentValue) => {
        return total + Number(currentValue.price * currentValue.quantity);
      }, 0)
    );
  }, [totalPrice, value]);
  const handlerMethodPayment = (e) => {
    setSelectMethodPayment(e.target.value);
  };

  const handlerDeliveryMethod = (e) => {
    // console.log(e.target.value);
    setValue("deliveryMethod", e.target.value);
    switch (e.target.value) {
      case "1":
        setFee(0);
        break;
      case "2":
        setFee(unitGhtk?.fee?.fee ? unitGhtk?.fee?.fee : 0);
        break;
    }
  };
  const handlerSelectBank = (e) =>{
    setSelectBank(e.target.value)
  }

  // tính phí giao tiết kiệm
  const getFreeGhtk = async () => {
    const ghtk = await shipApis.calculatorFeeGhtk({
      pick_province: "Hà Nội",
      pick_district: "Hai Bà Trưng",
      province: information.cityCode,
      district: information.districtCode,
      address: "P.503 tòa nhà Auu Việt, số 1 Lê Đức Thọ",
      value: totalPrice,
      token: TOKEN_API.GIAO_HANG_TIET_KIEM,
    });
    setUnitGhtk(ghtk.data);
  };

  // tính phí giao hàng nhanh
  const getFreeGhn = async () => {
    const fetchCity = await shipApis.getCity();
    setValue("deliveryMethod", "1");
    const provideId = fetchCity?.data?.data?.find(
      (city) => city.ProvinceName === "Gia Lai"
    )?.ProvinceID;

    const fetchDistrict = await shipApis.getDistrict({
      provide_id: provideId,
    });

    // console.log("fetchDistrict", fetchDistrict);
    const districtId = fetchDistrict?.data?.data?.find(
      (district) =>
        !!district.NameExtension?.find(
          (e) => e.toLowerCase() === information.districtCode.toLowerCase()
        )?.DistrictId
    );
    const serviceAvailable = await shipApis.getService({
      from_district: 1488,
      to_district: districtId,
      shop_id: 1,
    });

    const calculatorFee = await shipApis.calculatorFeeGhn({
      from_district_id: 1488,
      service_id: serviceAvailable.data.data.server_id,
      to_district_id: districtId,
      insurance_value: totalPrice,
      weight: 200,
    });
    // console.log('calculatorFee', calculatorFee)
    // console.log('districtId', districtId);
  };
  useEffect(() => {
    if (totalPrice > 0) {
      getFreeGhn();
      getFreeGhtk();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // console.log(fee)
  return (
    <>
      <SEO title="Thanh toán"></SEO>
      {value?.length === 0 && <CartEmpty></CartEmpty>}
      <CartTabs className="pt-12" tabs={3} />
      <div className="mb-16 px-20">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex items-start justify-start gap-8">
            <div className="w-[70%]">
              <div
                className="flex flex-col"
                {...register("deliveryMethod")}
                onChange={handlerDeliveryMethod}
              >
                <div className="px-3 pt-1 pb-3 border border-gray-300 border-b-0 bg-gray-100 rounded-t-md">
                  <span className="text-[18px] font-medium">
                    Phương thức giao hàng
                  </span>
                </div>
                <label className="flex items-center justify-start gap-5 pl-4 pt-6 pb-3 border-b-0 border border-gray-300 cursor-pointer">
                  <div id="">
                    <input
                      className="radio checked:bg-blue-500 w-5 h-5"
                      name="ship"
                      type="radio"
                      value={1}
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
                      name="ship"
                      type="radio"
                      value={2}
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
                    <div>
                      <input
                        {...register("paymentMethod")}
                        className="radio checked:bg-blue-500 w-5 h-5"
                        name="paymentMethod"
                        value={0}
                        type="radio"
                        checked={selectMethodPayment == 0}
                        onChange={handlerMethodPayment}
                      />
                    </div>
                    <div>
                      <strong className="text-[18px]">
                        Nhận hàng trả tiền
                      </strong>
                    </div>
                  </label>
                  <div>
                    <label className="flex items-center justify-start gap-5 pl-4 pt-6 pb-3 cursor-pointer">
                      <div>
                        <input
                          {...register("paymentMethod")}
                          className="radio checked:bg-blue-500 w-5 h-5"
                          name="paymentMethod"
                          value={1}
                          type="radio"
                          checked={selectMethodPayment === 1}
                          onChange={handlerMethodPayment}
                        />
                      </div>
                      <div>
                        <strong className="text-[18px]">Chuyển khoản</strong>
                      </div>
                    </label>
                  </div>
                  {selectMethodPayment == 1 && (
                    <div>
                      <div className="flex items-start justify-start gap-5 pl-4 pt-6 pb-3 cursor-pointer">
                        <div className="self-center">
                          <input
                            className="radio checked:bg-blue-500 w-5 h-5"
                            name="bank"
                            type="radio"
                            value={1}
                            checked={selectBank == 1}
                            onChange={handlerSelectBank}
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
                      </div>
                      <div className="flex items-start justify-start gap-5 pl-4 pt-6 pb-3 cursor-pointer">
                        <div className="self-center">
                          <input
                            className="radio checked:bg-blue-500 w-5 h-5"
                            id="bank-W5cb6f2d0d84cb"
                            name="bank"
                            type="radio"
                            onChange={handlerSelectBank}
                            value={2}
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
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-5 flex flex-col">
                  <label className="text-lg">Ghi chú cho đơn hàng</label>
                  <textarea
                    {...register("notes")}
                    className="outline-none border border-slate-700 rounded-md"
                    rows={5}
                  ></textarea>
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
                      {Number(totalPrice)?.toLocaleString("vi", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-sans font-normal">
                      Phí giao hàng:
                    </span>
                    <span className="text-3xl text-regal-red font-sans font-bold">
                      {Number(fee)?.toLocaleString("vi", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-sans font-normal">
                      Tổng:
                    </span>
                    <span className="text-3xl text-regal-red font-sans font-bold">
                      {(totalPrice + fee)?.toLocaleString("vi", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-5">
                    <button className="py-2 px-3 rounded-md bg-white text-regal-red border border-regal-red text-base font-light font-serif hover:bg-regal-red transition-all hover:text-white">
                      <Link href="/payment-confirm">Trở về nhập địa chỉ</Link>
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
