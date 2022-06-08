import React, { useCallback, useEffect, useState } from 'react';
import { Check, DownArrow } from '../../../assets';
import './selectInput.css';

const SelectInput = ({
    inputName,
    placeholder,
    required = true,
    getSelectedItem = () => { },
    label = null,
    selectItems,
    currentlySelected = '',
    profileSelect = false
}) => {
    const [dropdownState, setDropdownState] = useState(false);
    const [dropdownItem, setDropdownItem] = useState({});

    const getSelectedCallBack = useCallback(() => {
        getSelectedItem(dropdownItem);
    }, [dropdownItem]);

    useEffect(() => {
        getSelectedCallBack();
        setDropdownState(false);
    }, [dropdownItem, getSelectedCallBack]);

    console.log(inputName, currentlySelected);

    return (
        <>
            {label ? (
                <p className="select_label" onClick={() => setDropdownState(false)}>
                    {label}
                </p>
            ) : (
                <></>
            )}
            <input
                type={'text'}
                name={inputName}
                placeholder={placeholder}
                required={required}
                className="select_input"
                autoComplete="off"
                onFocus={() => setDropdownState(true)}
                // onBlur={() => setDropdownState(false)}
                value={dropdownItem.selected || ''}
                readOnly
            />
            <span
                className={`${profileSelect ? 'profile_select_icon' : 'select_dropdown_icon'}`}
                onClick={() => setDropdownState(!dropdownState)}
            >
                <DownArrow />
            </span>
            {dropdownState ? (
                <div className="dropdown">
                    {selectItems?.map((item, i) => (
                        <React.Fragment key={i}>
                            <div
                                id={item}
                                name={inputName}
                                className={`select_dropdown_item d-flex ${dropdownItem.selected === item ? 'item_active' : ''
                                    } justify-content-between pl-2`}
                                onClick={(e) =>
                                    setDropdownItem({
                                        selected: item,
                                        header: inputName
                                    })
                                }
                            >
                                <p className="p-0 my-auto dropdown_item ">{item}</p>
                                {item === dropdownItem.selected ? (
                                    <span className="my-auto mr-2">
                                        <Check />
                                    </span>
                                ) : (
                                    <></>
                                )}
                            </div>
                        </React.Fragment>
                    ))}
                </div>
            ) : (
                <></>
            )}
        </>
    );
};

export { SelectInput };
