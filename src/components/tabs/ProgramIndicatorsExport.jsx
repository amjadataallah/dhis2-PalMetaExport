import React, { useState, useEffect } from "react";
import { useDataQuery } from "@dhis2/app-runtime";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  NoticeBox,
} from "@dhis2/ui";
import ProgramSelector from "../common/ProgramSelector";
import ExportButtons from "../common/ExportButtons";

const indicatorQuery = {
  programIndicators: {
    resource: "programIndicators",
    params: () => ({
      paging: false,
      fields:
        "id,displayName,description,analyticsType,valueType,expression,filter,aggregationType,program[id]",
    }),
  },
};

export default function ProgramIndicatorsExport() {
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [indicators, setIndicators] = useState([]);

  const indicatorResults = useDataQuery(indicatorQuery, {
    variables: { programId: selectedProgram },
    skip: !selectedProgram,
  });

  console.log("🧪 Full indicatorResults.data:", indicatorResults.data);

  useEffect(() => {
    const all =
      indicatorResults.data?.programIndicators?.programIndicators || [];

    console.log("✅ All program indicators:", all);
    console.log("✅ Selected Program ID:", selectedProgram);

    const filtered = all.filter((ind) => ind.program?.id === selectedProgram);

    console.log("✅ Filtered indicators:", filtered);

    setIndicators(filtered);
  }, [indicatorResults.data, selectedProgram]);

  return (
    <div>
      <h3>Select Program</h3>
      <ProgramSelector onSelect={setSelectedProgram} />

      {selectedProgram && (
        <>
          <h3 style={{ marginTop: "1.5rem" }}>Program Indicators</h3>
          {indicatorResults.loading ? (
            "Loading indicators..."
          ) : indicators.length === 0 ? (
            <NoticeBox>No indicators found for this program.</NoticeBox>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Value Type</TableCell>
                  <TableCell>Expression</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {indicators.map((ind) => (
                  <TableRow key={ind.id}>
                    <TableCell>{ind.displayName}</TableCell>
                    <TableCell>{ind.description || "-"}</TableCell>
                    <TableCell>{ind.valueType}</TableCell>
                    <TableCell>{ind.expression}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          <ExportButtons
            data={indicators}
            fileName={`program_indicators_${selectedProgram}`}
            excludeJSON
          />
        </>
      )}
    </div>
  );
}
