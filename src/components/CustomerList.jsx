import { useState, useEffect } from "react";
import { Box, Button, Snackbar } from "@mui/material";
import { DataGrid, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport, GridToolbarFilterButton } from '@mui/x-data-grid';

import { getCustomers, deleteCustomer } from "../customerapi";
import AddCustomer from "./AddCustomer";
import EditCustomer from "./EditCustomer";
import AddTraining from "./AddTraining";

import { DeleteForever } from "@mui/icons-material";

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector
        slotProps={{ tooltip: {title: "Change density"} }}
      />
      <Box xs={{ flexGrow: 1 }} />
      <GridToolbarExport
        slotProps={{
          tooltip: { title: "Export customers" },
          button: { variant: "outlined" },
        }}
        csvOptions={{
          fileName: 'customerDataBase',
          delimiter: ';',
          utf8WithBom: true,
          fields: ["firstname", "lastname", "streetaddress", "postcode", "city", "email", "phone"],
        }}
      />
  </GridToolbarContainer>
  );
}

export default function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [open, setOpen] = useState(false);

  const columns = [
    { field: "firstname", headerName:"First Name", width: 130,  },
    { field: "lastname", headerName:"Last Name", width: 140 },
    { field: "streetaddress", headerName:"Streetaddress", width: 180 },
    { field: "postcode", headerName:"Postcode", width: 110 },
    { field: "city", headerName:"City", width: 130 },
    { field: "email", headerName:"Email", width: 150 },
    { field: "phone", headerName:"Phone", width: 120 },
    {
      field: "add training", headerName: "", sortable: false, renderCell: params => 
        { 
          return <AddTraining data={params.row} handleFetch={handleFetch} />;
        }
    },
    {
      field: "edit", headerName: "", sortable: false, renderCell: params => 
        { 
          return <EditCustomer data={params.row} handleFetch={handleFetch} />;
        }
    },
    {
      field: "delete",  headerName: "", sortable: false, renderCell: params => <Button color="error" endIcon={<DeleteForever />} onClick={() => handleDelete(params.row)}>Delete</Button>, width: 150
    }
  ];

  useEffect(() => {
    handleFetch();
  }, []);

  const handleFetch = () => {
    getCustomers()
      .then((data) => 
        setCustomers(data._embedded.customers.map((customer, index) => ({
        id: index,
        ...customer,
      }))
    )
  )
      .catch((err) => console.error(err));
  };

  const handleDelete = (params) => {
    if (window.confirm("Do you want to delete customer? \nThis also deletes all trainings of the customer.")) {
      setOpen(true);
      deleteCustomer(params._links.self.href)
        .then(() => handleFetch())
        .catch((err) => console.error(err));
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
    <div style={{ height: 60, display: "grid", justifyItems: "end", padding: 10 }}>
      <AddCustomer handleFetch={handleFetch} />
    </div>
    <div style={{ display: "flex", alignContent: "center", justifyContent: "center"}}>
      <div style={{ height: 800, width: "auto" }}>
        <DataGrid 
          rows={customers}
          columns={columns}
          slots={{
            toolbar: CustomToolbar,
          }}
        />
      </div>
    </div>
      <Snackbar
        open={open}
        message="Customer deleted"
        autoHideDuration={3000}
        onClose={handleClose}
      />
    </>
  );
}