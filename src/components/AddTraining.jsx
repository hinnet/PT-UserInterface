import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers";

import { saveTrainingOfCustomer } from "../customerapi";

export default function AddTraining(props) {
  const [customer, setCustomer] = useState({
    firstname: "",
    lastname: "",
  });
  const [training, setTraining] = useState({
    date: dayjs(), // Nykyinen pvm oletukseksi
    duration: null,
    activity: "",
  });
  const [open, setOpen] = useState(false);
  const [activityError, setActivityError] = useState(false);
  const [durationError, setDurationError] = useState(false);

  const changeDate = (date) => {
    setTraining({ ...training, date: dayjs(date) });
  };

  const handleClickOpen = () => {
    setOpen(true);
    setCustomer({
      firstname: props.data.firstname,
      lastname: props.data.lastname,
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const activityErrorValidation = () => {
    if (!training.activity) {
      // Asetetaan error näkyville lomakkeeseen
      setActivityError(true);
      // Palautetaan true activityErrorille
      return true;
    } else {
      // Asetetaan error pois lomakenäkymästä
      setActivityError(false);
      // Palautetaan false activityErrorille
      return false;
    }
  };

  const durationErrorValidation = () => {
    if (!training.duration || isNaN(training.duration)) {
      setDurationError(true);
      return true;
    } else {
      setDurationError(false);
      return false;
    }
  };

  const handleSave = () => {
    const activityErrorState = activityErrorValidation();
    const durationErrorState = durationErrorValidation();

    // Palautetaan lomake, jos erroreita ilmenee
    if (activityErrorState || durationErrorState) {
      return;
    }
    // valitun asiakkaan osoite, uusi training
    else {
      saveTrainingOfCustomer(props.data._links.customer.href, training)
        .then(() => {
          handleClose();
        })
        .catch((err) => console.error(err));
    }
  };

  return (
    <>
      <Button endIcon={<FitnessCenterIcon />} onClick={handleClickOpen}>
        Add
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>New Training</DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              margin="dense"
              name="date"
              value={training.date}
              onChange={(date) => changeDate(date)}
              label="Date"
              format="DD.MM.YYYY HH:mm"
              ampm={false} // dropdown valinta 24h, ei 12h
              variant="standard"
              sx={{ marginTop: 1 }}
            />
          </LocalizationProvider>
          <TextField
            required
            margin="dense"
            fullWidth
            variant="outlined"
            name="activity"
            value={training.activity}
            onChange={(event) =>
              setTraining({ ...training, activity: event.target.value })
            }
            label="Activity"
            error={activityError}
            helperText={activityError ? "Set activity" : ""}
          />
          <TextField
            required
            margin="dense"
            fullWidth
            variant="outlined"
            name="duration"
            value={training.duration}
            onChange={(event) =>
              setTraining({ ...training, duration: event.target.value })
            }
            placeholder="minutes"
            label="Duration"
            error={durationError}
            helperText={durationError ? "Duration must be a valid number" : ""}
          />
          <TextField
            disabled
            margin="dense"
            name="customer"
            value={`${customer.firstname} ${customer.lastname}`}
            label="Customer"
            fullWidth
            variant="outlined"
          />
          <Typography
            variant="caption"
            color="textSecondary"
            sx={{ marginTop: 2 }}
          >
            Required *
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
