export function Archive() {
  return (
    <div className="
        absolute
        top-[2dvh]
        left-[1.46dvw]
        pointer-events-auto
        w-[auto]
        h-[16.2dvh]
        aspect-[1.47/1]

        invisible

        rounded-[var(--border-radius-main)]
        bg-[var(--col-light)]
        p-[0.65dvh]
        text-center
        text-[var(--font-col-dark)]
        grid
        
        shadow-[5px_5px_15px_2px_#00000040]

        after:w-[100%]
        after:h-[100%]
        after:bg-[#FFFCF9E5]
        after:absolute
        after:left-[1.1dvh]
        after:top-[1.1dvh]
        after:portrait:max-md:left-[0.5dvh]
        after:portrait:max-md:top-[0.5dvh]
        after:z-[-1]
        after:rounded-[var(--border-radius-main)]
        after:shadow-[5px_5px_15px_2px_#00000040]

        portrait:max-md:h-[10.2dvh]
    ">
        <span className="
            text-center
            text-[2.18dvh]
            grid place-items-center
            h-full
            w-full
            content-center
            pb-[0.65dvh]
            font-main
        ">
            Fragenkatalog
        </span>
    </div>
  );
}