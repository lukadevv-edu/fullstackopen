import { useSelector } from "react-redux";
import BAlert from "react-bootstrap/Alert";

export function Alert() {
  const alert = useSelector(({ notification }) => notification);

  if (!alert) {
    return <></>;
  }

  const { message, alertType } = alert;

  return (
    <BAlert className="my-2" variant={alertType === "error" ? "danger" : "success"}>
      <p className="mb-0">{message}</p>
    </BAlert>
  );
}
