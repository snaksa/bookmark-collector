import React from "react";
import { Grid } from "@material-ui/core";
import { Label } from "../../models/label.model";

interface LabelsListProps {
  labels: Label[];
}

export default function LabelsList({ labels }: LabelsListProps): JSX.Element {
  return (
    <Grid container>
      {labels.map((item) => (
        <Grid item key={item.id}>
          {item.title}
        </Grid>
      ))}
    </Grid>
  );
}
