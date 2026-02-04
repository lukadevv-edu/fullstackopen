export function List({ list }) {
  return (
    <div>
      <h2>Numbers</h2>
      {list.map((each) => (
        <p key={each.name}>
          {each.name} {each.phonenumber}
        </p>
      ))}
    </div>
  );
}
