import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const SkillRadar = ({ skills }) => {
  // Format data for Chart.js
  const labels = skills.map(s => s.skill.skill_name);
  const dataValues = skills.map(s => s.proficiency_level);

  const data = {
    labels: labels.length > 0 ? labels : ['No Skills Added'],
    datasets: [
      {
        label: 'Proficiency (%)',
        data: dataValues.length > 0 ? dataValues : [0],
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderColor: '#6366f1',
        borderWidth: 2,
        pointBackgroundColor: '#6366f1',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#6366f1',
      },
    ],
  };

  const options = {
    scales: {
      r: {
        angleLines: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        pointLabels: {
          color: '#94a3b8',
          font: {
            size: 12,
            family: "'Plus Jakarta Sans', sans-serif",
          },
        },
        ticks: {
          backdropColor: 'transparent',
          color: '#94a3b8',
          beginAtZero: true,
          max: 100,
          stepSize: 20,
        },
        suggestedMin: 0,
        suggestedMax: 100,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="w-full h-full min-h-[300px]">
      <Radar data={data} options={options} />
    </div>
  );
};

export default SkillRadar;
