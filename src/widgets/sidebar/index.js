import React, { useContext, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { NavContext } from '../../appContext';

import {
    HomeIcon,
    GiftSubscription,
    MyDependents,
    LinkMobile,
    Print,
    Profile,
    Purchase,
    SubscriptionHistory,
    VerificationHistory,
    ViewSubscription,
    Logo
} from '../../assets';
import { MenuItem } from '../../components/menuItem';
import { ciEncrypt } from '../../config/utils/red';
import './sidebar.css';

const Sidebar = () => {
    const printLinks = [
        {
            linkName: 'Print Premium Slip',
            linkSlug: 'premium-slip',
            icon: <Print />
        },
        {
            linkName: 'Print Standard Slip',
            linkSlug: 'standard-slip',
            icon: <Print />
        }
    ];

    const subscriptionLinks = [
        {
            linkName: 'Purchase Service Plan',
            linkSlug: 'purchase-plan',
            icon: <Purchase />
        },
        {
            linkName: 'Transaction History',
            linkSlug: 'transaction-history',
            icon: <SubscriptionHistory />
        },
        {
            linkName: 'Gift Credits',
            linkSlug: 'gift-credits',
            icon: <GiftSubscription />
        },
        {
            linkName: 'View Subscribers',
            linkSlug: 'view-subscribers',
            icon: <ViewSubscription />
        }
    ];

    const accountLinks = [
        {
            linkName: 'My Dependents',
            linkSlug: 'my-dependents',
            icon: <MyDependents />
        },
        {
            linkName: 'Verification History',
            linkSlug: 'verification-history',
            icon: <VerificationHistory />
        },
        {
            linkName: 'Link Mobile Number',
            linkSlug: 'link-number',
            icon: <LinkMobile />
        },
        { linkName: 'View Profile', linkSlug: 'view-profile', icon: <Profile /> }
    ];

    const [active, setActive] = useState('home');
    const [headerIconDisplay, setHeaderIconDisplay] = useContext(NavContext);

    const history = useHistory();

    useEffect(() => {
        if (ciEncrypt.getItem('ciDK') === null || ciEncrypt.getItem('ciDK') === undefined) {
            history.push('/');
        }
    }, [history]);

    useEffect(() => {
        setHeaderIconDisplay(false);
    }, [active, setHeaderIconDisplay]);

    return (
        <React.Fragment key={headerIconDisplay ? 'true' : 'false'}>
            <Link to="/home">
                <div className="sidebar_logo d-flex">
                    <img src={Logo} alt="NIMC Logo" className="mx-auto" />
                </div>
            </Link>

            <div className="sidebar_overflow_wrapper">
                <Link to="/home" className="sidebar_link">
                    <MenuItem
                        link={{ linkName: 'Home', linkSlug: 'home', icon: <HomeIcon /> }}
                        id="home"
                        onclick={() => {
                            setActive('home');
                        }}
                    />
                </Link>

                <p className="mt-3 mb-2 sidebar_caption">PRINT SLIP</p>

                {printLinks.map((link, index) => (
                    <React.Fragment key={index}>
                        <Link to={`/${link.linkSlug}`}>
                            <MenuItem
                                link={link}
                                id={`${link.linkSlug}`}
                                onclick={() => {
                                    setActive(link.linkSlug);
                                }}
                                active={active}
                            />
                        </Link>
                    </React.Fragment>
                ))}

                <p className="mt-3 mb-2 sidebar_caption">SUBSCRIPTIONS</p>

                {subscriptionLinks.map((link, index) => (
                    <React.Fragment key={index}>
                        <Link to={`/${link.linkSlug}`}>
                            <MenuItem
                                link={link}
                                id={`${link.linkSlug}`}
                                onclick={() => {
                                    setActive(link.linkSlug);
                                }}
                                active={active}
                            />
                        </Link>
                    </React.Fragment>
                ))}

                <p className="mt-3 mb-2 sidebar_caption">ACCOUNT</p>

                {accountLinks.map((link, index) => (
                    <React.Fragment key={index}>
                        <Link to={`/${link.linkSlug}`}>
                            <MenuItem
                                link={link}
                                id={`${link.linkSlug}`}
                                onclick={() => {
                                    setActive(link.linkSlug);
                                }}
                                active={active}
                            />
                        </Link>
                    </React.Fragment>
                ))}
            </div>
            <div className="sidebar_footer position-fixed d-flex justify-content-center">
                <div className="pl-3 m-0 sidebar_footer_border">
                    <div className="d-flex justify-content-between pt-4 w-75 ">
                        <a href="https://nimcmobile.app/terms" rel="noreferrer" className="p-0 ">
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
                    <div className="p-0 mt-2 col-11">
                        <p className="">&copy; {new Date().getFullYear()} NIMC</p>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export { Sidebar };
