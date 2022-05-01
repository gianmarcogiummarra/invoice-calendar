import React from "react";
import "./App.css";
import "./components/InvoiceCalendar/InvoiceCalendar.css";
import "./components/MonthBox/MonthBox.css";
import { InvoiceCalendar } from "./components/InvoiceCalendar/InvoiceCalendar";

function App() {
  return (
    <InvoiceCalendar source="https://cors-everywhere.herokuapp.com/http://staccah.fattureincloud.it/testfrontend/data.json" />
  );
}

export default App;
