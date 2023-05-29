import React ,{forwardRef} from "react";

const Input = ({type, register, id, placeholder, errors, className, children, onChange, ...props}, ref) => {
  return (
    <>
      <input
        type="text"
        className={`px-4 py-2 rounded-md w-full outline-none ${errors !== ''? 'focus:ring-2 focus:ring-red-300 border border-red-500' : 'border border-slate-400 focus:border-slate-600'}`}
        id={id}
        placeholder={placeholder}
      >{children}</input>
    </>
  );
};

export default forwardRef(Input);
