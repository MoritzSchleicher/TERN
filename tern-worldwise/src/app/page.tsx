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
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { DebugPanel } from "@/components/DebugPanel";
import ScreenSubmit from "@/components/screens/ScreenSubmit";

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
export default function main() {
  // Refs
  const globe_api_ref = useRef<GlobeAPI | null>(null);
  const time_ctrl_api_ref = useRef<TimeController | null>(null);
  
  // *────────────────────────────────
  // * LEARN: States in den Parent
  // * Daten als Props nach unten, Änderungen per Callbacks nach oben;
  // * “dumme” Kinder (z. B. ScreenRound) rendern nur, was der Parent vorgibt.
  // *────────────────────────────────
  // Game-States
  const [game_state, set_game_state] = useState<GameState>(GameState.LOADING);
  const [globe_state, set_globe_state] = useState<GlobeState>(GlobeState.LOADING);
  const [round_state, set_round_state] = useState<RoundState>(RoundState.NONE);
  const [submitCoords, setSubmitCoords] = useState<{ lat?: number; lng?: number }>({});
  // Questions
  const [current_question_index, set_question_index] = useState(0);
  const [questions, set_questions] = useState<Question[]>([]);
  const questions_length = questions.length;
  const current_question: Question = questions[current_question_index];
  const [are_questions_loading, set_are_questions_loading] = useState(false);
  const [load_error, set_load_error] = useState<string | null>(null);
  // Score
  const [selected_answer_id, set_selected_answer] = useState<number | null>(null);
  const [score_count, set_score_count] = useState(0);
  // Time
  if (!time_ctrl_api_ref.current) {
    time_ctrl_api_ref.current = new TimeController(Constants.GAME.TIME_PER_ROUND_IN_MS);
  }
  const time_controller = time_ctrl_api_ref.current;
  // Animations
  const anim_question_controls = useAnimationControls();
  const anim_nugget_controls = useAnimationControls();
  const anim_menu_controls = useAnimationControls();
  const anim_result_controls = useAnimationControls();

  /*
    ╔═════════════════════════════════════════════════════════════════════════════╗
    ║                                                                             ║
    ║                               HANDLERS                                      ║
    ║                                                                             ║
    ╚═════════════════════════════════════════════════════════════════════════════╝
  */
  //initialize globe, set game state and position globe
  const init_globe = useCallback(async (globe_api: GlobeAPI) => {
    globe_api_ref.current = globe_api;
    set_globe_state(GlobeState.LOCKED_AUTO_MOVING);
    set_game_state(GameState.MENU);

    await globe_api.toMenuPose(/* ms */800);
  }, []);

  //handle menu and globe, fetch questions and initialize round
  const handle_start_button_clicked = useCallback(async () => {
    if (are_questions_loading) return;

    const active_controls =
    game_state === GameState.RESULT ? anim_result_controls : anim_menu_controls;
    // fade out menu 
    await active_controls.start({
      x: "0",
      y: "0",
      opacity: 0,
      scale: 0,
      rotate: 0,
      transition: { duration: 0.2, ease: "easeOut" },
    });
    
    // wait for globe movement
    await globe_api_ref.current?.toStartPose(1000);

    // get question
    set_are_questions_loading(true);
    set_load_error(null);
    try {
      const { data } = await question_api.get_random_questions({ limit: 10 });
      set_questions(data);
      set_question_index(0);
      set_selected_answer(null);
      set_score_count(0);

      set_game_state(GameState.ROUND);
      set_round_state(RoundState.QUESTION);
      set_globe_state(GlobeState.AUTO_MOVING);
      globe_api_ref.current?.clearPin?.();
    } catch (error: any) {
      console.error(error);
      set_load_error("Konnte Fragen nicht laden.");
      // zurück ins Menü
      set_game_state(GameState.MENU);
      set_globe_state(GlobeState.READY);
    } finally {
      set_are_questions_loading(false);
    }
  }, [game_state, anim_menu_controls, anim_result_controls, are_questions_loading]);

  //handle menu and globe
  const handle_end_clicked = useCallback(async () => {
    await anim_result_controls.start({
      x: "0",
      y: "0",
      opacity: 0,
      scale: 0,
      rotate: 0,
      transition: { duration: 0.2, ease: "easeOut" },
    });

    set_game_state(GameState.MENU);
    set_globe_state(GlobeState.LOCKED_AUTO_MOVING);
    globe_api_ref.current?.clearPin?.();

    await globe_api_ref.current!.toMenuPose(800);
  }, [anim_result_controls]); 

  const handle_continue_clicked = useCallback(async () => {
      set_game_state(GameState.SUBMIT);
      set_globe_state(GlobeState.NO_AUTO_MOVING);
      globe_api_ref.current?.clearPin?.();
      await globe_api_ref.current!.toSubmitPose(800);   
  }, []); 

  //evaluate result, handle UI and globe, shows nugget 
  const handle_answer_clicked = useCallback(
    async (answer_index: number | null) => {
      if (round_state !== RoundState.QUESTION) return;
      if (!current_question) return;

      set_selected_answer(answer_index);

      const is_correct = answer_index === current_question.correctIndex;
      if (is_correct) set_score_count((counter) => counter + 1);


      // UI-Status sofort umschalten (Fact anzeigen, Buttons sperren)
      set_round_state(RoundState.FLIGHT);
      set_globe_state(GlobeState.NO_AUTO_MOVING);
      const isPortrait = window.matchMedia("(orientation: portrait)").matches;
      const isSmallScreen = window.matchMedia("(max-width: 767px)").matches;

      const isPhonePortrait = isPortrait && isSmallScreen;

      if(isPhonePortrait){
        await anim_question_controls.start({
          opacity: 0,
          scale: 1,
          rotate: 0,
          transition: { duration: 0.2, ease: "easeIn" },
        });
      }
      else{
        await anim_question_controls.start({
          x: "calc(-50% - 16dvw)",
          y: "23dvh",
          opacity: 1,
          scale: 1,
          rotate: 0,
          transition: { duration: 0.2, ease: "easeIn" },
        });
      }

      // zur richtigen Lösung fliegen
      await globe_api_ref.current?.flyTo(
        current_question.location.lat,
        current_question.location.lng,
        Constants.GLOBE.FLY_ALTITUDE,
        Constants.GLOBE.FLY_MS
      );

      // NACH dem Flug: Pin setzen
      const pin_color = is_correct ? getCssVar("--col-correct") : getCssVar("--col-wrong");
      globe_api_ref.current?.setPin?.({
        lat: current_question.location.lat,
        lng: current_question.location.lng,
        label: current_question.question,
        color: pin_color,
      });

      set_round_state(RoundState.NUGGET);
      await anim_nugget_controls.start({
        x: "0",
        y: "0",
        opacity: 1,
        scale: 1,
        rotateY: 0,
        transition: { duration: 0.2, ease: "easeIn" },
      });
    },
    [current_question, round_state, anim_nugget_controls, anim_question_controls]
  );

  //handle nugget and globe, init new question or show result
  const handle_next = useCallback(async () => {
    // 1) Card „wegfaden“
    await anim_question_controls.start({
      x: "calc(-50% - 16dvw)",
      y: "23dvh",
      opacity: 0,
      scale: 0,
      rotate: 0,
      transition: { duration: 0.2, ease: "easeOut" },
    });

    // 2) Nugget wegfahren
    await anim_nugget_controls.start({
      x: "-65.1dvw",
      y: "-64.27dvh",
      opacity: 0,
      scale: 1,
      rotate: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    });

    // 3) rauszoomen
    await globe_api_ref.current?.zoomOutToStart(800);

    // 4) Wenn letzte Frage → Result
    if (current_question_index + 1 >= questions_length) {
      set_game_state(GameState.RESULT);
      set_globe_state(GlobeState.AUTO_MOVING);
      return;
    }
    

    // 5) … dann neue Frage setzen
    set_question_index((i) => i + 1);
    set_selected_answer(null);
    set_round_state(RoundState.QUESTION); 
    set_globe_state(GlobeState.AUTO_MOVING);
    
  }, [current_question_index, questions_length, anim_nugget_controls, anim_question_controls]);

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

  useEffect(() => {
    if (game_state !== GameState.SUBMIT) return;

    const lat = submitCoords.lat;
    const lng = submitCoords.lng;

    // nur wenn beide da + in Range
    const valid =
      typeof lat === "number" &&
      typeof lng === "number" &&
      lat >= -90 && lat <= 90 &&
      lng >= -180 && lng <= 180;

    // debounced, damit nicht bei jedem keystroke sofort geflogen wird
    const t = window.setTimeout(async () => {
      const api = globe_api_ref.current;
      if (!api) return;

      if (!valid) {
        api.clearPin?.();
        return;
      }

      await api.flyTo(lat!, lng!, 1.2, 700); // altitude/ms nach Geschmack

      api.clearPin?.();
      api.setPin(
        { lat: lat!, lng: lng!, label: "Vorschau", color: getCssVar("--col-correct") },
        { altitude: 0.02, radius: 0.45 }
      );
    }, 350);

    return () => window.clearTimeout(t);
  }, [submitCoords.lat, submitCoords.lng, game_state]);

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
      <GlobeView onReady={init_globe} globe_state={globe_state} game_state={game_state}/>
      {/* Globaler Mini-Spinner während Fragen-Ladevorgang */}
      {are_questions_loading && <LoadingSpinner />}
      {/* Progressbar */}
      {game_state == GameState.LOADING &&
        <Loader 
          show_is_ready={globe_state == GlobeState.READY} 
        />}
      {/* Menu */}
      {game_state == GameState.MENU && 
        <ScreenMenu
          onStart={ handle_start_button_clicked }
          game_state={game_state}
          controls={anim_menu_controls}
        />
      }
      {/* Round */}
      {game_state == GameState.ROUND && current_question &&
        <ScreenRound
          question = {current_question}
          index = {current_question_index}
          total = {questions_length}
          round_state = {round_state}
          selected_answer_id = {selected_answer_id}
          onAnswer = {handle_answer_clicked}
          onNext = {handle_next}
          onBack = {() => set_game_state(GameState.MENU)}
          anim_question_controls={anim_question_controls}
          anim_nugget_controls={anim_nugget_controls}
          time_controller={time_controller}
        />
      }
      {/* Result */}
      {game_state == GameState.RESULT &&
        <ScreenResult
          score = {score_count}
          total = {questions_length}
          onContinue={handle_continue_clicked}
          game_state={game_state}
          controls={anim_result_controls}
        />
      }
      {game_state == GameState.SUBMIT &&
        <ScreenSubmit
          onBack={handle_end_clicked} 
          game_state={game_state}
          onCoordsChange={setSubmitCoords}
        />
      }
      {/* Debug panel */}
        <DebugPanel
          onDebugClicked={handle_continue_clicked}
        />
    </main>
  )
}
