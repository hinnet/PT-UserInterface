import { useState, useEffect } from "react";
import { Box, Button, Snackbar } from "@mui/material";
import { DataGrid, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarFilterButton } from '@mui/x-data-grid';
import { DeleteForever } from '@mui/icons-material';
import dayjs from "dayjs";

import { getTrainings, deleteTraining } from "../trainingapi";

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector
        slotProps={{ tooltip: {title: "Change density"} }}
      />
  </GridToolbarContainer>
  );
}

export default function TrainingList() {
  const [trainings, setTrainings] = useState([]);
  const [open, setOpen] = useState(false);

 const columns = [
    { 
      field: "date", 
      headerName: "Date",
      renderCell: params => dayjs(params.value).format('DD.MM.YYYY HH:mm'),
      width: 180
    },
    { 
      field: "duration",
      headerName: "Duration",
      width: 100
    },
    { 
      field: "activity",
      headerName: "Activity",
      width: 180
    },
    { 
      field: "customer",
      headerName: "Customer",
      width: 200
    },
    {
      field: "delete",
      headerName: "", 
      sortable: false, 
      renderCell: params => 
        <Button color="error" endIcon={<DeleteForever />} onClick={() => handleDelete(params.row)}>Delete</Button>, 
      width: 150,
    }
  ];

  useEffect(() => {
    handleFetch();
  }, []);

  // (Promise chain)
  const handleFetch = () => {
    getTrainings()
      .then(data => {
      const trainings = data._embedded.trainings;
      // Käydään läpi treenit ja jokaisen treenin asiakas. Lisätään tiedot fetchPromises-taulukkoon.
      const fetchPromises = trainings.map((training, index) => {
        training.id = index;
        if (training._links.customer) {
          return fetch(training._links.customer.href)
          .then(response => response.json())
          .then(customerData => {
            training.customer = `${customerData.firstname} ${customerData.lastname}`;
            return training;
          })
          .catch((err) => {
            console.error(err)
            training.customer = "";
            return training;
          });
        } else {
          return Promise.resolve(training);
        }
      });

      // Promise.all(fetchPromises) odottaa, että kaikki taulukossa olevat lupaukset (= fetch-pyynnöt) on tehty, jonka jälkeen siirrytään eteenpäin.
      Promise.all(fetchPromises)
      .then(trainingsWithCustomers => {
        setTrainings(trainingsWithCustomers);
      })
      // Promise.all error, virhe asiakastietojen hakemisessa
      .catch((err) => console.error(err));
    })
    // getTrainings() error, virhe treenien hakemisessa
    .catch((err) => console.error(err));
  };

  const handleDelete = (params) => {
    if (window.confirm("Do you want to delete training?")) {
      setOpen(true);
      deleteTraining(params._links.self.href)
        .then(() => handleFetch())
        .catch((err) => console.error(err));
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Box style={{ height: 800, width: '100%' }}>
        <DataGrid 
          rows={trainings}
          columns={columns}
          slots={{
            toolbar: CustomToolbar,
          }}
        />
      </Box>
      <Snackbar
        open={open}
        message="Training deleted"
        autoHideDuration={3000}
        onClose={handleClose}
      />
    </>
  );
}