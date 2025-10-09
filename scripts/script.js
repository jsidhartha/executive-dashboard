// === HR (Human Resources) KPI Data ===
const hrKPIs = [
    {
        title: "Supplier Compliance",
        value: 97,
        target: "≥ 95%",
        type: "doughnut",
        color: "emerald",
        definition: "POs delivered on spec, on time, with required docs/SLAs.",
        formula: "Compliance% = (#Compliant Deliveries / #Deliveries) × 100 (monthly)"
    },
    {
        title: "Attrition (Voluntary)",
        value: [10, 11, 10.5, 10, 9.8, 11.2],
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        target: "< 12%",
        type: "line",
        color: "amber",
        definition: "Annualized voluntary separations as % of average headcount.",
        formula: "Attrition% = (#Voluntary Separations × 12 / Months) / Avg Headcount × 100"
    },
    {
        title: "Time-to-Fill (Critical Roles)",
        value: [80, 75, 82, 78, 70, 76],
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        target: "< 60 days",
        type: "line",
        color: "amber",
        definition: "Calendar days from approved req to accepted offer for critical roles.",
        formula: "TTF = Offer Accept Date − Requisition Approval Date"
    },
    {
        title: "Employee Engagement",
        value: [81, 84, 82, 87],
        labels: ["Q1", "Q2", "Q3", "Q4"],
        target: "≥ 80%",
        type: "line",
        color: "emerald",
        definition: "Percent favorable on engagement survey composite.",
        formula: "Engagement% = (#Favorable / #Responses) × 100"
    },
    {
        title: "Exit Interview Compliance",
        value: 92,
        target: "100%",
        type: "doughnut",
        color: "amber",
        definition: "Share of exits with completed interview and checklist.",
        formula: "Compliance% = (#Exits with Interview & Checklist / #Total Exits) × 100"
    }
];

// === Render HR KPIs ===
function renderHRKPIs() {
    const container = document.getElementById("hrContainer");
    container.innerHTML = hrKPIs.map((kpi, i) => `
    <div class="relative bg-${kpi.color}-50 border border-${kpi.color}-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
      <div class="flex justify-between items-start">
        <h3 class="text-lg font-semibold text-${kpi.color}-900">${kpi.title}</h3>
        <div class="relative group">
          <button class="text-${kpi.color}-700 hover:text-${kpi.color}-900 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 2a10 10 0 100 20 10 10 0 000-20zM12 8h.01M11 12h1v4h1" />
            </svg>
          </button>
          <div class="tooltip absolute top-6 right-0 w-64 bg-white border border-gray-200 text-gray-700 text-sm rounded-lg shadow-md p-3 opacity-0 group-hover:opacity-100 transition-all duration-200 z-50">
            <p class="font-semibold text-gray-800 mb-1">Definition</p>
            <p class="mb-2 text-gray-600">${kpi.definition}</p>
            <p class="font-semibold text-gray-800 mb-1">Formula</p>
            <p class="text-gray-600">${kpi.formula}</p>
          </div>
        </div>
      </div>

      <div class="mt-4 h-48 w-full">
        <canvas id="hrChart${i}"></canvas>
      </div>

      <p class="text-sm text-slate-600 mt-2">Target: ${kpi.target}</p>
    </div>
  `).join('');

    hrKPIs.forEach((kpi, i) => {
        const ctx = document.getElementById(`hrChart${i}`).getContext("2d");

        if (kpi.type === "doughnut") {
            new Chart(ctx, {
                type: "doughnut",
                data: {
                    labels: ["Achieved", "Remaining"],
                    datasets: [{
                        data: [kpi.value, 100 - kpi.value],
                        backgroundColor: [
                            `rgba(${kpi.color === 'amber' ? '251, 191, 36' : '16, 185, 129'}, 0.9)`,
                            "rgba(229, 231, 235, 0.4)"
                        ],
                        borderWidth: 0,
                        cutout: "70%"
                    }]
                },
                options: {
                    plugins: {
                        legend: { display: false },
                        tooltip: { enabled: false },
                        title: {
                            display: true,
                            text: `${kpi.value}%`,
                            color: `rgb(31, 41, 55)`,
                            font: { size: 22, weight: "bold" },
                            position: "center"
                        }
                    },
                    maintainAspectRatio: false
                }
            });
        }

        if (kpi.type === "line") {
            new Chart(ctx, {
                type: "line",
                data: {
                    labels: kpi.labels,
                    datasets: [{
                        data: kpi.value,
                        borderColor: `rgb(${kpi.color === 'amber' ? '251, 191, 36' : '16, 185, 129'})`,
                        backgroundColor: `rgba(${kpi.color === 'amber' ? '251, 191, 36' : '16, 185, 129'}, 0.2)`,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 4,
                        pointHoverRadius: 6,
                    }]
                },
                options: {
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { grid: { display: false } },
                        y: { grid: { color: "rgba(0,0,0,0.05)" }, ticks: { stepSize: 5 } }
                    },
                    maintainAspectRatio: false
                }
            });
        }
    });
}

document.addEventListener("DOMContentLoaded", renderHRKPIs);



// === GRC (Governance, Risk & Compliance) KPI Data ===
const grcKPIs = [
    {
        title: "Contract Review Cycle",
        value: [26.5, 25.8, 27.3, 24.9, 23.1, 22.0],
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        target: "< 30 days",
        type: "line",
        color: "rose",
        definition: "Calendar days from legal intake to approval/sign-ready.",
        formula: "Cycle Time = Approval/Send-to-Client − Legal Intake (median preferred)"
    },
    {
        title: "Regulatory Audit Success",
        value: 86,
        target: "100%",
        type: "doughnut",
        color: "emerald",
        definition: "Audits passed without major findings.",
        formula: "Success% = (#Audits Passed / #Audits Completed) × 100 (annual)"
    },
    {
        title: "Legal Disputes Ratio",
        value: [1.1, 1.0, 0.8, 0.6, 0.7, 0.9],
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        target: "< 1% of contracts",
        type: "bar",
        color: "rose",
        definition: "Contracts entering formal dispute/arbitration.",
        formula: "Dispute% = (#Contracts in Dispute / #Active Contracts) × 100 (annualized)"
    },
    {
        title: "Supplier Risk Score",
        value: 2.6,
        target: "≤ 3 (1–5 scale)",
        type: "doughnut",
        color: "amber",
        definition: "Composite vendor risk index from financial, cyber, and compliance inputs.",
        formula: "Weighted Score (Risk Factors)"
    },
    {
        title: "Policy Training Completion (%)",
        value: 98,
        target: "100% on time",
        type: "doughnut",
        color: "green",
        definition: "Percent of assigned policy trainings completed by employees on time.",
        formula: "100 × (Trainings Completed On Time / Trainings Assigned)"
    }
];

// === Render GRC KPIs ===
function renderGRCKPIs() {
    const container = document.getElementById("grcContainer");
    container.innerHTML = grcKPIs.map((kpi, i) => `
    <div class="relative bg-${kpi.color}-50 border border-${kpi.color}-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
      <div class="flex justify-between items-start">
        <h3 class="text-lg font-semibold text-${kpi.color}-900">${kpi.title}</h3>
        <div class="relative group">
          <button class="text-${kpi.color}-700 hover:text-${kpi.color}-900 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 2a10 10 0 100 20 10 10 0 000-20zM12 8h.01M11 12h1v4h1" />
            </svg>
          </button>
          <div class="tooltip absolute top-6 right-0 w-64 bg-white border border-gray-200 text-gray-700 text-sm rounded-lg shadow-md p-3 opacity-0 group-hover:opacity-100 transition-all duration-200 z-50">
            <p class="font-semibold text-gray-800 mb-1">Definition</p>
            <p class="mb-2 text-gray-600">${kpi.definition}</p>
            <p class="font-semibold text-gray-800 mb-1">Formula</p>
            <p class="text-gray-600">${kpi.formula}</p>
          </div>
        </div>
      </div>

      <div class="mt-4 h-48 w-full">
        <canvas id="grcChart${i}"></canvas>
      </div>

      <p class="text-sm text-slate-600 mt-2">Target: ${kpi.target}</p>
    </div>
  `).join('');

    grcKPIs.forEach((kpi, i) => {
        const ctx = document.getElementById(`grcChart${i}`).getContext("2d");

        // Doughnut charts
        if (kpi.type === "doughnut") {
            new Chart(ctx, {
                type: "doughnut",
                data: {
                    labels: ["Achieved", "Remaining"],
                    datasets: [{
                        data: [kpi.value, 100 - kpi.value],
                        backgroundColor: [
                            `rgba(${kpi.color === 'rose' ? '244, 63, 94' : kpi.color === 'amber' ? '251, 191, 36' : kpi.color === 'sky' ? '56, 189, 248' : '16, 185, 129'}, 0.9)`,
                            "rgba(229, 231, 235, 0.4)"
                        ],
                        borderWidth: 0,
                        cutout: "70%"
                    }]
                },
                options: {
                    plugins: {
                        legend: { display: false },
                        tooltip: { enabled: false },
                        title: {
                            display: true,
                            text: `${kpi.value}%`,
                            color: "rgb(31, 41, 55)",
                            font: { size: 22, weight: "bold" },
                            position: "center"
                        }
                    },
                    maintainAspectRatio: false
                }
            });
        }

        // Line charts
        if (kpi.type === "line") {
            new Chart(ctx, {
                type: "line",
                data: {
                    labels: kpi.labels,
                    datasets: [{
                        data: kpi.value,
                        borderColor: `rgb(244, 63, 94)`,
                        backgroundColor: `rgba(244, 63, 94, 0.2)`,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 4,
                        pointHoverRadius: 6,
                    }]
                },
                options: {
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { grid: { display: false } },
                        y: { grid: { color: "rgba(0,0,0,0.05)" } }
                    },
                    maintainAspectRatio: false
                }
            });
        }

        // Bar charts
        if (kpi.type === "bar") {
            new Chart(ctx, {
                type: "bar",
                data: {
                    labels: kpi.labels,
                    datasets: [{
                        data: kpi.value,
                        backgroundColor: `rgba(244, 63, 94, 0.6)`,
                        borderRadius: 6
                    }]
                },
                options: {
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { grid: { display: false } },
                        y: { grid: { color: "rgba(0,0,0,0.05)" } }
                    },
                    maintainAspectRatio: false
                }
            });
        }
    });
}

// Auto render when DOM loads
document.addEventListener("DOMContentLoaded", renderGRCKPIs);


// === PMO (Project Management Office) KPI Data ===
const pmoKPIs = [
    {
        title: "On-time Delivery",
        value: [89, 91, 94, 90, 92, 94],
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        target: "> 90%",
        type: "line",
        color: "emerald",
        definition: "Share of projects/tasks completed by committed date.",
        formula: "OTD% = (#Items Completed On/Before Due / #Completed) × 100"
    },
    {
        title: "Project ROI",
        value: 15,
        target: "≥ 15%",
        type: "static",
        color: "emerald",
        definition: "Return generated by project vs. cost.",
        formula: "ROI% = (Benefit − Cost) / Cost × 100"
    },
    {
        title: "Lead Time (Procurement)",
        value: [46, 45, 43, 41, 40, 43],
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        target: "< 45 days",
        type: "line",
        color: "amber",
        definition: "Calendar time from approved requisition to item in-hand/ready.",
        formula: "Lead Time = Receipt/Ready Date − Requisition Approval"
    },
    {
        title: "Schedule Variance (%)",
        value: [5, 3, -2, -1, 2, 4],
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        target: "Within ±10%",
        type: "bar",
        color: "rose",
        definition: "Percent difference between planned and actual schedule duration for completed work.",
        formula: "100 × (Planned Duration − Actual Duration) / Planned Duration"
    },
    {
        title: "Resource Utilization (%)",
        value: 82,
        target: "75–85% (sustainable)",
        type: "doughnut",
        color: "green",
        definition: "Share of available capacity consumed by planned work, excluding approved slack.",
        formula: "100 × (Allocated Hours / Available Hours)"
    }
];

// === Render PMO KPIs ===
function renderPMOKPIs() {
    const container = document.getElementById("pmoContainer");
    container.innerHTML = pmoKPIs.map((kpi, i) => `
    <div class="relative bg-${kpi.color}-50 border border-${kpi.color}-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
      <div class="flex justify-between items-start">
        <h3 class="text-lg font-semibold text-${kpi.color}-900">${kpi.title}</h3>
        <div class="relative group">
          <button class="text-${kpi.color}-700 hover:text-${kpi.color}-900 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 2a10 10 0 100 20 10 10 0 000-20zM12 8h.01M11 12h1v4h1" />
            </svg>
          </button>
          <div class="tooltip absolute top-6 right-0 w-64 bg-white border border-gray-200 text-gray-700 text-sm rounded-lg shadow-md p-3 opacity-0 group-hover:opacity-100 transition-all duration-200 z-50">
            <p class="font-semibold text-gray-800 mb-1">Definition</p>
            <p class="mb-2 text-gray-600">${kpi.definition}</p>
            <p class="font-semibold text-gray-800 mb-1">Formula</p>
            <p class="text-gray-600">${kpi.formula}</p>
          </div>
        </div>
      </div>

      <div class="mt-4 h-48 w-full">
        ${kpi.type === "static" ? `
          <div class="flex flex-col items-center justify-center h-full">
            <p class="text-4xl font-bold text-${kpi.color}-900">${kpi.value}%</p>
            <p class="text-sm text-slate-600">Target: ${kpi.target}</p>
            <p class="text-xs text-${kpi.color}-700 mt-1">+1% monthly</p>
          </div>
        ` : `<canvas id="pmoChart${i}"></canvas>`}
      </div>

      ${kpi.type !== "static" ? `<p class="text-sm text-slate-600 mt-2">Target: ${kpi.target}</p>` : ""}
    </div>
  `).join('');

    pmoKPIs.forEach((kpi, i) => {
        if (kpi.type === "static") return; // Skip non-chart cards

        const ctx = document.getElementById(`pmoChart${i}`).getContext("2d");

        // Doughnut chart
        if (kpi.type === "doughnut") {
            new Chart(ctx, {
                type: "doughnut",
                data: {
                    labels: ["Achieved", "Remaining"],
                    datasets: [{
                        data: [kpi.value, 100 - kpi.value],
                        backgroundColor: [
                            `rgba(${kpi.color === 'sky' ? '56, 189, 248' : '16, 185, 129'}, 0.9)`,
                            "rgba(229, 231, 235, 0.4)"
                        ],
                        borderWidth: 0,
                        cutout: "70%"
                    }]
                },
                options: {
                    plugins: {
                        legend: { display: false },
                        tooltip: { enabled: false },
                        title: {
                            display: true,
                            text: `${kpi.value}%`,
                            color: "rgb(31, 41, 55)",
                            font: { size: 22, weight: "bold" },
                            position: "center"
                        }
                    },
                    maintainAspectRatio: false
                }
            });
        }

        // Line chart
        if (kpi.type === "line") {
            new Chart(ctx, {
                type: "line",
                data: {
                    labels: kpi.labels,
                    datasets: [{
                        data: kpi.value,
                        borderColor: `rgb(${kpi.color === 'amber' ? '251, 191, 36' : '16, 185, 129'})`,
                        backgroundColor: `rgba(${kpi.color === 'amber' ? '251, 191, 36' : '16, 185, 129'}, 0.2)`,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 4,
                        pointHoverRadius: 6,
                    }]
                },
                options: {
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { grid: { display: false } },
                        y: { grid: { color: "rgba(0,0,0,0.05)" } }
                    },
                    maintainAspectRatio: false
                }
            });
        }

        // Bar chart
        if (kpi.type === "bar") {
            new Chart(ctx, {
                type: "bar",
                data: {
                    labels: kpi.labels,
                    datasets: [{
                        data: kpi.value,
                        backgroundColor: `rgba(244, 63, 94, 0.6)`,
                        borderRadius: 6
                    }]
                },
                options: {
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { grid: { display: false } },
                        y: { grid: { color: "rgba(0,0,0,0.05)" } }
                    },
                    maintainAspectRatio: false
                }
            });
        }
    });
}

document.addEventListener("DOMContentLoaded", renderPMOKPIs);


// === Security KPI Data ===
const securityKPIs = [
    {
        title: "Mean Time to Detect (MTTD)",
        value: 22,
        trend: "-3m monthly",
        target: "< 30m",
        type: "static",
        color: "amber",
        definition: "Average elapsed time from incident start to detection.",
        formula: "MTTD = Σ(DetectedAt − StartTime) / #Incidents (security events)"
    },
    {
        title: "Critical Breaches",
        value: 1,
        trend: "+1 monthly",
        target: "0",
        type: "static",
        color: "rose",
        definition: "Count of critical-severity security incidents with material impact.",
        formula: "Number of P1/P2 confirmed security breaches (period: monthly)"
    },
    {
        title: "IP Leaks (DLP)",
        value: [1.0, 0.0, 0.0, 1.0, 0.0, 0.9],
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        target: "0",
        type: "bar",
        color: "rose",
        definition: "Number of confirmed data loss exfiltration incidents.",
        formula: "Count of confirmed DLP incidents (period: monthly, 90-day rolling)"
    },
    {
        title: "IAM Coverage",
        value: 96,
        target: "100%",
        type: "doughnut",
        color: "emerald",
        definition: "Percent of in-scope users/apps under centralized SSO with MFA.",
        formula: "Coverage% = (#In-scope with enforced policy / Total in-scope) × 100"
    },
    {
        title: "Patch Compliance",
        value: [95.0, 95.6, 97.3, 96.5, 97.8, 96.9],
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        target: "> 95%",
        type: "line",
        color: "amber",
        definition: "Percent of assets meeting patch currency policy (OS and key apps).",
        formula: "Compliance% = (#Assets Compliant / #Assets in Scope) × 100"
    }
];

// === Render Security KPIs ===
function renderSecurityKPIs() {
    const container = document.getElementById("securityContainer");
    container.innerHTML = securityKPIs.map((kpi, i) => `
    <div class="relative bg-${kpi.color}-50 border border-${kpi.color}-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
      <div class="flex justify-between items-start">
        <h3 class="text-lg font-semibold text-${kpi.color}-900">${kpi.title}</h3>
        <div class="relative group">
          <button class="text-${kpi.color}-700 hover:text-${kpi.color}-900 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 2a10 10 0 100 20 10 10 0 000-20zM12 8h.01M11 12h1v4h1" />
            </svg>
          </button>
          <div class="tooltip absolute top-6 right-0 w-64 bg-white border border-gray-200 text-gray-700 text-sm rounded-lg shadow-md p-3 opacity-0 group-hover:opacity-100 transition-all duration-200 z-50">
            <p class="font-semibold text-gray-800 mb-1">Definition</p>
            <p class="mb-2 text-gray-600">${kpi.definition}</p>
            <p class="font-semibold text-gray-800 mb-1">Formula</p>
            <p class="text-gray-600">${kpi.formula}</p>
          </div>
        </div>
      </div>

      <div class="mt-4 h-48 w-full">
        ${kpi.type === "static" ? `
          <div class="flex flex-col items-center justify-center h-full">
            <p class="text-4xl font-bold text-${kpi.color}-900">${kpi.value}${kpi.title.includes("MTTD") ? "m" : ""}</p>
            <p class="text-sm text-slate-600">Target: ${kpi.target}</p>
            <p class="text-xs text-${kpi.color}-700 mt-1">${kpi.trend}</p>
          </div>
        ` : `<canvas id="securityChart${i}"></canvas>`}
      </div>

      ${kpi.type !== "static" ? `<p class="text-sm text-slate-600 mt-2">Target: ${kpi.target}</p>` : ""}
    </div>
  `).join('');

    securityKPIs.forEach((kpi, i) => {
        if (kpi.type === "static") return;

        const ctx = document.getElementById(`securityChart${i}`).getContext("2d");

        // Doughnut Chart
        if (kpi.type === "doughnut") {
            new Chart(ctx, {
                type: "doughnut",
                data: {
                    labels: ["Achieved", "Remaining"],
                    datasets: [{
                        data: [kpi.value, 100 - kpi.value],
                        backgroundColor: [
                            `rgba(${kpi.color === 'emerald' ? '16, 185, 129' : '251, 191, 36'}, 0.9)`,
                            "rgba(229, 231, 235, 0.4)"
                        ],
                        borderWidth: 0,
                        cutout: "70%"
                    }]
                },
                options: {
                    plugins: {
                        legend: { display: false },
                        tooltip: { enabled: false },
                        title: {
                            display: true,
                            text: `${kpi.value}%`,
                            color: "rgb(31, 41, 55)",
                            font: { size: 22, weight: "bold" },
                            position: "center"
                        }
                    },
                    maintainAspectRatio: false
                }
            });
        }

        // Line Chart
        if (kpi.type === "line") {
            new Chart(ctx, {
                type: "line",
                data: {
                    labels: kpi.labels,
                    datasets: [{
                        data: kpi.value,
                        borderColor: `rgb(251, 191, 36)`,
                        backgroundColor: `rgba(251, 191, 36, 0.2)`,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 4,
                        pointHoverRadius: 6
                    }]
                },
                options: {
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { grid: { display: false } },
                        y: { grid: { color: "rgba(0,0,0,0.05)" } }
                    },
                    maintainAspectRatio: false
                }
            });
        }

        // Bar Chart
        if (kpi.type === "bar") {
            new Chart(ctx, {
                type: "bar",
                data: {
                    labels: kpi.labels,
                    datasets: [{
                        data: kpi.value,
                        backgroundColor: `rgba(244, 63, 94, 0.6)`,
                        borderRadius: 6
                    }]
                },
                options: {
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { grid: { display: false } },
                        y: { grid: { color: "rgba(0,0,0,0.05)" } }
                    },
                    maintainAspectRatio: false
                }
            });
        }
    });
}

document.addEventListener("DOMContentLoaded", renderSecurityKPIs);


// === AI Operations KPI Data ===
const aiOpsKPIs = [
    {
        title: "SLA/Uptime Adherence (%)",
        value: 99.9,
        target: "≥ 99.9% core services",
        trend: "+0.1% monthly",
        direction: "up",
        type: "static",
        color: "emerald",
        definition: "Percent of service runtime that meets uptime targets as defined in the SLA.",
        formula: "100 × (In SLA Minutes / Total Minutes)"
    },
    {
        title: "Incident Volume / 1k users (by priority)",
        value: 8,
        target: "P1 < 0.2; Total < 10",
        trend: "-1.2% monthly",
        direction: "down",
        type: "static",
        color: "amber",
        definition: "Number of incidents normalized per 1,000 active users, split by priority.",
        formula: "1000 × (COUNT(Incidents by Priority) / Active Users)"
    },
    {
        title: "Change Failure Rate",
        value: 12,
        target: "< 10%",
        trend: "+2% monthly",
        direction: "down",
        type: "static",
        color: "rose",
        definition: "Percent of production changes that cause an incident, rollback, or hotfix.",
        formula: "100 × (Failed Changes / Total Changes)"
    },
    {
        title: "MTTI / MTTA (to Identify / Acknowledge)",
        value: "12m / 25m",
        target: "MTTI < 15m; MTTA < 30m",
        trend: "+1m monthly",
        direction: "up",
        type: "static",
        color: "green",
        definition: "Average time to identify an incident and to acknowledge it after detection.",
        formula: "AVG(IdentifiedAt − StartAt); AVG(AcknowledgedAt − StartAt)"
    },
    {
        title: "Problem Backlog (root-cause items)",
        value: 42,
        target: "↓ MoM; < 50 open",
        trend: "-3 items monthly",
        direction: "up",
        type: "static",
        color: "amber",
        definition: "Count of open problem records requiring root-cause analysis or permanent fix.",
        formula: "COUNT(Problem Records where State='Open')"
    }
];

// === Render AI Operations KPIs ===
function renderAIOpsKPIs() {
    const container = document.getElementById("aiContainer");
    container.innerHTML = aiOpsKPIs.map((kpi, i) => `
    <div class="relative bg-${kpi.color}-50 border border-${kpi.color}-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
      <!-- Header -->
      <div class="flex justify-between items-start">
        <h3 class="text-lg font-semibold text-${kpi.color}-900">${kpi.title}</h3>
        <div class="relative group">
          <button class="text-${kpi.color}-700 hover:text-${kpi.color}-900 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 2a10 10 0 100 20 10 10 0 000-20zM12 8h.01M11 12h1v4h1" />
            </svg>
          </button>
          <div class="tooltip absolute top-6 right-0 w-64 bg-white border border-gray-200 text-gray-700 text-sm rounded-lg shadow-md p-3 opacity-0 group-hover:opacity-100 transition-all duration-200 z-50">
            <p class="font-semibold text-gray-800 mb-1">Definition</p>
            <p class="mb-2 text-gray-600">${kpi.definition}</p>
            <p class="font-semibold text-gray-800 mb-1">Formula</p>
            <p class="text-gray-600">${kpi.formula}</p>
          </div>
        </div>
      </div>

      <!-- Value -->
      <div class="mt-4 flex flex-col items-center justify-center h-32">
        <p class="text-4xl font-bold text-${kpi.color}-900">${kpi.value}${typeof kpi.value === "number" && !kpi.title.includes("%") ? "" : ""}</p>
        <p class="text-sm text-slate-600">Target: ${kpi.target}</p>
        <p class="text-xs text-${kpi.color}-700 mt-1">${kpi.trend}</p>
      </div>
    </div>
  `).join('');
}

document.addEventListener("DOMContentLoaded", renderAIOpsKPIs);


// === Incident & CSM KPI Data ===
const incidentKPIs = [
    {
        title: "Mean Time to Resolve (MTTR)",
        value: "5.2 hrs",
        target: "< 8 hrs",
        trend: "-0.5h monthly",
        color: "amber",
        definition: "Average elapsed time between incident open and resolved for P1–P3 tickets.",
        formula: "MTTR = Σ(ResolvedAt − OpenedAt) / #Resolved (last 30 days)"
    },
    {
        title: "Downtime",
        value: "0.12%",
        target: "< 0.1%",
        trend: "+0.02% monthly",
        color: "rose",
        definition: "Total unplanned service unavailability as a percent of total time.",
        formula: "Downtime% = (Unplanned Outage Minutes / Total Minutes) × 100"
    },
    {
        title: "SLA Adherence",
        value: "99.3%",
        target: "> 99%",
        trend: "+0.2% weekly",
        color: "emerald",
        definition: "Percent of tickets resolved within SLA per contract/priority.",
        formula: "SLA% = (#Tickets Met SLA / #Tickets Due) × 100"
    },
    {
        title: "CSAT",
        value: "91%",
        target: "> 85%",
        trend: "+2% monthly",
        color: "emerald",
        definition: "Average customer satisfaction score from post-resolution surveys.",
        formula: "CSAT% = (Σ survey score / max score) × 100"
    },
    {
        title: "Net Promoter Score (NPS)",
        value: "54",
        target: "> 50",
        trend: "+3 quarterly",
        color: "amber",
        definition: "Promoters minus detractors from 'likelihood to recommend' question.",
        formula: "NPS = (%Promoters − %Detractors) (trailing 90 days)"
    },
    {
        title: "Resolution Time",
        value: "42 hrs",
        target: "< 48 hrs",
        trend: "-2 hrs monthly",
        color: "amber",
        definition: "Average time from ticket creation to final closure.",
        formula: "Avg Resolution Time = Σ(ClosedAt − OpenedAt) / #Closed"
    },
    {
        title: "Escalation Rate",
        value: "9%",
        target: "≤ 10%",
        trend: "-1% monthly",
        color: "green",
        definition: "Percent of tickets requiring transfer to a higher tier or specialized queue.",
        formula: "Escalation% = 100 × (#Escalated Tickets / #Total Tickets)"
    },
    {
        title: "Backlog Age / % Breaching SLA",
        value: "Median 6d / Breach 3%",
        target: "Median < 7d; Breach < 5%",
        trend: "-0.5d monthly",
        color: "green",
        definition: "Median age of open tickets and share of open tickets currently past SLA.",
        formula: "Median(Open Ticket Age Days); Breach% = 100 × (#Breached / #Open)"
    },
    {
        title: "Churn Rate (Logo/Revenue)",
        value: "Logo 2.5% / Rev 0.9%",
        target: "Logo ≤ 3%/qtr; Rev ≤ 1%/mo",
        trend: "Stable",
        color: "rose",
        definition: "Rate at which customers or recurring revenue are lost in the measured period.",
        formula: "Churn% = 100 × (#Lost Logos or ARR Lost / Starting ARR)"
    },
    {
        title: "Renewal Rate / NRR",
        value: "Renewal 92% / NRR 112%",
        target: "Renewal ≥ 90%; NRR ≥ 110%",
        trend: "+2% quarterly",
        color: "emerald",
        definition: "Percent of ARR renewed and overall net retention including expansion and churn.",
        formula: "100 × (Start ARR + Expansion − Churn) / Start ARR"
    }
];

// === Render Incident & CSM KPIs ===
function renderIncidentKPIs() {
    const container = document.getElementById("incidentContainer");

    container.innerHTML = incidentKPIs.map((kpi, i) => `
    <div class="relative bg-${kpi.color}-50 border border-${kpi.color}-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
      <div class="flex justify-between items-start">
        <h3 class="text-lg font-semibold text-${kpi.color}-900">${kpi.title}</h3>
        <div class="relative group">
          <button class="text-${kpi.color}-700 hover:text-${kpi.color}-900 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 2a10 10 0 100 20 10 10 0 000-20zM12 8h.01M11 12h1v4h1" />
            </svg>
          </button>
          <div class="tooltip absolute top-6 right-0 w-64 bg-white border border-gray-200 text-gray-700 text-sm rounded-lg shadow-md p-3 opacity-0 group-hover:opacity-100 transition-all duration-200 z-50">
            <p class="font-semibold text-gray-800 mb-1">Definition</p>
            <p class="mb-2 text-gray-600">${kpi.definition}</p>
            <p class="font-semibold text-gray-800 mb-1">Formula</p>
            <p class="text-gray-600">${kpi.formula}</p>
          </div>
        </div>
      </div>

      <div class="mt-4 flex flex-col items-center justify-center h-32">
        <p class="text-4xl font-bold text-${kpi.color}-900">${kpi.value}</p>
        <p class="text-sm text-slate-600">Target: ${kpi.target}</p>
        <p class="text-xs text-${kpi.color}-700 mt-1">${kpi.trend}</p>
      </div>
    </div>
  `).join('');
}

document.addEventListener("DOMContentLoaded", renderIncidentKPIs);


// === Finance KPI Data ===
const financeKPIs = [
    {
        title: "Days Sales Outstanding (DSO)",
        value: [62, 58, 57, 55, 54, 53],
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        target: "< 60 days",
        type: "bar",
        color: "amber",
        definition: "Average number of days to collect receivables.",
        formula: "DSO = (Average A/R Balance / Credit Sales) × Period Days (monthly)"
    },
    {
        title: "Billing Accuracy",
        value: 98,
        target: "> 98%",
        trend: "-1% monthly",
        type: "static",
        color: "rose",
        definition: "Percent of invoices issued without error or credit/rebill.",
        formula: "Accuracy% = (#Invoices w/o Error / #Total Invoices) × 100"
    },
    {
        title: "Cash Flow Variance",
        value: 4.5,
        target: "< 5%",
        trend: "-0.3% monthly",
        type: "static",
        color: "emerald",
        definition: "Deviation of actual cash flow from forecast.",
        formula: "Variance% = (Actual − Forecast) / Forecast × 100"
    },
    {
        title: "Budget Variance",
        value: 6,
        target: "< 10%",
        trend: "+2% monthly",
        type: "static",
        color: "emerald",
        definition: "Deviation of actual spend vs. approved budget.",
        formula: "Var% = (Actual − Budget) / Budget × 100"
    },
    {
        title: "Emergency Purchases",
        value: 5,
        target: "< 5%",
        trend: "0% monthly",
        type: "static",
        color: "amber",
        definition: "Share of POs marked emergency or bypassing standard workflow.",
        formula: "Emergency% = (#Emergency POs / #Total POs) × 100"
    }
];

// === Render Finance KPIs ===
function renderFinanceKPIs() {
    const container = document.getElementById("financeContainer");
    container.innerHTML = financeKPIs.map((kpi, i) => `
    <div class="relative bg-${kpi.color}-50 border border-${kpi.color}-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
      
      <!-- Header -->
      <div class="flex justify-between items-start">
        <h3 class="text-lg font-semibold text-${kpi.color}-900">${kpi.title}</h3>
        <div class="relative group">
          <button class="text-${kpi.color}-700 hover:text-${kpi.color}-900 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 2a10 10 0 100 20 10 10 0 000-20zM12 8h.01M11 12h1v4h1" />
            </svg>
          </button>
          <div class="tooltip absolute top-6 right-0 w-64 bg-white border border-gray-200 text-gray-700 text-sm rounded-lg shadow-md p-3 opacity-0 group-hover:opacity-100 transition-all duration-200 z-50">
            <p class="font-semibold text-gray-800 mb-1">Definition</p>
            <p class="mb-2 text-gray-600">${kpi.definition}</p>
            <p class="font-semibold text-gray-800 mb-1">Formula</p>
            <p class="text-gray-600">${kpi.formula}</p>
          </div>
        </div>
      </div>

      <!-- Chart or Static Value -->
      <div class="mt-4 h-48 w-full">
        ${kpi.type === "static" ? `
          <div class="flex flex-col items-center justify-center h-full">
            <p class="text-4xl font-bold text-${kpi.color}-900">${kpi.value}${kpi.title.includes("%") ? "%" : ""}</p>
            <p class="text-sm text-slate-600">Target: ${kpi.target}</p>
            <p class="text-xs text-${kpi.color}-700 mt-1">${kpi.trend}</p>
          </div>
        ` : `<canvas id="financeChart${i}"></canvas>`}
      </div>

      ${kpi.type !== "static" ? `<p class="text-sm text-slate-600 mt-2">Target: ${kpi.target}</p>` : ""}
    </div>
  `).join('');

    financeKPIs.forEach((kpi, i) => {
        if (kpi.type === "static") return;
        const ctx = document.getElementById(`financeChart${i}`).getContext("2d");

        if (kpi.type === "bar") {
            new Chart(ctx, {
                type: "bar",
                data: {
                    labels: kpi.labels,
                    datasets: [{
                        data: kpi.value,
                        backgroundColor: `rgba(251, 191, 36, 0.6)`,
                        borderRadius: 6
                    }]
                },
                options: {
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { grid: { display: false } },
                        y: { grid: { color: "rgba(0,0,0,0.05)" } }
                    },
                    maintainAspectRatio: false
                }
            });
        }
    });
}

document.addEventListener("DOMContentLoaded", renderFinanceKPIs);



// === Solutions Consulting KPI Data ===
const solutionsKPIs = [
    {
        title: "Win Rate",
        value: 30,
        target: "≥ 35%",
        trend: "-5% monthly",
        type: "static",
        color: "rose",
        definition: "Closed-won deals vs. decided deals.",
        formula: "Win% = (#Closed-Won / (#Closed-Won + #Closed-Lost)) × 100"
    },
    {
        title: "Average Discount",
        value: 12,
        target: "< 15%",
        trend: "-1% monthly",
        type: "pie",
        color: "emerald",
        definition: "Average discount percent on closed-won bookings.",
        formula: "Discount% = Σ(List − Sell) / List × 100 / #Deals",
        labels: ["Product A", "Product B", "Product C", "Product D"],
        dataset: [25, 25, 25, 25]
    },
    {
        title: "Revenue Growth (YoY)",
        value: 12,
        target: "≥ 10%",
        trend: "+1.5% quarterly",
        type: "static",
        color: "amber",
        definition: "Year-over-year growth in recognized revenue.",
        formula: "Growth% = (Revenue(t) − Revenue(t−12m)) / Revenue(t−12m) × 100"
    },
    {
        title: "Contact Rate per 1k users",
        value: 48,
        target: "≤ 50",
        trend: "Stable",
        type: "static",
        color: "green",
        definition: "Support contacts received per 1,000 active users across all channels.",
        formula: "1000 × (#Total Contacts / #Active Users)"
    },
    {
        title: "Sales Cycle Length (days)",
        value: 43,
        target: "< 45 days",
        trend: "-2 days monthly",
        type: "static",
        color: "amber",
        definition: "Average calendar days from first qualified stage to closed outcome.",
        formula: "AVG(Close Date − First Stage Date)"
    },
    {
        title: "Conversion Rates (MQL→SQL→Closed-Won)",
        value: "22% / 28%",
        target: "MQL→SQL ≥ 20%; SQL→Won ≥ 25%",
        trend: "+1% monthly",
        type: "static",
        color: "emerald",
        definition: "Stage-to-stage conversion percentages from MQL to SQL and SQL to closed-won.",
        formula: "100 × (#SQL/MQL); 100 × (#Closed Won/SQL)"
    },
    {
        title: "ACV / Deal Size",
        value: "$145K",
        target: "≥ plan per segment",
        trend: "+5% quarterly",
        type: "static",
        color: "emerald",
        definition: "Average contracted annual value per closed-won deal.",
        formula: "AVG(Contract Value)"
    },
    {
        title: "Forecast Accuracy (%)",
        value: 88,
        target: "≥ 85%",
        trend: "+3% monthly",
        type: "static",
        color: "green",
        definition: "Closeness of forecasted bookings to actual bookings, expressed as percent accuracy.",
        formula: "100 − 100 × ABS(Forecast − Actual) / Actual"
    },
    {
        title: "Upsell/Cross-sell Rate",
        value: 21,
        target: "≥ 20% of accounts",
        trend: "+1% quarterly",
        type: "static",
        color: "emerald",
        definition: "Percent of active accounts with expansion bookings in period.",
        formula: "100 × (#Accounts with Expansion / #Active Accounts)"
    },
    {
        title: "Actual vs Forecast Revenue",
        type: "barLine",
        color: "amber",
        target: "Accuracy ≥ 95%",
        definition: "Compares recognized revenue to forecast for same period to show variance and accuracy.",
        formula: "Accuracy = 100 − ABS((Actual − Forecast) / Forecast × 100)",
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        actual: [90, 85, 100, 95, 105, 110],
        forecast: [85, 90, 95, 100, 102, 108]
    }
];

// === Render Solutions Consulting KPIs ===
function renderSolutionsKPIs() {
    const container = document.getElementById("solutionsContainer");
    container.innerHTML = solutionsKPIs.map((kpi, i) => `
    <div class="relative bg-${kpi.color}-50 border border-${kpi.color}-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
      <div class="flex justify-between items-start">
        <h3 class="text-lg font-semibold text-${kpi.color}-900">${kpi.title}</h3>
        <div class="relative group">
          <button class="text-${kpi.color}-700 hover:text-${kpi.color}-900 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 2a10 10 0 100 20 10 10 0 000-20zM12 8h.01M11 12h1v4h1" />
            </svg>
          </button>
          <div class="tooltip absolute top-6 right-0 w-64 bg-white border border-gray-200 text-gray-700 text-sm rounded-lg shadow-md p-3 opacity-0 group-hover:opacity-100 transition-all duration-200 z-50">
            <p class="font-semibold text-gray-800 mb-1">Definition</p>
            <p class="mb-2 text-gray-600">${kpi.definition}</p>
            <p class="font-semibold text-gray-800 mb-1">Formula</p>
            <p class="text-gray-600">${kpi.formula}</p>
          </div>
        </div>
      </div>

      <div class="mt-4 h-48 w-full">
        ${kpi.type === "static" ? `
          <div class="flex flex-col items-center justify-center h-full">
            <p class="text-4xl font-bold text-${kpi.color}-900">${kpi.value}${typeof kpi.value === 'number' ? '%' : ''}</p>
            <p class="text-sm text-slate-600">Target: ${kpi.target}</p>
            <p class="text-xs text-${kpi.color}-700 mt-1">${kpi.trend}</p>
          </div>
        ` : `<canvas id="solutionsChart${i}"></canvas>`}
      </div>

      ${kpi.target ? `<p class="text-sm text-slate-600 mt-2">Target: ${kpi.target}</p>` : ""}
    </div>
  `).join('');

    // Render charts
    solutionsKPIs.forEach((kpi, i) => {
        if (kpi.type === "static") return;
        const ctx = document.getElementById(`solutionsChart${i}`).getContext("2d");

        // Pie Chart (Average Discount)
        if (kpi.type === "pie") {
            new Chart(ctx, {
                type: "pie",
                data: {
                    labels: kpi.labels,
                    datasets: [{
                        data: kpi.dataset,
                        backgroundColor: [
                            "rgba(16,185,129,0.7)",
                            "rgba(251,191,36,0.7)",
                            "rgba(244,63,94,0.7)",
                            "rgba(5,150,105,0.7)"
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    plugins: { legend: { display: true, position: "bottom" } },
                    maintainAspectRatio: false
                }
            });
        }

        // Bar + Line Chart (Actual vs Forecast Revenue)
        if (kpi.type === "barLine") {
            new Chart(ctx, {
                data: {
                    labels: kpi.labels,
                    datasets: [
                        {
                            type: "bar",
                            label: "Forecast Revenue",
                            data: kpi.forecast,
                            backgroundColor: "rgba(251,191,36,0.6)",
                            borderRadius: 5
                        },
                        {
                            type: "line",
                            label: "Actual Revenue",
                            data: kpi.actual,
                            borderColor: "rgba(16,185,129,0.8)",
                            backgroundColor: "rgba(16,185,129,0.2)",
                            fill: true,
                            tension: 0.3,
                            pointRadius: 4
                        }
                    ]
                },
                options: {
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { grid: { display: false } },
                        y: { grid: { color: "rgba(0,0,0,0.05)" } }
                    },
                    maintainAspectRatio: false
                }
            });
        }
    });
}

document.addEventListener("DOMContentLoaded", renderSolutionsKPIs);
