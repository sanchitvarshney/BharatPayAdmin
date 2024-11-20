import { Outlet } from "react-router-dom";
import "./App.css";
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid

function App() {
  return (
    <>
      <Outlet />
    </>
  );
}

export default App;
