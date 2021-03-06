import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Grid,
  Chip,
  Box,
} from "@material-ui/core";
import { useHistory } from "react-router";
import useStyle from "./styles";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux-hooks";
import { Label } from "../../../../models/label.model";
import { fetchLabels } from "../../../../redux/slices/labels/thunks/fetchLabels.thunk";

export default function TagsScreen(): JSX.Element {
  const classes = useStyle();

  const dispatch = useAppDispatch();
  const labels = useAppSelector((state) => state.labels.list);

  useEffect(() => {
    if (!labels || !labels.initialized) {
      dispatch(fetchLabels());
    }
  }, []);

  const history = useHistory();
  const onLabelClick = (labelId: string) => {
    history.push(`/my-list/tags/${labelId}`);
  };

  const [searchedLabels, setSearchedLabels] = useState<Label[]>(
    labels.data.slice(0, 5)
  );

  const onLabelSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchKey = event.target.value.toLowerCase();
    const filteredLabels = labels.data.filter((label) =>
      label.title.toLowerCase().includes(searchKey)
    );

    setSearchedLabels(filteredLabels);
  };

  return (
    <Container>
      <Typography variant={"h4"}>Tags</Typography>
      <Box className={classes.main}>
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <TextField
              fullWidth={true}
              variant="outlined"
              placeholder={
                labels.isLoading ? "Loading tags..." : "Search for your tags"
              }
              onChange={onLabelSearchChange}
              disabled={labels.isLoading}
            />
          </Grid>
          <Grid item>
            {searchedLabels.map((label) => (
              <Chip
                key={label.id}
                size="small"
                label={label.title}
                onClick={() => onLabelClick(label.id)}
              />
            ))}
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
