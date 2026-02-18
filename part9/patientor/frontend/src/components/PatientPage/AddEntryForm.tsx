import { useState, SyntheticEvent, useCallback } from "react";
import {
  TextField,
  Button,
  Grid,
  Alert,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  Divider,
} from "@mui/material";
import { HealthCheckRating, NewEntry, PatientType } from "../../types";
import patientService from "../../services/patients";

export function AddEntryForm({
  id,
  onCancel: rawOnCancel,
  onSuccess,
}: {
  id: string;
  onCancel: () => void;
  onSuccess: (patient: PatientType) => void;
}) {
  const [error, setError] = useState<string>();
  const [type, setType] = useState<
    "HealthCheck" | "Hospital" | "OccupationalHealthcare"
  >("HealthCheck");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [diagnosisCodes, setDiagnosisCodes] = useState("");

  const [rating, setRating] = useState("");
  const [dischargeDate, setDischargeDate] = useState("");
  const [dischargeCriteria, setDischargeCriteria] = useState("");
  const [employerName, setEmployerName] = useState("");
  const [sickLeaveStart, setSickLeaveStart] = useState("");
  const [sickLeaveEnd, setSickLeaveEnd] = useState("");

  const onCancel = useCallback(() => {
    rawOnCancel();
    setDescription("");
    setDate("");
    setSpecialist("");
    setRating("");
    setDiagnosisCodes("");
    setDischargeDate("");
    setDischargeCriteria("");
    setEmployerName("");
    setSickLeaveStart("");
    setSickLeaveEnd("");
    setError(undefined);
  }, [rawOnCancel]);

  const onSubmit = useCallback(
    async (entry: NewEntry) => {
      const data = await patientService.addEntry(id, entry);

      onSuccess(data);

      onCancel();
    },
    [id, onCancel, onSuccess],
  );

  const addEntry = async (event: SyntheticEvent) => {
    event.preventDefault();

    const codes = diagnosisCodes
      ? diagnosisCodes
          .split(",")
          .map((c) => c.trim())
          .filter((c) => c !== "")
      : [];

    const baseEntry = {
      description,
      date,
      specialist,
      diagnosisCodes: codes,
    };

    try {
      switch (type) {
        case "HealthCheck":
          await onSubmit({
            ...baseEntry,
            type,
            healthCheckRating: Number(rating) as HealthCheckRating,
          });
          break;
        case "Hospital":
          await onSubmit({
            ...baseEntry,
            type,
            discharge: { date: dischargeDate, criteria: dischargeCriteria },
          });
          break;
        case "OccupationalHealthcare":
          const occEntry: NewEntry = {
            ...baseEntry,
            type,
            employerName,
          };
          if (sickLeaveStart && sickLeaveEnd) {
            occEntry.sickLeave = {
              startDate: sickLeaveStart,
              endDate: sickLeaveEnd,
            };
          }
          await onSubmit(occEntry);
          break;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setError(e?.response?.data || e?.message || "Error caught!");
    }
  };

  return (
    <div
      style={{
        marginBottom: "20px",
        padding: "10px",
        border: "2px dashed gray",
      }}
    >
      {error && (
        <Alert severity="error" style={{ marginBottom: "10px" }}>
          {error}
        </Alert>
      )}
      <form onSubmit={addEntry}>
        <FormControl fullWidth margin="normal">
          <InputLabel>Entry Type</InputLabel>
          <Select
            value={type}
            label="Entry Type"
            onChange={({ target }) => setType(target.value as typeof type)}
          >
            <MenuItem value="HealthCheck">HealthCheck</MenuItem>
            <MenuItem value="Hospital">Hospital</MenuItem>
            <MenuItem value="OccupationalHealthcare">
              OccupationalHealthcare
            </MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Description"
          fullWidth
          value={description}
          onChange={({ target }) => setDescription(target.value)}
          margin="normal"
        />
        <TextField
          label="Date"
          type="date"
          fullWidth
          value={date}
          onChange={({ target }) => setDate(target.value)}
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Specialist"
          fullWidth
          value={specialist}
          onChange={({ target }) => setSpecialist(target.value)}
          margin="normal"
        />
        <TextField
          label="Diagnosis codes"
          placeholder="MD6.7, Z57.1"
          fullWidth
          value={diagnosisCodes}
          onChange={({ target }) => setDiagnosisCodes(target.value)}
          margin="normal"
        />

        {type === "HealthCheck" && (
          <FormControl fullWidth margin="normal">
            <InputLabel>Healthcheck rating</InputLabel>
            <Select
              value={rating}
              label="Healthcheck rating"
              onChange={({ target }) => setRating(target.value)}
            >
              <MenuItem value={0}>Healthy</MenuItem>
              <MenuItem value={1}>LowRisk</MenuItem>
              <MenuItem value={2}>HighRisk</MenuItem>
              <MenuItem value={3}>CriticalRisk</MenuItem>
            </Select>
          </FormControl>
        )}

        {type === "Hospital" && (
          <>
            <Typography variant="subtitle1" style={{ marginTop: "10px" }}>
              Discharge
            </Typography>
            <TextField
              label="Discharge Date"
              type="date"
              fullWidth
              value={dischargeDate}
              onChange={({ target }) => setDischargeDate(target.value)}
              margin="dense"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Discharge Criteria"
              fullWidth
              value={dischargeCriteria}
              onChange={({ target }) => setDischargeCriteria(target.value)}
              margin="dense"
            />
          </>
        )}

        {type === "OccupationalHealthcare" && (
          <>
            <TextField
              label="Employer Name"
              fullWidth
              value={employerName}
              onChange={({ target }) => setEmployerName(target.value)}
              margin="normal"
            />
            <Typography variant="subtitle1" style={{ marginTop: "10px" }}>
              Sick Leave
            </Typography>
            <TextField
              label="Start Date"
              type="date"
              fullWidth
              value={sickLeaveStart}
              onChange={({ target }) => setSickLeaveStart(target.value)}
              margin="dense"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="End Date"
              type="date"
              fullWidth
              value={sickLeaveEnd}
              onChange={({ target }) => setSickLeaveEnd(target.value)}
              margin="dense"
              InputLabelProps={{ shrink: true }}
            />
          </>
        )}

        <Divider style={{ marginTop: "20px" }} />

        <Grid container spacing={2} style={{ marginTop: "10px" }}>
          <Grid item>
            <Button
              color="error"
              variant="contained"
              type="button"
              onClick={onCancel}
            >
              CANCEL
            </Button>
          </Grid>
          <Grid item xs style={{ textAlign: "right" }}>
            <Button type="submit" variant="contained">
              ADD
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}
