import React, { useState } from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

/**
 * @param {{id: any, name: string }[]} options - Array of options
 * @param {id} selectedOption - Selected option's Id
 * @param {function} selectOption - function to select the option
 */
const CustomDropdown = ({ options, selectedOption, selectOption }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);

  return (
    <Dropdown
      isOpen={dropdownOpen}
      toggle={toggle}
      className="select-common-dropdown"
    >
      <DropdownToggle caret={false} className="selected-item" tag="div">
        <span>{options.find((op) => op.id == selectedOption)?.name}</span>
        <img src={require("assets/images/caret.svg").default} alt="caret" />
      </DropdownToggle>

      <DropdownMenu right>
        {options.map((op) => {
          const { id, name } = op;
          return (
            <DropdownItem key={id} onClick={() => selectOption(id)}>
              <span>{name}</span>
            </DropdownItem>
          );
        })}
      </DropdownMenu>
    </Dropdown>
  );
};

export default CustomDropdown;
