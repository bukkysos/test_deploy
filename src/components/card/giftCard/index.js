import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { BASE_URL } from '../../../config';
import { Button } from '../../button';
import { Input } from '../../input';
import { Card } from '../card';
import './giftCard.css';
import { useHistory } from 'react-router-dom';
import { ciEncrypt, decryptAndDecode } from '../../../config/utils/red';

const GiftCard = ({ getResponse, recipient = null }) => {
    const [userId, setUserId] = useState('');
    const [data, setData] = useState({});
    const [units, setUnits] = useState('');
    const [btnLoading, setBtnLoading] = useState(false);
    const [error, setError] = useState(false);
    const [errorType, setErrorType] = useState('inputError');
    const [userIdError, setUserIdError] = useState(false);
    const [creditError, setCreditError] = useState(false);
    const [ownIdError, setOwnIdError] = useState(false);

    const history = useHistory();

    const getUserIdFromHistoryState = useCallback(() => {
        if (history.location.state !== undefined) {
            setUserId(history.location.state.recipientID);
        }
    }, [history.location.state]);

    useEffect(() => {
        getUserIdFromHistoryState();
    }, [getUserIdFromHistoryState]);

    const credits = localStorage.getItem('credits');

    let ciDT = ciEncrypt.getItem('ciDT');

    const handleKey = useCallback(async () => {
        let ciDD = await ciEncrypt.getItem('ciDD');
        let userData = await decryptAndDecode(ciDD);
        setData(userData);
    }, [ciEncrypt]);

    useEffect(() => {
        handleKey();
    }, [handleKey]);

    useEffect(() => {
        if (error) {
            setCreditError(true);
            setUserIdError(true);
        }
    }, [error]);

    const handleCreditChange = (inputValue) => {
        let inputVal = [...inputValue].filter((val) => val !== '.').join('');
        if (isNaN(inputVal)) {
            // return;
        } else {
            if (credits && parseInt(inputVal) > parseInt(credits)) {
                setErrorType('unitError');
                setCreditError(true);
            } else {
                setCreditError(false);
            }
            console.log(units, inputVal, 'units, inputVal');
            setUnits(inputVal);
        }
    };

    const handleUserIdChange = (inputValue) => {
        let inputVal = [...inputValue].filter((val) => val !== ' ').join('');
        if (inputVal.length === 6 && !userId.includes('-')) {
            formatWithHyphen(inputVal);
        } else if (inputVal.length === 12) {
            checkSelfUserId(inputVal);
            return;
        } else {
            checkSelfUserId(inputVal);
            setUserId(inputVal);
        }
        checkSelfUserId(inputVal);
    };

    const checkSelfUserId = (id) => {
        if (data.userID === id) {
            setUserIdError(true);
            setUserId('');
            setOwnIdError(true);
            // return;
        }
    };

    const formatWithHyphen = (inputVal) => {
        setUserId(inputVal + '-');
    };

    const regex = {
        userid: /[A-Z]{6}-[0-9]{4}/,
        credit: /[0-9]+/
    };

    const validateOnBlur = (inputType, data) => {
        if (!regex[inputType].test(data)) {
            if (inputType === 'userid' && data.userid === data) {
                setUserIdError(true);
                checkSelfUserId(data);
            } else if (inputType === 'credit') {
                setCreditError(true);
            }
            // setError(true);
        } else {
            if (inputType === 'userid') {
                setUserIdError(false);
            } else if (inputType === 'credit') {
                if (credits && parseInt(data) > parseInt(credits)) {
                    setCreditError(true);
                    setErrorType('unitError');
                } else {
                    setCreditError(false);
                    setErrorType('inputError');
                }
            }
        }
    };

    const handleGiftCard = () => {
        setBtnLoading(true);

        if (userId.length < 11 || isNaN(units) === true || !userId.includes('-')) {
            setError(true);
            setBtnLoading(false);
            // return;
        } else {
            axios({
                method: 'post',
                url: `${BASE_URL}credit/assignCredits`,
                data: {
                    userID: userId,
                    adminUID: data.userID,
                    unit: units
                },
                headers: {
                    Authorization: `Bearer ${ciDT}`
                }
            })
                .then((response) => {
                    getResponse(response.data.success, response.data.message);
                    setBtnLoading(false);
                    localStorage.setItem('credits', credits - units);
                })
                .catch((error) => {
                    getResponse(error.response.data.success, error.response.statusText);
                    setBtnLoading(false);
                });
        }
    };

    return (
        <>
            <Card>
                <Input
                    placeholder={`${recipient ? recipient : 'User ID'}`}
                    label={'Recipient User ID'}
                    value={userId}
                    id={'userId'}
                    onchange={(val) => handleUserIdChange(val.toUpperCase())}
                    disabled={history.location.state !== undefined ? true : false}
                    onfocus={() => setError(false)}
                    onblur={() => validateOnBlur('userid', userId)}
                    error={userIdError}
                    errorText={
                        ownIdError
                            ? "Can't send credit to yourself"
                            : 'Invalid User ID or Unit(s). Please check your inputs.'
                    }
                />
                <div className=" py-3">
                    <Input
                        placeholder={'0.00'}
                        label={'Subscription Units'}
                        type={'text'}
                        id={'units'}
                        mnLength={0}
                        value={units}
                        onfocus={() => setError(false)}
                        onchange={(val) => handleCreditChange(val)}
                        onblur={() => validateOnBlur('credit', units)}
                        error={creditError}
                        errorText={
                            errorType === 'unitError'
                                ? 'Units are bigger than your credits'
                                : 'Invalid User ID or Unit(s). Please check your inputs.'
                        }
                    />
                </div>

                <Button
                    buttonText={'Gift Credit'}
                    buttonType={'primary'}
                    onButtonClick={() => handleGiftCard()}
                    loading={btnLoading}
                    disabled={btnLoading}
                />
            </Card>
        </>
    );
};

export { GiftCard };
