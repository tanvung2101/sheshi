import { ItemSlide, SEO, Title } from "@/components";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";
import categoryApis from "./../../apis/categoryApí";
import axios from "axios";
import productsApis from "@/apis/productApis";
import { GLOBAL_STATUS } from "@/constants";

const SamPham = ({ data }) => {
  const { category, product } = data;
  const [categorySlug, setCategorySlug] = useState([]);
  const [productCategory, setProductCategory] = useState([]);
  const [target, setTarget] = useState(false);
  // console.log(category, product);
  const router = useRouter();
  const handlerClickCategory = (e) => {
    console.log(e.target.name)
    setCategorySlug(() => [e.target.name, ...categorySlug]);
    console.log('categorySlug',categorySlug)
    const data = product?.rows?.filter((row) =>
      row.productCategory.categorySlug.includes(...categorySlug)
    );
    setProductCategory(() => [...productCategory, data]);
  };
  return (
    <>
      <SEO title="SẢN PHẨM SHESHI" href="/logosheshe.png"></SEO>
      
      <div className="bg-light-pink py-5">
        <Title className="text-3xl font-bold">sản phẩm</Title>
      </div>
      <div className="py-8 px-24 flex">
        <div className="flex-col grow-[2]">
          <h4 className="text-xl text-black font-sans font-bold mb-4">
            Danh Mục Sản Phẩm
          </h4>
          {category.length > 0 &&
            category.map((item) => {
              return (
                <div key={item.id} className="relative mb-4 group">
                  <label
                    className="ml-8 text-base font-medium font-serif text-center hover:text-red-500"
                    htmlFor={item.categorySlug}
                  >
                    <input
                      className="absolute left-0 top-[50%] -translate-y-[50%] hidden"
                      type="checkbox"
                      name={item.categorySlug}
                      id={item.categorySlug}
                      onClick={handlerClickCategory}
                      // checked
                    />
                    <span className="w-4 h-4 border border-black group-active:bg-regal-red absolute top-[50%] -translate-y-1/2 left-0">
                      <i className="fa-thin fa-square-check"></i>
                    </span>
                    {item?.name}
                  </label>
                </div>
              );
            })}
        </div>
        <div className="grow-[9] grid grid-rows-4 grid-flow-col gap-4">
          {product.rows.length > 0 &&
            product.rows.map((item) => (
              <ItemSlide
                className="h-[200px]"
                key={item.id}
                image={item?.productCategory.image}
                name={item.name}
                price={item.price}
                link={`/san-pham/${item.productSlug}`}
              ></ItemSlide>
            ))}
        </div>
      </div>
    </>
  );
};

export async function getStaticProps() {
  const category = await categoryApis.getAllCategory();
  const params = {
    size: 14,
    getMainImage: true,
    status: GLOBAL_STATUS.ACTIVE,
  };
  const product = await productsApis.getAllProducts({ params });
  // console.log(product.data);
  const data = { category: category.data, product: product.data };
  return {
    props: { data },
  };
}

export default SamPham;
