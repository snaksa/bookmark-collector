import { Box } from "@material-ui/core";
import { useEffect, useState } from "react";
import HttpClient from "../../services/http-client";
import LabelsList from './labels-list';

export default function MyLabels() {
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    // fetch labels
    HttpClient.get('labels').then(response => {
      setLabels(response);
    });
  }, []);

  return <Box>
    <LabelsList labels={labels}></LabelsList>
  </Box>;
}