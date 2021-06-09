import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { useAppSelector } from "./redux-hooks";

export interface NotificationContextProps {
  open: boolean;
  message: string;
  onOpen: (message: string) => void;
  onClose: () => void;
}

const initialProps: NotificationContextProps = {
  open: false,
  message: "",
  onOpen: (message = "Not implemented") => {
    throw new Error(message);
  },
  onClose: () => {
    throw new Error("Not implemented");
  },
};

export const NotificationContext = createContext<NotificationContextProps>(
  initialProps
);

const NotificationProvider = (props: { children: ReactNode }): JSX.Element => {
  const [open, setOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const notification = useAppSelector((state) => state.notifications.data);

  useEffect(() => {
    if (notification.message) {
      onOpen(notification.message);
    }
  }, [notification.timestamp]);

  const onOpen = (message: string) => {
    setOpen(true);
    setMessage(message);
  };

  const onClose = () => {
    setOpen(false);
    setMessage("");
  };

  const values = { open, message, onOpen, onClose };

  return <NotificationContext.Provider value={values} {...props} />;
};

export const useNotification = (): NotificationContextProps =>
  useContext(NotificationContext);

export default NotificationProvider;
