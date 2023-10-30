import React, { useState } from "react";
import { LoaderIcon } from "react-hot-toast";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

const CustomSelect = (props) => {
  const {
    Title,
    Classes,
    Error,
    options,
    selectOption,
    selectedOption,
    pagination = false,
    hasMoreData = false,
    loadMoreData = () => {},
    id,
    getUniqKey = (op) => op?.id,
    getName = (op) => op?.name,
    dropdownClasses,
    disable,
  } = props;

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const dropdownList = options.map((op) => {
    const key = getUniqKey(op);
    const name = getName(op);
    const isSelected = key === getUniqKey(selectedOption);
    return (
      <DropdownItem
        key={key}
        onClick={() => selectOption(op)}
        className={isSelected ? "selected" : ""}
      >
        <span>{name}</span>
      </DropdownItem>
    );
  });
  const withPagination = (
    <InfiniteScroll
      dataLength={options?.length}
      hasMore={hasMoreData}
      next={loadMoreData}
      scrollableTarget={id}
      loader={
        <DropdownItem tag="div" className="custom-dropdown-loader">
          <LoaderIcon />
        </DropdownItem>
      }
    >
      {dropdownList}
    </InfiniteScroll>
  );

  return (
    <div
      className={`c-field ${Classes ? Classes : ""} ${
        Error ? "error-input" : ""
      }`}
    >
      <label>{Title}</label>
      <Dropdown
        disabled={disable ? disable : false}
        isOpen={dropdownOpen}
        toggle={toggle}
        className={`select-common-dropdown ${
          dropdownClasses ? dropdownClasses : ""
        }`}
      >
        <DropdownToggle caret={false} className={"selected-item"} tag="div">
          <span>{getName(selectedOption)}</span>
          <img src={require("assets/images/caret.svg").default} alt="caret" />
        </DropdownToggle>
        <DropdownMenu right id={id}>
          {!pagination && dropdownList}
          {pagination && withPagination}
        </DropdownMenu>
      </Dropdown>
      {Error && <span className="error-msg">{Error}</span>}
    </div>
  );
};

export default CustomSelect;
