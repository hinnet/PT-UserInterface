import { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
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

    const handleSave = () => {
        // valitun asiakkaan osoite, muokattu asiakas -state
        updateCustomer(props.data._links.self.href, customer)
        .then(() => props.handleFetch())
        .then(setOpen(false))
        .catch(err => console.error(err))
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
                margin="dense"
                name="firstname"
                value={customer.firstname}
                onChange={event => setCustomer({...customer, firstname: event.target.value})}
                label="Firstname"
                fullWidth
                variant="standard"
            />
            <TextField
                margin="dense"
                name="lastname"
                value={customer.lastname}
                onChange={event => setCustomer({...customer, lastname: event.target.value})}
                label="Lastname"
                fullWidth
                variant="standard"
            />
            <TextField
                margin="dense"
                name="streetaddress"
                value={customer.streetaddress}
                onChange={event => setCustomer({...customer, streetaddress: event.target.value})}
                label="Streetaddress"
                fullWidth
                variant="standard"
            />
            <TextField
                margin="dense"
                name="postcode"
                value={customer.postcode}
                onChange={event => setCustomer({...customer, postcode: event.target.value})}
                label="Postcode"
                fullWidth
                variant="standard"
            />
            <TextField
                margin="dense"
                name="city"
                value={customer.city}
                onChange={event => setCustomer({...customer, city: event.target.value})}
                label="City"
                fullWidth
                variant="standard"
            />
            <TextField
                margin="dense"
                name="email"
                value={customer.email}
                onChange={event => setCustomer({...customer, email: event.target.value})}
                label="Email"
                fullWidth
                variant="standard"
            />
            <TextField
                margin="dense"
                name="phone"
                value={customer.phone}
                onChange={event => setCustomer({...customer, phone: event.target.value})}
                label="Phone"
                fullWidth
                variant="standard"
            />
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
            </DialogActions>
        </Dialog>
        </>
    );
}
