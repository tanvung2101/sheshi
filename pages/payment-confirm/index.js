import CartTabs from "@/components/CartTabs";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { BiErrorCircle } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Country, State, City } from "country-state-city";
import CartEmpty from "@/components/CartEmpty";
import accountApi from "@/apis/accountApi";
import { toast } from "react-toastify";
import { addInformation } from "@/redux/cartItemSlice";
import { useRouter } from "next/router";
import { SEO } from "@/components";
// import { Input } from "@/components";
import { RiArrowDropDownLine } from "react-icons/ri";

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
    cityCode: yup.string().required().nullable(),
    districtCode: yup.string().required().nullable(),
    wardCode: yup.string().required().nullable(),
  })
  .required();

const PaymentConfirm = () => {
  const { value } = useSelector((state) => state.cartItem);
  const [totalPrice, setTotalPrice] = useState(0);
  const dispatch = useDispatch();
  const { information } = useSelector((state) => state.cartItem);
  const router = useRouter();

  const [active, setActive] = useState(false);

  const [idCityCode, setIdCityCode] = useState();
  const [district, setDistrict] = useState();

  const [city, setCity] = useState();
  console.log(city);

  const handlerCityCode = (id) => {
    setValue("cityCode", id);
    setIdCityCode(id);
  };
  console.log("idCityCode", idCityCode);

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
  console.log(isValid);
  const onSubmit = async (data) => {
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
    router.push("/payment");
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
    async function Date() {
      const city = await import("../../components/locations/cities.json");
      setCity(city.data);
    }
    Date();
  }, []);

  useEffect(() => {}, []);

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
                      <span className="text-red-500 text-sm font-normal font-sans">
                        {errors?.fullname?.message}
                      </span>
                      {errors?.fullname?.message && (
                        <span className="absolute top-0 right-0 -translate-x-1/2 translate-y-1/2">
                          <BiErrorCircle className="text-lg text-red-500" />
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-y-2 mt-4">
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
                        <span className="text-red-500 text-sm font-normal font-sans">
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
                      <span className="text-red-500 text-sm font-normal font-sans">
                        Trường bắt buộc
                      </span>
                    )}
                    {errors?.phoneCode?.message && (
                      <span className="absolute top-0 right-0 -translate-x-1/2 translate-y-1/2">
                        <BiErrorCircle className="text-lg text-red-500" />
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-y-2 mt-4">
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
                        <span className="text-red-500 text-sm font-normal font-sans">
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
                  <div className="flex flex-col gap-y-2 mt-4">
                    <label
                      htmlFor="address"
                      className="text-[16px] font-sans font-normal"
                    >
                      Tỉnh/Thành
                    </label>
                    <div className="">
                      {/* <input
                        {...register("cityCode")}
                        className={`px-4 py-2 rounded-md w-full outline-none ${
                          errors?.cityCode?.message
                            ? "focus:ring-2 focus:ring-red-300 border border-red-500"
                            : "border border-slate-400 focus:border-slate-600"
                        }`}
                        id="address"
                        placeholder="Tỉnh/Thành"
                      /> */}
                      <div
                        className={`relative px-4 py-2 rounded-md w-full outline-none ${
                          errors?.cityCode?.message
                            ? "focus:ring-2 focus:ring-red-300 border border-red-500"
                            : "border border-slate-400 focus:border-slate-600"
                        }`}
                        onClick={() => setActive(!active)}
                      >
                        <span className="text-[16px] font-sans font-normal">
                          Tỉnh Thành
                        </span>
                        <span className="absolute top-1/2 right-0 -translate-x-1/2 -translate-y-1/2">
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
                                  onClick={() => setIdCityCode(e.id)}
                                  className="px-4 py-2 hover:bg-red-500 text-base"
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
                      <span className="text-red-500 text-sm font-normal font-sans">
                        Trường bắt buộc
                      </span>
                    )}
                    {/* {errors?.cityCode?.message && (
                        <span className="absolute top-0 right-0 -translate-x-1/2 translate-y-1/2">
                          <BiErrorCircle className="text-lg text-red-500" />
                        </span>
                      )} */}
                  </div>
                  <div className="flex flex-col gap-y-2 mt-4">
                    <label
                      htmlFor="address"
                      className="text-[16px] font-sans font-normal"
                    >
                      Quận/Huyện
                    </label>
                    <div className="relative">
                      <input
                        {...register("districtCode")}
                        className={`px-4 py-2 rounded-md w-full outline-none ${
                          errors?.districtCode?.message
                            ? "focus:ring-2 focus:ring-red-300 border border-red-500"
                            : "border border-slate-400 focus:border-slate-600"
                        }`}
                        id="address"
                        placeholder="Quận/Huyện"
                      />
                      {errors?.districtCode?.message && (
                        <span className="text-red-500 text-sm font-normal font-sans">
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
                  <div className="flex flex-col gap-y-2 mt-4">
                    <label
                      htmlFor="address"
                      className="text-[16px] font-sans font-normal"
                    >
                      Phường/Xã
                    </label>
                    <div className="relative">
                      <input
                        {...register("wardCode")}
                        className={`px-4 py-2 rounded-md w-full outline-none ${
                          errors?.wardCode?.message
                            ? "focus:ring-2 focus:ring-red-300 border border-red-500"
                            : "border border-slate-400 focus:border-slate-600"
                        }`}
                        id="address"
                        placeholder="Phường/Xã"
                      />
                      {errors?.wardCode?.message && (
                        <span className="text-red-500 text-sm font-normal font-sans">
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
                  <div className="flex flex-col gap-y-2 mt-4">
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
                        <span className="text-red-500 text-sm font-normal font-sans">
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
                    <p className="text-xl font-sans font-normal">
                      Bạn đang có sản phẩm trong giỏ hàng
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-sans font-normal">
                        Thành Tiền:
                      </span>
                      <span className="text-2xl text-regal-red font-sans font-bold">
                        {totalPrice?.toLocaleString("vi", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center justify-center gap-5">
                      <button className="py-2 px-3 rounded-md bg-white text-regal-red border border-regal-red text-base font-light font-serif hover:bg-regal-red transition-all hover:text-white">
                        <Link href="/cart">Trở về giỏ hàng</Link>
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
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
            </form>
          </div>
        </>
      )}
    </>
  );
};

export default PaymentConfirm;
