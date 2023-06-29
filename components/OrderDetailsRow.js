import React from 'react'

const OrderDetailsRow = () => {
    return (
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
    )
}

export default OrderDetailsRow