import { useCallback, useEffect, useRef } from "react";

const maxHistoryLength = 50;

/**
 * Generic undo/redo for a single editor entity. It records JSON snapshots of
 * the entity as it changes and lets the editor step back and forward through
 * them. Snapshots produced by undo/redo itself are not re-recorded.
 *
 * @param value     the entity currently being edited (or null when none)
 * @param applyValue applies a restored snapshot back into the editor
 * @param identity  a stable id for the entity; changing it clears the history
 */
export function useUndoRedo<T>(
  value: T | null,
  applyValue: (next: T) => void,
  identity: string | null,
) {
  const historyRef = useRef<string[]>([]);
  const pointerRef = useRef<number>(-1);
  const isApplyingRef = useRef<boolean>(false);

  useEffect(() => {
    historyRef.current = value === null ? [] : [JSON.stringify(value)];
    pointerRef.current = value === null ? -1 : 0;
    isApplyingRef.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset history only when a different entity is loaded
  }, [identity]);

  useEffect(() => {
    if (value === null) {
      return;
    }

    // Skip snapshots that result from applying an undo/redo.
    if (isApplyingRef.current) {
      isApplyingRef.current = false;
      return;
    }

    const snapshot = JSON.stringify(value);
    if (historyRef.current[pointerRef.current] === snapshot) {
      return;
    }

    const truncated = historyRef.current.slice(0, pointerRef.current + 1);
    truncated.push(snapshot);
    if (truncated.length > maxHistoryLength) {
      truncated.shift();
    }
    historyRef.current = truncated;
    pointerRef.current = truncated.length - 1;
  }, [value]);

  const undo = useCallback(() => {
    if (pointerRef.current <= 0) {
      return;
    }

    pointerRef.current -= 1;
    isApplyingRef.current = true;
    applyValue(JSON.parse(historyRef.current[pointerRef.current]) as T);
  }, [applyValue]);

  const redo = useCallback(() => {
    if (pointerRef.current >= historyRef.current.length - 1) {
      return;
    }

    pointerRef.current += 1;
    isApplyingRef.current = true;
    applyValue(JSON.parse(historyRef.current[pointerRef.current]) as T);
  }, [applyValue]);

  return { undo, redo };
}
