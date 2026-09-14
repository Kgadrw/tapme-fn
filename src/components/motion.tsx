import { motion, type MotionProps } from "framer-motion";
import type { ReactNode } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

export const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease },
  },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.7, ease },
  },
};

export const stagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

type FadeProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
} & MotionProps;

export function FadeUp({
  children,
  className,
  delay = 0,
  y = 18,
  ...props
}: FadeProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.65, ease, delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function FadeInView({
  children,
  className,
  delay = 0,
  ...props
}: FadeProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease, delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
