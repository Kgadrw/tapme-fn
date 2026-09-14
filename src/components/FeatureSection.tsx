import type { ReactNode } from "react";

type FeatureSectionProps = {
  id?: string;
  intro: ReactNode;
  title: string;
  body: string;
  cta?: { label: string; href: string };
};

export function FeatureSection({
  id,
  intro,
  title,
  body,
  cta,
}: FeatureSectionProps) {
  return (
    <section id={id} className="w-full bg-white px-0 sm:px-1.5 md:px-2">
      <div className="mx-auto max-w-[1320px] px-5 py-16 sm:px-6 sm:py-20 md:py-24">
        <p className="mx-auto max-w-[920px] text-center text-[28px] font-semibold leading-[1.15] tracking-[-0.02em] text-tap-fg sm:text-[36px] md:text-[40px]">
          {intro}
        </p>

        <div className="relative mt-12 min-h-[420px] overflow-hidden rounded-[28px] bg-black sm:mt-14 sm:min-h-[480px] sm:rounded-[36px] md:mt-16 md:min-h-[560px] md:rounded-[44px]">
          <img
            src="/feature-map.png"
            alt=""
            className="absolute inset-0 size-full object-cover object-center"
          />

          <div className="relative z-10 flex h-full min-h-[420px] items-start p-8 sm:min-h-[480px] sm:p-10 md:min-h-[560px] md:p-14 lg:p-16">
            <div className="max-w-[420px]">
              <h2 className="text-[28px] font-semibold leading-[1.1] tracking-tight text-white sm:text-[32px] md:text-[40px]">
                {title}
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-white/70 sm:text-[17px]">
                {body}
              </p>
              {cta ? (
                <a
                  href={cta.href}
                  className="mt-6 inline-block text-[17px] text-tap-link transition-colors hover:text-tap-link-hover"
                >
                  {cta.label}
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Blue({ children }: { children: ReactNode }) {
  return <span className="text-tap-link">{children}</span>;
}
