import React from "react";
import "./App.css";
import DicomHeader from "./components/DicomHeader";

const App = () => {

  return (
    <div style={{textAlign:"center"}}>
      <DicomHeader />
    </div>
  );
};

export default App;


// npm install dicom-parser
// npm install react-dropzone