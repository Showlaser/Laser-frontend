import { Modal, Grid, Paper, Divider, Button } from "@mui/material";
import React from "react";

export type ModalOptions = {
  show: boolean;
  onDelete: () => void;
};

type Props = {
  setModalOptions: (modalOptions: ModalOptions) => void;
  modalOptions: ModalOptions;
};

export default function DeleteModal({ setModalOptions, modalOptions }: Props) {
  return (
    <Modal open={modalOptions.show}>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: "100vh" }}
      >
        <Paper sx={{ textAlign: "left", width: "60%", padding: "5px 20px 5px 20px" }}>
          <h3>Are you sure you want to delete this item?</h3>
          <Divider />
          <br />
          <div style={{ float: "right" }}>
            <Button variant="text" onClick={() => setModalOptions({ show: false, onDelete: () => null })}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                modalOptions.onDelete();
                setModalOptions({
                  show: false,
                  onDelete: () => null,
                });
              }}
              style={{ marginLeft: "5px" }}
            >
              Ok
            </Button>
          </div>
        </Paper>
      </Grid>
    </Modal>
  );
}
