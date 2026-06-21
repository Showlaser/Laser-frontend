import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grow,
  IconButton,
  InputBase,
  Modal,
  Paper,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { OnTrue } from "../on-true";
type CardOverviewItems = {
  uuid: string | null;
  name: string | null;
  image: string | null;
  onCardClick: (item: CardOverviewItems) => void;
};

type CardNoItemsProps = {
  onNoItemsMessageTitle: string;
  onNoItemsDescription: string;
  onNoItemsCreateCallback: () => void;
};

type CardOverviewProps = {
  noItemsProps: CardNoItemsProps;
  show: boolean;
  closeOverview: () => void;
  items: CardOverviewItems[];

  onDeleteClick: (uuid: string | null) => void;
  onDuplicateClick?: (uuid: string | null) => void;
};

export default function CardOverview({
  noItemsProps,
  show,
  closeOverview,
  items,
  onDeleteClick,
  onDuplicateClick,
}: CardOverviewProps) {
  const [searchValue, setSearchValue] = useState<string>("");

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      closeOverview();
    }
  };

  return (
    <Modal open={show} onKeyDown={onKeyDown}>
      <Box style={{ textAlign: "center", marginTop: "40px" }}>
        <IconButton style={{ marginLeft: "95%" }} onClick={closeOverview}>
          <CloseIcon />
        </IconButton>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
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
        </Box>
        {items.length === 0 ? (
          <div>
            <h1 style={{ marginTop: "80px" }}>{noItemsProps.onNoItemsMessageTitle}</h1>
            <p>{noItemsProps.onNoItemsDescription}</p>
            <Button onClick={noItemsProps.onNoItemsCreateCallback}>Create</Button>
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
                searchValue.length > 0 ? item?.name?.toLowerCase().includes(searchValue) : true,
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
                    <OnTrue onTrue={onDuplicateClick !== undefined}>
                      <Button
                        style={{ marginTop: "10px" }}
                        size="large"
                        variant="contained"
                        aria-label="delete"
                        onClick={() => onDuplicateClick?.(item?.uuid)}
                        color="primary"
                      >
                        Duplicate
                      </Button>
                      <br />
                      <Button
                        style={{ marginTop: "10px" }}
                        size="small"
                        aria-label="delete"
                        onClick={() => onDeleteClick(item?.uuid)}
                        color="error"
                      >
                        Delete
                      </Button>
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
