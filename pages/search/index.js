import productsApis from "@/apis/productApis";
import { ItemSlide, SEO } from "@/components";
import { GLOBAL_STATUS } from "@/constants";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const Search = ({ product }) => {
  const { router } = useRouter();
  const {data} = product;
  const {params} = product;
  
  console.log(router);
  return (
    <>
      <SEO title="tìm kiếm"></SEO>
      <h1 className="mt-20 mb-8 text-center text-4xl text-black">Tìm kiếm</h1>
      <p className="mt-4 text-center text-lg ">{`Kết quả tìm kiếm cho "${params !== undefined? params : ''}"`}</p>
      <div className="px-8 grid grid-cols-4 mb-8">
        {data.rows.length > 0 &&
          data.rows.map((item) => {
            return (
              <ItemSlide
                key={item.id}
                link={`/san-pham/${item?.productSlug}`}
                image={item?.productImage[0]?.image || ""}
                name={item?.name}
                price={Number(item?.productDetail[0]?.price)}
                qty={item.productInventory[0].quantity}
              />
            );
          })}
      </div>
    </>
  );
};

export async function getServerSideProps(content) {
  const params = {
    name: content.query.keyword,
    getMainImage: true,
    status: GLOBAL_STATUS.ACTIVE,
  };
  const data = await productsApis.getAllProducts(params);

  return {
    props: {
      product: {data: data.data, params: content.query.keyword},
    },
  };
}

export default Search;
