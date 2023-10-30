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
    hasMoreData,
    loadMoreData,
    id,
    getUniqKey = (op) => op?.id,
    getName = (op) => op?.promoCode,
  } = props;

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const dropdownList = options.map((op, index) => {
    const key = getUniqKey(op);
    const name = getName(op);
    const isSelected = key === getUniqKey(selectedOption);
    return (
      <DropdownItem
        key={index}
        onClick={() => selectOption(op)}
        className={isSelected ? "selected" : ""}
      >
        <div className="d-flex justify-content-between">
          <span>{name}</span>
          <span className="right-content">
            {op?.discountAllowed} % discount
          </span>
        </div>
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
        isOpen={dropdownOpen}
        toggle={toggle}
        className={"select-common-dropdown"}
      >
        <DropdownToggle caret={false} className={"selected-item"} tag="div">
          <span>{getName(selectedOption)}</span>
          <img src={require("assets/images/caret.svg").default} alt="caret" />
        </DropdownToggle>
        <DropdownMenu right>
          <div
            id={id}
            className="max-height"
            style={{
              maxHeight: "300px",
              overflow: "scroll",
            }}
          >
            {withPagination}
          </div>
        </DropdownMenu>
      </Dropdown>
      {Error && <span className="error-msg">{Error}</span>}
    </div>
  );
};

export default CustomSelect;
