import React, { useEffect, useState } from "react";
import { useDataQuery } from "@dhis2/app-runtime";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  NoticeBox,
  Input,
} from "@dhis2/ui";
import ExportButtons from "../common/ExportButtons";

const query = {
  optionSets: {
    resource: "optionSets",
    params: {
      paging: false,
      fields: "id,displayName,options[id,code,displayName]",
    },
  },
};

export default function OptionSetExport() {
  const { loading, error, data } = useDataQuery(query);
  const [flattenedData, setFlattenedData] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    if (data?.optionSets?.optionSets) {
      const result = data.optionSets.optionSets.flatMap((os) =>
        (os.options || []).map((option) => ({
          optionSetId: os.id,
          optionSetName: os.displayName,
          optionId: option.id,
          optionCode: option.code || "",
          optionName: option.displayName,
        }))
      );
      setFlattenedData(result);
    }
  }, [data]);

  const filteredGroups = flattenedData.reduce((acc, item) => {
    if (
      filter &&
      !item.optionSetName.toLowerCase().includes(filter.toLowerCase())
    ) {
      return acc;
    }
    if (!acc[item.optionSetName]) {
      acc[item.optionSetName] = [];
    }
    acc[item.optionSetName].push(item);
    return acc;
  }, {});

  if (loading) return "Loading option sets...";
  if (error)
    return <NoticeBox title="Error">Failed to load option sets</NoticeBox>;

  return (
    <>
      <h3>All Option Sets with Options</h3>

      <Input
        value={filter}
        onChange={({ value }) => setFilter(value)}
        placeholder="Filter by Option Set name"
        style={{ marginBottom: "1rem", width: "300px" }}
      />

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Option Set</TableCell>
            <TableCell>Option Code</TableCell>
            <TableCell>Option Name</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(filteredGroups).map(([setName, options]) => (
            <>
              <TableRow key={setName}>
                <TableCell colSpan={3} style={{ fontWeight: "bold" }}>
                  {setName}
                </TableCell>
              </TableRow>
              {options.map((option) => (
                <TableRow key={option.optionId}>
                  <TableCell></TableCell>
                  <TableCell>{option.optionCode}</TableCell>
                  <TableCell>{option.optionName}</TableCell>
                </TableRow>
              ))}
            </>
          ))}
        </TableBody>
      </Table>

      <ExportButtons data={flattenedData} fileName="option_sets" excludeJSON />
    </>
  );
}
