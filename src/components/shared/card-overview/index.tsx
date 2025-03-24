import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Grow,
  IconButton,
  InputBase,
  Modal,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { OnTrue } from "../on-true";
type CardOverviewItems = {
  uuid: string | null;
  name: string | null;
  image: string | null;
  onCardClick: (item: any) => void;
};

type CardOverviewProps = {
  show: boolean;
  closeOverview: () => void;
  items: CardOverviewItems[];
  onNoItemsMessageTitle: string;
  onNoItemsDescription: string;
  onDeleteClick: (uuid: string | null) => void;
  onDuplicateClick?: (uuid: string | null) => void;
};

export default function CardOverview({
  show,
  closeOverview,
  items,
  onNoItemsMessageTitle: onEmptyMessageTitle,
  onNoItemsDescription: onEmptyMessageDescription,
  onDeleteClick,
  onDuplicateClick,
}: CardOverviewProps) {
  const [searchValue, setSearchValue] = useState<string>("");

  const onKeyDown = (e: any) => {
    if (e.kkey === "Escape") {
      closeOverview();
    }
  };

  return (
    <Modal open={show} onKeyDown={onKeyDown}>
      <Box style={{ textAlign: "center", marginTop: "40px" }}>
        <IconButton style={{ marginLeft: "95%" }} onClick={closeOverview}>
          <CloseIcon />
        </IconButton>
        <Grid container spacing={0} direction="column" alignItems="center" justifyContent="center">
          <OnTrue onTrue={items?.length > 0}>
            <Paper
              sx={{
                backgroundColor: "#2E2E2E",
                width: "30%",
                m: "8px 0 0 0",
                p: "4px 6px",
                display: "flex",
              }}
            >
              <InputBase
                value={searchValue}
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search items"
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <IconButton
                type="button"
                sx={{ p: "10px" }}
                aria-label="search"
                onClick={() => setSearchValue("")}
              >
                <CloseIcon />
              </IconButton>
            </Paper>
          </OnTrue>
        </Grid>
        {items.length === 0 ? (
          <div>
            <h1 style={{ marginTop: "80px" }}>{onEmptyMessageTitle}</h1>
            <p>{onEmptyMessageDescription}</p>
          </div>
        ) : (
          <Box
            style={{ margin: "30px", overflowY: "scroll" }}
            sx={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              height: `${window.innerHeight - 200}px`,
              alignContent: "flex-start",
            }}
          >
            {items
              .filter((item) =>
                searchValue.length > 0 ? item?.name?.toLowerCase().includes(searchValue) : true
              )
              .map((item, index) => (
                <Grow
                  in={items.length > 0}
                  timeout={1400 * index > 2500 ? 2500 : 1400 * index}
                  key={`card ${index}`}
                >
                  <Card
                    sx={{ width: "20%", minWidth: "40vh", margin: 1 }}
                    key={item.name + "card-overview"}
                  >
                    <CardActionArea onClick={() => item.onCardClick(item)}>
                      <CardMedia
                        component="img"
                        height="300"
                        alt="pattern image"
                        src={item.image ?? ""}
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                          {item.name}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                    <Tooltip title={`Delete ${item.name}`}>
                      <IconButton
                        aria-label="delete"
                        onClick={() => onDeleteClick(item?.uuid)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                    <OnTrue onTrue={onDuplicateClick !== undefined}>
                      <Tooltip title={`Duplicate ${item.name}`}>
                        <IconButton
                          aria-label="delete"
                          onClick={() => onDuplicateClick?.(item?.uuid)}
                          color="primary"
                        >
                          <ContentCopyIcon />
                        </IconButton>
                      </Tooltip>
                    </OnTrue>
                  </Card>
                </Grow>
              ))}
          </Box>
        )}
      </Box>
    </Modal>
  );
}
