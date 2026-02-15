import { useCallback, useState, type DOMAttributes } from "react";
import diaresService from "../services/diares.service";
import { Visibility, Weather, type DiaryEntry } from "../types";
import type { AxiosError } from "axios";

export function AddNew({
  addToLocal,
}: {
  addToLocal: (newEntryResult: DiaryEntry) => void;
}) {
  const [date, setDate] = useState<string>("");
  const [visibility, setVisibility] = useState<Visibility>();
  const [weather, setWeather] = useState<Weather>();
  const [comment, setComment] = useState<string>("");
  const [error, setError] = useState<string>();

  const handleSubmit = useCallback<
    NonNullable<DOMAttributes<HTMLFormElement>["onSubmit"]>
  >(
    (e) => {
      e.preventDefault();

      if (!date || !visibility || !weather || !comment) {
        setError("Please fill all of the fields");

        return;
      }

      diaresService
        .add({
          comment,
          date,
          visibility,
          weather,
        })
        .catch((e: AxiosError) => {
          const serverMsg =
            (e.response?.data as string) || e.message || "Error occurred";

          setError(serverMsg);

          throw e;
        })
        .then((result) => addToLocal(result.data));

      setError("");
      setDate("");
      setVisibility(undefined);
      setWeather(undefined);
      setComment("");
    },
    [addToLocal, comment, date, visibility, weather],
  );

  return (
    <div>
      <p
        style={{
          color: "red",
        }}
      >
        {error}
      </p>
      <form onSubmit={handleSubmit}>
        <div>
          date{" "}
          <input
            value={date}
            type="date"
            onChange={({ target }) => setDate(target.value)}
          />
        </div>
        <div>
          visibility{" "}
          <>
            <input
              type="radio"
              checked={visibility === Visibility.Great}
              onChange={() => setVisibility(Visibility.Great)}
            />
            great
            <input
              type="radio"
              checked={visibility === Visibility.Good}
              onChange={() => setVisibility(Visibility.Good)}
            />
            good
            <input
              type="radio"
              checked={visibility === Visibility.Ok}
              onChange={() => setVisibility(Visibility.Ok)}
            />
            ok
            <input
              type="radio"
              checked={visibility === Visibility.Poor}
              onChange={() => setVisibility(Visibility.Poor)}
            />
            poor
          </>
        </div>
        <div>
          weather{" "}
          <>
            <input
              type="radio"
              checked={weather === Weather.Sunny}
              onChange={() => setWeather(Weather.Sunny)}
            />
            sunny
            <input
              type="radio"
              checked={weather === Weather.Rainy}
              onChange={() => setWeather(Weather.Rainy)}
            />
            rainy
            <input
              type="radio"
              checked={weather === Weather.Cloudy}
              onChange={() => setWeather(Weather.Cloudy)}
            />
            cloudy
            <input
              type="radio"
              checked={weather === Weather.Stormy}
              onChange={() => setWeather(Weather.Stormy)}
            />
            stormy
            <input
              type="radio"
              checked={weather === Weather.Windy}
              onChange={() => setWeather(Weather.Windy)}
            />
            windy
          </>
        </div>
        <div>
          comment{" "}
          <input
            value={comment}
            onChange={({ target }) => setComment(target.value)}
          />
        </div>
        <button type="submit">add</button>
      </form>
    </div>
  );
}
