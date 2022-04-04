import React from 'react'
import { Error, SuccessCheck, SuccessCircle } from '../../../assets'
import './successContent.css'

const SuccessContent = ({ responseType, responseTexts }) => {
    return (
        <>
            <div className="success_icon mx-auto mt-1 ">
                <span className="icon_circle">
                    <SuccessCircle stroke={`${responseType === "success" ? "#27923E" : "#EE4034"}`} />
                </span>

                <span className={`${responseType === "error" ? `${"icon_" + responseType}` : "icon_check"}`}>
                    {
                        responseType === "success" ?
                            <SuccessCheck />
                            :
                            <Error />
                    }
                </span>

            </div>
            <p className={`${responseType === "success" ? "success" : "modal_error"} message mx-auto`}>{responseType === "error" ? "Failed!" : "Successful!"}</p>

            <p className={`${responseType === "success" ? "success_info" : "error_info"} description mx-auto`}>{responseTexts}</p>

            {/* <div className="success_button mx-auto">
                <Button icon={responseType === "error" ? <Reload /> : <Print height={"1rem"} width={"1rem"} />} buttonType="default" buttonText={responseType === "error" ? "Try Again" :"Print NIN Slip"} onButtonClick={() => btnAction()} />
            </div> */}
        </>
    )
}

export { SuccessContent }
