"use client";


import { useAnimationControls } from "framer-motion";
import * as question_api from "@/lib/api/questionsApi";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Loader from "@/components/Loader";

// Globe nur im Browser laden
const GlobeView = dynamic(() => import("@/components/GlobeView"), { ssr: false });

import type { GlobeAPI } from "@/components/GlobeView";
import { GameState, GlobeState, RoundState } from "@/types/main_game_types";
import ScreenMenu from "@/components/screens/ScreenMenu";
import ScreenRound from "@/components/screens/ScreenRound";
import ScreenResult from "@/components/screens/ScreenResult";
import { Constants } from "@/constants/general_constants";
import { TimeController } from "@/service/time_controller";
import { Question } from "@/types/question_types";

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
  // Refs
  const globeApiRef = useRef<GlobeAPI | null>(null);
  const timeCtrlApiRef = useRef<TimeController | null>(null);
  
  // *────────────────────────────────
  // * LEARN: States in den Parent
  // * Daten als Props nach unten, Änderungen per Callbacks nach oben;
  // * “dumme” Kinder (z. B. ScreenRound) rendern nur, was der Parent vorgibt.
  // *────────────────────────────────
  // Game-States
  const [game_state, set_game_state] = useState<GameState>(GameState.LOADING);
  const [globe_state, set_globe_state] = useState<GlobeState>(GlobeState.LOADING);
  const [round_state, set_round_state] = useState<RoundState>(RoundState.NONE);
  // Questions
  const [qIndex, setQIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const all_questions_length = questions.length;
  const current_question: Question = questions[qIndex];
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  // Score
  const [selected_answer_id, setSelectedAnswer] = useState<number | null>(null);
  const [score_count, setScoreCount] = useState(0);
  // Time
  if (!timeCtrlApiRef.current) {
    timeCtrlApiRef.current = new TimeController(Constants.GAME.TIME_PER_ROUND_IN_MS);
  }
  const time_controller = timeCtrlApiRef.current;
  // Animations
  const question_controls = useAnimationControls();
  const nugget_controls = useAnimationControls();
  const menu_controls = useAnimationControls();

  /*
    ╔═════════════════════════════════════════════════════════════════════════════╗
    ║                                                                             ║
    ║                               Questions                                     ║
    ║                                                                             ║
    ╚═════════════════════════════════════════════════════════════════════════════╝
  */

  useEffect(() => {
    question_api.getAllQuestions().then(({ data }) => console.log(data));
  }, []);


  /*
    ╔═════════════════════════════════════════════════════════════════════════════╗
    ║                                                                             ║
    ║                               HANDLERS                                      ║
    ║                                                                             ║
    ╚═════════════════════════════════════════════════════════════════════════════╝
  */
  const handle_globe_ready = useCallback(async (api: GlobeAPI) => {
    globeApiRef.current = api;
    set_globe_state(GlobeState.LOCKED_AUTO_MOVING);
    set_game_state(GameState.MENU);

    await api.toMenuPose(800);
  }, []);

  const handle_start_clicked = useCallback(async () => {
    // Menu Karte ausfaden
    await menu_controls.start({
      x: "0",
      y: "0",
      opacity: 0,
      scale: 0,
      rotate: 0,
      transition: { duration: 0.2, ease: "easeOut" },
    });
    
    // Bewegung (async) – wenn fertig, weiter:
    await globeApiRef.current?.toStartPose(1000);

    // Fragen vom Server holen
    setLoadingQuestions(true);
    setLoadError(null);
    try {
      const { data } = await question_api.getRandom({ limit: 10 });
      setQuestions(data);
      setQIndex(0);
      setSelectedAnswer(null);
      setScoreCount(0);

      set_game_state(GameState.ROUND);
      set_round_state(RoundState.QUESTION);
      set_globe_state(GlobeState.AUTO_MOVING);
      globeApiRef.current?.clearPin?.();
    } catch (e: any) {
      console.error(e);
      setLoadError("Konnte Fragen nicht laden.");
      // zurück ins Menü
      set_game_state(GameState.MENU);
      set_globe_state(GlobeState.READY);
    } finally {
      setLoadingQuestions(false);
    }
  }, [menu_controls]);

  const handle_end_clicked = useCallback(async () => {
    set_game_state(GameState.MENU);
    set_globe_state(GlobeState.LOCKED_AUTO_MOVING);
    globeApiRef.current?.clearPin?.();

    await globeApiRef.current!.toMenuPose(800);
  }, []); 

  const handle_answer_clicked = useCallback(
    async (answer_index: number | null) => {
      if (round_state !== RoundState.QUESTION) return;
      if (!current_question) return;

      setSelectedAnswer(answer_index);

      const is_correct = answer_index === current_question.correctIndex;
      if (is_correct) setScoreCount((counter) => counter + 1);


      // UI-Status sofort umschalten (Fact anzeigen, Buttons sperren)
      set_round_state(RoundState.FLIGHT);
      set_globe_state(GlobeState.NO_AUTO_MOVING);
      const isPortrait = window.matchMedia("(orientation: portrait)").matches;
      const isSmallScreen = window.matchMedia("(max-width: 767px)").matches;

      const isPhonePortrait = isPortrait && isSmallScreen;

      if(isPhonePortrait){
        await question_controls.start({
          opacity: 0,
          scale: 1,
          rotate: 0,
          transition: { duration: 0.2, ease: "easeIn" },
        });
      }
      else{
        await question_controls.start({
          x: "calc(-50% - 16dvw)",
          y: "23dvh",
          opacity: 1,
          scale: 1,
          rotate: 0,
          transition: { duration: 0.2, ease: "easeIn" },
        });
      }
      

      // zur richtigen Lösung fliegen
      await globeApiRef.current?.flyTo(
        current_question.location.lat,
        current_question.location.lng,
        Constants.GLOBE.FLY_ALTITUDE,
        Constants.GLOBE.FLY_MS
      );

      // NACH dem Flug: Pin setzen
      const pin_color = is_correct ? getCssVar("--col-correct") : getCssVar("--col-wrong");
      globeApiRef.current?.setPin?.({
        lat: current_question.location.lat,
        lng: current_question.location.lng,
        label: current_question.question,
        color: pin_color,
      });

      set_round_state(RoundState.NUGGET);
      await nugget_controls.start({
        x: "0",
        y: "0",
        opacity: 1,
        scale: 1,
        rotateY: 0,
        transition: { duration: 0.2, ease: "easeIn" },
      });
    },
    [current_question, round_state, nugget_controls, question_controls]
  );

  const handle_next = useCallback(async () => {
    // 1) Card „wegfaden“
    await question_controls.start({
      x: "calc(-50% - 16dvw)",
      y: "23dvh",
      opacity: 0,
      scale: 0,
      rotate: 0,
      transition: { duration: 0.2, ease: "easeOut" },
    });

    // 2) Nugget wegfahren
    await nugget_controls.start({
      x: "-65.1dvw",
      y: "-64.27dvh",
      opacity: 0,
      scale: 1,
      rotate: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    });

    // 4) rauszoomen
    await globeApiRef.current?.zoomOutToStart(800);

    // 3) Wenn letzte Frage → Result
    if (qIndex + 1 >= all_questions_length) {
      set_game_state(GameState.RESULT);
      set_globe_state(GlobeState.AUTO_MOVING);
      return;
    }
    

    // 5) … dann neue Frage setzen
    setQIndex((i) => i + 1);
    setSelectedAnswer(null);
    set_round_state(RoundState.QUESTION); 
    set_globe_state(GlobeState.AUTO_MOVING);
    
  }, [qIndex, all_questions_length, nugget_controls, question_controls]);
  /* -------------------------------------------------------------------------- */

  /*
    ╔═════════════════════════════════════════════════════════════════════════════╗
    ║                                                                             ║
    ║                               HELPERS                                       ║
    ║                                                                             ║
    ╚═════════════════════════════════════════════════════════════════════════════╝
  */
  function getCssVar(name: string, el: Element = document.documentElement) {
    return getComputedStyle(el).getPropertyValue(name).trim();
  }

  function shuffleArray<T>(arr: T[]): T[] {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  /* -------------------------------------------------------------------------- */

  
  /*
  ╔═════════════════════════════════════════════════════════════════════════════╗
  ║                                                                             ║
  ║                               EFFECTS                                       ║
  ║                                                                             ║
  ╚═════════════════════════════════════════════════════════════════════════════╝
  */
  useEffect(() => {
    if (game_state === GameState.ROUND && round_state === RoundState.QUESTION) {
      time_controller.reset();
      time_controller.start();
    } 
    else {
      time_controller.stop();
    }
  }, [game_state, round_state, time_controller]);

  useEffect(() => {
    time_controller.setOnComplete(() => {
      // „keine Antwort“ → null
      handle_answer_clicked(null);
    });
  }, [time_controller, handle_answer_clicked]);
  /* -------------------------------------------------------------------------- */

  /*
  ╔═════════════════════════════════════════════════════════════════════════════╗
  ║                                                                             ║
  ║                              RETURN                                         ║
  ║                                                                             ║
  ╚═════════════════════════════════════════════════════════════════════════════╝
  */
  return (
    <main className="relative h-[100dvh] w-full bg-black">
      {/* 3D-Layer */}
      <GlobeView onReady={handle_globe_ready} globe_state={globe_state}/>
      {/* Progressbar */}
      {/* TODO: Loader braucht eine update={ } mit dem loading-state vom globe */}
      {game_state == GameState.LOADING &&
        <Loader 
          show_is_ready={globe_state == GlobeState.READY} 
        />}
      {/* Menu */}
      {game_state == GameState.MENU && 
        <ScreenMenu
          onStart={ handle_start_clicked }
          game_state={game_state}
          controls={menu_controls}
        />
      }
      {/* Round */}
      {game_state == GameState.ROUND && current_question &&
        <ScreenRound
          question = {current_question}
          index = {qIndex}
          total = {all_questions_length}
          round_state = {round_state}
          selected_answer_id = {selected_answer_id}
          onAnswer = {handle_answer_clicked}
          onNext = {handle_next}
          onBack = {() => set_game_state(GameState.MENU)}
          question_controls={question_controls}
          nugget_controls={nugget_controls}
          time_controller={time_controller}
        />
      }
      {/* Result */}
      {game_state == GameState.RESULT &&
        <ScreenResult
          score = {score_count}
          total = {all_questions_length}
          onPlayAgain={handle_start_clicked}
          onBack={handle_end_clicked}
          game_state={game_state}
          controls={question_controls}
        />
      }
    </main>
  )
}
