export function Archive() {
  return (
    <div className="
        absolute
        pointer-events-auto
        w-[13.44dvw]
        h-[16.2dvh]
        aspect-[1/1]

        rounded-[var(--border-radius-main)]
        bg-[var(--col-light)]
        p-6
        text-center
        text-[var(--font-col-dark)]
        grid
        
        shadow-[5px_5px_15px_2px_#00000040]

        after:w-[100%]
        after:h-[100%]
        after:bg-[#FFFCF9E5]
        after:absolute
        after:left-[10px]
        after:top-[10px]
        after:z-[-1]
        after:rounded-[var(--border-radius-main)]
        after:shadow-[5px_5px_15px_2px_#00000040]
    ">
        <span className="
            text-center
            text-[2.18dvh]
            h-full
            content-center
            pb-6
            font-main
        ">
            Fragenkatalog
        </span>
    </div>
  );
}