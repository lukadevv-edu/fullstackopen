import { Entry, HealthCheckRating } from "../../types";
import { Box, Typography } from "@mui/material";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import WorkIcon from "@mui/icons-material/Work";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import FavoriteIcon from "@mui/icons-material/Favorite";

const HealthRatingHeart = ({ rating }: { rating: HealthCheckRating }) => {
  const colors = {
    [HealthCheckRating.Healthy]: "green",
    [HealthCheckRating.LowRisk]: "yellow",
    [HealthCheckRating.HighRisk]: "orange",
    [HealthCheckRating.CriticalRisk]: "red",
  };

  return <FavoriteIcon sx={{ color: colors[rating] }} />;
};

export function EntryDetails({ entry }: { entry: Entry }) {
  const style = {
    border: "1px solid black",
    borderRadius: "5px",
    padding: "10px",
    marginBottom: "10px",
  };

  switch (entry.type) {
    case "HealthCheck":
      return (
        <Box sx={style}>
          <Typography>
            {entry.date} <MedicalServicesIcon />
          </Typography>
          <Typography sx={{ fontStyle: "italic" }}>
            {entry.description}
          </Typography>
          <HealthRatingHeart rating={entry.healthCheckRating} />
          <Typography>diagnose by {entry.specialist}</Typography>
        </Box>
      );
    case "Hospital":
      return (
        <Box sx={style}>
          <Typography>
            {entry.date} <LocalHospitalIcon />
          </Typography>
          <Typography sx={{ fontStyle: "italic" }}>
            {entry.description}
          </Typography>
          <Typography>
            Discharge: {entry.discharge.date} - {entry.discharge.criteria}
          </Typography>
          <Typography>diagnose by {entry.specialist}</Typography>
        </Box>
      );
    case "OccupationalHealthcare":
      return (
        <Box sx={style}>
          <Typography>
            {entry.date} <WorkIcon /> <i>{entry.employerName}</i>
          </Typography>
          <Typography sx={{ fontStyle: "italic" }}>
            {entry.description}
          </Typography>
          {entry.sickLeave && (
            <Typography>
              Sick leave: {entry.sickLeave.startDate} to{" "}
              {entry.sickLeave.endDate}
            </Typography>
          )}
          <Typography>diagnose by {entry.specialist}</Typography>
        </Box>
      );
    default:
      throw new Error("This type of entry doesn't exist!");
  }
}
