import { Grid } from "@material-ui/core";

export default function LabelsList({ labels }: any) {
  return (
    <Grid container>
      {labels.map((item: any) => (
        <Grid item key={item.id}>
          {item.title}
        </Grid>
      ))}
    </Grid>
  );
}
