import React from 'react'
import { Phone } from '../../../assets'
import './loginContent.css'

const LoginContent = () => {
    return (
        <>
            <h5 className="login_modal_title mt-1 mb-4">Where can I see my OTP?</h5>
            <div className="d-flex justify-content-between align-items-center">
                <div className="login_modal_phone">
                    <img src={Phone} alt={"Phone directions"}/>
                </div>
                <div className="login_modal_details">
                    <ul>
                        <li>
                        You can copy your OTP from the NIMC MobileID App.
                        </li>
                        <li>
                        Simply click on “SECURITY PIN”, and copy the code displayed.
                        </li>
                        <li>
                            Please note that the OTP expires in 60 seconds.
                        </li>
                    </ul>
                </div>
            </div>
        </>
    )
}

export { LoginContent }