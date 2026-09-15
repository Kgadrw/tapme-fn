import { motion } from "framer-motion";
import { FadeUp, fadeUp, stagger } from "../components/motion";
import { PageHero } from "../components/PageHero";

const leaders = [
  {
    name: "Gad Kalisa",
    title: "Founder and CEO",
    image: "/team/gad-kalisa.png",
    alt: "Portrait of Gad Kalisa, Founder and CEO of TapMe",
    linkedin: "https://www.linkedin.com/in/gad-kalisa-521225339/",
    bio: "Founder and CEO of TapMe since 2026, leading NFC and web engineering products for everyday payments in Rwanda. Technical Lead at Uza solutions with experience in software infrastructure, DevOps, and secure payment systems. Previously Lead Software Engineer at Starhawk, building AI-powered crop monitoring platforms.",
  },
  {
    name: "UMUKUNDWA Jeovaire",
    title: "Co-Founder, Partnerships",
    image: "/team/jeovaire.png",
    alt: "Portrait of UMUKUNDWA Jeovaire, Co-Founder and Head of Partnerships",
    linkedin: "https://www.linkedin.com/in/jeovaire-umukundwa-944141248/",
    bio: "Ecosystem builder and innovation matchmaker. An ALU graduate who co-founded Circulate, later worked with the Ministry of ICT and Innovation and the Rwanda ICT Chamber on programs like Hanga Pitchfest and Founders Friday. Now Community of Practice and Learning Associate at UNDP Rwanda under the Timbuktoo UniPods initiative, connecting university innovation hubs across Africa.",
  },
  {
    name: "NYANGOMA Jennifer",
    title: "Head of Finance",
    image: "/team/jennifer.png",
    alt: "Portrait of NYANGOMA Jennifer, Head of Finance",
    linkedin: "https://www.linkedin.com/in/jennifer-nyangoma-a00a71355/",
    bio: "Tech sales professional and software engineering student at UNILAK. Bridges complex products and real business value through demos, enterprise proposals, and digital marketing. Focused on scaling adoption for NFC-powered connectivity products while growing TapMe’s sales pipeline.",
  },
] as const;

export function AboutPage() {
  return (
    <div className="bg-white">
      <PageHero
        title="About TapMe"
        subtitle="A Rwanda-based NFC technology company making everyday interactions simpler."
      />

      <section className="mx-auto max-w-[720px] px-5 pb-16 text-center sm:px-8 sm:pb-20 sm:text-left md:pb-24">
        <FadeUp>
          <p className="text-[18px] leading-relaxed text-tap-fg sm:text-[20px]">
            TapMe builds physical NFC products that connect real-world taps to
            useful digital actions. Payments are our first focus: stands and
            cards that start mobile-money payments without a new wallet or
            processor.
          </p>
        </FadeUp>
        <FadeUp delay={0.08}>
          <p className="mt-6 text-[16px] leading-relaxed text-tap-muted sm:text-[17px]">
            We do not hold customer money. Sellers keep their existing MTN MoMo
            or Airtel Money accounts. TapMe is the technology layer between the
            counter and the payment interaction.
          </p>
        </FadeUp>
        <FadeUp delay={0.14}>
          <p className="mt-6 text-[16px] leading-relaxed text-tap-muted sm:text-[17px]">
            The long-term vision is broader: near-field technology for business
            cards, packaging, access, attendance, and more. Today we ship
            payment products that businesses can use immediately.
          </p>
        </FadeUp>
      </section>

      <section className="bg-white pb-16 sm:pb-20 md:pb-24">
        <motion.ul
          className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-0"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
        >
          {leaders.map((person) => (
            <motion.li
              key={person.name}
              variants={fadeUp}
              className="mx-auto w-full max-w-[320px] sm:mx-0 sm:max-w-none"
            >
              <div className="group relative aspect-[3/4] overflow-hidden bg-[#e8e8ea] sm:aspect-[4/5]">
                <img
                  src={person.image}
                  alt={person.alt}
                  className="h-full w-full object-cover object-top grayscale transition duration-500 group-hover:scale-[1.02]"
                />
                {person.linkedin ? (
                  <a
                    href={person.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${person.name} on LinkedIn`}
                    className="absolute right-3 top-3 z-10 text-[#0A66C2] transition hover:opacity-80 sm:right-4 sm:top-4"
                  >
                    <LinkedInIcon />
                  </a>
                ) : null}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent pt-24 transition-all duration-500 sm:group-hover:from-black/90 sm:group-hover:via-black/55 sm:group-hover:pt-36">
                  <div className="px-4 pb-5 text-center sm:px-4 sm:pb-5 sm:text-left md:px-5 md:pb-7">
                    <div className="translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:group-hover:-translate-y-3 md:group-hover:-translate-y-4">
                      <div className="flex items-start justify-center gap-2 sm:justify-start">
                        <h3 className="text-[22px] font-semibold leading-tight tracking-tight text-white sm:text-[20px] md:text-[26px] lg:text-[30px]">
                          {person.name}
                        </h3>
                        <span
                          className="material-symbols-outlined mt-1 hidden shrink-0 text-[20px] leading-none text-[#0066cc] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] [-webkit-text-stroke:0.6px_white] [paint-order:stroke_fill] [font-variation-settings:'FILL'_1,'wght'_700,'GRAD'_200,'opsz'_24] sm:inline-block sm:rotate-[60deg] sm:group-hover:rotate-[-120deg] md:text-[22px]"
                          aria-hidden
                        >
                          arrow_upward
                        </span>
                      </div>
                      <p className="mx-auto mt-1.5 max-w-[22ch] text-[13px] font-medium leading-snug text-white/90 sm:mx-0 sm:mt-2 sm:text-[12px] md:text-[14px] lg:text-[15px]">
                        {person.title}
                      </p>
                    </div>
                    <p className="mt-0 hidden max-h-0 overflow-hidden text-[12px] leading-relaxed text-white/85 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:block sm:group-hover:mt-3 sm:group-hover:max-h-48 sm:group-hover:opacity-100 md:group-hover:max-h-52 md:text-[13px]">
                      {person.bio}
                    </p>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-center text-[14px] leading-relaxed text-tap-muted sm:hidden">
                {person.bio}
              </p>
            </motion.li>
          ))}
        </motion.ul>
      </section>
    </div>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-6 fill-current sm:size-7" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}
