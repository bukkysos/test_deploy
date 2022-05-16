import React, { useState } from 'react';
// import { Filter, LoadingIcon, SearchIcon, SortIcon } from '../../../assets';
import { Filter, SearchIcon, SortIcon } from '../../../assets';
import { Button } from '../../button';
import { FilterDropdown } from './components/FilterDropDown';
import { handleFilter, handleReverseData } from './components/utilities/reverseData';
import './newTable.css';

const filterItems = {
    filterItem: ['Status'],
    filterState: {
        Status: ['Active', 'Inactive']
    }
};

export const NewTable = ({ responseData, handleShowNumberModal = () => {}, showModal }) => {
    const [showInput, setShowInput] = useState(false);
    const [dropdownState, setDropdownState] = useState(false);
    const [filterValue, setFilterValue] = useState({});
    const [displayedData, setDisplayedData] = useState([]);
    const [dataAltered, setDataAltered] = useState(false);
    const [key, setKey] = useState(null);

    const sortTableData = (filterValue, responseData) => {
        if (responseData.length) {
            const sortedData = handleFilter(
                responseData,
                filterValue.selectedItem,
                filterValue.headerItem
            );
            if (sortedData) {
                setDisplayedData(sortedData);
                setDataAltered(true);
            }
        }
    };

    const reverseData = () => {
        if (dataAltered) {
            let tmpData = displayedData;
            let reversedData = handleReverseData(tmpData);
            setDisplayedData(reversedData);
        } else {
            let tmpData = responseData;
            let reversedData = handleReverseData(tmpData);
            setDisplayedData(reversedData);
            setDataAltered(true);
        }
        setKey(Math.random());
    };

    return (
        <>
            <div className="d-flex filter_tab mb-4">
                <div
                    className="d-flex justify-content-start filter_tab_filter_method"
                    onClick={() => {
                        setDropdownState((prevState) => !prevState);
                    }}
                >
                    <span className="my-auto">
                        <Filter />
                    </span>
                    <p className="p-0 my-auto">Filtered By : Method</p>
                </div>
                {dropdownState && (
                    <FilterDropdown
                        filterItems={filterItems}
                        handleSelectedData={(val) => setFilterValue(val)}
                        cancelFilter={() => {
                            setDropdownState(false);
                            setDataAltered(false);
                        }}
                        applyFilter={() => {
                            sortTableData(filterValue, responseData);
                            setDropdownState(false);
                        }}
                    />
                )}
                <div className="d-flex align-items-center filter_tab_search">
                    <div
                        className="search_mobile_icon"
                        onClick={() => {
                            setShowInput((prevState) => !prevState);
                        }}
                    >
                        <SearchIcon />
                    </div>
                    <input
                        type="text"
                        name="search"
                        placeholder="Search..."
                        onBlur={() => {}}
                        onChange={() => {}}
                        autoComplete={'off'}
                        style={{ border: 'none' }}
                        className={`search ${showInput ? 'input_visible' : 'input_hidden'}`}
                    />

                    <div className="filter_tab_export_button">
                        <Button
                            buttonType="secondary"
                            buttonText="Add Number"
                            loading={showModal}
                            exportBtn={true}
                            onButtonClick={() => {
                                handleShowNumberModal();
                            }}
                        />
                    </div>
                </div>
            </div>
            <div className="table-responsive component_table mb-4">
                <table className="table table-striped mb-4" key={key}>
                    <thead>
                        <tr>
                            <th
                                className={`mobile_sticky_table_side`}
                                onClick={() => reverseData()}
                            >
                                ID Number <SortIcon />
                            </th>
                            <th onClick={() => {}}>ID Number</th>
                            <th onClick={() => {}}>ID Number</th>
                            <th onClick={() => {}}>ID Number</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataAltered
                            ? displayedData.map((data, index) => (
                                  <tr key={index}>
                                      <td>{data?.idNumber ?? 'NA'}</td>
                                      <td>{data?.msisdn ?? 'NA'}</td>
                                      <td>{data?.deviceStatus ?? 'NA'}</td>
                                      <td>{data?.deviceID ?? 'NA'}</td>
                                  </tr>
                              ))
                            : responseData.map((data, index) => (
                                  <tr key={index}>
                                      <td>{data?.idNumber ?? 'NA'}</td>
                                      <td>{data?.msisdn ?? 'NA'}</td>
                                      <td>{data?.deviceStatus ?? 'NA'}</td>
                                      <td>{data?.deviceID ?? 'NA'}</td>
                                  </tr>
                              ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};
