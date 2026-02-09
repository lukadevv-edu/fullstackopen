import { useSelector } from "react-redux";

export const Notification = () => {
  const notification = useSelector(({ notification }) => notification?.message);
  const style = {
    border: "solid",
    padding: 10,
    borderWidth: 1,
  };

  if (!notification) {
    return <></>;
  }

  return <div style={style}>{notification}</div>;
};
