import { useState } from "react";
import Button from "@mui/material/Button";
import { TextField, Typography } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { updateCustomer } from "../customerapi";

import { Edit } from '@mui/icons-material';

export default function EditCustomer(props) {
    const [customer, setCustomer] = useState({
        firstname: "",
        lastname: "",
        streetaddress: "",
        postcode: "",
        city: "",
        email: "",
        phone: ""
    });
    const [open, setOpen] = useState(false);
    const [firstnameError, setFirstnameError] = useState(false);
    const [lastnameError, setLastnameError] = useState(false);
    const [emailError, setEmailError] = useState(false);


    const handleClickOpen = () => {
        setOpen(true);
        // Tallennetaan valitun asiakkaan tiedot EditCustomer-pop-up-ikkunaan
        setCustomer({
            firstname: props.data.firstname,
            lastname: props.data.lastname,
            streetaddress: props.data.streetaddress,
            postcode: props.data.postcode,
            city: props.data.city,
            email: props.data.email,
            phone: props.data.phone
        })
    };

    const handleClose = () => {
        setOpen(false);
    };

    const firstnameErrorValidation = () => {
        if (!customer.firstname) {
            // Asetetaan error näkyville lomakkeeseen
            setFirstnameError(true);
            // Palautetaan true firstnameErrorille
            return true;
        } else {
            // Asetetaan error pois lomakenäkymästä
            setFirstnameError(false);
            // Palautetaan false firstnameErrorille
            return false;
        }
    }

    const lastnameErrorValidation = () => {
        if (!customer.lastname) {
            setLastnameError(true);
            return true;
        } else {
            setLastnameError(false);
            return false;
        }
    }

    const emailErrorValidation = () => {
        const emailRegex = /^[\w\-\.]+@([\w\-]+\.)+[\w\-]{2,}$/; // https://regex101.com/r/lHs2R3/1
        if (!customer.email || !emailRegex.test(customer.email)) {
            setEmailError(true);
            return true;
        } else {
            setEmailError(false);
            return false;
        }
    }

    const handleSave = () => {
        const firstnameErrorState = firstnameErrorValidation();
        const lastnameErrorState = lastnameErrorValidation();
        const emailErrorState = emailErrorValidation();

        // Palautetaan lomake, jos erroreita ilmenee
        if (firstnameErrorState || lastnameErrorState || emailErrorState) {
            return;
        } else {
        // valitun asiakkaan osoite, muokattu asiakas -state
            updateCustomer(props.data._links.self.href, customer)
            .then(() => props.handleFetch())
            .then(setOpen(false))
            .catch(err=> console.error(err))
        }
    };

    return (
        <>
        <Button endIcon={<Edit />} color="primary" onClick={handleClickOpen}>Edit</Button>
        <Dialog
            open={open}
            onClose={handleClose}
        >
            <DialogTitle>Edit Customer</DialogTitle>
            <DialogContent>
            <TextField
                required
                margin="dense"
                fullWidth
                variant="outlined"
                name="firstname"
                value={customer.firstname}
                onChange={event => setCustomer({...customer, firstname: event.target.value})}
                label="Firstname"
                error={firstnameError}
                helperText={firstnameError ? "Set first name" : ""}
            />
            <TextField
                required
                margin="dense"
                fullWidth
                variant="outlined"
                name="lastname"
                value={customer.lastname}
                onChange={event => setCustomer({...customer, lastname: event.target.value})}
                label="Lastname"
                error={lastnameError}
                helperText={lastnameError ? "Set last name" : ""}
            />
            <TextField
                margin="dense"
                fullWidth
                variant="outlined"
                name="streetaddress"
                value={customer.streetaddress}
                onChange={event => setCustomer({...customer, streetaddress: event.target.value})}
                label="Streetaddress"
            />
            <TextField
                margin="dense"
                fullWidth
                variant="outlined"
                name="postcode"
                value={customer.postcode}
                onChange={event => setCustomer({...customer, postcode: event.target.value})}
                label="Postcode"
            />
            <TextField
                margin="dense"
                fullWidth
                variant="outlined"
                name="city"
                value={customer.city}
                onChange={event => setCustomer({...customer, city: event.target.value})}
                label="City"
            />
            <TextField
                required
                margin="dense"
                fullWidth
                variant="outlined"
                name="email"
                value={customer.email}
                onChange={event => setCustomer({...customer, email: event.target.value})}
                label="Email"
                error={emailError}
                helperText={emailError ? 
                <>
                    Set valid email, for example: 
                    <span style={{ fontStyle: "italic" }}> example@gmail.com</span>
                </> 
                : ""}
            />
            <TextField
                margin="dense"
                fullWidth
                variant="outlined"
                name="phone"
                value={customer.phone}
                onChange={event => setCustomer({...customer, phone: event.target.value})}
                label="Phone"
            />
            <Typography 
                variant="caption" 
                color="textSecondary" 
                sx={{ marginTop: 2 }}>
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
