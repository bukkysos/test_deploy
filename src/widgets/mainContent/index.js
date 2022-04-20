import React, { useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SidebarContext } from '../../appContext';
import { decrypt } from '../../config/utils/red';
import './mainContent.css';

const NodeRSA = require('node-rsa');
const ci = process.env.REACT_APP_CIE.split(', ');
const secretData = 'This is some mad data here';

const MainContent = ({ children }) => {
    const [sidebarState, setSidebarState] = useContext(SidebarContext);
    const mobileScreen = window.screen.width <= 767 ? true : false;
    const location = useLocation();

    // const [dd, setDD] = useState('');

    const encryptAndSaveKey = () => {
        const key = new NodeRSA({ b: Number(ci[Math.floor(Math.random() * ci.length)]) });
        const encryptedData = key.encrypt(secretData, 'base64');
        localStorage.setItem('token', encryptedData);
        decrypt(key, encryptedData);
        return true;
    };

    useEffect(() => {
        encryptAndSaveKey();
    }, []);

    useEffect(() => {
        if (mobileScreen) {
            setSidebarState(false);
        }
    }, [location.pathname, mobileScreen, setSidebarState]);

    return <div className={`main_content ${sidebarState ? '' : ''}`}>{children}</div>;
};

export { MainContent };
