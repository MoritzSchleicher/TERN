// components/ScreenSubmit.tsx
import React, { useEffect } from "react";
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
};

export default function ScreenSubmit({ onBack, game_state }: ScreenSubmitProps) {
  useEffect(() => {
    if (game_state !== GameState.SUBMIT) return;
  }, [game_state]);

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

  /*
  ╔═════════════════════════════════════════════════════════════════════════════╗
  ║                                                                             ║
  ║                               HANDLER                                       ║
  ║                                                                             ║
  ╚═════════════════════════════════════════════════════════════════════════════╝
  */
  const handle_submit = (e: React.FormEvent<HTMLFormElement>) => {
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
      long: getOptionalNumber(data, "long"),
      ...(email ? { email, terms_accepted } : {}),
    };

    console.log(payload);
  };

  return (
    <UIOverlay>
      <motion.div
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
        "
      >
        <div
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
          onSubmit={handle_submit}
          className="
            relative
            h-full
            w-full
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
          "
        >
          <div
            className="
              relative
              h-full
              w-full
              bg-[image:var(--grad-light)]
              rounded-[var(--border-radius-main)]
              flex
              flex-col
            "
          >
            <div
              className="
                h-full
                w-full
                flex
                flex-col
                gap-[2.5dvh]
              "
            >
              <div
                className="
                  h-auto
                  w-full
                  flex
                  flex-col
                  gap-[2.5dvh]
                  px-6
                  pt-2
                "
              >
                <h1 className="text-[4.13dvh]">Reiche deine Frage ein!</h1>

                <TextInput
                  name="question"
                  headline="Frage"
                  placeholder="Was kostet die Welt?"
                />

                <TextInput name="correct_answer" headline="Richtige Antwort" />
                <TextInput name="wrong_answer_a" headline="Falsche Antwort A" />
                <TextInput name="wrong_answer_b" headline="Falsche Antwort B" />

                <div
                  className="
                    w-full
                    grid
                    grid-cols-[1fr_1fr]
                    grid-rows-[auto]
                    gap-[1dvw]
                  "
                >
                  <TextInput name="lat" headline="Längengrad" />
                  <TextInput name="long" headline="Breitengrad" />
                </div>
              </div>

              <div className="w-full h-[0.87dvh] bg-[var(--col-light)]"></div>

              <div
                className="
                  h-[19dvh]
                  w-full
                  flex
                  flex-col
                  gap-[1dvh]
                  px-6
                  justify-between
                "
              >
                <TextInput name="email" headline="Email (optional)" />

                <div
                  className="
                    w-full
                    h-auto
                    flex
                    flex-row
                    gap-[0.47dvw]
                    px-2
                  "
                >
                  <input type="checkbox" name="terms" />
                  <span>
                    Hiermit stimme ich den <a href="www.google.de">TERMs</a> zu
                  </span>
                </div>

                <div
                  className="
                    flex
                    flex-row
                    w-full
                    gap-[1.1dvw]
                    justify-between
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
