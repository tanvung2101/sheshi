import accountApis from '@/apis/accountApi'
import axiosClient from '@/apis/axiosClient'
import commissionApis from '@/apis/commissionApis'
import configDataApis from '@/apis/configDataApis'
import { COMMISSION_TYPE, MASTER_DATA_NAME } from '@/constants'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { BsFillCameraFill } from 'react-icons/bs'
import { useSelector } from 'react-redux'
import logoIcon from "../public/logosheshe.png";
import Compressor from 'compressorjs';

const NavbarUser = ({ bgPageProfile, bgPageMyOrder, bgPageMyBonus }) => {
    const { token, info } = useSelector((state) => state.account);

    const [totalBonus, setTotalBonus] = useState();
    const [level, setLevel] = useState();
    const [commissionAutomation, setCommissionAutomation] = useState()
    const [compressedFile, setCompressedFile] = useState()

    const refAvatar = useRef()


    const fetchMasterData = useCallback(async () => {
        const listLevel = await axiosClient.get('/api/master/get-master', {
            idMaster: MASTER_DATA_NAME.LEVEL_USER,
        })
        // console.log(listLevel)
        const bonus = await accountApis.countTotalBonus({ userId: info.id })
        setTotalBonus(bonus.data === 0 ? 0 : bonus)
        const level = listLevel.find(e => e.id === info.level)
        setLevel(level ? level.name : 'User')
        if (info) {
            const commissionWithLevel = await commissionApis.getlistCommissionLevel({
                idLevel: info.level
            })
            setCommissionAutomation((commissionWithLevel?.find((e) => e.commissionConfig.type === COMMISSION_TYPE.AUTOMATION))?.commissionConfig.commissionName)
        }
    }, [info])
    useEffect(() => {
        fetchMasterData()
    }, [fetchMasterData])

    const beforChangeAvatar = (e) => {
        if (e.target.files.length) {
            console.log(e.target.files)
            const file = e.target.files[0];
            if (!file) {
                return;
            }
            new Compressor(file, {
                quality: 0.6,
                success: (compressedResult) => {
                    const formData = new FormData();

                    // The third parameter is required for server
                    formData.append('file', compressedResult);
                    console.log('fgshtjrj', formData)
                    console.log(compressedResult)
                    if (compressedResult) setCompressedFile(compressedResult)
                }
            })
        } else {
            refAvatar.current.value = null;
        }
    }

    const onChangeAvater = (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("fileName", file?.name);
        console.log(formData.append("file", file))
    }

    const onGetAvatar = () => {
        let avatar = "";
        avatar = info?.userInformation?.avatar;

        if (avatar) {
            return avatar;
        }

        return logoIcon.src;
    };

    useEffect(() => {
        if (compressedFile) onChangeAvater(compressedFile)
    }, [compressedFile])
    // console.log('info', info)
    return (
        <div className="flex flex-col items-center justify-center gap-5 w-[25%] px-4">
            <div className="w-full h-[200px] rounded-md bg-[#fdf2ec] flex flex-col items-center justify-start">
                <div className="relative w-[120px] h-[120px] mt-4">
                    <Image
                        src={onGetAvatar()}
                        alt=""
                        width={10}
                        height={10}
                        className="object-cover w-full h-full rounded-full"
                    />
                    <button className="absolute bottom-0 right-0 flex items-start justify-center w-8 h-8 bg-white rounded-full">
                        <label htmlFor="image">
                            <BsFillCameraFill className="mt-[5px] text-lg"></BsFillCameraFill>
                            <form>
                                <input
                                    ref={refAvatar}
                                    id="image"
                                    type="file"
                                    accept="image/*"
                                    className="hidden imageUser"
                                    onChange={beforChangeAvatar}
                                />
                            </form>
                        </label>
                    </button>
                </div>
                <span className="text-lg font-extrabold">{info?.userInformation?.fullName}</span>
                <span className="text-base font-bold text-red-700">{level}</span>
            </div>
            <ul className="flex flex-col items-center justify-center w-full gap-4">
                <li className={`w-full p-3 border-4 rounded-md ${bgPageProfile ? 'bg-regal-red text-white' : 'bg-white text-regal-red'} border-regal-red hover:bg-regal-red  hover:text-white`}>
                    <Link
                        className="inline-block w-full text-base font-bold text-center"
                        href="/profile"
                    >
                        Trang cá nhân
                    </Link>
                </li>
                <li className={`w-full p-3 border-4 rounded-md ${bgPageMyOrder ? 'bg-regal-red text-white' : 'bg-white text-regal-red'} border-regal-red hover:bg-regal-red  hover:text-white`}>
                    <Link
                        className="inline-block w-full text-base font-bold text-center"
                        href="/my-order"
                    >
                        Đơn hàng của tôi
                    </Link>
                </li>
                <li className={`w-full p-3 border-4 rounded-md ${bgPageMyBonus ? 'bg-regal-red text-white' : 'bg-white text-regal-red'} border-regal-red hover:bg-regal-red  hover:text-white`}>
                    <Link
                        className="inline-block w-full text-base font-bold text-center"
                        href="/my-bonus"
                    >
                        Lịch sử thưởng
                    </Link>
                </li>
            </ul>
        </div>
    )
}

export default NavbarUser