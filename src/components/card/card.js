import React from 'react'
import './card.css'
const Card = ({children}) => {
    return (
        <div className="display_card p-4 mt-4 mx-3">
            {children}
        </div>
    )
}


export const CheckPaymentCard = ({children}) => {
    return (
        <div className="display_card payment_status_card p-2 mt-4 mx-3">
            {children}
        </div>
    )
}

export { Card }