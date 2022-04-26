import React, { useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SidebarContext } from '../../appContext';
import './mainContent.css';

const MainContent = ({ children }) => {
    const [sidebarState, setSidebarState] = useContext(SidebarContext);
    const mobileScreen = window.screen.width <= 767 ? true : false;
    const location = useLocation();

    useEffect(() => {
        if (mobileScreen) {
            setSidebarState(false);
        }
    }, [location.pathname, mobileScreen, setSidebarState]);

    return <div className={`main_content ${sidebarState ? '' : ''}`}>{children}</div>;
};

export { MainContent };
