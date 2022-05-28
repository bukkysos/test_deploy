import React, { useContext, useEffect, useCallback, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { NavContext, SidebarContext } from '../../appContext';
import { DownArrow, Power, BackIcon, Hamburger } from '../../assets';
import './header.css';
import { ciEncrypt, decryptAndDecode } from '../../config/utils/red';

const Header = () => {
    const [profileStatus, setProfileStatus] = useState(false);
    const [headerIconDisplay] = useContext(NavContext);
    const [sidebarState, setSidebarState] = useContext(SidebarContext);
    const [jwt_data, setJWTData] = useState({});

    const history = useHistory();

    const handleKey = useCallback(async () => {
        let ciDD = await ciEncrypt.getItem('ciDD');
        let userData = await decryptAndDecode(ciDD);
        setJWTData(userData);
    }, [ciEncrypt]);

    useEffect(() => {
        localStorage.setItem('credits', jwt_data?.availablecredit);
        handleKey();
    }, [jwt_data?.availablecredit]);

    const Logout = () => {
        ciEncrypt.removeItem('ciDK');
        ciEncrypt.removeItem('ciDD');
        history.push('/');
    };

    return (
        <>
            <nav className="d-flex justify-content-between m-0">
                <div className="p-0 m-0 my-auto header_left">
                    {' '}
                    <span
                        className="hamburger_menu pr-3"
                        onClick={() => setSidebarState(!sidebarState)}
                    >
                        <Hamburger />
                    </span>
                    {headerIconDisplay ? (
                        <Link to={'/my-dependents'} className="back_link">
                            <div className="d-flex justify-content-start nav_back">
                                <span className="back_icon my-auto">
                                    <BackIcon />
                                </span>
                                <p className="p-0 ml-3 my-auto back_text">Back to My Dependents</p>
                            </div>
                        </Link>
                    ) : (
                        <p className="nimc_text m-0">NIMC MobileID</p>
                    )}
                </div>
                <div className="header_right">
                    <ul className="my-auto">
                        <li className="header_credits">
                            Credits: {localStorage.getItem('credits')}
                        </li>

                        <li onClick={() => setProfileStatus(!profileStatus)}>
                            <img
                                src={`https://v1.ibib.io:7070/1/png/${jwt_data?.h}.png`}
                                alt="Profile"
                            />
                        </li>
                        <li onClick={() => setProfileStatus(!profileStatus)}>
                            <DownArrow />
                        </li>
                    </ul>
                </div>
            </nav>

            {profileStatus ? (
                <div className="profile_popup">
                    <p
                        onClick={() => {
                            history.push('/view-profile');
                            setProfileStatus(false);
                        }}
                    >
                        {`${jwt_data?.fn} ${jwt_data?.mn} ${jwt_data?.sn}`}
                    </p>
                    <p
                        onClick={() => {
                            history.push('/view-profile');
                            setProfileStatus(false);
                        }}
                    >
                        ID: {jwt_data?.userid}
                    </p>
                    <div className="d-flex justify-content-start">
                        <Power className="mr-2" />
                        <p className="p-0 my-auto" onClick={() => Logout()}>
                            Logout
                        </p>
                    </div>
                </div>
            ) : (
                <></>
            )}
        </>
    );
};

export { Header };
