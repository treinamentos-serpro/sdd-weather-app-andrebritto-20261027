import { useId } from 'react';

interface EmptyStateProps {
  title: string;
  hint: string;
}

export default function EmptyState({ title, hint }: EmptyStateProps) {
  const titleId = useId();
  return (
    <section
      role="status"
      aria-labelledby={titleId}
      className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center shadow-glass backdrop-blur-md"
    >
      <h2 id={titleId} className="text-lg font-semibold text-white">
        {title}
      </h2>
      <p className="mt-2 text-sm text-white/70">{hint}</p>
    </section>
  );
}
