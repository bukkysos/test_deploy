import React, { useCallback, useEffect, useState } from 'react';
import { Card } from '../card';
import { Button } from '../../button';
import { Input, SelectInput } from '../../input';
import { ciEncrypt, decryptAndDecode } from '../../../config/utils/red';
import './style.css';
import { BASE_URL } from '../../../config';
import axios from 'axios';

const dropdownItems = ['Premium NIN Slip', 'Standard NIN Slip', 'Purchase Service Plan'];
const rrrNUmberLimit = 12;

export const ValidateRRRCard = ({ buttonText, getResponse, getValidationData, getUserData }) => {
    const [rrr, setRRR] = useState('');
    const [filterParams, setFilterParams] = useState('');
    const [userData, setUserData] = useState({});
    const [error, setError] = useState({ status: false, message: '' });
    const [selectError, setSelectError] = useState({ status: false, message: '' });
    const [btnLoading, setBtnLoading] = useState(false);

    let ciDT = ciEncrypt.getItem('ciDT');

    const handleRRRChange = (inputValue) => {
        if (!isNaN(inputValue) && inputValue.length <= rrrNUmberLimit) {
            setRRR(inputValue);
            setError({ status: false, message: '' });
        }

        if (rrr.length >= rrrNUmberLimit) {
            setError({ status: true, message: 'RRR number limit reached!' });
        }

        if (isNaN(inputValue)) {
            setError({ status: true, message: 'RRR expects only numbers' });
        }
    };

    const validateOnBlur = () => {
        if (rrr.length !== rrrNUmberLimit) {
            setError({ status: true, message: 'Invalid RRR' });
        }

        if (rrr.length !== rrrNUmberLimit) {
            setError({ status: true, message: 'Invalid RRR' });
        }
    };

    const handleKey = useCallback(async () => {
        let { data } = await ciEncrypt.getItem('ciDD');
        let decryptedData = await decryptAndDecode(data);
        setUserData(decryptedData);
    }, [ciEncrypt]);

    useEffect(() => {
        handleKey();
    }, []);

    const handleValidateRRR = () => {
        if (userData.userid && !!rrr && !!filterParams) {
            setBtnLoading(true);
            axios({
                method: 'post',
                url: `${BASE_URL}utility/RRRValidation`,
                data: {
                    userID: userData.userid,
                    RRR: rrr
                },
                headers: {
                    Authorization: `Bearer ${ciDT}`
                }
            })
                .then((response) => {
                    getResponse(response.data.success, response.data.message, filterParams);

                    setBtnLoading(false);
                    if (response.data.success) {
                        getValidationData({
                            action: 'print',
                            status: true,
                            service:
                                filterParams === 'Standard NIN Slip'
                                    ? 1
                                    : filterParams === 'Standard NIN Slip'
                                    ? 2
                                    : 3,
                            rrr: rrr
                        });
                        getUserData(userData);
                    } else {
                        getValidationData({
                            action: 'pending',
                            status: false,
                            service:
                                filterParams === 'Standard NIN Slip'
                                    ? 1
                                    : filterParams === 'Standard NIN Slip'
                                    ? 2
                                    : 3,
                            rrr: rrr
                        });
                    }
                })
                .catch((error) => {
                    setBtnLoading(false);
                    getResponse(
                        error.response.data.success,
                        error.response.data.message,
                        filterParams
                    );
                    getValidationData({
                        action: 'pending',
                        status: false,
                        service:
                            filterParams === 'Standard NIN Slip'
                                ? 1
                                : filterParams === 'Standard NIN Slip'
                                ? 2
                                : 3,
                        rrr: rrr
                    });
                    getUserData(userData);
                    setError({ status: true, message: error.response.data.message });
                });
        }
    };

    return (
        <>
            <Card>
                <div className="filter_dropdown_input mt-3 mb-4 position-relative">
                    <SelectInput
                        inputName={'select'}
                        label={'Web Service'}
                        placeholder="Select filter"
                        validateRRRSelect={true}
                        value={filterParams}
                        selectItems={dropdownItems}
                        getSelectedItem={(selectedItem) => {
                            setFilterParams(selectedItem.selected);
                            setSelectError({
                                status: false,
                                message: ''
                            });
                        }}
                        onblur={
                            filterParams && filterParams !== ''
                                ? () =>
                                      setSelectError({
                                          status: false,
                                          message: ''
                                      })
                                : () =>
                                      setSelectError({
                                          status: true,
                                          message: 'Web Service cannot be empty'
                                      })
                        }
                        error={selectError.status}
                        errorText={selectError.message}
                    />
                </div>
                <div className="pt-4 pb-2">
                    <Input
                        placeholder={'1234567890'}
                        label={'Remita Retrivial Reference'}
                        type={'text'}
                        id={'units'}
                        mnLength={0}
                        value={rrr}
                        onchange={(val) => handleRRRChange(val)}
                        onblur={() => validateOnBlur()}
                        error={error.status}
                        errorText={error.status && error.message}
                    />
                </div>
                <div className="pt-1 pb-2">
                    <Button
                        buttonText={buttonText}
                        buttonType={'primary'}
                        onButtonClick={() => handleValidateRRR()}
                        loading={btnLoading}
                        disabled={btnLoading}
                    />
                </div>
            </Card>
        </>
    );
};
