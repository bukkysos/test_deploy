import React, { useEffect, useState } from 'react';
import { Filter, LoadingIcon, SearchIcon, SortIcon } from '../../assets';
import { Button } from '../button';
import { EmptyTableState } from '../emptyStates';
import { SelectInput } from '../input';
import './table.css';

const Table = ({
    headerItems = ['Timestamp', 'Credits', 'Amount', 'Method', 'Subscriber ID'],
    tableContents,
    filterButtonText = 'Export CSV',
    // showBtn = false,
    iconDisplay = false,
    showModal,
    // buttonText = "Gift Credit",
    sortData,
    onInputChange,
    filterItems = [],
    isEmptyTable = false,
    getFilterDropdown = () => {},
    filterButtonState = false,
    csvFile
}) => {
    const [dropDownState, setDropDownState] = useState(false);
    const [searchShow, setSearchShow] = useState(false);
    const [filterParams, setFilterParams] = useState({
        selectedItem: '',
        headerItem: ''
    });
    const [sort, setSort] = useState({
        headerItem: headerItems[0],
        sortState: false
    });

    useEffect(() => {
        sortData(sort);
    }, [sortData, sort]);

    return (
        <>
            <div className="d-flex filter_tab mb-4">
                <div
                    className="d-flex justify-content-start filter_tab_filter_method"
                    onClick={() => setDropDownState(!dropDownState)}
                >
                    <span className="my-auto">
                        <Filter />
                    </span>
                    <p className="p-0 my-auto">
                        Filtered By :{' '}
                        {filterParams?.headerItem === '' || filterParams?.headerItem === undefined
                            ? 'Method'
                            : filterParams.headerItem}
                    </p>
                </div>
                {dropDownState && filterItems.filterItem ? (
                    <div className="filter_dropdown">
                        {filterItems?.filterItem?.map((item, i) => (
                            <React.Fragment key={i}>
                                <p className="p-0 mb-1">{item}</p>
                                <div className="filter_dropdown_input mb-4">
                                    <SelectInput
                                        inputName={item}
                                        placeholder="Select filter"
                                        selectItems={filterItems.filterState[item]}
                                        getSelectedItem={(selectedItem) => {
                                            setFilterParams((prevState) => ({
                                                ...prevState,
                                                selectedItem: selectedItem.selected,
                                                headerItem: selectedItem.header
                                            }));
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
                                    onButtonClick={() => setDropDownState(false)}
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

                <div className="d-flex align-items-center filter_tab_search">
                    <div className="search_mobile_icon" onClick={() => setSearchShow(!searchShow)}>
                        <SearchIcon />
                    </div>

                    {window.screen.width < 767 ? (
                        searchShow ? (
                            <>
                                <input
                                    type="text"
                                    name="search"
                                    placeholder="Search..."
                                    onBlur={() => setSearchShow(false)}
                                    onChange={(e) => onInputChange(e.target.value)}
                                    autoComplete={'off'}
                                    style={{ border: 'none' }}
                                    className="search"
                                />
                            </>
                        ) : (
                            <></>
                        )
                    ) : (
                        <>
                            {' '}
                            <input
                                type="text"
                                name="search"
                                placeholder="Search..."
                                onChange={(e) => onInputChange(e.target.value)}
                                autoComplete={'off'}
                                style={{ border: 'none' }}
                                className="search"
                            />
                        </>
                    )}

                    <div className="filter_tab_export_button">
                        {filterButtonText === 'Add Number' ? (
                            <Button
                                buttonType="secondary"
                                buttonText={filterButtonText}
                                loading={filterButtonState}
                                exportBtn={true}
                                onButtonClick={() =>
                                    filterButtonText === 'Add Number' ? showModal(true) : null
                                }
                            />
                        ) : (
                            <a
                                href={csvFile}
                                className="button mt-4 mx-auto mb-3 secondary"
                                download="Data"
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                    marginTop: '0px',
                                    padding: '5px 10px'
                                }}
                            >
                                {filterButtonState ? (
                                    <span>
                                        <>
                                            <span className="mr-2 btn_loading">
                                                <LoadingIcon fill={'#fff'} />{' '}
                                            </span>
                                            Export CSV
                                        </>
                                    </span>
                                ) : (
                                    'Export CSV'
                                )}
                            </a>
                        )}
                    </div>
                </div>
            </div>

            <div className="table-responsive component_table mb-4">
                {!isEmptyTable ? (
                    <table className="table table-striped mb-4">
                        <thead>
                            <tr>
                                <th
                                    className={`mobile_sticky_table_side`}
                                    onClick={() =>
                                        setSort((prevState) => ({
                                            ...prevState,
                                            headerItem: headerItems[0],
                                            sortState: !prevState.sortState
                                        }))
                                    }
                                >
                                    {headerItems[0]} {headerItems[0] !== 'Operator' && <SortIcon />}
                                </th>
                                <th
                                    onClick={
                                        headerItems[1] === 'Credits' || headerItems[1] === 'Mobile'
                                            ? () =>
                                                  setSort((prevState) => ({
                                                      ...prevState,
                                                      headerItem: headerItems[1],
                                                      sortState: !prevState.sortState
                                                  }))
                                            : () => {}
                                    }
                                >
                                    {' '}
                                    {headerItems[1]}{' '}
                                    {headerItems[1] === 'Credits' || headerItems[1] === 'Mobile' ? (
                                        <SortIcon />
                                    ) : (
                                        <></>
                                    )}{' '}
                                </th>
                                <th
                                    onClick={() =>
                                        iconDisplay
                                            ? setSort((prevState) => ({
                                                  ...prevState,
                                                  headerItem: headerItems[2],
                                                  sortState: !prevState.sortState
                                              }))
                                            : () => {}
                                    }
                                >
                                    {headerItems[2]} {iconDisplay ? <SortIcon /> : <></>}
                                </th>
                                <th>{headerItems[3]}</th>
                                {headerItems[4] ? <th>{headerItems[4]}</th> : <></>}
                                {headerItems[5] ? <th>{headerItems[5]}</th> : <></>}
                            </tr>
                        </thead>
                        <tbody>{tableContents}</tbody>
                    </table>
                ) : (
                    <EmptyTableState />
                )}
            </div>
        </>
    );
};

export { Table };
