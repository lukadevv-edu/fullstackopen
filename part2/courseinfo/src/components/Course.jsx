import { Content } from "./Content";
import { Header } from "./Header";
import { Total } from "./Total";

export function Course({ course: { name, parts } }) {
  return (
    <div>
      <Header course={name} />
      <Content parts={parts} />
      <Total parts={parts} />
    </div>
  );
}
