interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({ message = 'Carregando...' }: LoadingStateProps) {
  return (
    <div
      role="status"
      className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center text-white/80 shadow-glass backdrop-blur-md"
    >
      <span
        aria-hidden="true"
        className="mr-2 inline-block size-4 animate-spin rounded-full border-2 border-white/30 border-t-accent-400 align-[-2px]"
      />
      {message}
    </div>
  );
}
