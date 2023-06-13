import React, { forwardRef } from "react";

const Input = ({ className, ...props }, ref) => {
  return (
    <>
      <input
        {...props}
        ref={ref}
        className={`px-4 py-2 rounded-md w-full outline-none text-sm ${
          props.errors
            ? "focus:ring-2 focus:ring-red-300 border border-red-500"
            : "border border-slate-400 focus:border-slate-600"
        }`}
        // id={props.id}
        placeholder={props.placeholder}
      >
        {props.children}
      </input>
    </>
  );
};

export default forwardRef(Input);
