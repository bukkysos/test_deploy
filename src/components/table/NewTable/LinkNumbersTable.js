import React, { useState } from 'react';
// import { Filter, LoadingIcon, SearchIcon, SortIcon } from '../../../assets';
import { Filter, SearchIcon, SortIcon } from '../../../assets';
import { Button } from '../../button';
import './newTable.css';

export const LinkNumbersTable = () => {
    const [showInput, setShowInput] = useState(false);
    // const [dropDownState, setDropDownState] = useState();

    const filterItems = {
        filterItem: ['Status'],
        filterState: {
            Status: ['Active', 'Inactive']
        }
    };
    return (
        <>
            <div className="d-flex filter_tab mb-4">
                <div
                    className="d-flex justify-content-start filter_tab_filter_method"
                    onClick={() => {}}
                >
                    <span className="my-auto">
                        <Filter filterItems={filterItems}/>
                    </span>
                    <p className="p-0 my-auto">Filtered By : Method</p>
                </div>
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
                        {/* {filterButtonText === 'Add Number' ? ( */}
                        <Button
                            buttonType="secondary"
                            buttonText={'Export CSV'}
                            loading={false}
                            exportBtn={true}
                            onButtonClick={() => {}}
                        />
                    </div>
                </div>
            </div>
            <div className="table-responsive component_table mb-4">
                <table className="table table-striped mb-4">
                    <thead>
                        <tr>
                            <th className={`mobile_sticky_table_side`} onClick={() => {}}>
                                ID Number <SortIcon />
                            </th>
                            <th onClick={() => {}}>ID Number</th>
                            <th onClick={() => {}}>ID Number</th>
                            <th onClick={() => {}}>ID Number</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Data</td>
                            <td>Data</td>
                            <td>Data</td>
                            <td>Data</td>
                        </tr>
                        <tr>
                            <td>Data</td>
                            <td>Data</td>
                            <td>Data</td>
                            <td>Data</td>
                        </tr>
                        <tr>
                            <td>Data</td>
                            <td>Data</td>
                            <td>Data</td>
                            <td>Data</td>
                        </tr>
                        <tr>
                            <td>Data</td>
                            <td>Data</td>
                            <td>Data</td>
                            <td>Data</td>
                        </tr>
                        <tr>
                            <td>Data</td>
                            <td>Data</td>
                            <td>Data</td>
                            <td>Data</td>
                        </tr>
                        <tr>
                            <td>Data</td>
                            <td>Data</td>
                            <td>Data</td>
                            <td>Data</td>
                        </tr>
                        <tr>
                            <td>Data</td>
                            <td>Data</td>
                            <td>Data</td>
                            <td>Data</td>
                        </tr>
                        <tr>
                            <td>Data</td>
                            <td>Data</td>
                            <td>Data</td>
                            <td>Data</td>
                        </tr>
                        <tr>
                            <td>Data</td>
                            <td>Data</td>
                            <td>Data</td>
                            <td>Data</td>
                        </tr>
                        <tr>
                            <td>Data</td>
                            <td>Data</td>
                            <td>Data</td>
                            <td>Data</td>
                        </tr>
                        <tr>
                            <td>Data</td>
                            <td>Data</td>
                            <td>Data</td>
                            <td>Data</td>
                        </tr>
                        <tr>
                            <td>Data</td>
                            <td>Data</td>
                            <td>Data</td>
                            <td>Data</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
};
