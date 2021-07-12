import { User } from '../modules/shared/models/user.model';

export interface ApplicationState {
  currentUser: {
    isLoading: boolean;
    isInitialized: boolean;
    data: User;
    error: string;
    updating: boolean;
  };
}

export interface AppState {
  app: ApplicationState;
}
