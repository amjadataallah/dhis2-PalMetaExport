import React from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

import DataElementExport from "./components/tabs/DataElementExport";
import OptionSetExport from "./components/tabs/OptionSetExport";
import ProgramRulesExport from "./components/tabs/ProgramRulesExport";
import ProgramIndicatorsExport from "./components/tabs/ProgramIndicatorsExport";
import ProgramsExport from "./components/tabs/ProgramsExport";
import AllDataElementsExport from "./components/tabs/AllDataElementsExport";

export default function App() {
  return (
    <div style={{ padding: "2rem" }}>
      <h2>PalMetaExport</h2>
      <Tabs>
        <TabList>
          <Tab>Export Data Elements</Tab>
          <Tab>Export Option Sets</Tab>
          <Tab>Export Program Rules</Tab>
          <Tab>Export Program Indicators</Tab>
          {/* <Tab>Export Programs Metadata</Tab> */}
          {/* <Tab>Export All Data Elements</Tab> */}
        </TabList>

        <TabPanel>
          <DataElementExport />
        </TabPanel>
        <TabPanel>
          <OptionSetExport />
        </TabPanel>
        <TabPanel>
          <ProgramRulesExport />
        </TabPanel>
        <TabPanel>
          <ProgramIndicatorsExport />
        </TabPanel>
        {/* <TabPanel>
          <ProgramsExport />
        </TabPanel>
        <TabPanel>
          <AllDataElementsExport />
        </TabPanel> */}
      </Tabs>
    </div>
  );
}
