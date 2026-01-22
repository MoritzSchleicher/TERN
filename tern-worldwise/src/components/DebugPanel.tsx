type DebugProps = {
  onDebugClicked: () => void;
};

export function DebugPanel({onDebugClicked}: DebugProps) {  
  return (
    <div 
      onClick={onDebugClicked}
      className="
        absolute
        pointer-events-auto
        w-6
        h-6
        left-1
        bottom-1
        cursor-pointer

        rounded-[var(--border-radius-main)]
        bg-[var(--col-light)]
        p-[1.3dvh]
        text-center
        text-[var(--font-col-dark)]
        grid
        
        shadow-[5px_5px_15px_2px_#00000040]
        
        portrait:max-md:left-auto
        portrait:max-md:justify-self-center
        portrait:max-md:top-[21.45vh]
        portrait:max-md:h-[38dvw]
        portrait:max-md:w-auto
        portrait:max-md:aspect-[1/1]
      "
    >
    
    </div>
  );
}