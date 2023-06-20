import configDataApis from '@/apis/configDataApis';
import orderApis from '@/apis/orderApis';
import NavbarUser from '@/components/NavbarUser';
import { MASTER_DATA_NAME } from '@/constants';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { BsFillCameraFill } from 'react-icons/bs';
import { useSelector } from 'react-redux';


const PageMyOrder = () => {
    const { token, info } = useSelector((state) => state.account);
    const router = useRouter();

    const [orderList, setOrderList] = useState([])
    const [masterOrderStatus, setMasterOrderStatus] = useState()
    const fetchMasterData = async () => {
        const masterOrder = await axios.get('http://localhost:3001/api/master/get-master', {
            idMaster: MASTER_DATA_NAME.STATUS_ORDER
        })
        // console.log(masterOrder.data)
        setMasterOrderStatus(masterOrder.data)
    }
    console.log('masterOrderStatus', masterOrderStatus)
    const fetchOrderList = async () => {
        const orderList = await orderApis.getOrderUser();
        console.log('orderList', orderList)
        setOrderList(orderList)
    }

    useEffect(() => {
        fetchMasterData()
        fetchOrderList()
    }, [])

    useEffect(() => {
        if (!token) return router.push('/', undefined, { shallow: true })
    }, [router, token])
    return (
        <>
            {token && <NavbarUser bgPageMyOrder={true}>
                <div className="w-[75%] flex-col items-start">
                    <h3 className='text-[25px] pb-8'>Đơn hàng của tôi</h3>
                    {orderList && orderList.map(item =>
                        <div key={item.id} className='flex items-center justify-between bg-white p-4 drop-shadow-xl'>
                            <div className='flex flex-col items-start gap-2'>
                                <p className='text-2xl font-bold'>Đơn hàng {`#${item?.orderCode}`}</p>
                                <p className='font-normal font-serif'>Tổng giá trị: {item?.total.toLocaleString("vi", {
                                    style: "currency",
                                    currency: "VND",
                                })}</p>
                                <p className='font-normal font-serif'>Tình trạng: <span className='text-green-700'>{masterOrderStatus && masterOrderStatus.find((mas => mas.id === item.orderStatus))?.name}</span></p>
                            </div>
                            <div className='self-end flex items-end pr-28'>
                                <Link href={`my-order/${item?.orderCode}`} className='uppercase text-base font-bold text-regal-red transition-all hover:text-yellow-300'>Xem chi tiết</Link>
                            </div>
                        </div>
                    )}
                    {/* <div className='flex items-center justify-between bg-white p-4 drop-shadow-xl'>
                        <div className='flex flex-col items-start gap-2'>
                            <p className='text-2xl font-bold'>Đơn hàng #SHESHI000058</p>
                            <p className='font-normal font-serif'>Tổng giá trị: 4,501,250đ</p>
                            <p className='font-normal font-serif'>Tình trạng: Đơn hàng đợi xác nhận</p>
                        </div>
                        <div className='self-end flex items-end pr-28'>
                            <p className='uppercase text-base font-bold text-regal-red transition-all hover:text-yellow-300'>Xem chi tiết</p>
                        </div>
                    </div> */}
                </div>
            </NavbarUser>}
        </>
    )
}

export default PageMyOrder