import React from 'react'
import Modal from './Modal'
import { AiOutlineClose } from 'react-icons/ai'
import { createPortal } from 'react-dom';

const ModalWithdraw = () => {
    return (

        <Modal>
            <div className="absolute bg-white rounded-md top-24">
                {/* <div className="relative pb-4 mt-3 px-44 border-b-[1px] border-b-gray-300">
                    <h3 className="text-right text-lg font-bold">Chon ma vung</h3>
                    <label
                        className="absolute top-0 right-0 -translate-x-[10px] cursor-pointer"
                        htmlFor="my_modal_7"
                    //   show={show}
                    >
                        <AiOutlineClose className="text-3xl text-gray-400 hover:text-black"></AiOutlineClose>
                    </label>
                </div> */}
            </div>
        </Modal>

    )
}

export default ModalWithdraw