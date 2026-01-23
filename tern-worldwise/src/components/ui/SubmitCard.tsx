import { motion } from "framer-motion";
import { TextInput } from "./TextInput";
import { useCallback } from "react";

export function SubmitCard(){

    const handle_input = useCallback((input: string) => {
        console.log("input: " + input);
    },[])

    return (
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
                after:w-[2px]
                after:bg-[var(--col-light)]
                after:pointer-events-none
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
            >

            </div>
            <div
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
                            h-auto
                            w-full
                            flex
                            flex-col
                            gap-[2.94dvh]
                        "
                    >
                        <div 
                            className="
                                h-auto
                                w-full
                                flex
                                flex-col
                                gap-[2.94dvh]
                                px-6
                                pt-2
                            "
                        >
                            <h1
                                className="
                                    text-[4.13dvh]
                                "
                            >
                                Reiche deine Frage ein!
                            </h1>
                            <TextInput onInput={handle_input} headline="Frage"></TextInput>
                            
                            <TextInput onInput={handle_input} headline="Richtige Antwort"></TextInput>
                            
                            <TextInput onInput={handle_input} headline="Falsche Antwort A (optional)"></TextInput>
                            
                            <TextInput onInput={handle_input} headline="Falsche Antwort B (optional)"></TextInput>

                            <div
                                className="
                                    w-full
                                    grid
                                    grid-cols-[1fr_1fr]
                                    grid-rows-[auto]
                                    gap-[1dvw]
                                "
                            >
                                <TextInput onInput={handle_input} headline="Lat (optional)"></TextInput>
                                <TextInput onInput={handle_input} headline="Long (optional)"></TextInput>
                            </div>
                        </div>
                        <div
                            className="
                                w-full
                                h-[0.87dvh]
                                bg-[var(--col-light)]
                            "
                        ></div>
                        <div
                            className="
                                h-[19dvh]
                                w-full
                                flex
                                flex-col
                                gap-[1dvh]
                                px-6
                            "
                        >
                            <TextInput onInput={handle_input} headline="Email (optional)"></TextInput>
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
                                <input type="checkbox"></input>
                                <span>
                                    Hiermit stimme ich den <a href="www.google.de">TERMs</a> zu
                                </span>
                            </div>
                            <div
                                className="
                                    flex
                                    flex-row
                                    w-full
                                    justify-between
                                "
                            >
                                <button type="button">
                                    Zurück
                                </button>
                                <button type="button">
                                    Einreichen
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}