import React, { forwardRef } from "react";

const Input = ({ className, ...props }, ref) => {
  // console.log(props)
  return (
    <>
      <input
        {...props}
        ref={ref}
        className={`px-4 py-2 rounded-md w-full outline-none text-sm ${props.errors
          ? "focus:ring-[4px] focus:ring-red-300 border-[1px] focus:border-red-500 border-red-500"
          : "border border-slate-400 focus:border-slate-600"
          } ${className} `}
        // id={props.id}
        placeholder={props.placeholder}
      >
        {props.children}
      </input>
    </>
  );
};

export default forwardRef(Input);
