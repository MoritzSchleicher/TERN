// components/ScreenSubmit.tsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { UIOverlay } from "../ui/UIOverlay";
import { TextInput } from "../ui/TextInput";

import { MainButton } from "../ui/buttons/MainButton";
import { SecondaryButton } from "../ui/buttons/SecondaryButton";

import { GameState } from "@/types/main_game_types";
import { ButtonType, SubmitPayload } from "@/types/general_data_types";

type ScreenSubmitProps = {
  onBack: () => void;
  game_state: GameState;
  onCoordsChange?: (coords: { lat?: number; lng?: number }) => void;
};

export default function ScreenSubmit({ onBack, game_state, onCoordsChange }: ScreenSubmitProps) {
  /* Email */
  useEffect(() => {
    if (game_state !== GameState.SUBMIT) return;
  }, [game_state]);

  const [emailFilled, setEmailFilled] = useState(false);

  /* Coords */
  const [latStr, setLatStr] = useState("");
  const [lngStr, setLngStr] = useState("");

  useEffect(() => {
    if (!onCoordsChange) return;
    const lat = parseCoord(latStr);
    const lng = parseCoord(lngStr);
    onCoordsChange({ lat, lng });
  }, [latStr, lngStr, onCoordsChange]);

  /*
  ╔═════════════════════════════════════════════════════════════════════════════╗
  ║                                                                             ║
  ║                               HELPERS                                       ║
  ║                                                                             ║
  ╚═════════════════════════════════════════════════════════════════════════════╝
  */
  const getString = (data: FormData, key: string) => {
    const v = data.get(key);
    return typeof v === "string" ? v.trim() : "";
  };

  const getOptionalString = (data: FormData, key: string) => {
    const s = getString(data, key);
    return s.length ? s : undefined;
  };

  const getOptionalNumber = (data: FormData, key: string) => {
    const s = getString(data, key);
    if (!s) return undefined;
    const n = Number(s.replace(",", ".")); // falls User Komma eintippt
    return Number.isFinite(n) ? n : undefined;
  };

  const parseCoord = (s: string): number | undefined => {
    const cleaned = s
      .trim()
      .replace(",", ".")
      .replace(/[^\d.+-]/g, ""); // entfernt ° N E etc.
    if (!cleaned) return undefined;
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : undefined;
  };


  /*
  ╔═════════════════════════════════════════════════════════════════════════════╗
  ║                                                                             ║
  ║                               HANDLER                                       ║
  ║                                                                             ║
  ╚═════════════════════════════════════════════════════════════════════════════╝
  */
  const handle_submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    const question = getString(data, "question");
    const correct_answer = getString(data, "correct_answer");

    const email = getOptionalString(data, "email");
    const terms_accepted = data.get("terms") === "on";

    if (!question || !correct_answer) return;
    if (email && !terms_accepted) return;

    const payload: SubmitPayload = {
      question,
      correct_answer,
      wrong_answer_a: getOptionalString(data, "wrong_answer_a"),
      wrong_answer_b: getOptionalString(data, "wrong_answer_b"),
      lat: getOptionalNumber(data, "lat"),
      lng: getOptionalNumber(data, "lng"),
      ...(email ? { email, terms_accepted } : {}),
    };

    const res = await fetch("/api/questions/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => null);
      console.error("submit failed", err);
      return;
    }

    const out = await res.json();
    console.log("submitted", out);
    onBack(); // oder weiter screen / success message
  };

  return (
    <UIOverlay>
      <motion.div
        id="submit_card"
        className="
          absolute
          pointer-events-none
          left-1/2
          -translate-x-1/2
          top-[6dvh]
          h-[88dvh]
          w-[60dvw]

          rounded-[var(--border-radius-main)]
          text-[var(--font-col-dark)]
          grid
          grid-cols-[1fr_1fr]
          grid-row-[100%]
          
          shadow-[5px_5px_15px_2px_#00000040]
          will-change-transform
          transform-gpu
          ease-out
          motion-reduce:transition-none

          after:content-['']
          after:absolute
          after:top-0
          after:left-1/2
          after:-translate-x-1/2
          after:h-full
          after:w-[5px]
          after:bg-[var(--col-light)]
          after:pointer-events-none
          after:z-[-1]

          portrait:top-auto
          portrait:self-center
          portrait:h-[95dvh]
          portrait:w-[95dvw]
          
        "
      >
        <div
          id="left_side"
          className="
            relative
            h-full
            w-full
            col-start-1
            bg-[var(--col-light)]
            p-6
            rounded-tl-[var(--border-radius-main)]
            rounded-bl-[var(--border-radius-main)]
            pointer-events-none

            portrait:hidden

            [mask-image:linear-gradient(#fff_0_0),url('/assets/form_mask.svg')]
            [mask-repeat:no-repeat,no-repeat]
            [mask-position:0_0,center]
            [mask-size:100%_100%,calc(30dvw-3rem)_calc(88dvh-3rem)]
            [mask-composite:exclude]

            [-webkit-mask-image:linear-gradient(#fff_0_0),url('/assets/form_mask.svg')]
            [-webkit-mask-repeat:no-repeat,no-repeat]
            [-webkit-mask-position:0_0,center]
            [-webkit-mask-size:100%_100%,calc(30dvw-3rem)_calc(88dvh-3rem)]
            [-webkit-mask-composite:xor]
          "
        ></div>

        <form
          id="right_side"
          onSubmit={handle_submit}
          className="
            relative
            h-full
            w-full
            min-h-0
            bg-[var(--col-light)]

            col-start-2
            p-6
            pl-0
            rounded-tr-[var(--border-radius-main)]
            rounded-br-[var(--border-radius-main)]
            pointer-events-auto
            grid
            grid-cols-[100%]
            grid-row-[100%]
            gap-[0.87dvh]

            portrait:col-start-1
            portrait:col-end-3
            portrait:rounded-[var(--border-radius-main)]
            portrait:p-2
            portrait:py-2
          
          "
        >
          <div
            id="background"
            className="
              relative
              min-h-0
              h-full
              w-full
              bg-[image:var(--grad-light)]
              rounded-[var(--border-radius-main)]
              flex
              flex-col
            "
          >
            <div
              id="layout"
              className="
                h-full
                w-full
                flex
                flex-col
                gap-[2.5dvh]

                overflow-y-auto
                overflow-x-visible

                custom_scrollbar

                portrait:before:content-['']
                portrait:before:relative
                portrait:before:h-[5.3dvh]
                portrait:before:w-full
              "
            >
              <div
                id="question_container"
                className="
                  h-auto
                  w-full
                  flex
                  flex-col
                  gap-[2.5dvh]
                  px-6
                  pt-2

                  portrait:p-2
                "
              >
                <span className="text-[4.13dvh]">Reiche deine Frage ein!</span>

                <span 
                  className="
                    w-full                
                    text-[2.18dvh]
                    text-[var(--font-col-dark)]
                    px-2
                    p-2
                    rounded-[var(--border-radius-second)]
                    bg-[var(--col-light)]
                    shadow-[4px_4px_10px_rgba(0,0,0,0.08)]
                  ">
                    Pflichtfelder sind mit * markiert.
                    Nicht ausgefüllte Felder werden KI-gestützt ergänzt.
                </span>

                <TextInput
                  name="question"
                  headline="Frage*"
                  placeholder="Was kostet die Welt?"
                  required
                />

                <TextInput name="correct_answer" headline="Richtige Antwort*" placeholder="Das Richtige" required/>
                <TextInput name="wrong_answer_a" headline="Falsche Antwort A" placeholder="Das Falsche"/>
                <TextInput name="wrong_answer_b" headline="Falsche Antwort B" placeholder="Das Lustige"/>

                <div
                  className="
                    w-full
                    grid
                    grid-cols-[1fr_1fr]
                    grid-rows-[auto]
                    gap-[1dvw]

                    portrait:grid-cols-[auto]
                    portrait:grid-rows-[1fr_1fr]
                    portrait:gap-[2.5dvh]
                  "
                >
                  <TextInput name="lat" headline="Breitengrad" placeholder="48°N" onChange={(e) => setLatStr(e.currentTarget.value)}/>
                  <TextInput name="lng" headline="Längengrad" placeholder="7,8°E" onChange={(e) => setLngStr(e.currentTarget.value)}/>
                </div>
              </div>

              <div 
                id="seperator" 
                className="
                  w-full
                  h-[0.87dvh]
                  min-h-2
                  bg-[var(--col-light)]
                "></div>

              <div
                id="email_container"
                className="
                  h-[19dvh]
                  w-full
                  flex
                  flex-col
                  gap-[1dvh]
                  px-6
                  justify-between

                  portrait:px-2
                  portrait:gap-2
                "
              >
                <TextInput
                 name="email"
                 headline="Email"
                 info="
                    Wenn du über die Annahme deiner Frage informiert werden möchtest,
                    gib bitte deine E-Mail-Adresse an.
                  "
                  onChange={(e) => setEmailFilled(e.currentTarget.value.trim().length > 0)}
                />

                <div
                  className="
                    w-full
                    h-auto
                    flex
                    flex-row
                    gap-[8px]
                    px-2
                  "
                >
                  <input id="terms_box" type="checkbox" className="cursor-pointer" name="terms" required={emailFilled} />
                  <label htmlFor="terms_box" className="text-[2.18dvh] cursor-pointer">
                     Ich stimme den{" "}
                      <a
                        href="/terms"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline underline-offset-2"
                      >
                        Nutzungsbedingungen
                      </a>{" "}
                      zu.
                  </label>
                </div>

                <div
                  className="
                    flex
                    flex-row
                    w-full
                    gap-[1.1dvw]
                    justify-between
                    relative

                    portrait:flex-col-reverse
                    portrait:gap-2
                    portrait:before:content-['']
                    portrait:before:relative
                    portrait:before:h-[1.3dvh]
                    portrait:before:w-full
                  "
                >
                  <SecondaryButton
                    onClick={onBack}
                    text="Zurück"
                    type={ButtonType.BUTTON}
                  />

                  <MainButton text="Einreichen" type={ButtonType.SUBMIT} />
                </div>
              </div>
            </div>
          </div>
        </form>
      </motion.div>
    </UIOverlay>
  );
}
