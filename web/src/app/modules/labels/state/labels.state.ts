import { Label } from '../../shared/models/label.model';

export interface LabelsState {
  isLoading: boolean;
  isInitialized: boolean;
  data: Label[];
  error: string;
}
