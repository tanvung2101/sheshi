import React from "react";

const Button = ({ children, className, type, onClick }) => {
  return (
    <>
      <button onClick={onClick} className={className} type={type}>
        {children}
      </button>
    </>
  );
};

export default Button;
