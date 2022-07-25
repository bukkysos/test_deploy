import React, { useCallback, useEffect, useState } from 'react';
import { Check, DownArrow } from '../../../assets';
import './selectInput.css';

const SelectInput = ({
    inputName,
    placeholder,
    required = true,
    getSelectedItem = () => {},
    label = null,
    selectItems,
    validateRRRSelect = false,
    profileSelect = false,
    error = false,
    errorText = '',
    onblur = () => {}
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
                onBlur={() => onblur()}
                value={dropdownItem.selected || ''}
                readOnly
            />
            {error ? (
                <p className={`text-danger error_text p-0 m-0`}>
                    <em>
                        <small>{errorText}</small>
                    </em>
                </p>
            ) : (
                <></>
            )}
            <span
                className={`${
                    profileSelect
                        ? 'profile_select_icon'
                        : validateRRRSelect
                        ? 'validate-rrr-dropdown-icon'
                        : 'select_dropdown_icon'
                }`}
                onClick={() => {
                    setDropdownState(!dropdownState);
                    onblur();
                }}
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
                                className={`select_dropdown_item d-flex ${
                                    dropdownItem.selected === item ? 'item_active' : ''
                                } justify-content-between pl-2`}
                                onClick={() =>
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
