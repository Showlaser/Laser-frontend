import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
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
};

export default function CardOverview({
  show,
  closeOverview,
  items,
  onNoItemsMessageTitle: onEmptyMessageTitle,
  onNoItemsDescription: onEmptyMessageDescription,
  onDeleteClick,
}: CardOverviewProps) {
  const [searchValue, setSearchValue] = useState<string>("");

  return (
    <Modal
      open={show}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          closeOverview();
        }
      }}
    >
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
                    sx={{ width: "20%", minWidth: "30vh", margin: 1 }}
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
                    <Button fullWidth onClick={() => onDeleteClick(item?.uuid)}>
                      Delete
                    </Button>
                  </Card>
                </Grow>
              ))}
          </Box>
        )}
      </Box>
    </Modal>
  );
}
