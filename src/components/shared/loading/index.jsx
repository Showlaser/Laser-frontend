import { LinearProgress } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import "./index.css";
import HeartBrokenIcon from "@mui/icons-material/HeartBroken";

export default function Loading({ children, objectToLoad, style }) {
  const [hideLoading, setHideLoading] = useState(true);
  const [loadingFailed, setLoadingFailed] = useState(false);
  const objectToLoadRef = useRef();
  objectToLoadRef.current = objectToLoad;

  useEffect(() => {
    if (objectToLoad !== undefined) {
      setHideLoading(true);
      return;
    }

    setTimeout(() => {
      if (objectToLoadRef.current === undefined) {
        setHideLoading(false);
      }
    }, 100);

    setTimeout(() => {
      if (objectToLoadRef.current === undefined) {
        setLoadingFailed(true);
        setHideLoading(true);
      }
    }, 5000);
  }, [hideLoading, loadingFailed, objectToLoadRef.current]);

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
      <span hidden={objectToLoad === undefined}>{children}</span>
    </span>
  );
}
