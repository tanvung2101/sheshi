import InputCopy from "@/components/InputCopy";
import PhoneInput from "@/components/PhoneInput";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useCallback } from "react";
import { BiErrorCircle } from "react-icons/bi";
import {
  BsCurrencyDollar,
  BsFillCameraFill,
  BsGraphUpArrow,
  BsPeople,
} from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import AuthApis from "@/apis/authApis";
import { useRouter } from "next/navigation";
import RequireAuth from "@/components/RequireAuth";
import { setProfileAuth } from "@/redux/accountSlice";
import NavbarUser from "@/components/NavbarUser";
import accountApis from "@/apis/accountApi";
import configDataApis from "@/apis/configDataApis";
import { MASTER_DATA_NAME, STATUS_ORDER } from "@/constants";
import orderApis from "@/apis/orderApis";
import { useLocation } from "@/hook/useLocation";
import { toast } from "react-toastify";
import { Button } from "@/components";

const schema = yup.object({
  fullName: yup.string().required().min(3).max(50).trim(),
  phoneCode: yup.string().max(5).trim().required().nullable(),
  phoneNumber: yup.string().min(9).max(20).trim().required().nullable(),
  address: yup.string().max(255).trim().required("Trường bắt buộc").nullable(),
  userCode: yup.string(),
  cityCode: yup.number().integer().required().nullable(),
  districtCode: yup.number().integer().required().nullable(),
  wardCode: yup.number().integer().required().nullable(),
});

const PageProfile = () => {
  const { token, info } = useSelector((state) => state.account);
  const dispatch = useDispatch();
  const router = useRouter();
  console.log(info);

  const [listReferrer, setListReferrer] = useState([])
  const [listReferrerWithLevel, setListReferrerWithLevel] = useState();
  const [myBuyOfMonth, setMyBuyOfMonth] = useState(0);
  const [refBuyOfMonth, setRefBuyOfMonth] = useState(0);
  const [loadingUpdateProfile, setLoadingUpdateProfile] = useState(false)


  const [active, setActive] = useState(false);
  const [activeDistric, setActiveDistric] = useState(false);
  const [activeWard, setActiveWard] = useState(false);

  const [idCityCode, setIdCityCode] = useState(info?.userInformation?.cityCode);
  const [city, setCity] = useState();
  const [idDistrictCode, setIdDistrictCode] = useState(info?.userInformation?.districtCode);
  const [district, setDistrict] = useState();
  const [idWardCode, setIdWardCode] = useState(info?.userInformation?.wardCode);
  const [ward, setWard] = useState();
  const address = useLocation(idCityCode, idDistrictCode, idWardCode)
  // console.log(address)



  const getListReferrer = useCallback(async () => {
    const accounts = await accountApis.getMyReferrer(info?.id);
    setListReferrer(accounts)
    const listLevel = await configDataApis.getAllConfigData({
      idMaster: MASTER_DATA_NAME.LEVEL_USER
    })
    const referrerWithLevel = [];
    listLevel.map(level => {
      const userWithLevel = accounts.filter((a) => a.register.level === level.id)
      const quest = accounts.filter((a) => a.register.level === 0)
      referrerWithLevel.push({
        level: level.name,
        amount: userWithLevel.length,
      })

      setListReferrerWithLevel(referrerWithLevel)
    })

  }, [info])

  const getOrder = async () => {
    const myOrders = await orderApis.getOrderUser();
    const refsOrder = await orderApis.getOrderRef();
    let thisMonth = new Date().getMonth() + 1

    setMyBuyOfMonth(myOrders
      ?.filter((e) => new Date(e.orderDate).getMonth() + 1 === thisMonth && e.orderStatus === STATUS_ORDER.DELIVERED)
      ?.reduce((total, num) => {
        return total + (num.totalBeforeFee)
      }, 0)
    )

    setRefBuyOfMonth(refsOrder
      ?.filter((e) => new Date(e.orderDate).getMonth() + 1 === thisMonth && e.orderStatus === STATUS_ORDER.DELIVERED)
      ?.reduce((total, num) => {
        return total + (num.totalBeforeFee)
      }, 0))

  }

  useEffect(() => {
    getListReferrer()
  }, [getListReferrer])

  useEffect(() => {
    getOrder()
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    control,
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      fullName: info?.userInformation?.fullName,
      phoneCode: info?.phoneCode || "84",
      phoneNumber: info?.phoneNumber,
      address: info?.userInformation?.address,
      userCode: info?.userCode,
      cityCode: info?.userInformation?.cityCode,
      districtCode: info?.userInformation?.districtCode,
      wardCode: info?.userInformation?.wardCode,
    },
  });
  const { phoneCode, phoneNumber, userCode, cityCode, districtCode, wardCode } =
    useWatch({
      control,
    });
  const onSubmit = (data) => {
    const {
      fullName,
      phoneCode,
      phoneNumber,
      address,
      userCode,
      cityCode,
      districtCode,
      wardCode,
    } = data;
    setLoadingUpdateProfile(true)
    console.log({
      id: info?.id,
      fullName,
      phoneNumber: `${+phoneNumber}`,
      phoneCode: `${+phoneCode}`,
      address,
      cityCode: `${+cityCode}`,
      districtCode: `${+districtCode}`,
      wardCode: `${+wardCode}`,
    });
    AuthApis.updateProfileUser({
      id: info?.id,
      fullName,
      phoneNumber: `${+phoneNumber}`,
      phoneCode: `${+phoneCode}`,
      address,
      cityCode: `${+cityCode}`,
      districtCode: `${+districtCode}`,
      wardCode: +wardCode,
    })
      .then(() => {
        return AuthApis.getProfile();
      })
      .then((res) => {
        toast.success('Ban da cap nhat thanh cong')
        dispatch(setProfileAuth(res));
        setLoadingUpdateProfile(false)
        reset({
          fullName,
          phoneNumber: `+${phoneNumber}`,
          phoneCode: +phoneCode,
          address,
          cityCode: +cityCode.id,
          districtCode: +districtCode.id,
          wardCode: +wardCode.is,
        });
      });
  };

  const handlerCityCode = (id) => {
    setValue("cityCode", id, { shouldDirty: true });
    setIdCityCode(id);
    setValue("districtCode", null);
    setValue("wardCode", null);
    setIdDistrictCode(0)
    setIdWardCode(0)
    setActive(false);
    console.log('idDistrictCode', idDistrictCode)
  };
  const handlerDistrictCode = (id) => {
    setValue("districtCode", id);
    setIdDistrictCode(id);
    setValue("wardCode", null);
    setActiveDistric(false);
  };
  const handlerWardCode = (id) => {
    setValue("wardCode", id);
    setIdWardCode(id);
    setActiveWard(false);
  };

  useEffect(() => {
    async function cityCode() {
      const city = await import("../../components/locations/cities.json");
      setCity(city.data);
    }
    cityCode();
  }, [city, idCityCode]);

  useEffect(() => {
    async function districtCode() {
      // console.log(idCityCode.id);
      if (!idCityCode) return null
      const district = await import(
        `../../components/locations/districts/${idCityCode}.json`
      );
      setDistrict(district.data);
    }
    districtCode();
  }, [idCityCode, idDistrictCode]);
  useEffect(() => {
    async function wardCodeCode() {
      if (!idDistrictCode) return
      const ward = await import(
        `../../components/locations/wards/${idDistrictCode}.json`
      );
      setWard(ward.data);
    }
    wardCodeCode();
  }, [idDistrictCode]);

  useEffect(() => {
    AuthApis.getProfile()
      .then((res) => dispatch(setProfileAuth(res)))
      .catch((err) => console.log(err))
      .finally(() => {
        console.log('thành công');
      });
  }, [token, dispatch]);
  useEffect(() => {
    if (!token) return router.push('/', undefined, { shallow: true })
  }, [router, token])
  return (
    <>


      {token && <NavbarUser bgPageProfile={true}>
        <div className="w-[75%] flex-col items-start max-md:w-full max-md:mt-4">
          <section className="flex items-start justify-between max-md:flex-col">
            <div className="flex flex-col items-start justify-between gap-2 w-[30%] px-4 py-4 rounded-md bg-slate-200 max-md:w-full">
              <div className="flex items-center justify-between w-full mb-3">
                <p className="text-lg font-bold text-regal-red">{myBuyOfMonth.toLocaleString("vi", {
                  style: "currency",
                  currency: "VND",
                })}</p>
                <span>
                  <BsCurrencyDollar className="text-4xl text-center text-regal-red"></BsCurrencyDollar>
                </span>
              </div>
              <div className="relative w-full h-1 rounded-full bg-slate-200">
                <div className={`absolute top-0 left-0 right-0 w-[${Math.round((myBuyOfMonth / 15000000) * 100)}%] h-1 bg-red-500 rounded-full`}></div>
              </div>
              <p className="text-sm">Doanh số trong tháng</p>
            </div>
            <div className="flex flex-col items-start justify-between gap-2 w-[30%] px-4 py-4 rounded-md bg-slate-200 max-md:w-full max-md:mt-4">
              <div className="flex items-center justify-between w-full mb-3">
                <p className="text-lg font-bold text-[#0dcaf0]">{refBuyOfMonth.toLocaleString("vi", {
                  style: "currency",
                  currency: "VND",
                })}</p>
                <span>
                  <BsGraphUpArrow className="text-4xl text-center text-[#0dcaf0]"></BsGraphUpArrow>
                </span>
              </div>
              <div className="relative w-full h-1 rounded-full bg-slate-200">
                <div style={{
                  width: `${Math.round((refBuyOfMonth / 15000000) * 100)}%`
                }} className={`absolute top-0 left-0 right-0 h-1 bg-[#0dcaf0] rounded-full`}></div>
              </div>
              <p className="text-sm">Doanh số người giới thiệu trong tháng</p>
            </div>
            <div className="flex flex-col items-start justify-between gap-2 w-[30%] px-4 py-4 rounded-md bg-slate-200 max-md:w-full max-md:mt-4">
              <div className="flex items-center justify-between w-full mb-3">
                <p className="text-lg font-bold text-yellow-300">{listReferrer.length}</p>
                <span>
                  <BsPeople className="text-4xl text-center text-yellow-300"></BsPeople>
                </span>
              </div>
              <div className="relative w-full h-1 rounded-full bg-slate-200">
                <div style={{
                  width: `${Math.round((listReferrer.length / 20) * 100)}%`
                }} className={`absolute top-0 left-0 right-0  h-1 bg-yellow-300 rounded-full`}></div>
              </div>
              <p className="text-sm">Số lượng người giới thiệu</p>
            </div>
          </section>
          <section className="px-1 pb-4 pt-16">
            <h3 className="font-sans font-bold text-3xl">Thông tin cá nhân</h3>
          </section>
          <form className="px-1" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex items-start justify-between gap-8 max-md:flex-col">
              <div className="flex-col items-center justify-between gap-8 w-[50%] max-md:w-full">
                <div className="flex-col w-full">
                  <label
                    className="inline-block mb-3 text-sm font-normal text-black"
                    htmlFor=""
                  >
                    ID giới thiệu
                  </label>
                  <InputCopy
                    value={userCode}
                    disabled
                    placeholder="ID giới thiệu"
                  ></InputCopy>
                </div>
                <div className="flex-col w-full mt-4">
                  <label
                    className="inline-block mb-3 text-sm font-normal text-black"
                    htmlFor=""
                  >
                    Họ và tên
                  </label>
                  <div className="relative">
                    <input
                      {...register("fullName")}
                      placeholder="Họ và tên"
                      type="text"
                      className={`inline-block w-full py-3 pl-4 pr-10 bg-[#fff] rounded-md outline-none border text-sm ${""
                        ? "focus:ring-2 focus:ring-red-300 border border-red-500 "
                        : "border border-slate-300 hover:border hover:border-slate-500"
                        }`}
                    />
                    {errors?.fullName?.message && (
                      <span className="absolute top-0 right-0 -translate-x-1/2 translate-y-1/2">
                        <BiErrorCircle className="text-lg text-red-500" />
                      </span>
                    )}
                  </div>
                  <span className="font-sans text-sm font-normal text-red-500">
                    {errors?.fullName?.message}
                  </span>
                </div>
                <div className="flex-col w-full mt-4">
                  <label
                    className="inline-block mb-3 text-sm font-normal text-black"
                    htmlFor=""
                  >
                    Email
                  </label>
                  <div className="relative">
                    <input
                      placeholder="Địa chỉ"
                      defaultValue={info?.email}
                      disabled
                      type="text"
                      className={`inline-block w-full py-3 pl-4 pr-10 bg-[#fff] rounded-md outline-none text-sm border border-slate-300 hover:border hover:border-slate-500 cursor-not-allowed`}
                    />
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
              </div>
              <div className="flex-col items-center justify-between gap-8 w-[50%] max-md:w-full">
                <div className="flex-col w-full">
                  <label
                    className="inline-block mb-3 text-sm font-normal text-black"
                    htmlFor=""
                  >
                    Địa chỉ
                  </label>
                  <div className="relative">
                    <input
                      {...register("address")}
                      placeholder="Địa chỉ"
                      type="text"
                      className={`inline-block w-full py-3 pl-4 pr-10 bg-[#fff] rounded-md outline-none border text-sm ${errors?.address?.message
                        ? "focus:ring-2 focus:ring-red-300 border border-red-500 "
                        : "border border-slate-300 hover:border hover:border-slate-500"
                        }`}
                    />
                    {errors?.address?.message && (
                      <span className="absolute top-0 right-0 -translate-x-1/2 translate-y-1/2">
                        <BiErrorCircle className="text-lg text-red-500" />
                      </span>
                    )}
                  </div>
                  <p className="mt-1 mb-4 font-sans text-sm font-normal text-red-500">
                    {errors?.address?.message}
                  </p>
                </div>

                <div className="flex-col w-full mt-4 ">
                  <label className="inline-block mb-3 text-sm font-normal text-black">
                    Tỉnh/Thành
                  </label>
                  <div className="">
                    <div
                      className={`relative px-4 py-2 rounded-md w-full outline-none border border-slate-400 focus:border-slate-600 ${errors?.cityCode?.message
                        ? "focus:ring-2 focus:ring-red-300 border border-red-500"
                        : "border border-slate-400 focus:border-slate-600"
                        }`}
                      onClick={() => setActive(!active)}
                    >
                      <span className="text-[16px] font-sans font-normal">
                        {address.addressCity || "Tỉnh / Thành"}
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
                        {city?.length > 0 &&
                          city?.map((e) => {
                            return (
                              <div
                                onClick={() => handlerCityCode(e.id)}
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
                    <p className="mt-1 mb-4 font-sans text-sm font-normal text-red-500">
                      Trường bắt buộc
                    </p>
                  )}
                </div>
                <div className="flex-col w-full mt-4 ">
                  <label
                    htmlFor=""
                    className="inline-block mb-3 text-sm font-normal text-black"
                  >
                    Quận/Huyện
                  </label>
                  <div className="relative">
                    <div className="">
                      <div
                        className={`relative px-4 py-2 rounded-md w-full outline-none ${errors?.districtCode?.message
                          ? "focus:ring-2 focus:ring-red-300 border border-red-500"
                          : "border border-slate-400 focus:border-slate-600"
                          }`}
                        onClick={() => setActiveDistric(!activeDistric)}
                      >
                        <span className="text-[16px] font-sans font-normal">
                          {address?.addressDistrict || "Quận/Huyện"}
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
                          {...register("districtCode")}
                        >
                          {district?.length > 0 &&
                            district.map((e) => {
                              return (
                                <div
                                  onClick={() =>
                                    handlerDistrictCode(e.id)
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
                      <p className="mt-1 mb-4 font-sans text-sm font-normal text-red-500">
                        Trường bắt buộc
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex-col w-full mt-4 ">
                  <label
                    htmlFor=""
                    className="inline-block mb-3 text-sm font-normal text-black"
                  >
                    Phường/Xã
                  </label>
                  <div className="relative">
                    <div className="">
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
                    </div>
                    {errors?.wardCode?.message && (
                      <p className="mt-1 mb-4 font-sans text-sm font-normal text-red-500">
                        Trường bắt buộc
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-end justify-end mt-6">
                  {/* <button
                    type="submit"
                    disabled={!isDirty}
                    className="px-3 py-2 font-serif text-base font-light text-white rounded-md cursor-pointer bg-regal-red"
                  >
                    Cập nhật thông tin
                  </button> */}
                  <Button className='!w-[200px]' hiddent={true} type={'submit'} disabled={!isDirty} loading={loadingUpdateProfile}>Cập nhật thông tin</Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </NavbarUser>}
    </>
  );
};

export default PageProfile;
