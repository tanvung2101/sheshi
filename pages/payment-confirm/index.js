import CartTabs from "@/components/CartTabs";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { BiErrorCircle } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import CartEmpty from "@/components/CartEmpty";
import accountApi from "@/apis/accountApi";
import { toast } from "react-toastify";
import { addInformation } from "@/redux/cartItemSlice";
import { useRouter } from "next/router";
import { Input, SEO, SelectCustom } from "@/components";
import Select from 'react-select';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { useLocation } from "@/hook/useLocation";
import PhoneInput from "@/components/PhoneInput";
import useLocationForm from "@/components/location-vn";

const schema = yup
  .object({
    email: yup
      .string()
      .email()
      .required("Trường bắt buộc")
      .max(255)
      .matches(
        /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
        "Vui long nhap email hop le"
      )
      .trim(),
    fullName: yup
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
    phoneCode: yup.string().max(5).trim().required().nullable(),
    phoneNumber: yup.string().min(9).max(20).trim().required().nullable(),
    address: yup.string().max(255).trim().required().nullable(),
    cityCode: yup.number().integer().required('Trường bắt buộc').nullable(),
    districtCode: yup.number().integer().required('Trường bắt buộc').nullable(),
    wardCode: yup.number().integer().required('Trường bắt buộc').nullable(),
  })
  .required();

const PaymentConfirm = () => {
  const { value } = useSelector((state) => state.cartItem);
  const { info } = useSelector((state) => state.account);
  const { t } = useTranslation('common');
  const [totalPrice, setTotalPrice] = useState(0);
  const dispatch = useDispatch();
  const { information } = useSelector((state) => state.cartItem);
  console.log('infoooooo', info?.userInformation)
  const router = useRouter();

  // console.log(city);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    control,
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: info?.email,
      fullName: info?.userInformation?.fullName,
      phoneCode: info?.phoneCode || "84",
      phoneNumber: info?.phoneNumber,
      address: info?.userInformation?.address,
      cityCode: info?.userInformation?.cityCode,
      districtCode: info?.userInformation?.districtCode,
      wardCode: info?.userInformation?.wardCode,
      referralCode: info?.userReferral?.referrerCode,
    },
    mode: "onChange",
  });
  const { phoneCode, phoneNumber, userCode, cityCode, districtCode, wardCode } =
    useWatch({
      control,
    });
  console.log(cityCode, districtCode, wardCode)
  const { state, onCitySelect, onDistrictSelect, onWardSelect } =
    useLocationForm(
      true,
      info ? info.userInformation : information
    );

  const {
    cityOptions,
    districtOptions,
    wardOptions,
    selectedCity,
    selectedDistrict,
    selectedWard,
  } = state;
  // console.log(state)
  const onSubmit = async (data) => {
    console.log("hbghjhgggh", data)
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

    if (!Object.values(information).length === 0) {
      setValue("email", information.email);
      setValue("fullName", information.fullName);
      setValue("phoneCode", information.phoneCode);
      setValue("phoneNumber", information.phoneNumber);
      setValue("address", information.address);
      setValue("cityCode", information.cityCode);
      setValue("districtCode", information.districtCode);
      setValue("wardCode", information.wardCode);
      setValue("referralCode", information.referralCode);
    }

  }, [information, setValue, totalPrice, value]);

  return (
    <>
      <SEO title="Giỏ hàng"></SEO>
      {value?.length === 0 ? (
        <CartEmpty></CartEmpty>
      ) : (
        <>
          <CartTabs className="pt-12" tabs={2} />
          <div className="px-36 mb-28 max-lg:px-8 max-md:px-4">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex items-start justify-center gap-x-24 max-lg:flex-col">
                <div className="w-[65%] mt-0 max-lg:w-full max-lg:mb-10">
                  <div className="flex flex-col gap-y-2">
                    <label
                      htmlFor="fullname"
                      className="text-[16px] font-sans font-normal"
                    >
                      {t("display_name")}
                    </label>
                    <div className="relative">
                      <Input
                        {...register("fullName")}
                        type="text"
                        // className={`px-4 py-2 rounded-md w-full outline-none ${errors?.fullname?.message
                        //   ? "focus:ring-2 focus:ring-red-300 border border-red-500"
                        //   : "border border-slate-400 focus:border-slate-600"
                        //   }`}
                        errors={errors?.fullName?.message}
                        placeholder={t("display_name")}
                      />
                      <span className="font-sans text-sm font-normal text-red-500">
                        {errors?.fullName?.message}
                      </span>
                      {errors?.fullName?.message && (
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
                      {t("email")}
                    </label>
                    <div className="relative">
                      <Input
                        {...register("email")}
                        type="email"
                        // className={`px-4 py-2 rounded-md w-full outline-none ${errors?.email?.message
                        //   ? "focus:ring-2 focus:ring-red-300 border border-red-500"
                        //   : "border border-slate-400 focus:border-slate-600"
                        //   }`}
                        errors={errors?.email?.message}
                        placeholder={t("email")}
                        autoComplete="off"
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
                  <div className="flex-col w-full mt-4">
                    <label
                      className="inline-block mb-3 text-sm font-normal text-black"
                      htmlFor=""
                    >
                      Số điện thoại
                    </label>
                    <PhoneInput
                      phoneCode={phoneCode?.toString() || "84"}
                      onChangePhoneNumber={(newValue) => {
                        // console.log(newValue);
                        setValue("phoneNumber", +newValue, {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                      }}
                      onChangePhoneCode={(newValue) => {
                        setValue("phoneCode", +newValue, {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                      }}
                      namePhoneCode="phoneCode"
                      namePhoneNumber="phoneNumber"
                      register={register}
                    ></PhoneInput>
                    <span className="font-sans text-sm font-normal text-red-500">
                      {errors?.phoneNumber?.message}
                    </span>
                  </div>
                  <div className="flex flex-col mt-4 gap-y-2">
                    <label
                      htmlFor="address"
                      className="text-[16px] font-sans font-normal"
                    >
                      {t("address")}
                    </label>
                    <div className="relative">
                      <Input
                        {...register("address")}
                        placeholder={t("address")}
                        type="text"
                        // className={`px-4 py-2 rounded-md w-full outline-none ${errors?.address?.message
                        //   ? "focus:ring-2 focus:ring-red-300 border border-red-500"
                        //   : "border border-slate-400 focus:border-slate-600"
                        //   }`}
                        errors={errors?.address?.message}
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
                  <div className="flex-col w-full mt-4 ">
                    <label className="inline-block mb-3 text-sm font-normal text-black">
                      Tỉnh/Thành
                    </label>
                    <Controller
                      name="cityCode"
                      control={control}
                      render={({ field }) => (
                        <SelectCustom
                          {...field}
                          {...register("cityCode")}
                          isDisabled={cityOptions.length === 0}
                          options={cityOptions}
                          onChange={(option) => {
                            option.value !== selectedCity?.value && onCitySelect(option);
                            option.value === 0 && setValue("cityCode", undefined, {
                              shouldDirty: true,
                            });
                            setValue("wardCode", undefined)
                            setValue("districtCode", undefined)
                            option.value !== 0 && setValue('cityCode', option.value, {
                              shouldValidate: true,
                              shouldDirty: true,
                            })
                          }}
                          placeholder='Tinh'
                          // value={cityOptions.find((itemOption) => itemOption.value === cityCode)}
                          // value={selectedCity}
                          className="select-custom"
                          classNamePrefix="select-custom"
                        />
                      )}
                    />
                    <p className="mt-1 mb-4 font-sans text-sm font-normal text-red-500">
                      {errors?.cityCode?.message}
                    </p>
                  </div>
                  <div className="flex-col w-full mt-4 ">
                    <label
                      htmlFor=""
                      className="inline-block mb-3 text-sm font-normal text-black"
                    >
                      Quận/Huyện
                    </label>
                    <Controller
                      name="districtCode"
                      control={control}
                      render={({ field }) => (
                        <SelectCustom
                          {...field}
                          isDisabled={districtOptions.length === 0}
                          options={districtOptions}
                          onChange={(option) => {
                            console.log('fdssdgshs', option)
                            option.value !== selectedDistrict?.value && onDistrictSelect(option);
                            setValue("districtCode", option.value, {
                              shouldValidate: true,
                              shouldDirty: true
                            })
                          }}
                          placeholder='Quan/huyen'
                          // value={districtOptions?.find((itemOption) => itemOption.value === districtCode)}
                          // value={selectedDistrict}
                          className="select-custom"
                          classNamePrefix="select-custom"
                        />
                      )}
                    />
                    <p className="mt-1 mb-4 font-sans text-sm font-normal text-red-500">
                      {errors?.districtCode?.message}
                    </p>
                  </div>

                  <div className="flex-col w-full mt-4 ">
                    <label
                      htmlFor=""
                      className="inline-block mb-3 text-sm font-normal text-black"
                    >
                      Phường/Xã
                    </label>
                    <div className="relative">
                      {/* <div className="">
                        <div
                          className={`relative px-4 py-2 rounded-md w-full outline-none ${errors?.wardCode?.message
                            ? "focus:ring-2 focus:ring-red-300 border border-red-500"
                            : "border border-slate-400 focus:border-slate-600"
                            }`}
                          onClick={() => setActiveWard(!activeWard)}
                        >
                          <span className="text-[16px] font-sans font-normal">
                            {address?.addressWard || "Phường/Xã"}
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
                            {...register("wardCode")}
                          >
                            {ward?.length > 0 &&
                              ward.map((e) => {
                                return (
                                  <div
                                    onClick={() =>
                                      handlerWardCode(e.id)
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
                      </div> */}
                      <Controller
                        name="wardCode"
                        control={control}
                        render={({ field }) => (
                          <SelectCustom
                            {...field}
                            isDisabled={wardOptions.length === 0}
                            options={wardOptions}
                            onChange={(option) => {
                              onWardSelect(option);
                              setValue('wardCode', option.value, {
                                shouldValidate: true,
                                shouldDirty: true,
                              })
                            }}
                            placeholder='Phường/Xã'
                            // value={wardOptions.find((itemOption) => itemOption.value === wardCode)}
                            // value={selectedWard}
                            className="select-custom"
                            classNamePrefix="select-custom"
                          />
                        )}
                      />

                      <p className="mt-1 mb-4 font-sans text-sm font-normal text-red-500">
                        {errors?.wardCode?.message}
                      </p>

                    </div>
                  </div>
                  <div className="flex flex-col mt-4 gap-y-2">
                    <label
                      htmlFor="address"
                      className="text-[16px] font-sans font-normal"
                    >
                      {t("referral_id")}
                    </label>
                    <div className="relative">
                      <input
                        {...register("referralCode")}
                        className={`px-4 py-2 rounded-md w-full outline-none ${errors?.referralCode?.message
                          ? "focus:ring-2 focus:ring-red-300 border border-red-500"
                          : "border border-slate-400 focus:border-slate-600"
                          }`}
                        id="address"
                        placeholder={t("referral_id")}
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
                <div className="w-[35%] mt-0 max-lg:w-full">
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
                    <div className="flex items-center justify-center gap-5 max-lg:flex-col">
                      <div className="px-3 py-2 font-serif text-base font-light text-center transition-all bg-white border rounded-md text-regal-red border-regal-red hover:bg-regal-red hover:text-white max-lg:w-full">
                        <Link href="/cart" prefetch={true}>Trở về giỏ hàng</Link>
                      </div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-3 py-2 font-serif text-base font-light text-white rounded-md bg-regal-red max-lg:w-full"
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

export async function getStaticProps({ locale }) {
  console.log(locale)
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'], null, ['vi', 'en'])),
      // Will be passed to the page component as props
    },
  }
}

export default PaymentConfirm;
