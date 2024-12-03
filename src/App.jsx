import "./App.css";
import { Link, Outlet } from "react-router-dom";
import { Container, CssBaseline, AppBar, Toolbar, Typography }  from "@mui/material";

export default function App() {
  return (
    <Container maxWidth={false} disableGutters>
      <CssBaseline />
        <AppBar position="static" sx={{ backgroundColor: "black" }}>
          <div className="app-bar-container">
            <Toolbar className="toolbar">
              <Typography variant="h6">PT Application</Typography>
            </Toolbar>
            <nav>
              <Link to={"/"}>Home</Link>
              <Link to={"/customers"}>Customers</Link>
              <Link to={"/trainings"}>Trainings</Link>
              <Link to={"/calendar"}>Calendar</Link>
              <Link to={"/chart"}>Chart</Link>
            </nav>
          </div>
        </AppBar>
      <Outlet />
    </Container>
  );
}