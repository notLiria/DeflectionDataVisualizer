/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unused-vars */
/* eslint-disable no-plusplus */
import React, { useState } from "react";
import CSVReader from "react-csv-reader";
import DeflectionGraph from "../DeflectionGraph/DeflectionGraph";
import type { DeflectionType } from "../types";

const DeflectionCsvReader = () => {
  const [csvData, setCsvData] = useState<DeflectionType[]>([]);

  const handleForce = (data: any[], fileInfo: any) => {
    const masses = data.map(x => {
      return parseFloat(x.Mass);
    });
    const keys = Object.keys(data[0]).filter(x => {
      return x !== "Mass";
    });

    const deflections = keys.map(key => {
      const nominalPoundage = parseFloat(key.split(" ")[1].split("@")[0]);
      const deflectionForKey = data
        .map(x => {
          return parseFloat(x[key]);
        })
        .filter(Boolean);
      return {
        title: key,
        nominalPoundage,
        deflections: deflectionForKey,
        mass: masses.slice(0, deflectionForKey.length),
      };
    });

    setCsvData(deflections);
  };

  return (
    <div>
      <h2>Upload your CSV file</h2>
      <CSVReader
        cssClass="react-csv-input"
        onFileLoaded={handleForce}
        parserOptions={{ header: true }}
      />
      <div>
        <DeflectionGraph deflections={csvData} />
      </div>
    </div>
  );
};

export default DeflectionCsvReader;
