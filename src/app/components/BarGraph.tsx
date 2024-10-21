import { Chart, registerables } from 'chart.js';
import ChartDeferred from 'chartjs-plugin-deferred';
import { Bar } from 'react-chartjs-2';

Chart.register(...registerables, ChartDeferred);

Chart.defaults.font.family = 'Gotham Narrow Book';

const colours = ['#550D35', '#FBD166', '#F2695D', '#5125E8', '#C9D5E9'];

interface BarGraphProps {
  labels: string[];
  values: number[];
}

const BarGraph = ({ labels, values }: BarGraphProps) => {
  const options = {
    datasets: {
      bar: {},
    },
  };

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: colours,
        hoverBackgroundColor: colours,
        borderRadius: 35,
      },
    ],
  };

  return <Bar options={options} data={data} />;
};

export default BarGraph;
