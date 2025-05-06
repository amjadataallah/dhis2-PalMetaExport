import React, { useEffect, useState, useMemo } from "react";
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

const ruleQuery = {
  programRules: {
    resource: "programRules",
    params: () => ({
      paging: false,
      fields:
        "id,displayName,condition,program[id],programRuleActions[actionType]", // 🟢 Add program[id]
    }),
  },
};

const variableQuery = {
  programRuleVariables: {
    resource: "programRuleVariables",
    params: () => ({
      paging: false,
      fields:
        "id,displayName,program[id],programRuleVariableSourceType,dataElement[id,displayName]", // 🟢 Add program[id]
    }),
  },
};

export default function ProgramRulesExport() {
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [rules, setRules] = useState([]);
  const [variables, setVariables] = useState([]);

  const ruleResults = useDataQuery(ruleQuery, {
    variables: { programId: selectedProgram },
    skip: !selectedProgram,
  });

  const variableResults = useDataQuery(variableQuery, {
    variables: { programId: selectedProgram },
    skip: !selectedProgram,
  });

  console.log("🧪 Full ruleResults.data:", ruleResults.data);
  console.log("🧪 Full variableResults.data:", variableResults.data);

  useEffect(() => {
    const allRules = ruleResults.data?.programRules?.programRules || [];
    const allVars =
      variableResults.data?.programRuleVariables?.programRuleVariables || [];

    console.log("✅ Raw programRules:", allRules);
    console.log("✅ Raw programRuleVariables:", allVars);
    console.log("✅ Selected Program ID:", selectedProgram);

    const filteredRules = allRules.filter(
      (rule) => rule.program?.id === selectedProgram
    );
    const filteredVars = allVars.filter(
      (v) => v.program?.id === selectedProgram
    );

    console.log("✅ Filtered rules:", filteredRules);
    console.log("✅ Filtered variables:", filteredVars);

    setRules(filteredRules);
    setVariables(filteredVars);
  }, [ruleResults.data, variableResults.data, selectedProgram]);

  return (
    <div>
      <h3>Select Program</h3>
      <ProgramSelector
        onSelect={(id) => {
          setSelectedProgram(id);
        }}
      />

      {selectedProgram && (
        <>
          <h3 style={{ marginTop: "1.5rem" }}>Program Rules</h3>
          {ruleResults.loading ? (
            "Loading rules..."
          ) : rules.length === 0 ? (
            <NoticeBox>No rules found for this program.</NoticeBox>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Condition</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rules.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell>{rule.displayName}</TableCell>
                    <TableCell>{rule.condition}</TableCell>
                    <TableCell>
                      {(rule.programRuleActions || [])
                        .map((a) => a.actionType)
                        .join(", ")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          <h3 style={{ marginTop: "2rem" }}>Program Rule Variables</h3>
          {variableResults.loading ? (
            "Loading variables..."
          ) : variables.length === 0 ? (
            <NoticeBox>No rule variables found for this program.</NoticeBox>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Source Type</TableCell>
                  <TableCell>Data Element</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {variables.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell>{v.displayName}</TableCell>
                    <TableCell>{v.programRuleVariableSourceType}</TableCell>
                    <TableCell>{v.dataElement?.displayName || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          <ExportButtons
            data={[
              ...rules.map((r) => ({
                type: "Rule",
                name: r.displayName,
                condition: r.condition,
                actions: (r.programRuleActions || [])
                  .map((a) => a.actionType)
                  .join(", "),
              })),
              ...variables.map((v) => ({
                type: "Variable",
                name: v.displayName,
                sourceType: v.programRuleVariableSourceType,
                dataElement: v.dataElement?.displayName || "",
              })),
            ]}
            fileName={`program_rules_${selectedProgram}`}
            excludeJSON
          />
        </>
      )}
    </div>
  );
}
