import React, { useContext, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { SidebarContext } from '../../appContext';
import jwt_decode from 'jwt-decode';
import './mainContent.css';
import { decryptor } from '../../config/utils';

const MainContent = ({ children }) => {
    const [sidebarState, setSidebarState] = useContext(SidebarContext);
    const mobileScreen = window.screen.width <= 767 ? true : false;
    const location = useLocation();
    const history = useHistory();

    const decrypted = decryptor();

    const accessToken = localStorage.getItem('accessToken');
    const jwt_code = localStorage.getItem('data');
    var jwt_data = jwt_decode(jwt_code);

    console.log(jwt_data, jwt_code);

    useEffect(() => {
        if (!jwt_code || !accessToken) {
            history.push('/');
        }
        console.log(decrypted);
        return () => {};
    }, [jwt_code, accessToken, decryptor]);

    useEffect(() => {
        if (mobileScreen) {
            setSidebarState(false);
        }
    }, [location.pathname, mobileScreen, setSidebarState]);

    return <div className={`main_content ${sidebarState ? '' : ''}`}>{children}</div>;
};

export { MainContent };
