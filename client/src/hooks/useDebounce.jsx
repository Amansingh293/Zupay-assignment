import React, { useCallback, useRef } from "react";

const useDebounce = (callBack, delay) => {
  const timerRef = useRef();

  const debounce = useCallback(
    (...args) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        callBack(...args);
      }, delay);
    },
    [callBack, delay]
  );

  return debounce;
};

export default useDebounce;
