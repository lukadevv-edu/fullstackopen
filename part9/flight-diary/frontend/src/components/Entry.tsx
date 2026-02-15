import type { NonSensitiveDiaryEntry } from "../types";

export function Entry({
  diare: { date, visibility, weather },
}: {
  diare: NonSensitiveDiaryEntry;
}) {
  return (
    <div>
      <strong
        style={{
          fontSize: "1.5rem",
          textDecoration: "underline",
        }}
      >
        {date}
      </strong>
      <p>
        Visibility: <strong>{visibility}</strong>
      </p>
      <p>
        Weather: <strong>{weather}</strong>
      </p>
    </div>
  );
}
