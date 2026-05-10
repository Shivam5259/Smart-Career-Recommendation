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

  // Radar charts need at least 3 points to look like a shape.
  // If we have 1 or 2 skills, we'll repeat them with 0 value to maintain the chart structure
  // but keep the visual focus on the actual skills.
  let displayLabels = [...labels];
  let displayValues = [...dataValues];

  if (labels.length === 1) {
    displayLabels = [labels[0], '', ''];
    displayValues = [dataValues[0], 0, 0];
  } else if (labels.length === 2) {
    displayLabels = [labels[0], labels[1], ''];
    displayValues = [dataValues[0], dataValues[1], 0];
  }

  const data = {
    labels: displayLabels.length > 0 ? displayLabels : ['No Skills'],
    datasets: [
      {
        label: 'Proficiency (%)',
        data: displayValues.length > 0 ? displayValues : [0],
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderColor: '#6366f1',
        borderWidth: 2,
        pointBackgroundColor: '#6366f1',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#6366f1',
        tension: 0.4,
      },
    ],
  };

  const options = {
    scales: {
      r: {
        angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        pointLabels: {
          color: '#94a3b8',
          font: { size: 10, weight: '700' },
          padding: 10
        },
        ticks: {
          display: false,
          beginAtZero: true,
          max: 100,
        },
        suggestedMin: 0,
        suggestedMax: 100,
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => ` Proficiency: ${context.raw}%`
        }
      }
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="w-full h-full flex-center">
      <Radar data={data} options={options} />
    </div>
  );
};

export default SkillRadar;
