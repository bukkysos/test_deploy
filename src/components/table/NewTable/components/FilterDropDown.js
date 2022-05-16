import React, { useState, useEffect } from 'react';
import { Button } from '../../../button';
import { SelectInput } from '../../../input';

export const FilterDropdown = ({
    filterItems,
    handleSelectedData = () => {},
    applyFilter = () => {},
    cancelFilter = () => {}
}) => {
    // const [selectedItem, setSelectedItem] = useState('');
    const [filterParams, setFilterParams] = useState({
        selectedItem: '',
        headerItem: ''
    });

    useEffect(() => {
        handleSelectedData(filterParams);

        return () => {};
    }, [filterParams]);

    return (
        <>
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
                            onButtonClick={() => cancelFilter()}
                        />
                    </div>
                    <div className="col-7 p-0">
                        <Button
                            buttonText="Apply Filter"
                            buttonType="standard"
                            exportBtn={true}
                            // onButtonClick={() => {
                            //     getFilterDropdown(filterParams);
                            //     setDropDownComponentsState(false);
                            // }}
                            onButtonClick={() => applyFilter()}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};
