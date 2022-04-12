import React, { useEffect, useState } from 'react';
import { PhoneIcon, Profile, ProfileImage, RightChevron } from '../../assets';
import { Button } from '../button';
// import { useHistory } from "react-router-dom";
import './profileSidebar.css';

const ProfileSidebar = ({
    sidebarItems = [
        {
            linkName: 'Account Information',
            linkIcon: <Profile />
        },
        {
            linkName: 'Device Information',
            linkIcon: <PhoneIcon />
        }
    ],
    profileImage = null,
    getTabIndex,
    mobileDropdownData,
    loading = false,
    showProfileModal = () => {},
    showAddNumberModal = () => {},
    printNIN = () => {}
}) => {
    const [active, setActive] = useState(0);
    const [closeAll, setCloseAll] = useState('');

    useEffect(() => {
        getTabIndex(active);
    }, [active, getTabIndex]);

    const handleProfileButton = (determinant) => {
        if (determinant === 'Request Profile Update') {
            showProfileModal(true);
        } else if (determinant === 'Link Mobile Number') {
            showAddNumberModal(true);
        } else if (determinant === 'Purchase Subscription') {
            printNIN();
        }
    };

    return (
        <>
            <div className="profile_sidebar col-md-5 col-lg-4 p-0">
                <div className="profile_image">
                    <img
                        src={profileImage === null ? ProfileImage : profileImage}
                        alt="Dependent"
                    />
                </div>

                {sidebarItems.map((item, index) => (
                    <React.Fragment key={index}>
                        <div
                            id={index}
                            className={`profile_link mb-2 d-flex justify-content-start pl-3 ${
                                index === active && closeAll === '' ? 'profile_link_active' : ''
                            }`}
                            onClick={() => {
                                setActive(() => index);
                                setCloseAll(() => (active === index ? 'close' : ''));
                            }}
                        >
                            <div className="profile_link_icon mr-3">{item.linkIcon}</div>
                            <div className="profile_link_name ">{item.linkName}</div>
                            <div className={`profile_link_pointer my-auto`}>
                                <RightChevron
                                    height="15"
                                    viewBox="0 0 6 17"
                                    className={`${
                                        window.screen.width > 767 && active === index && !closeAll
                                            ? 'show_open'
                                            : 'show_closed'
                                    }`}
                                />
                            </div>
                        </div>
                        <div
                            className={`p-0 m-0 ${
                                active === index && window.screen.width < 768 && !closeAll
                                    ? 'd-block'
                                    : 'd-none'
                            }`}
                            id={index}
                        >
                            <>
                                <div className="profile_details_title d-flex justify-content-center">
                                    <p className="my-auto p-0">Account Information</p>
                                </div>

                                <div className="p-0 m-0">
                                    <div
                                        className={`d-flex justify-content-center profile_details_body ${
                                            mobileDropdownData.contentType === 'table'
                                                ? 'table-responsive'
                                                : ''
                                        }`}
                                    >
                                        {/* eslint-disable-next-line */}
                                        {mobileDropdownData.hasOwnProperty('contentType') &&
                                        mobileDropdownData.contentType === null ? (
                                            <>
                                                <div className="col-6 py-4 px-0">
                                                    {mobileDropdownData.leftData.map(
                                                        (item, index) => (
                                                            <React.Fragment key={index}>
                                                                <p className="profile_details_left">
                                                                    {item}
                                                                </p>
                                                            </React.Fragment>
                                                        )
                                                    )}
                                                </div>
                                                <div className="col-6 py-4 profile_details_right text-right">
                                                    {mobileDropdownData.rightData.map(
                                                        (item, index) => (
                                                            <React.Fragment key={index}>
                                                                <p>{item}</p>
                                                            </React.Fragment>
                                                        )
                                                    )}
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="col-6 py-4 px-0">
                                                    {mobileDropdownData.map((item, index) => (
                                                        <React.Fragment key={index}>
                                                            <div className="mb-4">
                                                                <p className="p-0 m-0">
                                                                    {item.mobile}
                                                                </p>
                                                                <small
                                                                    className="font-weight-normal mb-5 text-capitalize"
                                                                    style={{
                                                                        color:
                                                                            item.status === 'active'
                                                                                ? '#27923E'
                                                                                : item.status ===
                                                                                  'inactive'
                                                                                ? '#C82C20'
                                                                                : 'inherit',
                                                                        fontSize: '.65rem'
                                                                    }}
                                                                >
                                                                    {item.status}
                                                                </small>
                                                            </div>
                                                        </React.Fragment>
                                                    ))}
                                                </div>
                                                <div className="col-6 py-4 profile_details_right text-right">
                                                    {mobileDropdownData.map((item, index) => (
                                                        <React.Fragment key={index}>
                                                            <p className="text-muted mb-5">
                                                                #{item.idNumber}
                                                            </p>
                                                        </React.Fragment>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <div className="col-11 p-0 mb-4 mx-auto">
                                        <Button
                                            buttonText={
                                                mobileDropdownData.contentType !== null
                                                    ? 'Link Mobile Number'
                                                    : mobileDropdownData.primaryButtonText
                                            }
                                            buttonType={'primary'}
                                            loading={loading}
                                            onButtonClick={(e) =>
                                                handleProfileButton(e.target.innerText)
                                            }
                                        />
                                    </div>
                                </div>
                            </>
                        </div>
                    </React.Fragment>
                ))}
            </div>
        </>
    );
};

export { ProfileSidebar };
