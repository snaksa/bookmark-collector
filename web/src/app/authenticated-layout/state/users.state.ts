import { User } from '../../modules/shared/models/user.model';
import { AppState } from '../../state/app.state';

export interface UsersState {
  currentUser: {
    isLoading: boolean;
    isInitialized: boolean;
    data: User;
    error: string;
  };
}

export interface State extends AppState {
  users: UsersState;
}
