function calculateBmi(height: number, weight: number) {
  const bmi = weight / (height / 100) ** 2;

  return bmi;
}

(() => {
  const height = process.argv[2];
  const weight = process.argv[3];

  if (!height || !weight) {
    console.error("(!) Invalid arguments...");
    process.exit(1);
  }

  if (isNaN(Number(height)) || isNaN(Number(weight))) {
    console.error("(!) Please use numbers...");
    process.exit(2);
  }

  const bmi = calculateBmi(Number(height), Number(weight));

  let result;

  /*
    Underweight (Severe thinness)	    < 16.0	    < 0.64
    Underweight (Moderate thinness)	    16.0–17.0	0.64–0.68
    Underweight (Mild thinness)	        17.0–18.5	0.68–0.74
    Normal range	                    18.5–25.0	0.74–1.00
    Overweight (Pre-obese)          	25.0–30.0	1.00–1.20
    Obese (Class I)	                    30.0–35.0	1.20–1.40
    Obese (Class II)	                35.0–40.0	1.40–1.60
    Obese (Class III)	                ≥ 40.0	    ≥ 1.60
   */

  if (bmi < 16.0) {
    result = "Underweight (Severe thinness)";
  } else if (bmi >= 16.0 && bmi < 17.0) {
    result = "Underweight (Moderate thinness)";
  } else if (bmi >= 17.0 && bmi < 18.5) {
    result = "Underweight (Mild thinness)";
  } else if (bmi >= 18.5 && bmi < 25.0) {
    result = "Normal (healthy weight)";
  } else if (bmi >= 25.0 && bmi < 30.0) {
    result = "Overweight (Pre-obese)";
  } else if (bmi >= 30.0 && bmi < 35.0) {
    result = "Obese (Class I)";
  } else if (bmi >= 35.0 && bmi < 40.0) {
    result = "Obese (Class II)";
  } else {
    result = "Obese (Class III)";
  }

  console.log(result);
})();
