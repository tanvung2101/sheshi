import CartTabs from "@/components/CartTabs";
import Link from "next/link";
import React, {useEffect, useState } from "react";
import { BiErrorCircle } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import CartEmpty from "@/components/CartEmpty";
import accountApi from "@/apis/accountApi";
import { toast } from "react-toastify";
import { addInformation } from "@/redux/cartItemSlice";
import { useRouter } from "next/router";
import { SEO } from "@/components";

const schema = yup
  .object({
    fullname: yup
      .string()
      .required("Trường bắt buộc")
      .min(8, "Tối thiểu 8 kí thự")
      .max(50, "Tối đa 50 kí tự")
      .trim(),
    referralCode: yup
      .string()
      .notRequired()
      .nullable()
      .matches(/(^\s*$|(^SS)[0-9]{6}$)/),
    email: yup
      .string()
      .email()
      .required()
      .max(255)
      .matches(
        /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
        "Vui long nhap email hop le"
      )
      .trim(),
    phoneCode: yup.string().min(9).max(20).nullable(),
    address: yup.string().max(255).trim().required().nullable(),
    cityCode: yup
      .object({
        id: yup.number().required(),
        name: yup.string().required(),
      })
      .required()
      .nullable(),
    districtCode: yup
      .object({
        id: yup.number().required(),
        name: yup.string().required(),
      })
      .required()
      .nullable(),
    wardCode: yup
      .object({
        id: yup.number().required(),
        name: yup.string().required(),
      })
      .required()
      .nullable(),
  })
  .required();

const PaymentConfirm = () => {
  const { value } = useSelector((state) => state.cartItem);
  const [totalPrice, setTotalPrice] = useState(0);
  const dispatch = useDispatch();
  const { information } = useSelector((state) => state.cartItem);
  const router = useRouter();

  const [active, setActive] = useState(false);
  const [activeDistric, setActiveDistric] = useState(false);
  const [activeWard, setActiveWard] = useState(false);

  const [idCityCode, setIdCityCode] = useState({ id: 0, name: "" });
  const [city, setCity] = useState();
  const [idDistrictCode, setIdDistrictCode] = useState({ id: 0, name: "" });
  const [district, setDistrict] = useState();
  const [idWardCode, setIdWardCode] = useState({ id: 0, name: "" });
  const [ward, setWard] = useState();

  // console.log(city);

  const handlerCityCode = (id, name) => {
    setValue("cityCode", { id, name });
    setIdCityCode({ id, name });
    setActive(false);
  };
  const handlerDistrictCode = (id, name) => {
    setValue("districtCode", { id, name });
    setIdDistrictCode({ id, name });
    setActiveDistric(false);
  };
  const handlerWardCode = (id, name) => {
    setValue("wardCode", { id, name });
    setIdWardCode({ id, name });
    setActiveWard(false);
  };
  // console.log("idWardCode", idWardCode);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    control,
    watch,
    setValue,
  } = useForm({
    // mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      fullname: "",
      email: "",
      phoneCode: "",
      address: "",
      cityCode: "",
      districtCode: "",
      wardCode: "",
      referralCode: "",
    },
  });
  const onSubmit = async (data) => {
    // console.log(data)
    if (!isValid) return;
    if (data.referralCode) {
      const checkExists = await accountApi.getUserWithUserCode({
        userCode: data.referralCode,
      });
      if (checkExists?.data === null) {
        toast.success("Mã giới thiệu này không tồn tại");
      }
    }
    dispatch(addInformation(data));
    router.replace("/payment");
  };
  // console.log(watch('fullname'))
  useEffect(() => {
    setTotalPrice(
      value?.reduce((total, currentValue) => {
        return total + Number(currentValue.price * currentValue.quantity);
      }, 0)
    );

    if (information) {
      setValue("fullname", information.fullname);
      setValue("email", information.email);
      setValue("phoneCode", information.phoneCode);
      setValue("address", information.address);
      setValue("cityCode", information.cityCode);
      setValue("districtCode", information.districtCode);
      setValue("wardCode", information.wardCode);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setValue, totalPrice, value]);

  useEffect(() => {
    async function ciyCode() {
      const city = await import("../../components/locations/cities.json");
      setCity(city.data);
    }
    ciyCode();
  }, [city, idCityCode]);

  useEffect(() => {
    async function districtCode() {
      const district = await import(
        `../../components/locations/districts/${idCityCode.id}.json`
      );
      setDistrict(district.data);
    }
    districtCode();
  }, [idCityCode, idDistrictCode]);
  useEffect(() => {
    async function wardCodeCode() {
      const ward = await import(
        `../../components/locations/wards/${idDistrictCode.id}.json`
      );
      setWard(ward.data);
    }
    wardCodeCode();
  }, [idDistrictCode])

  return (
    <>
      <SEO title="tìm kiếm"></SEO>
      {value?.length === 0 ? (
        <CartEmpty></CartEmpty>
      ) : (
        <>
          <CartTabs className="pt-12" tabs={2} />
          <div className="px-36 mb-28">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex items-start justify-center gap-x-24">
                <div className="w-[65%] mt-0">
                  <div className="flex flex-col gap-y-2">
                    <label
                      htmlFor="fullname"
                      className="text-[16px] font-sans font-normal"
                    >
                      Họ và tên
                    </label>
                    <div className="relative">
                      <input
                        name="fullname"
                        id="fullname"
                        {...register("fullname")}
                        type="text"
                        className={`px-4 py-2 rounded-md w-full outline-none ${
                          errors?.fullname?.message
                            ? "focus:ring-2 focus:ring-red-300 border border-red-500"
                            : "border border-slate-400 focus:border-slate-600"
                        }`}
                        placeholder="Họ và tên"
                      />
                      <span className="font-sans text-sm font-normal text-red-500">
                        {errors?.fullname?.message}
                      </span>
                      {errors?.fullname?.message && (
                        <span className="absolute top-0 right-0 -translate-x-1/2 translate-y-1/2">
                          <BiErrorCircle className="text-lg text-red-500" />
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col mt-4 gap-y-2">
                    <label
                      htmlFor="email"
                      className="text-[16px] font-sans font-normal"
                    >
                      Email
                    </label>
                    <div className="relative">
                      <input
                        className={`px-4 py-2 rounded-md w-full outline-none ${
                          errors?.email?.message
                            ? "focus:ring-2 focus:ring-red-300 border border-red-500"
                            : "border border-slate-400 focus:border-slate-600"
                        }`}
                        id="email"
                        {...register("email")}
                        placeholder="Nhập email của bạn"
                      />
                      {errors?.email?.message && (
                        <span className="font-sans text-sm font-normal text-red-500">
                          Trường bắt buộc
                        </span>
                      )}
                      {errors?.email?.message && (
                        <span className="absolute top-0 right-0 -translate-x-1/2 translate-y-1/2">
                          <BiErrorCircle className="text-lg text-red-500" />
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="w-full mt-4">
                    <label className="text-[16px] font-sans font-normal">
                      Số điện thoại
                    </label>
                    <Controller
                      render={({ field: { onChange, onBlur, value, ref } }) => {
                        return (
                          <PhoneInput
                            country={"vn"}
                            placeholder="Số điện thoại"
                            inputRef={register}
                            inputStyle={{
                              width: "100%",
                              height: "40px",
                              fontSize: "15px",
                              paddingLeft: "60px",
                              borderRadius: "5px",
                            }}
                            inputProps={{
                              name: "phoneCode",
                              required: true,
                              autoFocus: true,
                            }}
                            id="phoneCode"
                            specialLabel="Telephone"
                            name="phoneCode"
                            autoComplete="phoneCoder"
                            onChange={onChange}
                            error={!!errors.phoneCode}
                            helperText={
                              errors.phoneCode &&
                              "Un numéro valide est obligatoire"
                            }
                          />
                        );
                      }}
                      defaultValue=""
                      name="phoneCode"
                      control={control}
                      rules={{ required: true }}
                    />
                    {errors?.phoneCode?.message && (
                      <span className="font-sans text-sm font-normal text-red-500">
                        Trường bắt buộc
                      </span>
                    )}
                    {errors?.phoneCode?.message && (
                      <span className="absolute top-0 right-0 -translate-x-1/2 translate-y-1/2">
                        <BiErrorCircle className="text-lg text-red-500" />
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col mt-4 gap-y-2">
                    <label
                      htmlFor="address"
                      className="text-[16px] font-sans font-normal"
                    >
                      Địa chỉ
                    </label>
                    <div className="relative">
                      <input
                        {...register("address")}
                        className={`px-4 py-2 rounded-md w-full outline-none ${
                          errors?.address?.message
                            ? "focus:ring-2 focus:ring-red-300 border border-red-500"
                            : "border border-slate-400 focus:border-slate-600"
                        }`}
                        id="address"
                        placeholder="Địa chỉ"
                      />
                      {errors?.address?.message && (
                        <span className="font-sans text-sm font-normal text-red-500">
                          Trường bắt buộc
                        </span>
                      )}
                      {errors?.address?.message && (
                        <span className="absolute top-0 right-0 -translate-x-1/2 translate-y-1/2">
                          <BiErrorCircle className="text-lg text-red-500" />
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col mt-4 gap-y-2">
                    <label
                      htmlFor="address"
                      className="text-[16px] font-sans font-normal"
                    >
                      Tỉnh/Thành
                    </label>
                    <div className="">
                      <div
                        className={`relative px-4 py-2 rounded-md w-full outline-none ${
                          errors?.cityCode?.message
                            ? "focus:ring-2 focus:ring-red-300 border border-red-500"
                            : "border border-slate-400 focus:border-slate-600"
                        }`}
                        onClick={() => setActive(!active)}
                      >
                        <span className="text-[16px] font-sans font-normal">
                          {idCityCode.name
                            ? idCityCode.name
                            : information?.cityCode?.name
                            ? information?.cityCode?.name
                            : "Tỉnh/Thành"}
                        </span>
                        <span className="absolute right-0 -translate-x-1/2 -translate-y-1/2 top-1/2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-4 h-4 hover:text-black"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                            />
                          </svg>
                        </span>
                      </div>
                      {active && (
                        <div
                          className="h-[250px] p-1 overflow-y-auto mt-1 rounded-md border border-slate-300"
                          {...register("cityCode")}
                        >
                          {city.length > 0 &&
                            city.map((e) => {
                              return (
                                <div
                                  onClick={() => handlerCityCode(e.id, e.name)}
                                  className="px-4 py-2 text-base hover:bg-red-500"
                                  key={e.id}
                                >
                                  {e.name}
                                </div>
                              );
                            })}
                        </div>
                      )}
                    </div>
                    {errors?.cityCode?.message && (
                      <span className="font-sans text-sm font-normal text-red-500">
                        Trường bắt buộc
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col mt-4 gap-y-2">
                    <label
                      htmlFor="address"
                      className="text-[16px] font-sans font-normal"
                    >
                      Quận/Huyện
                    </label>
                    <div className="relative">
                      <div className="">
                        <div
                          className={`relative px-4 py-2 rounded-md w-full outline-none ${
                            errors?.districtCode?.message
                              ? "focus:ring-2 focus:ring-red-300 border border-red-500"
                              : "border border-slate-400 focus:border-slate-600"
                          }`}
                          onClick={() => setActiveDistric(!activeDistric)}
                        >
                          <span className="text-[16px] font-sans font-normal">
                            {idDistrictCode.name
                              ? idDistrictCode.name
                              : information?.districtCode?.name
                              ? information?.districtCode?.name
                              : "Quận/Huyện"}
                          </span>
                          <span className="absolute right-0 -translate-x-1/2 -translate-y-1/2 top-1/2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-4 h-4 hover:text-black"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                              />
                            </svg>
                          </span>
                        </div>
                        {activeDistric && (
                          <div
                            className="h-[250px] p-1 overflow-y-auto mt-1 rounded-md border border-slate-300"
                            {...register("cityCode")}
                          >
                            {district?.length > 0 &&
                              district.map((e) => {
                                return (
                                  <div
                                    onClick={() =>
                                      handlerDistrictCode(e.id, e.name)
                                    }
                                    className="px-4 py-2 text-base hover:bg-red-500"
                                    key={e.id}
                                  >
                                    {e.name}
                                  </div>
                                );
                              })}
                          </div>
                        )}
                      </div>
                      {errors?.districtCode?.message && (
                        <span className="font-sans text-sm font-normal text-red-500">
                          Trường bắt buộc
                        </span>
                      )}
                      {errors?.districtCode?.message && (
                        <span className="absolute top-0 right-0 -translate-x-1/2 translate-y-1/2">
                          <BiErrorCircle className="text-lg text-red-500" />
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col mt-4 gap-y-2">
                    <label
                      htmlFor="address"
                      className="text-[16px] font-sans font-normal"
                    >
                      Phường/Xã
                    </label>
                    <div className="relative">
                      <div className="">
                        <div
                          className={`relative px-4 py-2 rounded-md w-full outline-none ${
                            errors?.wardCode?.message
                              ? "focus:ring-2 focus:ring-red-300 border border-red-500"
                              : "border border-slate-400 focus:border-slate-600"
                          }`}
                          onClick={() => setActiveWard(!activeWard)}
                        >
                          <span className="text-[16px] font-sans font-normal">
                            {idWardCode.name
                              ? idWardCode.name
                              : information?.wardCode?.name
                              ? information?.wardCode?.name
                              : "Phường/Xã"}
                          </span>
                          <span className="absolute right-0 -translate-x-1/2 -translate-y-1/2 top-1/2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-4 h-4 hover:text-black"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                              />
                            </svg>
                          </span>
                        </div>
                        {activeWard && (
                          <div
                            className="h-[250px] p-1 overflow-y-auto mt-1 rounded-md border border-slate-300"
                            {...register("cityCode")}
                          >
                            {ward?.length > 0 &&
                              ward.map((e) => {
                                return (
                                  <div
                                    onClick={() =>
                                      handlerWardCode(e.id, e.name)
                                    }
                                    className="px-4 py-2 text-base hover:bg-red-500"
                                    key={e.id}
                                  >
                                    {e.name}
                                  </div>
                                );
                              })}
                          </div>
                        )}
                      </div>
                      {errors?.wardCode?.message && (
                        <span className="font-sans text-sm font-normal text-red-500">
                          Trường bắt buộc
                        </span>
                      )}
                      {errors?.wardCode?.message && (
                        <span className="absolute top-0 right-0 -translate-x-1/2 translate-y-1/2">
                          <BiErrorCircle className="text-lg text-red-500" />
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col mt-4 gap-y-2">
                    <label
                      htmlFor="address"
                      className="text-[16px] font-sans font-normal"
                    >
                      ID giới thiệu
                    </label>
                    <div className="relative">
                      <input
                        {...register("referralCode")}
                        className={`px-4 py-2 rounded-md w-full outline-none ${
                          errors?.referralCode?.message
                            ? "focus:ring-2 focus:ring-red-300 border border-red-500"
                            : "border border-slate-400 focus:border-slate-600"
                        }`}
                        id="address"
                        placeholder="ID giới thiệu"
                      />

                      {errors?.referralCode?.message && (
                        <span className="font-sans text-sm font-normal text-red-500">
                          Trường bắt buộc
                        </span>
                      )}
                      {errors?.referralCode?.message && (
                        <span className="absolute top-0 right-0 -translate-x-1/2 translate-y-1/2">
                          <BiErrorCircle className="text-lg text-red-500" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="w-[35%] mt-0">
                  <div className="p-4 flex flex-col gap-5 shadow-md max-h-[300px]">
                    <p className="font-sans text-xl font-normal">
                      Bạn đang có sản phẩm trong giỏ hàng
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-sans text-xl font-normal">
                        Thành Tiền:
                      </span>
                      <span className="font-sans text-2xl font-bold text-regal-red">
                        {totalPrice?.toLocaleString("vi", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center justify-center gap-5">
                      <div className="px-3 py-2 font-serif text-base font-light transition-all bg-white border rounded-md text-regal-red border-regal-red hover:bg-regal-red hover:text-white">
                        <Link href="/cart">Trở về giỏ hàng</Link>
                      </div>
                      <button
                        type="submit"
                        // disabled={isSubmitting}
                        className="px-3 py-2 font-serif text-base font-light text-white rounded-md bg-regal-red"
                      >
                        Tiến hàng thanh toán
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </>
      )}
    </>
  );
};

export default PaymentConfirm;
