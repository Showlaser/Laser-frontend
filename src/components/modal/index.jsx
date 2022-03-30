import { Button } from "@mui/material";
import "./index.css";

export default function Modal(props) {
  const { modal } = props;

  return modal?.show ? (
    <div id="modal">
      <div id="modal-items">
        <h2>{modal?.title}</h2>
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => modal?.onOkClick()}
        >
          Ok
        </Button>
        <Button size="large" onClick={() => modal?.onCancelClick()}>
          Cancel
        </Button>
      </div>
    </div>
  ) : null;
}
