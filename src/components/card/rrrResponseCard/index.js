import React from 'react';
import { Card } from '../card';
import { Error, LoadingIcon, Print, SuccessCheck, SuccessCircle } from '../../../assets';

const RRRResponseCard = ({
    action,
    status = false,
    serviceType = 1,
    loading,
    onclick,
    errorText
}) => {
    let cardHeader = 'Successful!';
    if (action === 'print') {
        cardHeader = 'Payment Found!';
    } else if (action === 'pending') {
        cardHeader = 'Validation Failed!';
    }

    return (
        <>
            <Card>
                <div className="success_icon mx-auto mt-1 ">
                    <span className="icon_circle">
                        <SuccessCircle stroke={status ? '#27923E' : '#EE4034'} />
                    </span>
                    {status ? (
                        <span
                            id="response_icon_check"
                            className={'icon_check'}
                            style={{
                                position: 'relative',
                                top: '-4rem',
                                left: '2rem',
                                width: '2rem',
                                height: '2rem'
                            }}
                        >
                            <SuccessCheck width="2rem" height="2rem" />
                        </span>
                    ) : (
                        <span
                            className={'icon_error'}
                            style={{
                                position: 'relative',
                                top: '-3.7rem',
                                left: '2.8rem',
                                width: '2rem',
                                height: '2rem'
                            }}
                        >
                            <Error />
                        </span>
                    )}
                </div>
                {/* <p className={`${responseType === "success" ? "success" : "modal_error"} message mx-auto`}>{responseType === "error" ? "Failed!" : "Successful!"}</p> */}
                <p className={` ${status ? 'success' : 'text-danger'} message mx-auto`}>
                    {cardHeader}
                </p>
                {action === 'print' ? (
                    <p className={'success_info description mx-auto'}>
                        Your Remita payment of{' '}
                        {serviceType === 1 ? (
                            <strong>₦ 400.00</strong>
                        ) : (
                            <strong>₦ 1,000.00</strong>
                        )}{' '}
                        has been validated successfully.
                    </p>
                ) : action === 'failed' ? (
                    <p className={'error_info description mx-auto'}>
                        Your Remita payment of{' '}
                        {serviceType === 1 ? (
                            <strong>₦ 400.00</strong>
                        ) : (
                            <strong>₦ 1,000.00</strong>
                        )}{' '}
                        could not be completed successfully.
                    </p>
                ) : action === 'pending' ? (
                    <p className={'error_info description mx-auto'}>{errorText}</p>
                ) : (
                    <p className={'success_info description mx-auto'}>
                        Your Remita payment of{' '}
                        {serviceType === 1 ? (
                            <strong>₦ 400.00</strong>
                        ) : (
                            <strong>₦ 1,000.00</strong>
                        )}{' '}
                        has been processed successfully.
                    </p>
                )}

                {status ? (
                    <div className="success_button mx-auto">
                        <button
                            type="button"
                            className="button mt-4 mx-auto mb-3"
                            disabled={loading}
                            onClick={(e) => onclick(e)}
                        >
                            <span>
                                {loading ? (
                                    <span>
                                        <>
                                            <span className="mr-2 btn_loading">
                                                <LoadingIcon fill={'#fff'} />{' '}
                                            </span>
                                            {'Download NIN Slip'}
                                        </>
                                    </span>
                                ) : (
                                    <>
                                        <span className="mr-2">
                                            <Print stroke={'#fff'} />
                                        </span>
                                        {'Click Here to Download'}
                                    </>
                                )}
                            </span>
                        </button>
                    </div>
                ) : (
                    <></>
                )}
            </Card>
        </>
    );
};

export { RRRResponseCard };
