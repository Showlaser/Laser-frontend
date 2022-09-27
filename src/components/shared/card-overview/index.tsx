import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Divider,
  Grid,
  IconButton,
  InputBase,
  Modal,
  Paper,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

type CardOverviewItems = {
  name: string;
  image: string | null;
  onCardClick: (item: any) => void;
};

type CardOverviewProps = {
  show: boolean;
  closeOverview: () => void;
  items: CardOverviewItems[];
  onEmptyMessageTitle: string;
  onEmptyMessageDescription: string;
};

export default function CardOverview({
  show,
  closeOverview,
  items,
  onEmptyMessageTitle,
  onEmptyMessageDescription,
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
              onChange={(e) => setSearchValue(e.target.value.toLocaleLowerCase())}
            />
            <IconButton type="button" sx={{ p: "10px" }} aria-label="search" onClick={() => setSearchValue("")}>
              <CloseIcon />
            </IconButton>
          </Paper>
        </Grid>
        {items.length === 0 ? (
          <div>
            <h1 style={{ marginTop: "80px" }}>{onEmptyMessageTitle}</h1>
            <p>{onEmptyMessageDescription}</p>
          </div>
        ) : (
          <Box style={{ margin: "30px" }} sx={{ flexDirection: "row", flexWrap: "wrap" }}>
            {items
              .filter((item) => (searchValue.length > 0 ? item.name.toLowerCase().includes(searchValue) : true))
              .map((item) => (
                <Card sx={{ width: "20%", minWidth: "30vh" }} key={item.name + "card-overview"}>
                  <CardActionArea onClick={() => item.onCardClick(item)}>
                    <CardMedia component="img" height="300" alt="pattern image" src={item.image ?? ""} />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {item.name}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              ))}
          </Box>
        )}
      </Box>
    </Modal>
  );
}
