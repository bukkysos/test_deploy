import { useEffect } from 'react';
import { NIMC_SERVICOM } from '../../../assets';
import './styles.css';

export const Support = () => {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https:////code.tidio.co/6fn3wrk925lpvslyneqrnzdlrbqtxsc3.js';
        script.async = true;
        script.onload = () => console.log('Loaded....');
        document.body.appendChild(script);
        return () => {};
    }, []);
    return (
        <div className="d-flex flex-column justify-content-center align-items-center mt-4">
            <img src={NIMC_SERVICOM} alt="Servicom" className="servicom_logo" />
            <p className="mt-4 text_bold">How can we help?</p>
            <p className="text_thin text-center">
                Click the button below to contact a SERVICOM staff and get resolutions to all your
                questions immediately.
            </p>
        </div>
    );
};
