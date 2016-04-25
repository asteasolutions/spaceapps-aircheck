import React from 'react';
import { Line } from 'react-chartjs';

import createComponent from '../utils/createComponent';

const Chart = (props) => {
  const sorted = Array.from(props.symptomCounts).sort();
  const minCount = sorted[0];
  const maxCount = sorted[sorted.length - 1];
  const length = maxCount - minCount;
  const scaled = props.symptomCounts.map(count => (count - minCount) / length);

  const data = {
    labels: props.dates.map(date => date.toDateString()),
    datasets: [
      {
        label: 'Symptom counts',
        strokeColor: 'rgba(255, 0, 0, 1)',
        data: scaled,
      },
      {
        label: props.layerName,
        strokeColor: 'rgba(0, 255, 0, 1)',
        data: props.layerValues,
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
