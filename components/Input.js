import React from "react";

const Input = ({type, placeholder, className}) => {
  return (
    <>
      <input
        className={`p-2 rounded-lg outline-none bg-[#f8f9fa] border border-[#edeff1] text-sm inline-block focus:ring-4 focus:ring-blue-200 ${className}`}
        type={type}
        placeholder={placeholder}
      ></input>
    </>
  );
};

export default Input;
