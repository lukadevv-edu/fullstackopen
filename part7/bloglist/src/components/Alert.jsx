import { useSelector } from "react-redux";

export function Alert() {
  const alert = useSelector(({ notification }) => notification);

  if (!alert) {
    return <></>;
  }

  const { message, alertType } = alert;

  if (alertType === "error") {
    return (
      <div className="alert error">
        <p>{message}</p>
      </div>
    );
  } else {
    return (
      <div className="alert success">
        <p>{message}</p>
      </div>
    );
  }
}
