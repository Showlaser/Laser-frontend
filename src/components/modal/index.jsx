import { Button } from "@material-ui/core";
import "./index.css";

export default function Modal(props) {
  return props?.modal?.show ? (
    <div id="modal">
      <div id="modal-items">
        <h2>{props?.modal?.title}</h2>
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => props?.modal?.onOkClick()}
        >
          Ok
        </Button>
        <Button size="large" onClick={() => props?.modal?.onCancelClick()}>
          Cancel
        </Button>
      </div>
    </div>
  ) : null;
}
