import { Alert } from "@mui/material";

export default function HighPoweredBeamsWarning() {
  return localStorage.getItem("development-mode-active") ? null : (
    <Alert severity="warning">
      Development mode is not active. Watch out for high powered beams!
    </Alert>
  );
}
