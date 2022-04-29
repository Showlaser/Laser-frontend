import { LinearProgress } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import "./index.css";
import HeartBrokenIcon from "@mui/icons-material/HeartBroken";
import { stringIsEmpty } from "services/shared/general";

export default function Loading({ children, objectToLoad }) {
  const [hideLoading, setHideLoading] = useState(true);
  const [loadingFailed, setLoadingFailed] = useState(false);
  const objectToLoadRef = useRef();
  objectToLoadRef.current = objectToLoad;

  useEffect(() => {
    if (!objectIsNotLoaded(objectToLoadRef.current)) {
      setHideLoading(true);
      return;
    }

    setTimeout(() => {
      if (objectIsNotLoaded(objectToLoadRef.current)) {
        setHideLoading(false);
      }
    }, 100);

    setTimeout(() => {
      if (objectIsNotLoaded(objectToLoadRef.current)) {
        setLoadingFailed(true);
        setHideLoading(true);
      }
    }, 5000);
  }, [hideLoading, loadingFailed, objectToLoadRef.current]);

  const objectIsNotLoaded = (obj) => {
    if (obj === undefined || obj === null) {
      return true;
    }

    return typeof obj === "string" && stringIsEmpty(obj);
  };

  return loadingFailed ? (
    <div id="loading-failed">
      <HeartBrokenIcon fontSize="large" />
      <br />
      Oh no! We've lost connection
      <br />
      <small>Try reloading the page</small>
    </div>
  ) : (
    <span>
      <span hidden={hideLoading}>
        <LinearProgress />
      </span>
      <span hidden={objectIsNotLoaded(objectToLoadRef.current)}>
        {children}
      </span>
    </span>
  );
}
