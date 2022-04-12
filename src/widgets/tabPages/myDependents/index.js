import axios from 'axios';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';
import { NavContext } from '../../../appContext';
import { Card, DependentsCard, EmptyDependentState } from '../../../components';
import { BASE_URL } from '../../../config';
import { LoadingIcon } from '../../../assets';

const MyDependents = () => {
    const [responseData, setResponseData] = useState([]);
    const [headerIconDisplay, setHeaderIconDisplay] = useContext(NavContext);
    const [loading, setLoading] = useState(true);
    const [emptyState, setEmptyState] = useState(false);

    const accessToken = localStorage.getItem('accessToken');
    const jwt_code = localStorage.getItem('data');

    if (jwt_code && accessToken) {
        var jwt_data = jwt_decode(jwt_code);
    }

    const userNin = jwt_data?.nin;

    const fetchDependents = useCallback(
        (nin) => {
            axios({
                method: 'get',
                url: `${BASE_URL}utility/myDependents?parentNin=${nin}`,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
                .then((response) => {
                    setLoading(false);
                    if (response.data.data) {
                        setResponseData(() => response.data.data);
                    } else {
                        setEmptyState(true);
                    }
                })
                .catch((error) => {
                    console.error(error, 'error');
                    setLoading(false);
                    setResponseData([]);
                });
        },
        [accessToken]
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
