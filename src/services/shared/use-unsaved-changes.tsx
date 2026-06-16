import { useCallback, useEffect, useMemo, useState } from "react";

/**
 * Tracks whether an editor entity has unsaved changes by comparing it against
 * the last saved snapshot. Also warns the user before leaving the page while
 * there are unsaved changes.
 *
 * @param current  the entity currently being edited (or null when none is open)
 * @param identity a stable id for the entity; when it changes the baseline is
 *                 reset so loading a different entity does not look "dirty"
 */
export function useUnsavedChanges<T>(current: T | null, identity: string | null) {
  const [savedSnapshot, setSavedSnapshot] = useState<string | null>(() =>
    current === null ? null : JSON.stringify(current),
  );

  // Only re-serialize when the entity reference actually changes, so playback
  // re-renders (which keep the same reference) stay cheap.
  const currentSnapshot = useMemo(
    () => (current === null ? null : JSON.stringify(current)),
    [current],
  );

  const isDirty = savedSnapshot !== null && currentSnapshot !== savedSnapshot;

  // Pass an explicit value when the saved entity differs from the current
  // state (e.g. a thumbnail added during save), otherwise the current
  // entity is used as the new baseline.
  const markSaved = useCallback(
    (value?: T | null) => {
      const snapshot = value !== undefined ? value : current;
      setSavedSnapshot(snapshot === null ? null : JSON.stringify(snapshot));
    },
    [current],
  );

  // Rebaseline whenever a different entity is loaded or the editor is cleared.
  useEffect(() => {
    setSavedSnapshot(current === null ? null : JSON.stringify(current));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- rebaseline only on identity change
  }, [identity]);

  useEffect(() => {
    if (!isDirty) {
      return;
    }

    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  return { isDirty, markSaved };
}
