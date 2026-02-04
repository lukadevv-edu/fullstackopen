export function Content({ parts }) {
  return parts.map((each) => (
    <Part key={each.name} exercises={each.exercises} title={each.name} />
  ));
}

function Part({ title, exercises }) {
  return (
    <p>
      {title} {exercises}
    </p>
  );
}
