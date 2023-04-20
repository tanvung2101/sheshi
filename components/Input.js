import React from "react";

const Input = ({type, placeholder, className, children, onChange}) => {
  return (
    <>
      <input
        onChange={onChange}
        className={`p-2 rounded-lg outline-none bg-[#f8f9fa] border border-[#edeff1] inline-block focus:ring-4 focus:ring-blue-200 ${className}`}
        type={type}
        placeholder={placeholder}
      >{children}</input>
    </>
  );
};

export default Input;
