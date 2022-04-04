import { useLocation } from "react-router";

const MenuItem = ({link, onclick}) => {
    
    const location = useLocation()

    return (
        <div className={`d-flex justify-content-start sidebar_menu_item my-3 text-center pt-2 pb-2 ${location.pathname.includes(`/${link.linkSlug}`) ? "active" : ""}`} onClick={() => onclick(link.linkSlug)}>
            <span className="sidebar_menu_item_icon">{link.icon}</span>
            <p className='ml-2 my-auto'>{link.linkName}</p>
        </div>
    )
    
}

export { MenuItem }