import { motion } from "framer-motion";
import { FadeUp, SplitText, staggerWords } from "./motion";

type PageHeroProps = {
  title: string;
  subtitle: string;
};

export function PageHero({ title, subtitle }: PageHeroProps) {
  return (
    <div className="bg-white px-5 pb-12 pt-14 text-center sm:px-8 sm:pb-14 sm:pt-16 md:pt-20">
      <motion.h1
        className="text-[40px] font-semibold leading-[1.05] tracking-tight text-tap-fg sm:text-[52px] md:text-[64px]"
        variants={staggerWords}
        initial="hidden"
        animate="show"
      >
        <SplitText text={title} />
      </motion.h1>
      <FadeUp delay={0.35} className="mx-auto mt-4 max-w-[40ch] sm:mt-5">
        <p className="text-[17px] leading-relaxed text-tap-muted sm:text-[19px] md:text-[21px]">
          {subtitle}
        </p>
      </FadeUp>
    </div>
  );
}
