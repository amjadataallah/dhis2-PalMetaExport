// src/components/ProgramStageSelector.js
import React, { useState } from "react";
import { useDataQuery } from "@dhis2/app-runtime";
import { SingleSelect, SingleSelectOption } from "@dhis2/ui";

const query = {
  program: {
    resource: "programs",
    id: ({ programId }) => programId,
    params: {
      fields: "programStages[id,displayName]",
    },
  },
};

export default function ProgramStageSelector({ programId, onSelect }) {
  const [selected, setSelected] = useState("");

  const { loading, error, data } = useDataQuery(query, {
    variables: { programId },
    skip: !programId,
  });

  if (!programId) return null;
  if (loading) return "Loading program stages...";
  if (error) return "Error loading program stages";

  const stages = data.program.programStages || [];

  const handleChange = (value) => {
    setSelected(value);
    onSelect(value);
  };

  return (
    <SingleSelect
      selected={selected}
      onChange={({ selected }) => handleChange(selected)}
      placeholder="Select a program stage"
    >
      {stages.map((stage) => (
        <SingleSelectOption
          key={stage.id}
          label={stage.displayName}
          value={stage.id}
        />
      ))}
    </SingleSelect>
  );
}
