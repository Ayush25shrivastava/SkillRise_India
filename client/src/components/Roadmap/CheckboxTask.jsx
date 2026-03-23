import { useState } from "react";

export default function CheckboxTask({ task }) {
  const [checked, setChecked] = useState(false);

  return (
    <div className="flex items-center gap-2 mt-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={() => setChecked(!checked)}
        className="accent-blue-500"
      />
      <span className={checked ? "line-through text-gray-500" : ""}>
        {task}
      </span>
    </div>
  );
}