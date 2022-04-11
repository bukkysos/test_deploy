import React from 'react';
import { Link } from 'react-router-dom';
import { LoadingIcon, Print } from '../../../assets';
import { Card } from '../card';
import './homeCard.css';
const HomeCard = ({
    icon = <Print />,
    description,
    buttonText,
    iconType,
    to = null,
    onclick = () => {},
    loading,
    disabled = false
}) => {
    return (
        <>
            <Card>
                <div className={`card_icon mx-auto ${iconType === 'print' ? 'print' : 'icon'}`}>
                    {icon}
                </div>
                <p className="mx-auto card_description text-center">{description}</p>
                {to !== null ? (
                    <Link to={to}>
                        <div className="card_button mx-auto">
                            <button
                                type="button"
                                className="button mt-4 mx-auto mb-3"
                                onClick={() => onclick()}
                                disabled={disabled}
                            >
                                {buttonText}
                            </button>
                        </div>
                    </Link>
                ) : (
                    <div className="card_button mx-auto">
                        <button
                            type="button"
                            className="button mt-4 mx-auto mb-3"
                            onClick={(e) => onclick(e)}
                            disabled={disabled}
                        >
                            <span>
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
                        </button>
                    </div>
                )}
            </Card>
        </>
    );
};

export { HomeCard };
