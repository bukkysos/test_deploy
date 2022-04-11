import React, { createContext, useState } from 'react';

export const AppContext = createContext();
export const NavContext = createContext();
export const IdContext = createContext();
export const SidebarContext = createContext();

const StateProvider = ({ children }) => {
    const [context, setContext] = useState(false);

    return <AppContext.Provider value={[context, setContext]}>{children}</AppContext.Provider>;
};

const HeaderIconProvider = ({ children }) => {
    const [headerIconDisplay, setHeaderIconDisplay] = useState(false);

    return (
        <NavContext.Provider value={[headerIconDisplay, setHeaderIconDisplay]}>
            {children}
        </NavContext.Provider>
    );
};

const UserIdProvider = ({ children }) => {
    const [userId, setUserId] = useState(null);

    return <IdContext.Provider value={[userId, setUserId]}>{children}</IdContext.Provider>;
};

const SidebarProvider = ({ children }) => {
    const [sidebarState, setSidebarState] = useState(() =>
        window.screen.width > 767 ? true : false
    );

    return (
        <SidebarContext.Provider value={[sidebarState, setSidebarState]}>
            {children}
        </SidebarContext.Provider>
    );
};

export { StateProvider, HeaderIconProvider, UserIdProvider, SidebarProvider };
