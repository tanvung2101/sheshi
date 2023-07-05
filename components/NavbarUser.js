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
import commonApis from '@/apis/commonApis'
import imageCompression from 'browser-image-compression';
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'

const NavbarUser = ({ bgPageProfile, bgPageMyOrder, bgPageMyBonus, children }) => {
    const { t } = useTranslation('transitions');
    const { token, info } = useSelector((state) => state.account);
    const router = useRouter()

    const [totalBonus, setTotalBonus] = useState();
    const [level, setLevel] = useState();
    const [commissionAutomation, setCommissionAutomation] = useState()
    const [compressedFile, setCompressedFile] = useState()

    const [avatar, setAvatar] = useState();
    const [avatarPreview, setAvatarPreview] = useState();

    const refAvatar = useRef()



    const fetchMasterData = useCallback(async () => {
        const listLevel = await axiosClient.get('/api/master/get-master', {
            idMaster: MASTER_DATA_NAME.LEVEL_USER,
        })
        // console.log(listLevel)
        const bonus = await accountApis.countTotalBonus({ userId: info?.id })
        setTotalBonus(bonus?.data === 0 ? 0 : bonus)
        const level = listLevel.find(e => e.id === info?.level)
        setLevel(level ? level?.name : 'User')
        if (info) {
            const commissionWithLevel = await commissionApis.getlistCommissionLevel({
                idLevel: info?.level
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
                    if (compressedResult) setCompressedFile(compressedResult)
                }
            })
        } else {
            refAvatar.current.value = null;
        }
    }

    const onChangeAvater = useCallback((file) => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append("fileName", file.name);
        try {
            commonApis.preUploadFile(file).then(async (response) => {
                const payloadUpdateProfile = {
                    avatar: response,
                    id: info?.id,
                    fullName: info?.userInformation?.fullName
                }
                console.log(payloadUpdateProfile)
            })
        } catch (error) {

        }
    }, [info?.id, info?.userInformation?.fullName])

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
    }, [compressedFile, onChangeAvater])
    // console.log('info', info)

    async function handleImageUpload(event) {

        const imageFile = event.target.files[0];
        console.log('originalFile instanceof Blob', imageFile instanceof Blob); // true
        console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);

        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
        }
        try {
            const compressedFile = await imageCompression(imageFile, options);
            console.log('compressedFile instanceof Blob', compressedFile instanceof Blob); // true
            console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB

            console.log(compressedFile)
            await commonApis.preUploadFile(compressedFile).then(async (response) => {
                const payloadUpdateProfile = {
                    avatar: response,
                    id: info?.id,
                    fullName: info?.userInformation?.fullName
                }
                console.log(payloadUpdateProfile)
            }); // write your own logic
        } catch (error) {
            console.log(error);
        }

    }

    // useEffect(() => {
    //     if (!token) {
    //         const routerToken = setTimeout(() => {
    //             router.push('/')
    //         }, 500)
    //         return () => {
    //             clearTimeout(routerToken);
    //         };
    //     }
    //     return null
    // }, [router, token])

    return (
        <>
            <div className="flex items-start justify-center gap-5 px-24 mt-8 mb-20 max-lg:px-8 max-md:flex-col max-md:px-3 max-sm:mb-8">
                <div className="flex flex-col items-center justify-center gap-5 w-[25%] max-:w-full max-md:w-full">
                    <div className="w-full h-[200px] rounded-md bg-[#fdf2ec] flex flex-col items-center justify-start">
                        <div className="relative w-[120px] h-[120px] mt-4">
                            <Image
                                src={onGetAvatar()}
                                alt=""
                                width={100}
                                height={100}
                                className="object-cover w-full h-full rounded-full"
                            />
                            <button className="absolute bottom-0 right-0 flex items-start justify-center w-8 h-8 bg-white rounded-full">
                                <label htmlFor="image">
                                    <BsFillCameraFill className="mt-[5px] text-lg"></BsFillCameraFill>
                                    {/* <form> */}
                                    <input
                                        // ref={refAvatar}
                                        id="image"
                                        type="file"
                                        name='avatar'
                                        accept="image/*"
                                        className="hidden imageUser"
                                        onChange={handleImageUpload}
                                    />
                                    {/* </form> */}
                                </label>
                            </button>
                        </div>
                        <span className="text-lg font-extrabold">{info?.userInformation?.fullName}</span>
                        <span className="text-base font-bold text-red-700">{level}</span>
                    </div>
                    <ul className="flex flex-col items-center justify-center w-full gap-4">
                        <li className={`w-full p-3 border-4 rounded-md transition-all ${bgPageProfile ? 'bg-regal-red text-white' : 'bg-white text-regal-red'} border-regal-red hover:bg-regal-red  hover:text-white max-lg:py-1`}>
                            <Link
                                className="inline-block w-full text-base font-bold text-center"
                                href="/profile"
                                prefetch={true}
                            >
                                Trang cá nhân
                            </Link>
                        </li>
                        <li className={`w-full p-3 border-4 rounded-md transition-all ${bgPageMyOrder ? 'bg-regal-red text-white' : 'bg-white text-regal-red'} border-regal-red hover:bg-regal-red  hover:text-white max-lg:py-1`}>
                            <Link
                                className="inline-block w-full text-base font-bold text-center"
                                href="/my-order"
                                prefetch={true}
                            >
                                Đơn hàng của tôi
                            </Link>
                        </li>
                        <li className={`w-full p-3 border-4 rounded-md transition-all ${bgPageMyBonus ? 'bg-regal-red text-white' : 'bg-white text-regal-red'} border-regal-red hover:bg-regal-red  hover:text-white max-lg:py-1`}>
                            <Link
                                className="inline-block w-full text-base font-bold text-center"
                                href="/my-bonus"
                                prefetch={true}
                            >
                                Lịch sử thưởng
                            </Link>
                        </li>
                    </ul>
                </div>
                {children}
            </div>
        </>
    )
}

export default NavbarUser