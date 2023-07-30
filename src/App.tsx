// <reference path="path/types.d.ts" />
import FaSun from "./assests/images/FaSun.png";
import "./App.css";
import DeflectionCsvReader from "./DeflectionCsvReader/DeflectionCsvReader";

const App = () => {
  return (
    <div>
      <DeflectionCsvReader />
      <h3>react-typescript boilerplate!</h3>
      <h5>testing lint stage!!</h5>

      <img src={FaSun} alt="FaSun" />
    </div>
  );
};

export default App;
