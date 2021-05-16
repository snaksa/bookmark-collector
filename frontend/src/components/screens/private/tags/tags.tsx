import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Grid,
  Chip,
  Box,
} from "@material-ui/core";
import useHttpGet from "../../../../hooks/useHttpGet";
import { useDispatch, useSelector } from "react-redux";
import {
  initializedLabels,
  initializeLabels,
} from "../../../../redux/labels/labels.actions";
import { useHistory } from "react-router";
import useStyle from "./styles";

export default function TagsScreen() {
  const classes = useStyle();

  const { fetch: fetchLabels } = useHttpGet("labels", {}, true);

  const dispatch = useDispatch();
  const labels = useSelector((state: any) => state.labels.list);

  useEffect(() => {
    if (!labels || !labels.initialized) {
      dispatch(initializeLabels());
      fetchLabels().then((data) => {
        setSearchedLabels(data.slice(0, 5));
        dispatch(initializedLabels(data));
      });
    }
  }, []);

  const history = useHistory();
  const onLabelClick = (labelId: string) => {
    history.push(`/my-list/tags/${labelId}`);
  };

  const [searchedLabels, setSearchedLabels] = useState(labels.data.slice(0, 5));

  const onLabelSearchChange = (event: any) => {
    const searchKey = event.target.value.toLowerCase();
    const filteredLabels = labels.data.filter((label: any) =>
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
            {searchedLabels.map((label: any) => (
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
