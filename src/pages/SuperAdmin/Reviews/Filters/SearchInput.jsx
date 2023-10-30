import { debounce } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router";
import qs from "query-string";
import constants from "./../../../../constants";
import useQueryParam from "hooks/useQueryParam";

function SearchInput({ placeholderKey, t }) {
  const searchTerm = useQueryParam("search", "");
  const [input, setInput] = useState(null);

  const location = useLocation();
  const debounceDuration = 1500;

  const history = useHistory();
  // eslint-disable-next-line
  const handler = useCallback(
    debounce((_searchTerm, query) => {
      query.pageNumber = 1;

      if (_searchTerm.trim().length === 0) {
        delete query.search;
      } else {
        query.search = encodeURIComponent(_searchTerm.trim());
      }

      history.push({
        pathname: constants.routes.superAdmin.reviews,
        search: qs.stringify(query),
      });
    }, debounceDuration),
    []
  );

  // We need to execute debounce handler whenever 'user types'
  // and this effect executes when user types.
  useEffect(() => {
    if (input !== null) {
      handler(input, qs.parse(location.search));
    }
    // eslint-disable-next-line
  }, [input]);

  useEffect(() => {
    return () => {
      handler.cancel();
    };
    //eslint-disable-next-line
  }, []);

  return (
    <div className="search-box">
      <input
        type="text"
        placeholder={t(placeholderKey)}
        onChange={(e) => setInput(e.target.value)}
        value={input === null ? decodeURIComponent(searchTerm) : input}
      />
      <span className="ico">
        <img
          src={require("assets/images/search-icon.svg").default}
          alt="icon"
        />
      </span>
    </div>
  );
}

export default withTranslation()(SearchInput);
