import { UIMainCard } from "./UIMainCard";


export function SettingsPanel() {
  return (
    <div className="
        absolute
        pointer-events-auto
        top-[1.85dvh]
        right-[0.78dvw]
        flex
        flex-col
        gap-[1.63dvh]
        content-center
        items-center
        invisible
    ">
        <div className="
            h-[9.47dvh]
            aspect-[1/1]
            rounded-[100px]
            grid
            content-center
            justify-center
            bg-[var(--col-light)]
            cursor-pointer
            shadow-[2px_2px_4px_2px_#00000040]
            hover:bg-[var(--col-light-darker)]
        ">
            <i className="tern_icons tern_icon_Settings 
                text-[var(--font-col-dark)]
                text-[5.33vh]
            "></i>
        </div>
        <div className="
            h-[5.44dvh]
            aspect-[1/1]
            rounded-[100px]
            grid
            content-center
            justify-center
            bg-[var(--col-light)]
            cursor-pointer
            shadow-[2px_2px_4px_2px_#00000040]
            hover:bg-[var(--col-light-darker)]
        ">
            <i className="tern_icons tern_icon_SoundOn 
                text-[var(--font-col-dark)]
                text-[2.91vh]
            "></i>
        </div>
    </div>
  );
}