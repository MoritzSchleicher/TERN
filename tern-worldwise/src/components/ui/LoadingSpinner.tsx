"use client";

export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center ">
      <div className="h-10 w-10 top-[40dvh] rounded-full border-4 border-[var(--col-dark)]/30 border-t-[var(--col-light)] animate-spin" />
    </div>
  );
}
