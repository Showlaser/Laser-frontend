import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
} from "@mui/material";
import { getVersionHistory } from "services/shared/version-history";

type Props = {
  open: boolean;
  pageName: string;
  onClose: () => void;
  onRestore: (state: unknown) => void;
};

/**
 * Shows the locally stored saved versions for one editor as thumbnail cards
 * and lets the user restore any of them.
 */
export default function VersionHistoryModal({ open, pageName, onClose, onRestore }: Props) {
  const versions = open ? getVersionHistory(pageName) : [];
  const sortedVersions = [...versions].sort((a, b) => (b.savedAt ?? 0) - (a.savedAt ?? 0));

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Version history</DialogTitle>
      <DialogContent>
        {sortedVersions.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No saved versions yet. A version is stored each time you save.
          </Typography>
        ) : (
          <Grid container spacing={2} sx={{ mt: 0 }}>
            {sortedVersions.map((version) => (
              <Grid size={{ xs: 6, sm: 4 }} key={version.id}>
                <Card variant="outlined">
                  {version.image ? (
                    <CardMedia
                      component="img"
                      height="120"
                      image={version.image}
                      alt={version.name ?? "Saved version"}
                      sx={{ objectFit: "contain", backgroundColor: "#000" }}
                    />
                  ) : null}
                  <CardContent sx={{ py: 1 }}>
                    <Typography variant="body2" noWrap>
                      {version.name ?? "Unnamed"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {version.savedAt ? new Date(version.savedAt).toLocaleString() : ""}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      onClick={() => {
                        onRestore(version.state);
                        onClose();
                      }}
                    >
                      Restore
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
