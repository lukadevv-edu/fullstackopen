interface CoursePartBase {
  name: string;
  exerciseCount: number;
}

interface CoursePartDescription extends CoursePartBase {
  description: string;
}

interface CoursePartBasic extends CoursePartDescription {
  kind: "basic";
}

interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number;
  kind: "group";
}

interface CoursePartBackground extends CoursePartDescription {
  backgroundMaterial: string;
  kind: "background";
}

type CoursePart = CoursePartBasic | CoursePartGroup | CoursePartBackground;

const courseParts: CoursePart[] = [
  {
    name: "Fundamentals",
    exerciseCount: 10,
    description: "This is an awesome course part",
    kind: "basic",
  },
  {
    name: "Using props to pass data",
    exerciseCount: 7,
    groupProjectCount: 3,
    kind: "group",
  },
  {
    name: "Basics of type Narrowing",
    exerciseCount: 7,
    description: "How to go from unknown to string",
    kind: "basic",
  },
  {
    name: "Deeper type usage",
    exerciseCount: 14,
    description: "Confusing description",
    backgroundMaterial:
      "https://type-level-typescript.com/template-literal-types",
    kind: "background",
  },
  {
    name: "TypeScript in frontend",
    exerciseCount: 10,
    description: "a hard part",
    kind: "basic",
  },
];

const App = () => {
  const courseName = "Half Stack application development";

  const totalExercises = courseParts.reduce(
    (sum, part) => sum + part.exerciseCount,
    0,
  );

  return (
    <div>
      <Header courseName={courseName} />
      <Content courses={courseParts} />
      <Footer totalExercises={totalExercises} />
    </div>
  );
};

function Header({ courseName }: { courseName: string }) {
  return <h1>{courseName}</h1>;
}

function Content({ courses }: { courses: CoursePart[] }) {
  return courses.map((course) => <Part course={course} />);
}

function Footer({ totalExercises }: { totalExercises: number }) {
  return <p>Number of exercises {totalExercises}</p>;
}

function Part({ course }: { course: CoursePart }) {
  switch (course.kind) {
    case "basic":
      return (
        <div>
          <strong>
            {course.name} {course.exerciseCount}
          </strong>
          <p>{course.description}</p>
        </div>
      );
    case "background":
      return (
        <div>
         <strong>
            {course.name} {course.exerciseCount}
          </strong>
          <p>{course.description}</p>
          <p>submit to {course.backgroundMaterial}</p>
        </div>
      );
    case "group":
      return (
        <div>
          <strong>
            {course.name} {course.exerciseCount}
         </strong>
          <p>project exercises {course.groupProjectCount}</p>
        </div>
      );
  }
}

export default App;
