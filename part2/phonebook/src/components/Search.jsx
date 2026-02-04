export function Search({ setFilterName }) {
  return (
    <div>
      <p>
        Filter shown with{" "}
        <input
          onChange={(e) => {
            setFilterName(e.target.value);
          }}
        />
      </p>
    </div>
  );
}
