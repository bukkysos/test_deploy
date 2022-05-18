import axios from 'axios';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { NavContext } from '../../../appContext';
import { Card, DependentsCard, EmptyDependentState } from '../../../components';
import { BASE_URL } from '../../../config';
import { LoadingIcon } from '../../../assets';
import { ciEncrypt, decryptAndDecode } from '../../../config/utils/red';

const MyDependents = () => {
    const [responseData, setResponseData] = useState([]);
    const [headerIconDisplay, setHeaderIconDisplay] = useContext(NavContext);
    const [nin, setNin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [emptyState, setEmptyState] = useState(false);

    let ciDT = ciEncrypt.getItem('ciDT');

    const handleKey = useCallback(async () => {
        let ciDD = await ciEncrypt.getItem('ciDD');
        let userData = await decryptAndDecode(ciDD);
        setNin(userData.nin);
    }, [ciEncrypt]);

    const decryptData = async (data) => {
        let userData = await decryptAndDecode(data);
        return userData;
    };

    useEffect(() => {
        handleKey();
    }, [handleKey]);

    const userNin = nin;

    const fetchDependents = useCallback(
        async (nin) => {
            axios({
                method: 'get',
                url: `${BASE_URL}utility/myDependents?parentNin=${nin}`,
                headers: {
                    Authorization: `Bearer ${ciDT}`
                }
            })
                .then((response) => {
                    setLoading(false);
                    if (response.data.data.length) {
                        setEmptyState(false);
                        decryptData(response.data.data).then((data) => {
                            setResponseData(() => data);
                        });
                    } else {
                        setEmptyState(true);
                    }
                })
                .catch(() => {
                    // console.error(error, 'error');
                    setLoading(false);
                    setResponseData([]);
                });
            return true;
        },
        [ciDT]
    );

    useEffect(() => {
        setHeaderIconDisplay(false);
    }, [setHeaderIconDisplay]);

    useEffect(() => {
        fetchDependents(userNin);
        return () => {
            setResponseData([]);
        };
    }, [fetchDependents, userNin]);

    return (
        <>
            <h3 className={`tab_page_title mx-auto ${headerIconDisplay ? '' : ''}`}>
                My Dependents
            </h3>
            <p className="mx-auto tab_page_subtitle mb-4">
                Quickly view and manage all the data of your wards/children under the age of 16.
            </p>

            <div className="col-12 d-flex justify-content-center px-4 my_dependents">
                {loading ? (
                    <LoadingIcon fill={'#000'} className="loader" />
                ) : emptyState ? (
                    <Card>
                        <EmptyDependentState />
                    </Card>
                ) : (
                    <DependentsCard dependents={responseData} />
                )}
            </div>
        </>
    );
};

export { MyDependents };
