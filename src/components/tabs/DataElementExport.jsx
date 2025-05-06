import React, { useState } from "react";
import ProgramSelector from "../common/ProgramSelector";
import ProgramStageSelector from "../common/ProgramStageSelector";
import DataElementsList from "../common/DataElementsList";
import ExportButtons from "../common/ExportButtons";

export default function DataElementExport() {
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedStage, setSelectedStage] = useState(null);
  const [dataElements, setDataElements] = useState([]);

  const handleProgramChange = (programId) => {
    setSelectedProgram(programId);
    setSelectedStage(null);
    setDataElements([]);
  };

  const handleStageChange = (stageId) => {
    setSelectedStage(stageId);
    setDataElements([]);
  };

  return (
    <div>
      <h3>Select Program</h3>
      <ProgramSelector onSelect={handleProgramChange} />

      {selectedProgram && (
        <>
          <h3 style={{ marginTop: "1.5rem" }}>Select Program Stage</h3>
          <ProgramStageSelector
            programId={selectedProgram}
            onSelect={handleStageChange}
          />
        </>
      )}

      {selectedStage && (
        <>
          <DataElementsList
            key={selectedStage}
            stageId={selectedStage}
            onLoaded={setDataElements}
          />
          <ExportButtons
            data={dataElements}
            fileName={`data_elements_${selectedStage}`}
          />
        </>
      )}
    </div>
  );
}
