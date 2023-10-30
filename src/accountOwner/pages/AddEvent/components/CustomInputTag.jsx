import React, { useState } from "react";
import { withTranslation } from "react-i18next";

function CustomInputTag({ t, tagslist, setTagslist, eventId }) {
  const [tag, setTag] = useState("");
  const [error, setError] = useState("");

  const filtertagslist = tagslist.filter((e) => e.IsDeleted === false);
  const removeTag = (title) => {
    const allReadyAvaliable = [...tagslist];

    const getIndex = allReadyAvaliable.findIndex(
      (e) => e.title.trim() == title.trim()
    );

    if (allReadyAvaliable?.[getIndex]?.isFromDetail) {
      allReadyAvaliable[getIndex].IsDeleted = true;
    } else {
      allReadyAvaliable.splice(getIndex, 1);
    }

    setTagslist(allReadyAvaliable);
    if (tag && tag.trim().length > 32) {
      setError(t("form.errors.maxLimit", { limit: "32" }));
    } else {
      setError("");
    }
  };

  const addTag = (event) => {
    let allReadyAvaliable = [...filtertagslist];
    let allEvents = [...tagslist];
    const alreadyAdded = allReadyAvaliable.some((item) => item.title === tag);
    if (
      (event.keyCode === 13 || event.key === "Enter") &&
      tag.trim().length &&
      filtertagslist.length < 5
    ) {
      if (!alreadyAdded) {
        allEvents.push({
          id: 0,
          schedulerEventId: eventId ? eventId : 0,
          title: tag.trim(),
          IsDeleted: false,
          isFromDetail: false,
        });
        setTagslist(allEvents);
      }
      setTag("");
    }
  };

  return (
    <>
      <div className="input-tag-group">
        <div className="form-control d-inline-flex flex-wrap">
          {filtertagslist.length > 0 &&
            filtertagslist.map((tagName, index) => (
              <div
                key={index}
                tabindex="0"
                className="badge bg-secondary bg-gradient "
              >
                {tagName?.title}
                <button
                  tabindex="-1"
                  className="border-0 bg-transparent"
                  onClick={() => {
                    removeTag(tagName?.title);
                  }}
                >
                  <img
                    src={require("assets/images/tag-close.svg").default}
                    alt="icon"
                  />
                </button>
              </div>
            ))}
          <input
            onChange={(e) => {
              setTag(e.currentTarget.value);
              if (filtertagslist.length < 5 && tag.trim().length > 32) {
                setError(t("form.errors.maxLimit", { limit: "32" }));
              } else if (
                filtertagslist.length === 5 &&
                e.currentTarget.value.trim().length > 0
              ) {
                setError(t("form.errors.maximumTags", { limit: "5" }));
              } else {
                setError("");
              }
            }}
            value={tag}
            onKeyDown={(e) => {
              tag &&
                tag?.trim()?.length &&
                tag.trim().length <= 32 &&
                addTag(e);
            }}
            className="border-0 w-auto flex-fill input-tags"
          />
        </div>
        {tag.length > 0 && error && <span className="error-msg"> {error}</span>}
      </div>
    </>
  );
}

export default withTranslation()(CustomInputTag);
