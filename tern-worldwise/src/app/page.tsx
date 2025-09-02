"use client";

import { useCallback, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Loader from "@/components/Loader";

// Globe nur im Browser laden
const GlobeView = dynamic(() => import("@/components/GlobeView"), { ssr: false });

// Fragen
import { QuestionPool, type Question } from "../data/questions";
import type { GlobeAPI } from "@/components/GlobeView";
import { GameState, GlobeState, RoundState } from "@/types/main_game_types";
import Game from "@/components/Game";
import ScreenMenu from "@/components/screens/ScreenMenu";
import ScreenRound from "@/components/screens/ScreenRound";
import ScreenResult from "@/components/screens/ScreenResult";
import { Constants } from "@/constants/general_constants";

// *────────────────────────────────
// * LEARN: In React erbt man nicht von Components,
// * stattdessen kombiniert man sie (Komposition) und
// * teilt Logik über Hooks – nicht über Vererbung. 
// * Beispiel: Ein spezieller Button wird durch Zusammensetzen erstellt,
// * nicht durch Erben von einer Button-Klasse:
// *
// * function Button({ label, style }) {
// *   return <button style={style}>{label}</button>;
// * }
//
// * function DangerButton({ label }) {
// *   return <Button label={label} style={{ color: "red" }} />;
// * }
// *────────────────────────────────
export default function MainGame() {
  // Game-State
  const [game_state, set_game_state] = useState<GameState>(GameState.LOADING);
  const [globe_state, set_globe_state] = useState<GlobeState>(GlobeState.LOADING);

  const apiRef = useRef<GlobeAPI | null>(null);
  
  // *────────────────────────────────
  // * LEARN: States in den Parent
  // * Daten als Props nach unten, Änderungen per Callbacks nach oben;
  // * “dumme” Kinder (z. B. ScreenRound) rendern nur, was der Parent vorgibt.
  // *────────────────────────────────
  const [qIndex, setQIndex] = useState(0);
  const [selected_answer_id, setSelectedAnswer] = useState<number | null>(null);
  const [round_state, set_round_state] = useState<RoundState>(RoundState.QUESTION);
  const [score_count, setScoreCount] = useState(0);

  const all_questions_length = QuestionPool.length;
  const current_question: Question = QuestionPool[qIndex];

  /*
    ╔═════════════════════════════════════════════════════════════════════════════╗
    ║                                                                             ║
    ║                               HANDLERS                                      ║
    ║                                                                             ║
    ╚═════════════════════════════════════════════════════════════════════════════╝
  */
  const handle_globe_ready = useCallback((api: GlobeAPI) => {
    apiRef.current = api;
    set_globe_state(GlobeState.READY);
    set_game_state(GameState.MENU);
  }, []);

  const handle_start_clicked = useCallback(() => {
    set_game_state(GameState.ROUND);
    set_globe_state(GlobeState.AUTO_MOVING);

    setQIndex(0);
    setSelectedAnswer(null);
    set_round_state(RoundState.QUESTION);
    set_globe_state(GlobeState.AUTO_MOVING);
    setScoreCount(0);
    apiRef.current?.clearPin?.();
  }, []); 

  const handle_end_clicked = useCallback(() => {
    set_game_state(GameState.MENU);
    set_globe_state(GlobeState.READY);
  }, []); 

  const handle_answer_clicked = useCallback(
    async (answer_index: number) => {
      if (round_state !== RoundState.QUESTION) return;

      setSelectedAnswer(answer_index);

      const is_correct = answer_index === current_question.correctIndex;
      if (is_correct) setScoreCount((counter) => counter + 1);

      // UI-Status sofort umschalten (Fact anzeigen, Buttons sperren)
      set_round_state(RoundState.FLIGHT);
      set_globe_state(GlobeState.LOCKED);

      // zur richtigen Lösung fliegen
      await apiRef.current?.flyTo(
        current_question.location.lat,
        current_question.location.lng,
        Constants.GLOBE.FLY_ALTITUDE,
        Constants.GLOBE.FLY_MS
      );

      // NACH dem Flug: Pin setzen
      const pin_color = is_correct ? getCssVar("--col-correct") : getCssVar("--col-wrong");
      apiRef.current?.setPin?.({
        lat: current_question.location.lat,
        lng: current_question.location.lng,
        label: current_question.question,
        color: pin_color,
      });

      set_round_state(RoundState.NUGGET);
    },
    [current_question, round_state]
  );

  const handle_next = useCallback(() => {
    if (qIndex + 1 >= all_questions_length) {
      apiRef.current?.clearPin?.();
      set_game_state(GameState.RESULT);
      return;
    }
    setQIndex(i => i + 1);
    setSelectedAnswer(null);
    set_round_state(RoundState.QUESTION);
    set_globe_state(GlobeState.AUTO_MOVING);
  }, [qIndex, all_questions_length]);

  const handle_play_again_clicked = useCallback(() => {
    console.log("play again clicked");
  }, []); 
  /* -------------------------------------------------------------------------- */

  /*
    ╔═════════════════════════════════════════════════════════════════════════════╗
    ║                                                                             ║
    ║                               HANDLERS                                      ║
    ║                                                                             ║
    ╚═════════════════════════════════════════════════════════════════════════════╝
  */
  function getCssVar(name: string, el: Element = document.documentElement) {
    return getComputedStyle(el).getPropertyValue(name).trim();
  }
  /* -------------------------------------------------------------------------- */

  return (
    <main className="relative h-[100dvh] w-full bg-black">
      {/* 3D-Layer */}
      <GlobeView onReady={handle_globe_ready} globe_state={globe_state}/>
      {/* Progressbar */}
      {/* TODO: Loader braucht eine update={ } mit dem loading-state vom globe */}
      {game_state == GameState.LOADING && <Loader showIsReady={globe_state == GlobeState.READY} />}
      {/* Menu */}
      {game_state == GameState.MENU && 
        <ScreenMenu
          onStart={ handle_start_clicked }
        />
      }
      {/* Round */}
      {game_state == GameState.ROUND &&
        <ScreenRound
          question = {current_question}
          index = {qIndex}
          total = {all_questions_length}
          round_state = {round_state}
          selected_answer_id = {selected_answer_id}
          onAnswer = {handle_answer_clicked}
          onNext = {handle_next}
          onBack = {() => set_game_state(GameState.MENU)}
        />
      }
      {/* Result */}
      {game_state == GameState.RESULT &&
        <ScreenResult
          score = {score_count}
          total = {all_questions_length}
          onPlayAgain={handle_start_clicked}
          onBack={handle_end_clicked}
        />
      }
    </main>
  )
}
