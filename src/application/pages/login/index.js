import React, { useEffect, useState } from 'react';
import './login.css';
import {
    Logo,
    ShapesLeft,
    ShapesRight,
    SliderImage_1,
    SliderImage_2,
    SliderImage_3
} from '../../../assets';
import { useHistory } from 'react-router-dom';
import { Input, LoginContent, Modal, SuccessContent } from '../../../components';
import { Button } from '../../../components/button';
import axios from 'axios';
import { BASE_URL } from '../../../config';
import { fetchKey } from './utils';
import { ciEncrypt } from '../../../config/utils/red';

const Login = () => {
    const [modal, setModal] = useState(false);
    const [userId, setUserId] = useState('');
    const [otp, setOTP] = useState('');
    const [type, setType] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [userIdError, setUserIdError] = useState(false);
    const [otpError, setOTPError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [modalError, setModalError] = useState(false);

    const sliderImages = [SliderImage_1, SliderImage_2, SliderImage_3];

    const history = useHistory();
    // const jwt_code = localStorage?.getItem('data');
    const jwt_code = ciEncrypt.getItem('ciDK');

    useEffect(() => {
        if (window && window.$ && typeof window.$ === 'function') {
            window.$('.login_slider_wrapper').not('.slick-initialized').slick({
                arrows: false,
                slidesToShow: 1,
                slidesToScroll: 3,
                autoplay: true,
                autoplaySpeed: 7000,
                dots: true,
                centerMode: true,
                centerPadding: '5px',
                infinite: true
            });
        }
    });

    useEffect(() => {
        if (jwt_code) {
            history.push('/home');
        }
    }, [history, jwt_code]);

    const handleOtpChange = (inputVal) => {
        if (isNaN(inputVal)) {
            // return;
        } else if (inputVal.length === 7) {
            // return;
        } else {
            setOTP(inputVal);
            setError(false);
        }
    };

    const handleUserIdChange = (inputValue) => {
        let inputVal = [...inputValue].filter((val) => val !== ' ').join('');
        if (inputVal.length === 6 && !userId.includes('-')) {
            formatWithHyphen(inputVal);
        } else if (inputVal.length === 12) {
            // return;
        } else {
            setUserId(inputVal);
        }
    };

    const formatWithHyphen = (inputVal) => {
        setUserId(inputVal + '-');
    };

    const regex = {
        userid: /[A-Z]{6}-[0-9]{4}/,
        loginOTP: /[0-9]{6}/
    };

    const validateOnBlur = (inputType, data) => {
        if (!regex[inputType].test(data)) {
            if (inputType === 'userid') {
                setUserIdError(true);
            } else if (inputType === 'loginOTP') {
                setOTPError(true);
            }
        } else {
            if (inputType === 'userid') {
                setUserIdError(false);
            } else if (inputType === 'loginOTP') {
                setOTPError(false);
            }
        }
    };

    useEffect(() => {}, [userId]);

    const login = (e) => {
        e.preventDefault();
        let domUserID = e.target['userId'].value;
        let domOTP = e.target['loginOTP'].value;
        let loginUserId = domUserID || userId;
        let loginUserOTP = domOTP || otp;
        if (loginUserId.length < 11 || loginUserOTP.length < 6 || error) {
            setError(true);
        } else {
            setLoading(true);
            axios({
                method: 'post',
                url: `${BASE_URL}user/login`,
                data: {
                    userID: String(loginUserId),
                    otp: String(loginUserOTP)
                }
            })
                .then((response) => {
                    console.log(response.data.accessToken, 'login response');
                    if (!fetchKey(response.data.accessToken, response.data.data)) {
                        setModalError(true);
                    }
                    setModalError(false);
                    setTimeout(() => {
                        setLoading(false);
                        history.push('/home');
                    }, 2000);
                    // return true;
                })
                .catch((error) => {
                    console.log({ error }, 'fetchkey');

                    setLoading(true);
                    axios({
                        method: 'post',
                        url: `/api/user/login`,
                        data: {
                            userID: String(loginUserId),
                            otp: String(loginUserOTP)
                        }
                    })
                        .then((response) => {
                            console.log(response.data.accessToken, 'login response');
                            if (!fetchKey(response.data.accessToken, response.data.data)) {
                                setModalError(true);
                            }
                            setModalError(false);
                            setTimeout(() => {
                                setLoading(false);
                                history.push('/home');
                            }, 2000);
                            // return true;
                        })
                        .catch((error) => {
                            setErrorMessage(error.message);
                            setError(true);
                            setLoading(false);
                            setModalError(true);
                        });
                });
        }
        return true;
    };

    return (
        <>
            <div className={`d-flex login_wrapper ${modal ? 'blur' : ''}`}>
                <div className="login_left">
                    <div className="shape_left">
                        <ShapesLeft width="inherit" height="inherit" />
                    </div>
                    <div className="shape_right">
                        <ShapesRight width="inherit" height="inherit" />
                    </div>

                    <div>
                        <div className="login_slider_wrapper">
                            {sliderImages.map((image, index) => (
                                <div className="slider_image_wrapper" key={index}>
                                    <img src={image} alt="slider" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="login_right">
                    <div className="login_right_cover">
                        <div className="mb-3 d-flex justify-content-center">
                            <div className="login_logo_wrapper mt-5">
                                <img src={Logo} alt="Nimc" />
                            </div>
                        </div>
                        <div className="login_form_wrapper">
                            <h5>Mobile &amp; Web Services</h5>
                            <div className=" col-11 login_form">
                                <form onSubmit={login}>
                                    <Input
                                        type="text"
                                        placeholder="Enter User ID"
                                        label="User ID"
                                        id={`userId`}
                                        name={`userId`}
                                        value={userId}
                                        mxlength={11}
                                        onblur={() => validateOnBlur('userid', userId)}
                                        required={true}
                                        error={userIdError}
                                        onfocus={() => setError(false)}
                                        onchange={(value) =>
                                            handleUserIdChange(value.toUpperCase())
                                        }
                                    />
                                    <Input
                                        type={`${type ? 'password' : 'text'}`}
                                        placeholder="Mobile OTP"
                                        label="Mobile OTP"
                                        id={`loginOTP`}
                                        name={`loginOTP`}
                                        required={true}
                                        showIcon={true}
                                        value={otp}
                                        mxlength={6}
                                        onblur={() => validateOnBlur('loginOTP', otp)}
                                        onfocus={() => setError(false)}
                                        getInputTypeToggle={(type) => setType(type)}
                                        onchange={(value) => handleOtpChange(value)}
                                        getInputType={(input) => setType(input)}
                                        error={otpError}
                                    />
                                    <p
                                        className="login_otp py-1 my-2"
                                        onClick={() => setModal(true)}
                                    >
                                        Where can I find my OTP?
                                    </p>
                                    <div className="login_button">
                                        <Button
                                            buttonText={'Login'}
                                            id={'button'}
                                            className="button mx-auto"
                                            type={'submit'}
                                            loading={loading}
                                        />
                                    </div>
                                </form>

                                <div className="d-flex login_right_terms w-75 p-0 mx-auto p-0 m-0">
                                    <div style={{ width: '100%', padding: 0 }}>
                                        <a
                                            href="https://nimcmobile.app/terms"
                                            rel="noreferrer"
                                            className="p-0 "
                                        >
                                            Terms
                                        </a>
                                        <a
                                            href="https://nimcmobile.app/privacy"
                                            target="_blank"
                                            rel="noreferrer"
                                            className="p-0 "
                                        >
                                            Privacy
                                        </a>
                                        <a href="mailto:mobileid@nimc.gov.ng" className="p-0 ">
                                            Contact
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {modal ? (
                <Modal
                    onclick={(modalState) => setModal(modalState)}
                    content={
                        <>
                            <LoginContent />
                        </>
                    }
                />
            ) : (
                <></>
            )}

            {modalError ? (
                <Modal
                    onclick={(modalState) => setModalError(modalState)}
                    content={
                        <>
                            <SuccessContent responseType="error" responseTexts={errorMessage} />
                        </>
                    }
                />
            ) : (
                <></>
            )}
        </>
    );
};

export { Login };
