import { SettingsPanel } from "./SettingsPanel";

export function UIOverlay({ children }: { children: React.ReactNode }) {
  return (
    <div className="
        pointer-events-none
        absolute
        inset-0
        z-10
        overflow-hidden 
        select-none
        grid
      ">
        <SettingsPanel/>
        {children}
    </div>
  );
}