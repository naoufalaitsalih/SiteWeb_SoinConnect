"use client";

export default function AdminUrgencyBadge({ isUrgent }: { isUrgent: boolean }) {
  if (isUrgent) {
    return (
      <span className="inline-flex rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700">
        Urgent
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
      Normal
    </span>
  );
}
