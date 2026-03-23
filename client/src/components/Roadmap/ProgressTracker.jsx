export default function ProgressTracker({ roadmap }) {
  let total = 0;
  let done = 0;

  const saved = JSON.parse(localStorage.getItem("progress")) || {};

  roadmap.forEach((phase) => {
    phase.steps.forEach((step) => {
      total++;
      if (saved[step.title]) done++;
    });
  });

  const percent = Math.round((done / total) * 100);

  return (
    <div className="mb-4">
      <p>Progress: {percent}%</p>
      <div className="w-full bg-gray-700 h-2 rounded">
        <div
          className="bg-blue-500 h-2 rounded"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}