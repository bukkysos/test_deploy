import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Header, Sidebar } from '../../../widgets';
import { MainContent } from '../../../widgets/mainContent';
import { ciEncrypt } from '../../../config/utils/red';
import { AppContext, HeaderIconProvider, SidebarContext } from '../../../appContext';
import './dashboard.css';

let countDownTimer;
let countDownTime = 30 * 60000;
let warningTime = 20 * 60000;

const Dashboard = ({ children }) => {
    const [context] = useContext(AppContext);
    const [sidebarState, setSidebarState] = useContext(SidebarContext);
    const [idleState, setIdleState] = useState(true);
    const [counter, setCounter] = useState(countDownTime);
    const [warning, setWarning] = useState(false);

    const history = useHistory();

    const logout = useCallback(() => {
        handleMouseMove = () => {};
        handleKeyUp = () => {};
        handleClick = () => {};
        ciEncrypt.removeItem('ciDK');
        ciEncrypt.removeItem('ciDD');
        history.push('/');
    }, [history]);

    const countDown = useCallback(() => {
        countDownTimer = setTimeout(() => {
            setCounter(counter - 10);
        }, 10000);
        if (counter === warningTime) {
            setWarning(true);
        }
        if (counter === 0) {
            logout();
        }
        console.log(counter);
    }, [counter, logout]);

    useEffect(() => {
        if (idleState) {
            countDown();
        } else {
            setCounter(countDownTime);
            clearTimeout(countDownTimer);
        }
    }, [countDown, idleState]);

    const resetIdleAttributes = () => {
        setTimeout(() => {
            setIdleState(true);
        }, 5000);
        setIdleState(false);
        setCounter(countDownTime);
        console.log('mouse moved');
    };

    let handleMouseMove = useCallback(() => {
        document.addEventListener('mousemove', resetIdleAttributes);
    }, [idleState]);

    let handleKeyUp = useCallback(() => {
        document.addEventListener('keyup', resetIdleAttributes);
    }, [idleState]);

    let handleClick = useCallback(() => {
        document.addEventListener('click', resetIdleAttributes);
    }, [idleState]);

    useEffect(() => {
        setTimeout(() => {
            handleMouseMove();
            handleKeyUp();
            handleClick();
        }, 5000);

        return () => {
            document.removeEventListener('mousemove', resetIdleAttributes);
            document.removeEventListener('keyup', resetIdleAttributes);
            document.removeEventListener('click', resetIdleAttributes);
        };
    }, []);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https:////code.tidio.co/6fn3wrk925lpvslyneqrnzdlrbqtxsc3.js';
        script.async = true;
        script.onload = () => console.log('Loaded....');
        document.body.appendChild(script);
    }, []);

    return (
        <>
            {warning ? (
                <div
                    className="timeout_alert alert alert-danger alert-dismissible fade show text-center"
                    role="alert"
                >
                    <strong>Still there?</strong> You will soon be logged out due to inactivity.
                    Move mouse, click, or press a key to continue.
                    <button
                        type="button"
                        className="close"
                        data-dismiss="alert"
                        aria-label="Close"
                        onClick={() => {
                            setWarning(false);
                        }}
                    >
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            ) : (
                <></>
            )}

            <HeaderIconProvider>
                <div className={`d-flex justify-content-center p-0 dashboard_wrapper`}>
                    <div
                        className={`dashboard_sidebar_overlay ${
                            sidebarState ? 'show_sidebar' : 'hide_sidebar'
                        }`}
                        onClick={() => setSidebarState(false)}
                    ></div>
                    <div
                        className={`dashboard_sidebar ${context ? 'blur' : ''} ${
                            sidebarState ? 'show_sidebar' : 'hide_sidebar'
                        }`}
                    >
                        <Sidebar />
                    </div>

                    <div className="dashboard_right_container">
                        <div className={`${context ? 'blur' : ''} p-0 m-0`}>
                            <Header />
                        </div>
                        <MainContent children={children} />

                        {/* <div
              className={`dashboard_support d-flex justify-content-between align-content-center py-2 px-4 ${
                context ? "blur" : ""
              }`}
            >
              <SupportIcon />
              <p className="p-0 my-auto">Support</p>
            </div> */}
                    </div>
                </div>
            </HeaderIconProvider>
        </>
    );
};

export { Dashboard };
