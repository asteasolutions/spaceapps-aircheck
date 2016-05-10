import React from 'react';
import { Line } from 'react-chartjs';

import createComponent from '../utils/createComponent';

function scale(arr) {
  const sorted = Array.from(arr).sort((a, b) => a - b);
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const length = max - min;
  return arr.map(value => (value - min) / length);
}

const Chart = (props) => {
  const data = {
    labels: props.dates.map(date => date.toDateString()),
    datasets: [
      {
        label: 'Symptom counts',
        strokeColor: 'rgba(255, 0, 0, 1)',
        data: scale(props.symptomCounts),
      },
      {
        label: props.layerName,
        strokeColor: 'rgba(0, 255, 0, 1)',
        data: scale(props.layerValues),
      },
    ],
  };

  const options = {
    datasetFill: false,
    responsive: true,
    scaleShowGridLines: false,
    showTooltips: false,
  };

  return (
    <div>
      <Line
        data={ data }
        options={ options }
      />
    </div>
  );
};

export default createComponent(Chart, {});
