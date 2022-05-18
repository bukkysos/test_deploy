import React, { useState } from 'react';
import OtpInput from 'react-otp-input';
import { Button } from '../../../../button';
import { Modal } from '../../../../modal';
import { RemitaModal } from '../../../../modalComponents';
// import { addNumber } from '../utilities/addNumber';

// export const OTPModal = ({ setResponse }) => {
export const OTPModal = () => {
    const [otpValue, setOtpValue] = useState('');
    const [error, setError] = useState(false);

    // const handleAddNumber = () => {
    //     addNumber()
    // }

    return (
        <>
            <Modal
                onclick={() => {}}
                content={
                    <RemitaModal
                        responseType={'error'}
                        title={'Verify Number'}
                        description={
                            'We just sent a six(6) digits one time password to the phone number.'
                        }
                        children={
                            <>
                                <div className={`remita_select_otp my-5`}>
                                    <OtpInput
                                        value={otpValue}
                                        onChange={(val) => {
                                            setOtpValue(val);
                                            setError(false);
                                        }}
                                        numInputs={6}
                                        isInputNum={true}
                                        containerStyle={
                                            'd-flex justify-content-between col-12 p-0 m-0'
                                        }
                                        inputStyle={`filter_box ${error ? 'error' : ''}`}
                                        focusStyle={`filter_box_focus ${error ? 'error' : ''}`}
                                        hasErrored={true}
                                        separator={' '}
                                    />
                                </div>
                                <div className="remita_buttons d-flex justify-content-between">
                                    <div className="col-4 p-0">
                                        <Button
                                            buttonType={'default'}
                                            buttonText={'Cancel'}
                                            onButtonClick={() => {}}
                                        />
                                    </div>
                                    <div className="col-7 p-0">
                                        <Button
                                            buttonType={'primary'}
                                            buttonText={'Confirm'}
                                            loading={true}
                                            onButtonClick={() => {}}
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
