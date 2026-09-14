import { motion } from "framer-motion";
import { FadeUp } from "./motion";

type PageHeroProps = {
  title: string;
  subtitle: string;
};

export function PageHero({ title, subtitle }: PageHeroProps) {
  return (
    <div className="bg-white px-5 pb-12 pt-14 text-center sm:px-8 sm:pb-14 sm:pt-16 md:pt-20">
      <motion.h1
        className="text-[40px] font-semibold leading-[1.05] tracking-tight text-tap-fg sm:text-[52px] md:text-[64px]"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      >
        {title}
      </motion.h1>
      <FadeUp delay={0.1} className="mx-auto mt-4 max-w-[40ch] sm:mt-5">
        <p className="text-[17px] leading-relaxed text-tap-muted sm:text-[19px] md:text-[21px]">
          {subtitle}
        </p>
      </FadeUp>
    </div>
  );
}
