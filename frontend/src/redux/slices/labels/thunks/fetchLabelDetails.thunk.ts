import {
  ActionReducerMapBuilder,
  createAsyncThunk,
  PayloadAction,
} from "@reduxjs/toolkit";
import { ErrorType } from "../../../../services/http.service";
import { LabelsState } from "../labels.slice";
import { Label } from "../../../../models/label.model";
import LabelService from "../../../../services/label.service";

export const fetchLabelDetails = createAsyncThunk<
  Label,
  string,
  { rejectValue: ErrorType }
>("bookmarks/fetchLabelDetails", async (id, { rejectWithValue }) => {
  const response = await LabelService.getLabelDetails(id);
  if (response.error) {
    return rejectWithValue(response.error as ErrorType);
  }

  return response.data as Label;
});

export const fetchLabelDetailsReducers = (
  builder: ActionReducerMapBuilder<LabelsState>
): void => {
  builder.addCase(fetchLabelDetails.pending, (state) => {
    state.details.isLoading = true;
  });

  builder.addCase(
    fetchLabelDetails.fulfilled,
    (state, action: PayloadAction<Label>) => {
      state.details = {
        ...state.details,
        isLoading: false,
        data: action.payload,
      };
    }
  );
};
