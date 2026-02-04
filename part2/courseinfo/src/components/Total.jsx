export function Total({ parts }) {
  return (
    <p>
      <b>
        Total of {parts.reduce((counter, each) => counter + each.exercises, 0)}
        {" exercises"}
      </b>
    </p>
  );
}
