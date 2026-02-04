import { Weather } from "./Weather";
import weatherService from "../services/weather.service";
import { useState } from "react";
import { useEffect } from "react";

export function Country({ name: { common }, capital, area, languages, flags }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    weatherService.getLocationWeather(capital).then((r) => setData(r));
  }, [capital]);

  return (
    <div>
      <h2>{common}</h2>
      <p>Capital {capital}</p>
      <p>Area {area}</p>
      <div>
        <h3>Languages</h3>
        <ul>
          {Object.entries(languages).map(([key, value]) => (
            <li key={key + value}>{value}</li>
          ))}
        </ul>
      </div>
      <div>
        <img src={flags.png} width={320} height={220} />
      </div>
      {data && (
        <Weather iconCode={data.iconCode} temp={data.temp} wind={data.wind} />
      )}
    </div>
  );
}
