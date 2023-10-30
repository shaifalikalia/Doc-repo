import { useEffect, useRef } from "react";

const useReadOnlyDateTextInput = () => {
  const datePickerRef = useRef(null);

  useEffect(() => {
    if (datePickerRef?.current?.input) {
      if (!datePickerRef.current.input.readOnly) {
        datePickerRef.current.input.readOnly = true;
      }
    }
  });

  return datePickerRef;
};

export default useReadOnlyDateTextInput;
