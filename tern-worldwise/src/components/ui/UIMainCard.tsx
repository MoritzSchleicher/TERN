export function UIMainCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="
        absolute
        pointer-events-auto
        left-1/2
        -translate-x-1/2
        top-[21.45vh]
        w-max
        h-[38vh]
        aspect-[1/1]

        rounded-[var(--border-radius-main)]
        bg-[var(--col-light)]
        p-6
        text-center
        text-[var(--font-col-dark)]
        grid
        
        shadow-[5px_5px_15px_2px_#00000040]
    ">
        {children}
    </div>
  );
}