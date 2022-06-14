import React, { useState } from 'react';
import { Button } from '../../button';
import { SelectInput } from '../../input';
import { LoadingIcon } from '../../../assets';
import { Blank } from '../../../assets';
// import { EmptyTableState } from '../../emptyStates';
import { EmptyDependentState } from '../../../components';

import './newTable.css';

const OperatorLogos = {
    '9Mobile': 'TU1VZC4J9',
    MTN: 'ODVDBF2MB',
    Airtel: 'RQAXA3A4E',
    Ntel: 'YR27Y3B2C',
    smile: 'FZVSMZKC4',
    Glo: 'NVTWIWMYQ',
    Spectranet: 'QGSJZDQO3'
};

export const LinkNumbersTable = ({
    showModal,
    getFilterDropdown = () => {},
    handleLoadMore = () => {},
    loadingTableData,
    totalPageNo,
    currentPageNo,
    isEmptyTable = false,
    canLoadMore = false,
    tableContent
}) => {
    const [dropDownState, setDropDownState] = useState();
    const [filterParams, setFilterParams] = useState({
        selectedItem: '',
        headerItem: ''
    });

    const filterItems = {
        filterItem: ['Operator'],
        filterState: {
            Operator: ['MTN', 'Glo', 'Airtel', '9Mobile', 'Ntel', 'smile', 'Spectranet']
        }
    };

    return (
        <>
            <div className="numbers_display_wrapper">
                <div className="numbers_display_container">
                    <div className="d-flex justify-content-center numbers_filter_tab">
                        <div
                            className="d-flex justify-content-start numbers_filter_method"
                            onClick={() => setDropDownState(!dropDownState)}
                        >
                            <p className="p-0 my-auto">Filtered By : Method</p>
                        </div>

                        {dropDownState && filterItems.filterItem ? (
                            <div className="filter_dropdown operator_filter_dropdown">
                                {filterItems?.filterItem?.map((item, i) => (
                                    <React.Fragment key={i}>
                                        <p className="p-0 mb-1">{item}</p>
                                        <div className="filter_dropdown_input mb-4">
                                            <SelectInput
                                                inputName={item}
                                                placeholder="Select filter"
                                                selectItems={filterItems.filterState[item]}
                                                getSelectedItem={(selectedItem) => {
                                                    setFilterParams({
                                                        selectedItem: selectedItem.selected,
                                                        headerItem: selectedItem.header
                                                    });
                                                }}
                                            />
                                        </div>
                                    </React.Fragment>
                                ))}
                                <div className="filter_dropdown_buttons">
                                    <div className="col-4 p-0">
                                        <Button
                                            buttonText="Cancel"
                                            buttonType="default"
                                            exportBtn={true}
                                            onButtonClick={() => {
                                                getFilterDropdown({
                                                    selectedItem: '',
                                                    headerItem: ''
                                                });
                                                setDropDownState(false);
                                            }}
                                        />
                                    </div>
                                    <div className="col-7 p-0">
                                        <Button
                                            buttonText="Apply Filter"
                                            buttonType="standard"
                                            exportBtn={true}
                                            onButtonClick={() => {
                                                getFilterDropdown(filterParams);
                                                setDropDownState(false);
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <></>
                        )}
                        <div className="filter_tab_export_button">
                            <Button
                                buttonType="secondary"
                                buttonText={'Add Number'}
                                loading={false}
                                exportBtn={true}
                                onButtonClick={() => showModal(true)}
                            />
                        </div>
                    </div>
                    <div className="mx-3 mb-4">
                        <div className="numbers_display_section">
                            {!isEmptyTable ? (
                                <p className="mb-2">
                                    Showing {currentPageNo} out of {totalPageNo}
                                </p>
                            ) : (
                                <></>
                            )}
                        </div>

                        {isEmptyTable ? (
                            <EmptyDependentState
                                classname="numbers_empty"
                                message={`You currently do not have any Mobile Numbers under ${
                                    filterParams.headerItem.length
                                        ? `the ${filterParams.selectedItem}`
                                        : 'this'
                                } operator.`}
                            />
                        ) : tableContent.length ? (
                            tableContent.map((content, index) => (
                                <React.Fragment key={index}>
                                    <div className="d-flex justify-content-start align-items-center number_strip">
                                        {!content.operator ? (
                                            <img
                                                className="operator_logo mr-2"
                                                src={Blank}
                                                alt="Blank"
                                            />
                                        ) : (
                                            <img
                                                className="operator_logo mr-2"
                                                src={`https://applications.fra1.digitaloceanspaces.com/Logo_${
                                                    OperatorLogos[content.operator]
                                                }`}
                                                alt="Operator"
                                            />
                                        )}
                                        <div>
                                            <p>{content.msisdn}</p>
                                            <p>{content.operator || ''}</p>
                                        </div>
                                    </div>
                                </React.Fragment>
                            ))
                        ) : (
                            <div className="load_more_indicator">
                                <span>
                                    <LoadingIcon className="col-12" fill="#27923E" />
                                </span>
                            </div>
                        )}
                    </div>
                </div>
                {canLoadMore && (
                    <div className="load_more_numbers d-flex justify-content-center">
                        <Button
                            buttonType="secondary"
                            buttonText="Load More"
                            loading={loadingTableData}
                            exportBtn={true}
                            onButtonClick={() => handleLoadMore()}
                        />
                    </div>
                )}
            </div>
        </>
    );
};
