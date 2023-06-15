import NavbarUser from '@/components/NavbarUser';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import { BsFillCameraFill } from 'react-icons/bs';
import { useSelector } from 'react-redux';


const PageMyBonus = () => {
    const { token, info } = useSelector((state) => state.account);
    return (
        <>
            <div className="flex items-start justify-center px-24 mt-8 mb-20">
                <NavbarUser bgPageMyBonus={true}></NavbarUser>
                <div className="w-[75%] flex-col items-start">

                </div>
            </div>
        </>
    )
}

export default PageMyBonus