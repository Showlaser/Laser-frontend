import { Button } from "@mui/material";
import "./index.css";

export default function Modal({ modal }) {
  return modal?.show ? (
    <div id="modal">
      <div id="modal-items">
        <h2>{modal?.title}</h2>
        <Button
          variant="contained"
          color="primary"
          onClick={() => modal?.onOkClick()}
        >
          Ok
        </Button>
        <Button variant="contained" onClick={() => modal?.onCancelClick()}>
          Cancel
        </Button>
      </div>
    </div>
  ) : null;
}
