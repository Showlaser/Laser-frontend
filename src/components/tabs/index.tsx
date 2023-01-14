import { Box, Grow, Tab, Tabs } from "@mui/material";
import * as React from "react";
import TabPanel from "./tab-panel";

export type TabSelectorData = {
  tabName: string;
  tabChildren: React.ReactNode;
};

type Props = {
  data: TabSelectorData[];
};

export default function TabSelector({ data }: Props) {
  const [selectedTabIndex, setSelectedTabIndex] = React.useState<number>(0);

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={selectedTabIndex}
          onChange={(e, value) => setSelectedTabIndex(value)}
          aria-label="basic tabs example"
        >
          {data.map((tab, index) => (
            <Tab key={tab.tabName + index} label={tab.tabName} {...a11yProps(index)} />
          ))}
        </Tabs>
      </Box>
      {data.map((tab, index) => (
        <TabPanel key={`tab-panel-${index}`} value={selectedTabIndex} index={index}>
          <Grow in={true} timeout={800}>
            <span>{tab?.tabChildren}</span>
          </Grow>
        </TabPanel>
      ))}
    </Box>
  );
}
