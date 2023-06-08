import { DELIVERY_METHOD_MAP, PAYMENT_METHOD_MAP } from "@/constants";
import React from "react";

const OrderContent = ({ orderSearchItem, address }) => {
  return (
    <div className="flex items-start gap-8">
      <div>
        <div className="py-2 border-b-[1px] border-b-gray-300">
          <p className="uppercase font-bold text-[16px] text-center">
            địa chỉ nhận hàng
          </p>
        </div>
        {orderSearchItem && (
          <div className="flex flex-col items-center">
            <span className="text-base font-medium text-center">
              {orderSearchItem.address}
            </span>
            <span className="text-base font-medium text-center">
              {address.addressWard}
            </span>
            <span className="text-base font-medium text-center">
              {address.addressDistrict}
            </span>
            <span className="text-base font-medium text-center">
              {address.addressCity}
            </span>
            <span className="text-base font-medium text-center">
              {orderSearchItem?.telephone}
            </span>
          </div>
        )}
      </div>
      <div>
        <div className="py-2 px-[60px] border-b-[1px] border-b-gray-300">
          <span className="uppercase font-bold text-[16px]">
            ĐƠN VỊ GIAO HÀNG
          </span>
        </div>
        <p className="text-base font-medium leading-6 text-center">
          {orderSearchItem &&
            DELIVERY_METHOD_MAP.find((e) => e.value === orderSearchItem.shipId)?.label}
        </p>
      </div>
      <div>
        <div className="py-2 px-[60px] border-b-[1px] border-b-gray-300">
          <span className="uppercase font-medium text-[16px]">
            phương thức thanh toán
          </span>
        </div>
        <p className="text-base font-medium leading-6 text-center">
          {orderSearchItem &&
            PAYMENT_METHOD_MAP.find(
              (e) => e.value === orderSearchItem?.orderPayment?.paymentMethod
            )?.label}
        </p>
      </div>
      <div>
        <div className="py-2 px-[60px] border-b-[1px] border-b-gray-300">
          <span className="uppercase font-bold text-[16px]">GHI CHÚ</span>
        </div>
        <p className="text-base font-normal leading-6 text-center">
          {orderSearchItem?.note}
        </p>
      </div>
    </div>
  );
};

export default OrderContent;
