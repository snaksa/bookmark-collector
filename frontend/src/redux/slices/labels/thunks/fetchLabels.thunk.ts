import {
  ActionReducerMapBuilder,
  createAsyncThunk,
  PayloadAction,
} from "@reduxjs/toolkit";
import { ErrorType } from "../../../../services/http.service";
import { LabelsState } from "../labels.slice";
import { Label } from "../../../../models/label.model";
import LabelService from "../../../../services/label.service";
import { AppDispatch } from "../../../store";
import { notificationError } from "../../notifications/notifications.slice";

export const fetchLabels = createAsyncThunk<
  Label[],
  void,
  { rejectValue: ErrorType; dispatch: AppDispatch }
>("bookmarks/fetchLabels", async (_, { rejectWithValue, dispatch }) => {
  const response = await LabelService.getLabels();
  if (response.error) {
    dispatch(notificationError(response.error.message));
    return rejectWithValue(response.error as ErrorType);
  }

  return response.data as Label[];
});

export const fetchLabelsReducers = (
  builder: ActionReducerMapBuilder<LabelsState>
): void => {
  builder.addCase(fetchLabels.pending, (state) => {
    state.list.isLoading = true;
  });

  builder.addCase(
    fetchLabels.fulfilled,
    (state, action: PayloadAction<Label[]>) => {
      state.list = {
        ...state.list,
        isLoading: false,
        initialized: true,
        data: action.payload,
      };
    }
  );
};
