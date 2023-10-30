import Toast from "components/Toast/Alert";
import React, { useEffect } from "react";
import { useState } from "react";
import { useDoctorOffices } from "repositories/doctor-repository";
import OfficeCard from "./OfficeCard";
import styles from "./Offices.module.scss";
import { motion } from "framer-motion";
import InfiniteScroll from "react-infinite-scroll-component";

const pageSize = 12;
const animationVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

function OfficeGrid({ doctorId }) {
  const [pageNumber, setPageNumber] = useState(1);
  const [offices, setOffices] = useState([]);
  const { isLoading, data, error } = useDoctorOffices(
    doctorId,
    pageNumber,
    pageSize
  );
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    if (!isLoading && data.items) {
      setOffices((o) => [...o, ...data.items]);
      setTotalItems(data.totalItems);
    }
  }, [isLoading, data]);

  if (isLoading && offices.length === 0) {
    return (
      <div className="center h-50vh">
        <div className="loader"></div>
      </div>
    );
  }

  if (!isLoading && error) {
    return <Toast errorToast message={error.message} />;
  }

  let items = offices.map((it) => (
    <div className="col-xl-3 col-lg-4 col-md-6">
      <OfficeCard doctorId={doctorId} office={it} />
    </div>
  ));

  return (
    <div className={styles["doctor-office-block"]}>
      <motion.div variants={animationVariants} initial="hidden" animate="show">
        <InfiniteScroll
          className="row"
          dataLength={offices.length}
          hasMore={offices.length < totalItems}
          next={() => setPageNumber((v) => v + 1)}
        >
          {items}
        </InfiniteScroll>
      </motion.div>
    </div>
  );
}

export default OfficeGrid;
