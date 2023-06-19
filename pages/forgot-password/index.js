import { Button, Input } from '@/components'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import { BiErrorCircle } from 'react-icons/bi'
import { BsArrowReturnLeft } from 'react-icons/bs'
import { useForm, useWatch } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import InputOtp from '@/components/InputOtp'
import InputPassword from '@/components/InputPassword'
import { useRouter } from 'next/router'
import accountApis from '@/apis/accountApi'
import AuthApis from '@/apis/authApis'
import { OTP_CODE_TYPE } from '@/constants'
import { toast } from 'react-toastify'

const schema = yup
    .object({
        email: yup.string().email().required('Trường bắt buộc').max(255).matches(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Email không đúng định đạng').trim(),
        emailVerified: yup.bool().required().default(false),
        otpCode: yup.string().when('emailVerified', {
            is: true,
            then: () => yup.string().length(6).required().trim(),
        }),
        password: yup.string().when('emailVerified', {
            is: true,
            then: () => yup.string().required().min(6).max(30).trim(),
        }),
        rePassword: yup.string().when('password', {
            is: (val) => (val && val.length > 0 ? true : false),
            then: () => yup.string().oneOf([yup.ref('password')], 'Mật khẩu không đúng')
        })
    })
    .required()

const PageForgotPassword = () => {
    const refCountdownOtp = useRef();
    const router = useRouter()

    const [loading, setLoading] = useState(false);
    const [loadingSentcodeEmail, setLoadingSentcodeEmail] = useState(false)
    const [countdownEmail, setCountEmail] = useState(60)
    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
        trigger,
        setValue,
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            emailVerified: false
        }
    })

    const { emailVerified, email, otpCode } = useWatch({
        control
    })

    const onSendEmailOTP = () => {
        setLoadingSentcodeEmail(true);
        AuthApis.sendOTP({
            email: (email || '').trim(),
            type: OTP_CODE_TYPE.FORGOT_PASSWORD
        }).then(() => {
            setCountEmail((preCount) => preCount - 1)
            clearInterval(refCountdownOtp.current)
            refCountdownOtp.current = setInterval(() => {
                setCountEmail((preCount) => preCount - 1)
            }, 1000)
            setValue('emailVerified', true, { shouldValidate: true })
        }).catch((err) => console.log(err))
            .finally(() => setLoadingSentcodeEmail(false))
    }
    const onSubmit = (data) => {
        const { email, otpCode, password, rePassword } = data;
        console.log(data)
        setLoading(true)
        setLoadingSentcodeEmail(true)
        if (!data.emailVerified) {
            AuthApis.sendOTP({
                email: data.email,
                type: OTP_CODE_TYPE.FORGOT_PASSWORD
            }).then(() => {
                setCountEmail((preCount) => preCount - 1)
                clearInterval(refCountdownOtp.current)
                setValue('emailVerified', true, { shouldValidate: true })
                refCountdownOtp.current = setInterval(() => {
                    setCountEmail((preCount) => preCount - 1)
                }, 1000)
            }).catch((err) => console.log(err))
                .finally(() => {
                    setLoadingSentcodeEmail(false)
                    setLoading(false)
                })
        } else {
            AuthApis.resetPassword({
                email,
                otpCode,
                password,
                rePassword
            })
                .then(() => {
                    toast.success('Khôi phụ mật khẩu thành công')
                    router.push('/login')
                })
                .catch(() => toast.error('Mã code sai'))
                .finally(() => {
                    setLoading(false)
                    setLoadingSentcodeEmail(false)
                })
        }
    }

    useEffect(() => {
        if (countdownEmail === 0) {
            clearInterval(refCountdownOtp.current)
            setCountEmail(60)
        }
    }, [countdownEmail])
    return (
        <div className='bg-[#fdf2ec] flex items-center justify-center px-16'>
            <div className='w-[32%] flex flex-col items-start justify-center gap-4 my-12 px-8 bg-white'>
                <div className='mt-8'>
                    <h3 className='text-[26px] pb-2'>Quên mật khẩu</h3>
                </div>
                <div className='w-full'>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className='flex flex-col items-start justify-center gap-2 w-full mb-10'>
                            {emailVerified && <InputOtp
                                value={otpCode || ''}
                                onChange={(value) => setValue('otpCode', value, { shouldValidate: true })}
                                countdown={countdownEmail}
                                errors={errors?.otpCode?.message}
                                loading={loadingSentcodeEmail}
                                disabledSend={errors?.email}
                                onSendOTP={async () => {
                                    const isVaildEmail = await trigger('email')

                                    if (isVaildEmail) {
                                        onSendEmailOTP()
                                    }
                                }}
                            >
                            </InputOtp>}
                            <label className='font-normal'>Email</label>
                            <div className='relative w-full'>
                                <Input {...register('email')} disabled={emailVerified} autoComplete="off" className='h-[45px]' placeholder='Nhập email của bạn' errors={errors?.email?.message} />
                                <span className='pt-1 text-sm text-red-500'>{errors?.email?.message}</span>
                                {errors?.email?.message && <span className="absolute top-0 right-0 -translate-x-1/2 translate-y-1/2">
                                    <BiErrorCircle className="text-lg text-red-500" />
                                </span>}
                            </div>
                            {emailVerified && <InputPassword {...register('password')} label='Mật khẩu' placeholder='Nhập mật khẩu của bạn' errors={errors?.password?.message}></InputPassword>}
                            {emailVerified && <InputPassword {...register('rePassword')} label='Xác nhận mật khẩu' placeholder='Xác nhận mật khẩu' errors={errors?.rePassword?.message}></InputPassword>}
                        </div>
                        <Button hiddent={true} loading={loading}>Tiếp tục</Button>
                        <Link href='/login' className='flex items-center justify-start gap-2 mt-4 pb-8 text-regal-red hover:text-yellow-300'>
                            <BsArrowReturnLeft></BsArrowReturnLeft>
                            <span className='text-base'>Trở lại đăng nhập</span>
                        </Link>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default PageForgotPassword