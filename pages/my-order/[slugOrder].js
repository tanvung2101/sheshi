import commissionApis from '@/apis/commissionApis'
import orderApis from '@/apis/orderApis'
import NavbarUser from '@/components/NavbarUser'
import OrderContent from '@/components/OrderContent'
import { COMMISSION_TYPE, MASTER_DATA_NAME, STATUS_ORDER } from '@/constants'
import { useLocation } from '@/hook/useLocation'
import axios from 'axios'
import moment from 'moment'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'
import { BsFillCameraFill } from 'react-icons/bs'
import { useSelector } from 'react-redux'
import Swal from 'sweetalert2'

async function fetchMasterCapacity(params) {
    const res = await axios.get(`http://localhost:3001/api/master`, {
        params: {
            idMaster: params,
        },
    });
    return res.data.rows;
}

const PageSlugOrder = () => {
    const router = useRouter()
    const { token, info } = useSelector((state) => state.account);
    // console.log(info)
    // console.log(router.query.slugOrder)

    // const [slug, setSlug] = useState(router.query.slugOrder)
    const [masterCapacity, setMasterCapacity] = useState();
    const [masterUnit, setMasterUnit] = useState();
    const [masterOrderStatus, setMasterOrderStatus] = useState();
    const [orderList, setOrderList] = useState([]);
    const [orderDetail, setOrderDetail] = useState()
    // console.log('orderDetail', orderDetail)
    const [product, setProduct] = useState([]);
    const [commission, setCommission] = useState()


    const fetchMasterData = async () => {
        const masterOrder = await fetchMasterCapacity(
            MASTER_DATA_NAME.STATUS_ORDER
        );
        const DataMasterCapacity = await fetchMasterCapacity(
            MASTER_DATA_NAME.CAPACITY_PRODUCT
        );
        const DataMasterUnit = await fetchMasterCapacity(
            MASTER_DATA_NAME.UNIT_PRODUCT
        );
        setMasterCapacity(DataMasterCapacity);
        setMasterUnit(DataMasterUnit);
        setMasterOrderStatus(masterOrder);

    };

    const address = useLocation(orderDetail?.cityCode, orderDetail?.districtCode, orderDetail?.wardCode)
    // console.log(address)

    const fetchOrderList = useCallback(async () => {
        let cartItemsInfo = []
        const productOption = [];
        if (!router.query.slugOrder) return
        const orderUser = await orderApis.getOrderByOrderCode({
            orderCode: router.query.slugOrder
        });
        if (info?.id !== orderUser?.userId) {
            return
        }
        if (orderUser) {
            await Promise.all(orderUser?.orderItem.map(async (item) => {
                const params = {
                    productId: item.productId,
                    id: item.subProductId,
                };
                const data = await axios.get(
                    "http://localhost:3001/api/product/get-capacity-product",
                    { params }
                );
                cartItemsInfo.push(data.data);
            }))
        }
        if (masterCapacity?.length > 0) {
            cartItemsInfo.map((e) => {
                // console.log("capacity", e);
                const capacity = masterCapacity?.find((cap) => cap.id === e.capacityId)?.name;
                const unit = masterUnit?.find((un) => un.id === e.unitId)?.name;
                productOption.push({
                    name: capacity + " " + unit,
                    id: e.id,
                    productId: e.productId,
                });
                setProduct(productOption);
            });
        }
        setOrderDetail(orderUser)
        // console.log('masterCapacity', masterCapacity)
        // console.log('cartItemsInfo', cartItemsInfo)
        // console.log('product', product)
        // console.log(orderList)
        // setOrderList(orderList)
    }, [info, masterCapacity, masterUnit, router])

    const cancelOrder = async () => {
        const body = {
            status: STATUS_ORDER.REJECT,
            productDetail: orderDetail.orderItem,
        }
        Swal.fire({
            title: 'Bạn thật sự',
            text: "muốn huỷ đơn hàng không ?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        }).then(async (result) => {
            if (result.isConfirmed) {
                orderApis.cancelOrder(orderDetail.id, body)
                    .then(() => { })
                    .catch(err => toast.error(err.mesage))
                    .finally(() => {
                        fetchOrderList()
                    });
                Swal.fire(
                    'Deleted!',
                    'Your file has been deleted.',
                    'success'
                )
            }
        })
        // return orderApis.cancelOrder(order.id, body)
        // .then(() => toast.success('Bạn đã huỷ đơn hành thành công'))
        // .catch(err => toast.error(err.mesage))
        // .finally(() => {
        //   getCartItemsInfo()
        // });
    }


    useEffect(() => {
        fetchMasterData();
    }, []);
    useEffect(() => {
        fetchOrderList();
    }, [fetchOrderList])

    const getListCommission = useCallback(async () => {
        const listCommission = await commissionApis.getlistCommissionLevel({
            idLevel: info ? info.level : 0,
            type: COMMISSION_TYPE.AUTOMATION
        })
        setCommission(info ? listCommission[0].commissionConfig.percent : null)
    }, [info])
    useEffect(() => {
        getListCommission()
    }, [getListCommission])
    // console.log('commisstion, ', commission)
    return (
        <>

            <NavbarUser bgPageMyOrder={true}>
                <div className="w-[75%] flex-col items-start max-md:w-full">
                    <div className="flex flex-col items-center ">
                        <h4 className="text-[22px]">Chi tiết đơn hàng</h4>
                        {!!orderDetail ? (
                            <div className="flex flex-col py-8 w-full ">
                                <div className="flex items-center justify-between max-md:items-start">
                                    <div className="flex flex-col items-start justify-center gap-4 mb-14">
                                        <span>
                                            Hóa đơn: <strong>{orderDetail && `#${orderDetail.orderCode}`}</strong>
                                        </span>
                                        <span>
                                            Đặt ngày{" "}
                                            {orderDetail &&
                                                moment(orderDetail?.orderDate).format(
                                                    "DD-MM-YYY h:mm:ss"
                                                )}
                                        </span>
                                        <span>
                                            Trạng thái đơn hàng:{" "}
                                            {orderDetail &&
                                                masterOrderStatus?.find(
                                                    (e) => e.id === orderDetail.orderStatus
                                                )?.name}
                                        </span>
                                    </div>
                                    <button
                                        disabled={
                                            orderDetail?.orderStatus !== STATUS_ORDER.WAITTING_CONFIRM
                                        }
                                        onClick={() => cancelOrder()}
                                        className={`relative px-3 py-2 font-serif text-base font-light text-white border rounded-md bg-regal-red 
                ${orderDetail?.orderStatus !== STATUS_ORDER.WAITTING_CONFIRM
                                                ? "cursor-not-allowed after:content-[''] after:absolute after:top-0 after:left-0 after:w-full after:h-full after:bg-slate-200 after:bg-opacity-30"
                                                : ""
                                            }`}
                                    >
                                        <span>Hủy đơn hàng</span>
                                    </button>
                                </div>
                                <OrderContent
                                    orderSearchItem={orderDetail}
                                    address={address}
                                ></OrderContent>
                                <div className="w-full mt-10">
                                    <div className="flex w-full">
                                        <div className="flex flex-col w-[15%] max-md:hidden">
                                            <div className="bg-[#fdf2ec] pt-2 pb-4 px-2 w-full">
                                                <p className="uppercase text-[15px] font-normal">Hình</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col w-[40%] max-md:w-[85%]">
                                            <div className="bg-[#fdf2ec] pt-2 pb-4 w-full max-md:pl-4">
                                                <p className="uppercase text-[15px] font-normal">sản phẩm</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col w-[5%] max-md:w-[15%]">
                                            <div className="bg-[#fdf2ec] pt-2 pb-4 pr-2 w-full">
                                                <p className="uppercase text-[15px] font-normal">sl</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col w-[25%] max-md:hidden">
                                            <div className="bg-[#fdf2ec] pt-2 pb-4 pr-2 w-full">
                                                <p className="uppercase text-[15px] font-normal text-center">
                                                    giá
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col w-[15%] max-md:hidden">
                                            <div className="bg-[#fdf2ec] pt-2 pr-2 pb-4">
                                                <p className="uppercase text-[15px] font-normal float-right">
                                                    tạm tính
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    {orderDetail &&
                                        orderDetail.orderItem?.map((item, index) => (
                                            <div
                                                key={index}
                                                className="flex pb-3 w-full border-b-[1px] border-b-gray-300"
                                            >
                                                <div className="flex flex-col w-[15%] max-md:hidden">
                                                    <div className="px-2 mt-3">
                                                        <Image
                                                            src={item?.product.productImage[0]?.image}
                                                            alt=""
                                                            width={80}
                                                            height={50}
                                                            className="w-[60px] h-[50px] object-cover"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col w-[40%] max-md:w-[85%]">
                                                    <div className="flex flex-col mt-3 max-md:pl-4">
                                                        <p className="text-lg text-regal-red hover:text-[#ecbe26]">
                                                            <Link href={`/san-pham/${item?.product.productSlug}`}>
                                                                {item?.product.name}
                                                            </Link>
                                                        </p>
                                                        <p className="text-lg">
                                                            Kích cỡ:{" "}
                                                            {
                                                                product?.find(
                                                                    (e) =>
                                                                        e.id === item.subProductId &&
                                                                        e.productId &&
                                                                        item.productId
                                                                )?.name
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col w-[5%]">
                                                    <div className="flex flex-col mt-3">
                                                        <span className="text-lg">
                                                            {orderDetail &&
                                                                orderDetail.orderItem[0]?.quantity}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col w-[25%] max-md:hidden">
                                                    <div className="flex flex-col mt-3">
                                                        <p className="text-lg text-center">
                                                            {item?.price?.toLocaleString("vi", {
                                                                style: "currency",
                                                                currency: "VND",
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col w-[15%] max-md:hidden">
                                                    <div className="flex flex-col px-2 mt-3 ">
                                                        <p className="text-lg text-right">
                                                            {item?.price?.toLocaleString("vi", {
                                                                style: "currency",
                                                                currency: "VND",
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    <div className="w-full mt-2 mb-10">
                                        <div className="flex flex-col w-[33%] float-right max-md:w-[65%] max-sm:w-[90%]">
                                            <div className="flex items-center justify-between w-full pr-2">
                                                <span className="text-lg font-normal text-right text-black">
                                                    Tạm tính
                                                </span>
                                                <span className="text-lg font-normal text-black">
                                                    {orderDetail &&
                                                        (orderDetail?.totalBeforeFee || 0).toLocaleString(
                                                            "vi",
                                                            {
                                                                style: "currency",
                                                                currency: "VND",
                                                            }
                                                        )}
                                                </span>
                                            </div>
                                            {!!orderDetail !== 0 && orderDetail?.commission && <div className="flex items-center justify-between w-full pr-2 mt-5">
                                                <span className=" text-lg font-normal text-black">
                                                    Hoa hồng cấp đại lý
                                                </span>
                                                <span className="text-lg font-normal text-black">
                                                    {orderDetail?.commission
                                                        ?.toLocaleString("vi", {
                                                            style: "currency",
                                                            currency: "VND",
                                                        })}
                                                </span>
                                            </div>}
                                            {!!orderDetail !== 0 && orderDetail?.shipId && <div className="flex items-center justify-between w-full pr-2 mt-5">
                                                <span className="text-lg font-normal text-black">
                                                    Phí vận chuyển
                                                </span>
                                                <span className="text-lg font-normal text-black">
                                                    {(
                                                        orderDetail?.total -
                                                        orderDetail?.totalBeforeFee +
                                                        (orderDetail?.commission
                                                            ? orderDetail?.commission
                                                            : 0)
                                                    )?.toLocaleString("vi", {
                                                        style: "currency",
                                                        currency: "VND",
                                                    })}
                                                </span>
                                            </div>}
                                            <div className="flex items-center justify-between w-full pr-2 mt-5">
                                                <span className="text-lg font-medium text-regal-red">
                                                    Thành tiền
                                                </span>
                                                <span className="text-lg font-medium no-underline text-regal-red">
                                                    {orderDetail &&
                                                        (orderDetail.total || 0).toLocaleString("vi", {
                                                            style: "currency",
                                                            currency: "VND",
                                                        })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            ""
                        )}
                    </div>
                </div>
            </NavbarUser>


        </>
    )
}

export default PageSlugOrder