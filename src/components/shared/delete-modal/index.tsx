import { Modal, Grid, Paper, Divider, Button, Fade } from "@mui/material";
import React from "react";

export type ModalOptions = {
  show: boolean;
  onDelete: () => void;
  title?: string;
  children?: React.ReactNode;
};

type Props = {
  setModalOptions: (modalOptions: ModalOptions) => void;
  modalOptions: ModalOptions;
  onCancelClick?: () => void;
};

export default function DeleteModal({ setModalOptions, modalOptions, onCancelClick }: Props) {
  const onModalClose = () => {
    let updatedModalOptions = { ...modalOptions };
    updatedModalOptions.show = false;
    setModalOptions(updatedModalOptions);
    if (onCancelClick !== undefined) {
      onCancelClick();
    }
  };

  return (
    <Modal open={modalOptions.show}>
      <Fade in={modalOptions.show}>
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
          style={{ minHeight: "100vh" }}
        >
          <Paper sx={{ textAlign: "left", width: "60%", padding: "5px 20px 5px 20px" }}>
            <h3>{modalOptions?.title ?? "Are you sure you want to delete this item?"}</h3>
            <Divider />
            <br />
            {modalOptions.children}
            <div style={{ float: "right" }}>
              <Button variant="text" onClick={onModalClose}>
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  modalOptions.onDelete();
                  onModalClose();
                }}
                style={{ marginLeft: "5px" }}
              >
                Ok
              </Button>
            </div>
          </Paper>
        </Grid>
      </Fade>
    </Modal>
  );
}
