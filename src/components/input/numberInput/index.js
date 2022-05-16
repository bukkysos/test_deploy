import React, { useEffect, useState } from 'react';
import './numberInput.css';
import { EyeOff, EyeOn } from '../../../assets';

const NumberInput = ({
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
    filter = true,
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
                <>
                    <input
                        type={type}
                        className={`login_input form-control ${className} ${error ? 'error' : ''}`}
                        id={id}
                        name={name}
                        value={value}
                        maxLength={mxlength}
                        minLength={mnLength}
                        required={required}
                        placeholder={placeholder}
                        onFocus={onfocus}
                        onBlur={onblur}
                        onChange={(e) => onchange(e.target.value)}
                        autoComplete={'off'}
                        disabled={disabled}
                    />
                    <p className={`error_text p-0 m-0 ${showIcon ? 'password_error' : ''}`}>
                        <em>
                            <small>{'Format: 2348000000000'}</small>
                        </em>
                    </p>
                </>
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
                    {
                        <p
                            className={`text-danger error_text p-0 m-0 ${
                                showIcon ? 'password_error' : ''
                            }`}
                        >
                            <em>
                                <small>{errorText}</small>
                            </em>
                        </p>
                    }
                </div>
            )}
        </>
    );
};

export { NumberInput };
