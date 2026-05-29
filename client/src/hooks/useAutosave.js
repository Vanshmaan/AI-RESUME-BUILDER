import { useEffect, useRef } from "react";
import { useDebounce } from "./useDebounce";

export const useAutosave = (data, saveFn, delay = 2000, enabled = true) => {
  const debouncedData = useDebounce(data, delay);
  const isFirst = useRef(true);
  const saving = useRef(false);

  useEffect(() => {
    if (!enabled || !debouncedData?._id) return;

    if (isFirst.current) {
      isFirst.current = false;
      return;
    }

    if (saving.current) return;

    const run = async () => {
      saving.current = true;
      try {
        await saveFn(debouncedData, { silent: true });
      } finally {
        saving.current = false;
      }
    };

    run();
  }, [debouncedData, enabled]);
};
