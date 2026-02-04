import axios from "axios";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const base = `https://api.openweathermap.org/data/2.5/weather`;

const getLocationWeather = (locationName) => {
  const request = axios.get(
    `${base}?q=${locationName}&appid=${API_KEY}&units=metric`,
  );

  return request.then(
    ({
      data: {
        main: { temp },
        wind: { speed },
        weather,
      },
    }) => ({
      temp,
      speed,
      weather,
      iconCode: weather[0].icon,
    }),
  );
};

export default { getLocationWeather };
