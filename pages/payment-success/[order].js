import orderApis from "@/apis/orderApis";
import Image from "next/image";
import { useRouter } from "next/router";
import { AiOutlineCheck } from "react-icons/ai";
import { useEffect, useState, useCallback } from "react";
import { MASTER_DATA_NAME } from "@/constants";
import axios from "axios";

// SHESHI000351

async function fetchMasterCapacity(params) {
  const res = await axios.get(`http://localhost:3001/api/master`, {
    params: {
      idMaster: params,
    },
  });
  return res.data.rows;
}

function PagePaymentSucces({orderCode}) {
  const { query } = useRouter();
  const [order, setOrder] = useState();
  const [masterCapacity, setMasterCapacity] = useState();
  const [masterUnit, setMasterUnit] = useState();


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
    setOrder(orderCode);
  }, [orderCode]);

  console.log(order)
  return (
    <>
      {order && <div className="mt-10 px-80">
    <div className="flex flex-col items-center">
      <div className="w-28 h-28 bg-[#f6f6f6] rounded-full flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-14 h-14 mb-4 text-regal-red"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 12.75l6 6 9-13.5"
          />
        </svg>
      </div>
      <h3 className="uppercase mt-4 font-sans">thank you</h3>
      <div className="mb-4">
        <span className="text-lg font-sans">
          Đơn đặt hàng của bạn đã hoàn tất.
        </span>
      </div>
      <div className="flex flex-col items-center gap-1 text-lg font-extralight">
        <span>
          ORDER: <strong>{query.order}</strong>
        </span>
        <span>Chúng tôi đã xác nhận đơn hàng của bạn.</span>
        <span>
          Nếu có bất kỳ thắc mắc về đơn hàng của bạn, vui lòng liên hệ với
          chúng tôi hoặc dùng chức năng theo dõi đơn hàng
        </span>
      </div>
    </div>
    <div className="my-14 flex flex-col items-center ">
      <h4 className="text-[22px]">Chi tiết đơn hàng</h4>
      <div className="flex items-start justify-center gap-5">
        <div>
          <div className="py-2 px-[60px] border-b-[1px] border-b-gray-300">
            <span className="uppercase font-bold text-[16px]">
              địa chỉ nhận hàng
            </span>
          </div>
          {order.length !== 0 && <p className="text-center text-base font-normal leading-6 tracking-widest">
            {order.address} <br /> Phường Khương Thượng, <br /> Quận Đống Đa{" "}
            <br /> Hà Nội <br />
            0657676878
          </p>}
        </div>
        <div>
          <div className="py-2 px-[60px] border-b-[1px] border-b-gray-300">
            <span className="uppercase font-bold text-[16px]">
              ĐƠN VỊ GIAO HÀNG
            </span>
          </div>
          <p className="text-center text-base font-normal leading-6 tracking-widest">
            Giao hàng nhanh
          </p>
        </div>
        <div>
          <div className="py-2 px-[60px] border-b-[1px] border-b-gray-300">
            <span className="uppercase font-bold text-[16px]">
              PHƯƠNG THỨC THANH TOÁN
            </span>
          </div>
          <p className="text-center text-base font-normal leading-6 tracking-widest">
            Thanh toán bằng tiền mặt
          </p>
        </div>
        <div>
          <div className="py-2 px-[60px] border-b-[1px] border-b-gray-300">
            <span className="uppercase font-bold text-[16px]">GHI CHÚ</span>
          </div>
          <p className="text-center text-base font-normal leading-6 tracking-widest">
            Thanh toán bằng tiền mặt
          </p>
        </div>
      </div>
      <div className="mt-10 flex w-full pb-3 border-b-[1px] border-b-gray-300">
        <div className="flex flex-col w-[15%]">
          <div className="bg-[#fdf2ec] pt-2 pb-4 px-2 w-full">
            <span className="uppercase text-[15px] font-normal">Hình</span>
          </div>
          <div className="mt-3 px-2">
           {order.length !==0 && <Image
              src={order.orderItem[0].product?.productImage[0].image}
              alt=""
              width={80}
              height={100}
              className="w-[80px] h-[90px] object-cover" />}
          </div>
        </div>
        <div className="flex flex-col w-[45%]">
          <div className="bg-[#fdf2ec] pt-2 pb-4 w-full">
            <span className="uppercase text-[15px] font-normal">
              sản phẩm
            </span>
          </div>
          <div className="mt-3 flex flex-col">
            <p className="text-lg text-regal-red hover:text-[#ecbe26]">
              {order.length !==0 && order.orderItem[0].product?.name}
            </p>
            <p className="text-lg">Kích cỡ: 200 ML</p>
          </div>
        </div>
        <div className="flex flex-col w-[5%]">
          <div className="bg-[#fdf2ec] pt-2 pb-4 pr-2 w-full">
            <p className="uppercase text-[15px] font-normal">sl</p>
          </div>
          <div className="mt-3 flex flex-col">
            <span className="text-lg">{order.length !==0 && order.orderItem[0].quantity}</span>
          </div>
        </div>
        <div className="flex flex-col w-[25%]">
          <div className="bg-[#fdf2ec] pt-2 pb-4 pr-2 w-full">
            <p className="uppercase text-[15px] font-normal text-center">
              giá
            </p>
          </div>
          <div className="mt-3 flex flex-col">
            <p className="text-lg text-center">{order.length !==0 && order?.totalBeforeFee}</p>
          </div>
        </div>
        <div className="flex flex-col w-[10%]">
          <div className="bg-[#fdf2ec] pt-2 pr-2 pb-4">
            <p className="uppercase text-[15px] font-normal float-right">
              tạm tính
            </p>
          </div>
          <div className="mt-3 px-2 flex flex-col ">
            <p className="text-lg text-right">{order.length !==0 && order?.totalBeforeFee}</p>
          </div>
        </div>
      </div>
      <div className="w-full mt-2">
        <div className="flex flex-col w-[25%] float-right">
          <div className="flex items-center justify-between pr-2 w-full">
            <span className='font-normal text-lg text-right text-black'>Tạm tính</span>
            <span className='font-normal text-lg text-black'>{order?.totalBeforeFee.toLocaleString('vi', {style : 'currency', currency : 'VND'})}</span>
          </div>
          <div className="flex items-center justify-between pr-2 w-full mt-5">
            <span className='font-normal text-lg text-black'>Phí vận chuyển</span>
            <span className='font-normal text-lg text-black'>{(order?.total - order?.totalBeforeFee).toLocaleString('vi', {style : 'currency', currency : 'VND'})}</span>
          </div>
          <div className="flex items-center justify-between pr-2 w-full mt-5">
            <span className='font-medium text-lg text-regal-red'>Thành tiền</span>
            <span className='font-medium text-lg text-regal-red'>{order?.total.toLocaleString('vi', {style : 'currency', currency : 'VND'})}</span>
          </div>
        </div>
      </div>
    </div>
  </div> }
    </>
  );
}

export async function getStaticPaths() {
  return {
    paths: [
      {
        params: {
          order: 'SHESHI000358',
        },
      }, 
    ],
   fallback: true,
  };
}

export async function getStaticProps(context){
  const {order} = context.params;
  const params = order
  const orderCode = await axios.get(`http://0.0.0.0:3001/api/order/search-order?orderCode=${order}`)
  console.log(orderCode.data)
  return {
    props: { orderCode: orderCode.data},
  };
}

export default PagePaymentSucces;
