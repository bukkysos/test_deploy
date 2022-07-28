import React from 'react';
import { Card, CheckPaymentCard } from '../card';
import { Button } from '../../button';
import { useHistory } from 'react-router-dom';
import { Error, LoadingIcon, Reload, SuccessCheck, SuccessCircle } from '../../../assets';

const ResponseCard = ({ action, status = false, serviceType = 1, loading, onclick }) => {
    const history = useHistory();
    let cardHeader = 'Successful!';
    if (action === 'print') {
        cardHeader = 'Payment Found!';
    } else if (action === 'failed') {
        cardHeader = 'Payment Failed!';
    } else if (action === 'pending') {
        cardHeader = 'No Payment Found!';
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
                    <p className={'error_info description mx-auto'}>
                        There is no record of payment found.
                        <br />
                        Please click the button below to pay
                    </p>
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

                {!status ? (
                    <div className="success_button mx-auto">
                        <Button
                            className="response_button"
                            icon={
                                <span className="mr-2">
                                    <Reload />
                                </span>
                            }
                            buttonType="default"
                            buttonText={'Try Again'}
                            onButtonClick={() => history.goBack()}
                        />
                    </div>
                ) : (
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
                                    'Download NIN Slip'
                                )}
                            </span>
                        </button>
                    </div>
                )}
            </Card>
            <ResponseCardButton onclick={() => history.push('/validate-rrr')} />
        </>
    );
};

export { ResponseCard };

export const ResponseCardButton = ({ onclick }) => {
    return (
        <>
            <CheckPaymentCard>
                <p>Already paid offline?</p>
                <div className="check_payment_button">
                    <button
                        type="button"
                        className="button mt-1 mx-auto mb-1"
                        onClick={(e) => onclick(e)}
                    >
                        <span>
                            <span>{'Validate RRR'}</span>
                        </span>
                    </button>
                </div>
            </CheckPaymentCard>
        </>
    );
};
