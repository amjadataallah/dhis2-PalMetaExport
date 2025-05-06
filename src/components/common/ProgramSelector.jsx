// src/components/ProgramSelector.js
import React, { useState, useEffect } from "react";
import { useDataQuery } from "@dhis2/app-runtime";
import { SingleSelect, SingleSelectOption } from "@dhis2/ui";

const query = {
  programs: {
    resource: "programs",
    params: {
      paging: false,
      fields: "id,displayName",
    },
  },
};

export default function ProgramSelector({ onSelect }) {
  const { loading, error, data } = useDataQuery(query);
  const [selected, setSelected] = useState("");

  if (loading) return "Loading programs...";
  if (error) return "Error loading programs";

  const handleChange = (value) => {
    setSelected(value);
    onSelect(value);
  };

  return (
    <SingleSelect
      selected={selected}
      onChange={({ selected }) => handleChange(selected)}
      placeholder="Select a program"
    >
      {data.programs.programs.map((program) => (
        <SingleSelectOption
          key={program.id}
          label={program.displayName}
          value={program.id}
        />
      ))}
    </SingleSelect>
  );
}
