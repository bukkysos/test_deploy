import React, { useState } from 'react';
import { Button } from '../../../../button';
import { Input } from '../../../../input';
import { Modal } from '../../../../modal';
import { RemitaModal } from '../../../../modalComponents';
import { sendNumber } from '../utilities/sendNumber';

export const AddNumberModal = ({
    handleShowNUmberModal = () => {},
    setResponse = () => {},
    ciDT,
    userid
}) => {
    // const [numberVal, setNumberVal] = useState('');
    const [normalInputVal, setNormalInputVal] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({
        state: false,
        message: ''
    });

    const validPhonePattern = /^0\d{10}$/;

    const validatePhoneNumberOnChange = (numberVal) => {
        if (isNaN(numberVal)) {
            return;
        } else if (normalInputVal.length === 12) {
            return;
        }
        setNormalInputVal(numberVal);
    };

    const validateOnBlur = () => {
        setLoading(false);
        if (!validPhonePattern.test(normalInputVal)) {
            setError({
                state: true,
                message: ''
            });
        }
    };

    const sendNumberForOTP = () => {
        setLoading(true);
        sendNumber(normalInputVal, ciDT, userid, ({ status, message }) => {
            if (status === 'success') {
                handleShowNUmberModal(false);
                setResponse({ status, message, openOTPModal: true });
            }
        });
    };

    return (
        <>
            <Modal
                onclick={() => {}}
                content={
                    <RemitaModal
                        responseType={'error'}
                        title={'Add Mobile Number'}
                        description={
                            'Please endeavour to input a valid phone number in the field below.'
                        }
                        children={
                            <>
                                <div className={`remita_select_input`}>
                                    <Input
                                        placeholder={'08000000000'}
                                        label={'Phone Number'}
                                        value={normalInputVal}
                                        onblur={() => validateOnBlur()}
                                        onchange={(val) => validatePhoneNumberOnChange(val)}
                                        name="remita_select"
                                        mxlength={11}
                                        error={error.state}
                                        errorText={error.message}
                                    />
                                </div>
                                <div className="remita_buttons d-flex justify-content-between">
                                    <div className="col-4 p-0">
                                        <Button
                                            onButtonClick={() => handleShowNUmberModal(false)}
                                            buttonType={'default'}
                                            buttonText={`Cancel`}
                                        />
                                    </div>
                                    <div className="col-7 p-0">
                                        <Button
                                            onButtonClick={() => sendNumberForOTP()}
                                            buttonType={'primary'}
                                            buttonText={'Next'}
                                            loading={loading}
                                        />
                                    </div>
                                </div>
                            </>
                        }
                    />
                }
                showCloseButton={false}
            />
        </>
    );
};
