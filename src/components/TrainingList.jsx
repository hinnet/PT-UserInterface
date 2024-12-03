import { useState, useEffect } from "react";
import { Box, Button, Snackbar } from "@mui/material";
import { DataGrid, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarFilterButton } from '@mui/x-data-grid';
import { DeleteForever } from '@mui/icons-material';
import dayjs from "dayjs";

import { deleteTraining } from "../trainingapi";
import mappingService from "./trainingMappingService";

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

  const handleFetch = () => {
    mappingService()
      .then(trainingsWithCustomers => {
        setTrainings(trainingsWithCustomers);
      })
      .catch((err) => console.log(err))
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
      <div style={{ display: "flex", alignContent: "center", justifyContent: "center"}}>
        <Box style={{ height: 800, width: 'auto' }}>
          <DataGrid 
            rows={trainings}
            columns={columns}
            slots={{
              toolbar: CustomToolbar,
            }}
          />
        </Box>
      </div>
      <Snackbar
        open={open}
        message="Training deleted"
        autoHideDuration={3000}
        onClose={handleClose}
      />
    </>
  );
}