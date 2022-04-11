import React from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import { SidebarProvider, StateProvider } from './appContext';
import { Dashboard, Login } from './application/pages';
import {
    GiftSubscription,
    Home,
    LinkMobileNumber,
    MyDependents,
    PrintPremiumSlip,
    PrintStandardSlip,
    PurchaseSubscription,
    SubscriptionHistory,
    VerificationHistory,
    ViewProfile,
    ViewSubscribers,
    SingleDependent
} from './widgets';
import ResponsePage from './widgets/tabPages/responsePage';
// import { OrderManagement, Login, ProductsUpload, VehicleLookup, Admin, MainLayout, OrderOverview } from './pages';

const AppRoute = () => {
    const MainRoute = ({ Component, home, ...rest }) => {
        return (
            <Route
                {...rest}
                render={(props) => (
                    <StateProvider>
                        <SidebarProvider>
                            <Dashboard home={home}>
                                <Component {...props} />
                            </Dashboard>
                        </SidebarProvider>
                    </StateProvider>
                )}
            />
        );
    };

    return (
        <>
            <Router>
                <Switch>
                    <Route exact={true} path="/">
                        <Login />
                    </Route>
                    <MainRoute path={'/home'} exact={true} Component={Home} />
                    <MainRoute path={'/premium-slip'} exact={true} Component={PrintPremiumSlip} />
                    <MainRoute path={'/standard-slip'} exact={true} Component={PrintStandardSlip} />
                    <MainRoute
                        path={'/purchase-plan'}
                        exact={true}
                        Component={PurchaseSubscription}
                    />
                    <MainRoute
                        path={'/transaction-history'}
                        exact={true}
                        Component={SubscriptionHistory}
                    />

                    <MainRoute path={'/gift-credits'} exact={true} Component={GiftSubscription} />
                    <MainRoute
                        path={'/view-subscribers'}
                        exact={true}
                        Component={ViewSubscribers}
                    />

                    <MainRoute path={'/my-dependents'} exact={true} Component={MyDependents} />
                    <MainRoute
                        path={'/my-dependents/single/:id'}
                        exact={true}
                        Component={SingleDependent}
                    />
                    <MainRoute
                        path={'/verification-history'}
                        exact={true}
                        Component={VerificationHistory}
                    />
                    <MainRoute path={'/link-number'} exact={true} Component={LinkMobileNumber} />
                    <MainRoute path={'/view-profile'} exact={true} Component={ViewProfile} />
                    <MainRoute path={'/payment-response'} exact={true} Component={ResponsePage} />
                    {/*<MainRoute path={"/payment-response/:id"} exact={true} Component={ResponsePage} />*/}

                    <Route path={'*'} render={() => <Redirect to={'/'} />} />
                </Switch>
            </Router>
        </>
    );
};

export { AppRoute };
