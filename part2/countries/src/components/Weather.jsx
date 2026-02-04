export function Weather({ temp, wind, iconCode }) {
  return (
    <div>
      <h3>Weather</h3>
      <p>{`Temperature ${temp} Celsius`}</p>
      <img src={`https://openweathermap.org/img/wn/${iconCode}@2x.png`} />
      <p>{`Wind ${wind} m/s`}</p>
    </div>
  );
}
