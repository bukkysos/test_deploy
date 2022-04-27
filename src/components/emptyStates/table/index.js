import React from 'react';
import { EmptyTableIcon } from '../../../assets';
import './emptyTable.css';

const EmptyTableState = () => {
    return (
        <div
            className="col-12 h-100 d-flex flex-column justify-content-center align-items-center empty_description p-0"
            style={{ position: 'relative', zIndex: 0 }}
        >
            <EmptyTableIcon />
            <h6 className="text-center w-75 my-2">Empty Table</h6>
            <p className="text-center w-75 my-2">
                There are currently no avaliable data. Please try again later.
            </p>
        </div>
    );
};

export { EmptyTableState };
