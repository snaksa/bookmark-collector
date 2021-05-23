import React from "react";
import { Box } from "@material-ui/core";
import useHttpGet from "../../hooks/useHttpGet";
import LabelsList from "./labels-list";

export default function MyLabels(): JSX.Element {
  const { response: labels, isLoading } = useHttpGet("labels");

  return (
    <Box>
      {isLoading ? <Box>Loading...</Box> : <LabelsList labels={labels} />}
    </Box>
  );
}
