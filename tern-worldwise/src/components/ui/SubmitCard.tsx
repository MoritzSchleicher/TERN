import { motion } from "framer-motion";

export function SubmitCard(){
    return (
        <motion.div
            className="
                absolute
                pointer-events-auto
                left-1/2
                -translate-x-1/2
                top-[6dvh]
                h-[88dvh]
                w-[60dvw]

                rounded-[var(--border-radius-main)]
                text-center
                text-[var(--font-col-dark)]
                grid
                grid-cols-[50%_50%]
                grid-row-[100%]
                
                shadow-[5px_5px_15px_2px_#00000040]
                will-change-transform
                transform-gpu
                ease-out
                motion-reduce:transition-none
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

                    [mask-image:linear-gradient(#fff_0_0),url('/assets/form_mask.svg')]
                    [mask-repeat:no-repeat,no-repeat]
                    [mask-position:0_0,center]
                    [mask-size:100%_100%,auto_95,5%]
                    [mask-composite:exclude]

                    [-webkit-mask-image:linear-gradient(#fff_0_0),url('/assets/form_mask.svg')]
                    [-webkit-mask-repeat:no-repeat,no-repeat]
                    [-webkit-mask-position:0_0,center]
                    [-webkit-mask-size:100%_100%,auto_95,5%]
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
                    rounded-tr-[var(--border-radius-main)]
                    rounded-br-[var(--border-radius-main)]
                "
            >

            </div>
        </motion.div>
    )
}