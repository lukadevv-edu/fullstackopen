interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

function calculateExercises(dailyHours: number[], goal: number): Result {
  const average =
    dailyHours.reduce((counter, hours) => counter + hours, 0) /
    dailyHours.length;

  const trainingDays = dailyHours.filter(Boolean).length;

  let rating = 1;
  let ratingDescription = "bad";

  if (average >= goal) {
    rating = 3;
    ratingDescription = "good";
  } else if (average >= goal * 0.75) {
    rating = 2;
    ratingDescription = "not too bad but could be better";
  }

  return {
    periodLength: dailyHours.length,
    trainingDays,
    success: average >= goal,
    rating,
    ratingDescription,
    target: goal,
    average,
  };
}

(() => {
  const goal = process.argv[2];
  const dailyHours = process.argv.slice(3);

  if (!goal || !dailyHours.length) {
    console.error("(!) Invalid arguments...");
    process.exit(1);
  }

  if (isNaN(Number(goal)) || dailyHours.some((hours) => isNaN(Number(hours)))) {
    console.error("(!) Please use numbers...");
    process.exit(2);
  }

  console.log(calculateExercises(dailyHours.map(Number), Number(goal)));
})();
