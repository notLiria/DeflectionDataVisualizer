/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Scatter } from "react-chartjs-2";
import regression from "regression";
import { Button, Grid } from "@mui/material";
import Annotation from "chartjs-plugin-annotation";
import { Chart, LegendItem, registerables } from "chart.js";
import type { DataPoint } from "regression";
import type { DeflectionType } from "../types";

Chart.register(...registerables);
Chart.register(Annotation);

interface DeflectionGraphProps {
  deflections: DeflectionType[];
}

interface Point {
  x: number;
  y: number;
}

const DeflectionGraph: React.FC<DeflectionGraphProps> = ({ deflections }) => {
  const [data, setData] = useState<{
    datasets: Array<{
      label: string;
      data: Point[];
      backgroundColor: string;
      pointRadius: number;
      showLine: boolean;
    }>;
  }>({ datasets: [] });
  const [normalized, setNormalized] = useState(false);

  useEffect(() => {
    const xAxis = [] as number[];
    if (deflections.length > 0) {
      deflections[0].mass.forEach(x => {
        xAxis.push(x);
      });
    }
    const chartData = {
      datasets: deflections.map((deflection, index) => {
        const data = deflection.mass.map((m, i) => {
          return {
            x: normalized ? m / (deflection.nominalPoundage * 454) : m,
            y: deflection.deflections[i],
          };
        });

        const regressionData = data.map((point: Point) => {
          return [point.x, point.y] as DataPoint;
        });

        // calculate line of best fit
        const result = regression.linear(regressionData, {
          order: 2,
          precision: 15,
        });
        const gradient = result.equation[0];
        const yIntercept = result.equation[1];

        const normalizedAxis = Array.from(Array(10).keys()).map(x => {
          return x / 100;
        });

        const backgroundColor = `rgba(${Math.random() * 255}, ${
          Math.random() * 255
        }, ${Math.random() * 255}, 0.5)`;
        return {
          label: `${deflection.title} - ${deflection.nominalPoundage}`,
          data: normalized
            ? normalizedAxis.map(x => {
                return { x, y: x * gradient + yIntercept };
              })
            : xAxis.map(x => {
                return { x, y: x * gradient + yIntercept } as Point;
              }),
          backgroundColor, // random color
          pointRadius: 2, // hide points
          showLine: true, // show line
          borderColor: backgroundColor,
        };
      }),
    };

    setData(chartData);
  }, [deflections, normalized]);

  const handleNormalize = () => {
    setNormalized(prevNormalized => {
      return !prevNormalized;
    });
  };

  return (
    <div>
      <Scatter
        data={data}
        options={{
          responsive: true,
          plugins: { annotation: { annotations: {} } },
          scales: {
            x: {
              title: {
                display: true,
                text: normalized ? "Mass %" : "Mass in g",
              },
            },
            y: { title: { display: true, text: "Deflection" } },
          },
        }}
      />
      <div>
        <Button
          onClick={handleNormalize}
          variant="contained"
          color={normalized ? "secondary" : "primary"}
        >
          {normalized ? "Denormalize Mass" : "Normalize Mass"}
        </Button>
      </div>
    </div>
  );
};

export default DeflectionGraph;
