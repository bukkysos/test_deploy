import React from 'react';
import './remitaContent.css';

const RemitaModal = ({ title, description, children }) => {
    return (
        <>
            <div className="remita_modal_wrapper">
                <p className={`remita_title`}>{title}</p>
                <p className={`remita_desc`}>{description}</p>

                {children}
            </div>
        </>
    );
};

export { RemitaModal };
