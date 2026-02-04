export function Total({ parts }) {
  return (
    <p>
      Number of exercises{" "}
      {parts.reduce((counter, each) => counter + each.exercises, 0)}
    </p>
  );
}
