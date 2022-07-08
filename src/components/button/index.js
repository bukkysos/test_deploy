import React from 'react';
import { LoadingIcon } from '../../assets';
import './button.css';

/**
 *
 * @param {buttonType} {'primary - dark background, white text', 'secondary - green background white text', 'default - white background dark text'}
 * @param {icon} {'Button icon - default = null'}
 * @param {onButtonClick} {'Button onClick function'}
 * @param {buttonText} {'Button Text'}
 * @returns
 */

const Button = ({
    icon = null,
    buttonText,
    type = 'button',
    buttonType = 'primary',
    exportBtn = false,
    onButtonClick = () => {},
    loading = false,
    className = '',
    disabled = false
}) => {
    return (
        <>
            <button
                className={`button ${
                    exportBtn ? '' : ' mt-4 mx-auto mb-3 '
                } ${buttonType} ${className} ${loading || disabled ? 'disabled' : ''}`}
                type={type}
                onClick={(e) => onButtonClick(e)}
                disabled={loading || disabled}
                style={{
                    marginTop: exportBtn ? '0px' : '3rem',
                    padding: exportBtn ? '5px 5px' : '8px 20px'
                }}
            >
                {icon !== null ? (
                    <>
                        <span className=" my-auto">{icon}</span>
                        <span className="my-auto">{buttonText}</span>
                    </>
                ) : (
                    <span className="m-auto" style={{ fontSize: exportBtn ? '0.7rem' : '13px' }}>
                        {loading ? (
                            <span>
                                <>
                                    <span className="mr-2 btn_loading">
                                        <LoadingIcon fill={'#fff'} />{' '}
                                    </span>
                                    {buttonText}
                                </>
                            </span>
                        ) : (
                            buttonText
                        )}
                    </span>
                )}
            </button>
        </>
    );
};

export { Button };
