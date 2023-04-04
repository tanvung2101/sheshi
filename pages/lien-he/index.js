import { Input, SEO, Title } from "@/components";
import Head from "next/head";
import React from "react";

const LienHe = () => {
  return (
    <>
      <SEO title="LIÊN HỆ VỚI SHESHI"></SEO>
      {/* <Head>
        <link rel="icon" href="/logosheshe.png" />
        <title>LIÊN HỆ SHESHI</title>
      </Head> */}
      <div className="bg-light-pink py-5 mb-10">
        <Title className="text-3xl font-bold">liên hệ</Title>
      </div>
      <div className="flex items-center justify-between pt-5 pb-14">
        <div className="flex item justify-center w-full">
          <span className="block text-small-font-color font-bold">
            Nếu bạn có thắc mắc hãy liên hệ với chúng tôi qua địa chỉ
          </span>
        </div>
        <div className="w-full px-20">
          <h3 className="text-3xl font-bold mb-5">
            Gửi thắc mắc cho chúng tôi
          </h3>
          <p className="text-small-font-color font-bold mb-5 text-base leading-6 tracking-wider">
            Nếu bạn có thắc mắc gì, có thể gửi yêu cầu cho chúng tôi và chúng
            tôi <br /> sẽ liên lạc với bạn sớm nhất có thể
          </p>
          <div>
            <form>
              <div className="flex items-start gap-8">
                <Input
                  text="text"
                  placeholder="Họ và tên"
                  className="py-4 pl-3 pr-20"
                />
                <Input
                  text="email"
                  placeholder="Nhập email của bạn"
                  className="py-4 pl-3 pr-20"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="mb-10">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d13854.365253907554!2d105.755428!3d20.970836!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3134531e3271472f%3A0x2651fde14e086a84!2zMzQ2IFThu5EgSOG7r3UsIExhIEtow6osIEjDoCDEkMO0bmcsIEjDoCBO4buZaSwgVmnhu4d0IE5hbQ!5e1!3m2!1svi!2sus!4v1680057974036!5m2!1svi!2sus"
          className="m-auto w-[1356px] h-[252px]"
          loading="lazy"
        ></iframe>
      </div>
    </>
  );
};

export default LienHe;
