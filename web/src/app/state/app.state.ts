import {Label} from "../modules/shared/models/label.model";

export interface LabelsState {
  isLoading: boolean;
  isInitialized: boolean;
  data: Label[],
  error: string,
}

export interface AppState {
  labels: LabelsState,
}
