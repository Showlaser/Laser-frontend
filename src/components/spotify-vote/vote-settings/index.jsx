import { TextField } from "@mui/material";

export default function VoteSettings({ setVoteValidTimeInMinutes }) {
  return (
    <div>
      <h3>Vote settings</h3>
      <TextField
        type="number"
        label="Vote session valid in minutes"
        defaultValue={5}
        onKeyDown={(e) => {
          e.preventDefault();
          return false;
        }}
        onChange={(e) => setVoteValidTimeInMinutes(Number(e.target.value))}
        style={{ minWidth: "175px" }}
        InputProps={{ inputProps: { min: 1, max: 10 } }}
      />
    </div>
  );
}
