import React from 'react'
import { EmptyDependentIcon } from '../../../assets/svg'
import "./emptyDependents.css"

const EmptyDependentState = () => {
    return (
        <div className="col-12 d-flex flex-column justify-content-center align-items-center empty_description p-0">
                <EmptyDependentIcon />
            <p className="text-center w-75 my-2">You currently do not have any dependents under your profile.</p>
        </div>
    )
}

export {EmptyDependentState}
