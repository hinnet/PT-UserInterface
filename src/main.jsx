import React from "react";
import ReactDOM from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router-dom";

import App from "./App";
import Error from "./components/Error";
import Home from "./components/Home";
import CustomerList from "./components/CustomerList";
import TrainingList from "./components/TrainingList";
import Calendar from "./components/Calendar";
import Chart from "./components/Chart";

const router = createHashRouter([
  {
    basename: import.meta.env.BASE_URL,
    path: "/",
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        element: <Home />,
        index: true,
      },
      {
        path: "customers",
        element: <CustomerList />,
      },
      {
        path: "trainings",
        element: <TrainingList />,
      },
      {
        path: "calendar",
        element: <Calendar />,
      },
      {
        path: "chart",
        element: <Chart />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
