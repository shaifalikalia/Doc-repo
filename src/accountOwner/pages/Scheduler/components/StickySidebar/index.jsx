import React, { useEffect, useState } from 'react';
import styles from "./SchedulerSidebar.module.scss";
import { withTranslation } from 'react-i18next';
import Tooltip from "reactstrap/lib/Tooltip";

function StickySidebar({ children, t , isSidebarActive , handleSidebarToggle , resetFilter }) {
    useEffect(() => {
        if (isSidebarActive) {
            document.body.classList.add("schedular-sidebar-active");
        } else {
            document.body.classList.remove("schedular-sidebar-active");
        }
    }, [isSidebarActive])

    const [tooltipFilter, setTooltipFilter] = useState(false);
    return (
        <div
            className={styles['scheduler-sidebar']  + `${isSidebarActive ? " sidebar-active " + styles['sidebar-active'] : ""}`}>
            <div className={styles["sidebar-arrow"]} onClick={() => { handleSidebarToggle && handleSidebarToggle() }}>
                 <img  id="TooltipFilterBtn" src={require('assets/images/sidebar-arrow.svg').default} alt="icon" />
            </div>
            <Tooltip
                  isOpen={tooltipFilter}
                  placement="right"
                  target="TooltipFilterBtn"
                  toggle={() => {
                    setTooltipFilter(!tooltipFilter);
                  }}
                >
                  {isSidebarActive ? t("accountOwner.hideFilters") : t("accountOwner.showFilters")}
                </Tooltip>
         
            
            <div className={"scheduler-sidebar " + styles["siderbar-inner"]}>
                <div className={styles["reset-filter-btn"]}>
                    <span className="link-btn" onClick={()=>{resetFilter && resetFilter()}}>{t("accountOwner.resetFilter")}</span>
                </div>
                {children}
            </div>
        </div>
    );
}

export default withTranslation()(StickySidebar);