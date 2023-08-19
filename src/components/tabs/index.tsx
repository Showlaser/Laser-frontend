import { Box, Grow, Tab, Tabs } from "@mui/material";
import * as React from "react";
import TabPanel from "./tab-panel";

export type TabSelectorData = {
  tabName: string;
  tabChildren: React.ReactNode;
};

type Props = {
  data: TabSelectorData[];
  selectedTabId: number;
  setSelectedTabId: (id: number) => void;
  disableAnimation?: boolean;
};

export default function TabSelector({ data, selectedTabId, setSelectedTabId, disableAnimation }: Props) {
  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={selectedTabId} onChange={(e, value) => setSelectedTabId(value)} aria-label="basic tabs example">
          {data.map((tab, index) => (
            <Tab key={tab.tabName + index} label={tab.tabName} {...a11yProps(index)} />
          ))}
        </Tabs>
      </Box>
      {data.map((tab, index) => (
        <TabPanel key={`tab-panel-${index}`} value={selectedTabId} index={index}>
          <Grow in={true} timeout={disableAnimation ? 0 : 800}>
            <span>{tab?.tabChildren}</span>
          </Grow>
        </TabPanel>
      ))}
    </Box>
  );
}
