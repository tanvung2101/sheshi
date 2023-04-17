import { SEO } from "@/components";
import { useRouter } from "next/router";
import React from "react";

const Search = () => {
  const {router} = useRouter();
  console.log(router?.query)
  return (
    <>
      <SEO title="tìm kiếm"></SEO>
      <h1 className='mt-20 text-center text-4xl text-black'>Tìm kiếm</h1>
      <p className='mt-4 text-center text-lg '>Kết quả tìm kiếm cho</p>
    </>
  );
};

export default Search;
