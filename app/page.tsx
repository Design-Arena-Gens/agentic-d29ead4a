const expenseSummary = [
  {
    label: "Total Spend",
    value: 4285,
    delta: -6.4,
    spark: [320, 410, 380, 460, 415, 440, 395],
  },
  {
    label: "Subscriptions",
    value: 680,
    delta: 3.1,
    spark: [82, 91, 95, 88, 90, 102, 95],
  },
  {
    label: "Travel",
    value: 1340,
    delta: -11.2,
    spark: [220, 205, 230, 210, 180, 160, 135],
  },
  {
    label: "Cashback Earned",
    value: 186,
    delta: 8.9,
    spark: [14, 24, 28, 20, 30, 32, 38],
  },
];

const spendingByCategory = [
  { label: "Dining", amount: 980, color: "#818cf8" },
  { label: "Housing", amount: 1240, color: "#f472b6" },
  { label: "Commute", amount: 620, color: "#34d399" },
  { label: "Wellness", amount: 410, color: "#facc15" },
  { label: "Other", amount: 1035, color: "#f97316" },
];

const expenseActivity = [
  {
    id: "1",
    merchant: "Linear",
    category: "Subscription",
    amount: 35,
    status: "Cleared",
    date: "Jun 09",
    color: "rgba(129, 140, 248, 0.18)",
  },
  {
    id: "2",
    merchant: "Monocle Coffee",
    category: "Dining",
    amount: 18,
    status: "Pending",
    date: "Jun 08",
    color: "rgba(52, 211, 153, 0.18)",
  },
  {
    id: "3",
    merchant: "Acme Flights",
    category: "Travel",
    amount: 420,
    status: "Cleared",
    date: "Jun 07",
    color: "rgba(244, 158, 54, 0.18)",
  },
  {
    id: "4",
    merchant: "Evergreen Market",
    category: "Groceries",
    amount: 86,
    status: "Cleared",
    date: "Jun 06",
    color: "rgba(250, 204, 21, 0.18)",
  },
  {
    id: "5",
    merchant: "Wayfinder Taxi",
    category: "Transport",
    amount: 22,
    status: "Cleared",
    date: "Jun 06",
    color: "rgba(180, 83, 9, 0.18)",
  },
];

function formatCurrency(value: number) {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

function Sparkline({ values, positive }: { values: number[]; positive: boolean }) {
  const width = 120;
  const height = 60;
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  const range = maxValue - minValue || 1;
  const points = values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * width;
      const y = height - ((value - minValue) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="sparkline">
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        <polyline
          fill="none"
          stroke={positive ? "#34d399" : "#f87171"}
          strokeWidth="2.5"
          strokeLinecap="round"
          points={points}
        />
      </svg>
    </div>
  );
}

function CategoryRadial({
  segments,
}: {
  segments: { label: string; amount: number; color: string }[];
}) {
  const total = segments.reduce((sum, item) => sum + item.amount, 0);
  let cumulativeAngle = 0;

  return (
    <svg viewBox="0 0 200 200" className="w-full" style={{ maxWidth: 220 }}>
      <circle cx="100" cy="100" r="78" fill="rgba(15,23,42,0.55)" />
      {segments.map((segment) => {
        const angle = (segment.amount / total) * 360;
        const startAngle = cumulativeAngle;
        const endAngle = cumulativeAngle + angle;
        cumulativeAngle += angle;

        const start = polarToCartesian(100, 100, 70, endAngle);
        const end = polarToCartesian(100, 100, 70, startAngle);
        const largeArcFlag = angle > 180 ? 1 : 0;

        return (
          <path
            key={segment.label}
            d={`M ${start.x} ${start.y} A 70 70 0 ${largeArcFlag} 0 ${end.x} ${end.y}`}
            fill="none"
            stroke={segment.color}
            strokeWidth="16"
            strokeLinecap="round"
          />
        );
      })}
      <text
        x="100"
        y="95"
        textAnchor="middle"
        fontSize="20"
        fill="rgba(226,232,240,0.9)"
        fontWeight="600"
      >
        {formatCurrency(total)}
      </text>
      <text
        x="100"
        y="115"
        textAnchor="middle"
        fontSize="12"
        fill="rgba(148,163,184,0.75)"
        letterSpacing="0.2em"
      >
        TOTAL
      </text>
    </svg>
  );
}

function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number,
) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

export default function Page() {
  return (
    <div className="main-shell">
      <aside className="sidebar">
        <h1>Ledger</h1>
        <div className="nav-section">
          <span>Overview</span>
          <a className="nav-item active" href="#">Dashboard</a>
          <a className="nav-item" href="#">Budgets</a>
          <a className="nav-item" href="#">Analytics</a>
        </div>
        <div className="nav-section">
          <span>Accounts</span>
          <a className="nav-item" href="#">Cards</a>
          <a className="nav-item" href="#">Wallets</a>
          <a className="nav-item" href="#">Vendors</a>
        </div>
      </aside>

      <main className="content">
        <header className="header-row">
          <h2>Expense Tracking</h2>
          <div className="date-picker">
            <span>May 10, 2024 - Jun 09, 2024</span>
          </div>
        </header>

        <section className="grid-cards">
          {expenseSummary.map((item) => {
            const positive = item.delta >= 0;
            return (
              <article className="card" key={item.label}>
                <span>{item.label}</span>
                <strong>{formatCurrency(item.value)}</strong>
                <small className={positive ? "status-positive" : "status-negative"}>
                  {positive ? "+" : ""}
                  {item.delta}% vs last month
                </small>
                <Sparkline values={item.spark} positive={positive} />
              </article>
            );
          })}
        </section>

        <section className="spending-distribution">
          <div className="section-title">
            <h3>Spending Breakdown</h3>
            <span>Last 30 days</span>
          </div>
          <div style={{ display: "flex", gap: "32px", flexWrap: "wrap" }}>
            <CategoryRadial segments={spendingByCategory} />
            <div className="legend">
              {spendingByCategory.map((item) => (
                <div className="legend-item" key={item.label}>
                  <span
                    className="legend-swatch"
                    style={{ background: item.color }}
                  />
                  <div>
                    <div>{item.label}</div>
                    <small>{formatCurrency(item.amount)}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="recent-activity">
          <div className="section-title">
            <h3>Recent Activity</h3>
            <span>5 newest entries</span>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Merchant</th>
                <th>Category</th>
                <th>Date</th>
                <th>Status</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {expenseActivity.map((item) => (
                <tr key={item.id}>
                  <td>{item.merchant}</td>
                  <td>
                    <span
                      className="category-badge"
                      style={{ background: item.color, color: "rgba(15,23,42,0.85)" }}
                    >
                      {item.category}
                    </span>
                  </td>
                  <td>{item.date}</td>
                  <td>{item.status}</td>
                  <td>{formatCurrency(item.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
