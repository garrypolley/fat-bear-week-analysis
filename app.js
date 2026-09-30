const STAGES = ["Open", "Day2", "Mid", "Late/Semi", "Finals"];

const COLORS = {
  y2026: "#6b9e8a",
  y2025: "#7fad6a",
  y2024: "#c4924a",
  y2023: "#8a9080",
  y2022: "#c46a5a",
  guide: "#9aa58a",
};

const vsOpener = {
  labels: STAGES,
  datasets: [
    {
      label: "2026",
      data: [100, 80.4, 64.0, 74.0, 98.6],
      backgroundColor: COLORS.y2026,
    },
    {
      label: "2025",
      data: [100, 112.0, 81.0, 73.8, 101.6],
      backgroundColor: COLORS.y2025,
    },
    {
      label: "2024",
      data: [100, 88.7, 44.0, 69.5, 89.4],
      backgroundColor: COLORS.y2024,
    },
    {
      label: "2023",
      data: [100, 97.3, 51.6, 70.5, 90.3],
      backgroundColor: COLORS.y2023,
    },
    {
      label: "2022",
      data: [100, 102.7, 59.4, 70.2, 114.2],
      backgroundColor: COLORS.y2022,
    },
    guideLine("Same as opener", STAGES.length),
  ],
};

const yoy = {
  labels: STAGES,
  datasets: [
    {
      label: "2026 vs 2025",
      data: [129.7, 93.1, 102.5, 130.1, 125.9],
      backgroundColor: COLORS.y2026,
    },
    {
      label: "2025 vs 2024",
      data: [138.6, 175.0, 255.2, 147.2, 157.5],
      backgroundColor: COLORS.y2025,
    },
    {
      label: "2024 vs 2023",
      data: [78.1, 71.2, 66.6, 77.0, 77.4],
      backgroundColor: COLORS.y2024,
    },
    {
      label: "2023 vs 2022",
      data: [133.0, 126.0, 115.5, 133.5, 105.1],
      backgroundColor: COLORS.y2023,
    },
    guideLine("Same as prior year", STAGES.length),
  ],
};

const gapLabels = [
  "22-10-05",
  "22-10-06",
  "22-10-07",
  "22-10-08",
  "23-10-04",
  "23-10-05",
  "23-10-06",
  "23-10-07",
  "23-10-09",
  "24-10-02",
  "24-10-03",
  "24-10-04",
  "24-10-05",
  "24-10-07",
  "25-09-23",
  "25-09-24",
  "25-09-25",
  "25-09-26",
  "25-09-29",
  "26-09-23",
  "26-09-24",
  "26-09-25",
  "26-09-28",
];

const gapPct = [
  1.6, 6.1, 2.4, 0.6, 7.8, 9.6, 2.7, 3.9, 1.3, 4.3, 2.7, 3.7, 2.4, 1.2, 1.6,
  1.7, 2.5, 2.9, 4.8, 16.4, 3.7, 2.3, 5.7,
];

function guideLine(label, n) {
  return {
    type: "line",
    label,
    data: Array(n).fill(100),
    borderColor: COLORS.guide,
    borderWidth: 2,
    borderDash: [6, 4],
    pointRadius: 0,
    tension: 0,
    order: 0,
  };
}

function baseOptions(yTitle) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: {
        labels: {
          color: "#e8edd9",
          boxWidth: 12,
          font: { family: "DM Sans" },
        },
      },
      tooltip: {
        callbacks: {
          label(ctx) {
            const v = ctx.parsed.y;
            if (v == null) return ctx.dataset.label;
            return `${ctx.dataset.label}: ${v}`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "#9aa58a", font: { family: "DM Sans", size: 11 } },
        grid: { color: "rgba(44,53,38,0.7)" },
      },
      y: {
        title: {
          display: true,
          text: yTitle,
          color: "#9aa58a",
          font: { family: "DM Sans", size: 12 },
        },
        ticks: { color: "#9aa58a", font: { family: "DM Sans" } },
        grid: { color: "rgba(44,53,38,0.7)" },
        beginAtZero: true,
      },
    },
  };
}

function makeGrouped(canvasId, data, yTitle) {
  const el = document.getElementById(canvasId);
  if (!el) return;
  new Chart(el, {
    type: "bar",
    data,
    options: baseOptions(yTitle),
  });
}

function makeGaps() {
  const el = document.getElementById("chartGaps");
  if (!el) return;
  new Chart(el, {
    type: "bar",
    data: {
      labels: gapLabels,
      datasets: [
        {
          label: "Gap as % of day's max pair",
          data: gapPct,
          backgroundColor: COLORS.y2024,
        },
        {
          type: "line",
          label: "10% flag",
          data: Array(gapLabels.length).fill(10),
          borderColor: COLORS.y2022,
          borderWidth: 2,
          borderDash: [6, 4],
          pointRadius: 0,
        },
      ],
    },
    options: {
      ...baseOptions("Gap (% of max pair)"),
      scales: {
        ...baseOptions("Gap (% of max pair)").scales,
        x: {
          ticks: {
            color: "#9aa58a",
            maxRotation: 90,
            minRotation: 45,
            font: { family: "DM Sans", size: 10 },
          },
          grid: { display: false },
        },
      },
    },
  });
}

makeGrouped(
  "chartVsOpener",
  vsOpener,
  "Index (that year's opener = 100)"
);
makeGrouped("chartYoY", yoy, "Index (prior year same stage = 100)");
makeGaps();
