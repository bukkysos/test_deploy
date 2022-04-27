import React, { useEffect, useState } from 'react';
import './input.css';
import { EyeOff, EyeOn } from '../../../assets';

const Input = ({
    type = 'text',
    showIcon = false,
    placeholder,
    name = '',
    mxlength = 524288, //Default max value for input elements
    mnLength = 0,
    value,
    id = 'mobileOTP',
    className = '',
    label = '',
    required = true,
    filter = false,
    onblur = () => {},
    onchange,
    // onkeypress = () => {},
    getInputTypeToggle = () => {},
    onfocus = () => {},
    disabled = false,
    error = false,
    errorText = 'Incorrect! Please cross-check your data and try again.'
}) => {
    const [iconState, setIconState] = useState(true);

    useEffect(() => {
        getInputTypeToggle(iconState);
    }, [iconState, getInputTypeToggle]);

    return (
        <>
            {filter ? (
                <input
                    type={type}
                    className={`${className}`}
                    id={id}
                    name={name}
                    maxLength={mxlength}
                    minLength={mnLength}
                    required={required}
                    placeholder={placeholder}
                    onFocus={onfocus}
                    onChange={(e) => onchange(e.target.value)}
                    autoComplete={'off'}
                    disabled={disabled}
                />
            ) : (
                <div className="form-group">
                    {label !== '' ? (
                        <label htmlFor="mobileOTP" className="login_label">
                            {label}
                        </label>
                    ) : (
                        <></>
                    )}
                    <input
                        type={type}
                        className={`login_input form-control ${className} ${error ? 'error' : ''}`}
                        id={id}
                        placeholder={placeholder}
                        name={name}
                        required={required}
                        value={value}
                        maxLength={mxlength}
                        onFocus={onfocus}
                        onBlur={onblur}
                        onChange={(e) => onchange(e.target.value)}
                        autoComplete={'off'}
                        disabled={disabled}
                    />
                    {showIcon ? (
                        <span
                            className={`login_password_icon_wrapper ${'icon_normal_position'}`}
                            onClick={() => setIconState(!iconState)}
                        >
                            {iconState ? <EyeOff /> : <EyeOn />}
                        </span>
                    ) : (
                        <></>
                    )}
                    {error ? (
                        <p
                            className={`text-danger error_text p-0 m-0 ${
                                showIcon ? 'password_error' : ''
                            }`}
                        >
                            <em>
                                <small>{errorText}</small>
                            </em>
                        </p>
                    ) : (
                        <></>
                    )}
                </div>
            )}
        </>
    );
};

export { Input };
