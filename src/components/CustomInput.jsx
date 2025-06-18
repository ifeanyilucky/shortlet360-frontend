import React, { forwardRef } from "react";
import PropTypes from "prop-types";

const CustomInput = forwardRef(
  (
    {
      label,
      type = "text",
      name,
      value,
      onChange,
      placeholder,
      error,
      required = false,
      disabled = false,
      className = "",
      inputClassName = "",
      labelClassName = "",
      icon,
      ...rest
    },
    ref
  ) => {
    return (
      <div className={`w-full ${className}`}>
        {label && (
          <label
            htmlFor={name || rest.name}
            className={`block text-sm font-medium text-gray-700 mb-2 ${labelClassName}`}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            type={type}
            id={name || rest.name}
            disabled={disabled}
            placeholder={placeholder}
            className={`
            w-full
            ${icon ? "pl-10" : "pl-4"}
            pr-4
            py-3
            border
            rounded-lg
            shadow-sm
            focus:outline-none
            focus:ring-2
            focus:ring-primary-500
            focus:border-transparent
            disabled:bg-gray-100
            disabled:cursor-not-allowed
            ${error ? "border-red-500" : "border-gray-300"}
            ${inputClassName}
          `}
            {...rest}
            name={name || rest.name}
            value={value !== undefined ? value : rest.value}
            onChange={onChange || rest.onChange}
          />
        </div>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

CustomInput.displayName = "CustomInput";

CustomInput.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  inputClassName: PropTypes.string,
  labelClassName: PropTypes.string,
  icon: PropTypes.node,
};

export default CustomInput;
