import React from 'react'

const AddToCalendar = (props) => {
    const { handleAddToCalendar, setToolTipModal, firstIcon, middleText, secondIcon } = props;
    return (
        <span
            style={{ display: "flex", alignItems: "end" }}
            className='link-btn' onClick={handleAddToCalendar}
        >
            <img
                style={{ display: "inline-block" }}
                src={firstIcon} alt="download-icon" className='mr-2'
            />
            <div style={{ display: "inline-block" }}>{middleText}</div>
            <img
                style={{ display: "inline-block" }}
                src={secondIcon}
                alt="download-icon"
                className='ml-3'
                onClick={(e) => {
                    e.stopPropagation();
                    setToolTipModal(true);
                }}
            />
        </span>
    )
}

export default AddToCalendar