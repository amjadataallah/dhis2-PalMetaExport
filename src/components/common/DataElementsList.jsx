import React, { useEffect } from "react";
import { useDataQuery } from "@dhis2/app-runtime";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  NoticeBox,
} from "@dhis2/ui";

const query = {
  stage: {
    resource: "programStages",
    id: ({ stageId }) => stageId,
    params: {
      fields:
        "programStageDataElements[dataElement[id,displayName,code,description,valueType]]",
    },
  },
};

export default function DataElementsList({ stageId, onLoaded }) {
  const { loading, error, data } = useDataQuery(query, {
    variables: { stageId },
    skip: !stageId,
  });

  useEffect(() => {
    if (data?.stage?.programStageDataElements && onLoaded) {
      const elements = data.stage.programStageDataElements.map(
        (psde) => psde.dataElement
      );
      onLoaded(elements);
    }
  }, [data, onLoaded]);

  if (!stageId) return null;
  if (loading) return "Loading data elements...";
  if (error)
    return <NoticeBox title="Error">Failed to load data elements</NoticeBox>;

  const dataElements = data.stage.programStageDataElements.map(
    (psde) => psde.dataElement
  );

  return (
    <>
      <h3>Data Elements in Program Stage</h3>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Code</TableCell>
            <TableCell>Value Type</TableCell>
            <TableCell>Description</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dataElements.map((de) => (
            <TableRow key={de.id}>
              <TableCell>{de.id}</TableCell>
              <TableCell>{de.displayName}</TableCell>
              <TableCell>{de.code || "-"}</TableCell>
              <TableCell>{de.valueType}</TableCell>
              <TableCell>{de.description || "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
