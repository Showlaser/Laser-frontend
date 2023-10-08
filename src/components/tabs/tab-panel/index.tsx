import { Box } from "@mui/material";
import { OnTrue } from "components/shared/on-true";
import * as React from "react";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export default function TabPanel({ children, index, value }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      <OnTrue onTrue={value === index}>
        <Box sx={{ p: 3 }}>{children}</Box>
      </OnTrue>
    </div>
  );
}
