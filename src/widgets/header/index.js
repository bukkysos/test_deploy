import React, { useContext, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import { NavContext, SidebarContext } from '../../appContext';
import { DownArrow, Power, BackIcon, Hamburger } from '../../assets';
import './header.css';
import { ciEncrypt } from '../../config/utils/red';

const Header = () => {
    const [profileStatus, setProfileStatus] = useState(false);
    const [headerIconDisplay] = useContext(NavContext);
    const [sidebarState, setSidebarState] = useContext(SidebarContext);

    const history = useHistory();
    const credits = localStorage.getItem('credits');

    const jwt_code = localStorage?.getItem('data');
    if (jwt_code) {
        var jwt_data = jwt_decode(jwt_code);
    }

    useEffect(() => {
        localStorage.setItem('credits', jwt_data?.availablecredit);
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
                            Credits: {jwt_data?.availablecredit ?? credits}
                        </li>

                        <li onClick={() => setProfileStatus(!profileStatus)}>
                            <img
                                src={`https://v1.ibib.io:7070/${jwt_data?.p}/png/${jwt_data?.h}.png`}
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
                    <p>{`${jwt_data?.fn} ${jwt_data?.mn} ${jwt_data?.sn}`}</p>
                    <p>ID: {jwt_data?.userid}</p>
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
