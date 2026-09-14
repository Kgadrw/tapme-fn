const columns = [
  {
    id: "products",
    label: "TapMe Stand",
    title: "Your counter. Modern payments.",
    cta: { label: "Learn more", href: "#contact" },
  },
  {
    id: "businesses",
    label: "For businesses",
    title: "Take payments. Anytime, anywhere.",
    cta: { label: "Learn more", href: "#contact" },
  },
  {
    id: "benefits",
    label: "Mobile money",
    title: "No typing. Just tap and pay.",
    cta: { label: "Learn more", href: "#how-it-works" },
  },
  {
    id: "about",
    label: "About TapMe",
    title: "Simple. Modern. Fast. Practical.",
    cta: { label: "Learn more", href: "#contact" },
  },
] as const;

function LearnMoreIcon() {
  return (
    <span
      className="material-symbols-outlined text-[22px] leading-none sm:text-[24px]"
      aria-hidden
    >
      arrow_circle_right
    </span>
  );
}

export function BusinessStories() {
  return (
    <section className="w-full bg-white pt-16 sm:pt-20 md:pt-24">
      <div className="relative w-full bg-black pt-2 [border-top-left-radius:50%_4.5rem] [border-top-right-radius:50%_4.5rem] sm:[border-top-left-radius:50%_6rem] sm:[border-top-right-radius:50%_6rem] md:[border-top-left-radius:50%_7.5rem] md:[border-top-right-radius:50%_7.5rem]">
        {/* Full-bleed photo with headline overlaid */}
        <div className="relative w-full overflow-hidden [border-top-left-radius:50%_4.5rem] [border-top-right-radius:50%_4.5rem] sm:[border-top-left-radius:50%_6rem] sm:[border-top-right-radius:50%_6rem] md:[border-top-left-radius:50%_7.5rem] md:[border-top-right-radius:50%_7.5rem]">
          <img
            src="/stories-nfc-phones.png"
            alt="Two phones sharing an NFC payment, one showing an NFC card icon and the other receiving"
            className="block h-[62vh] min-h-[420px] w-full object-cover object-center sm:h-[68vh] md:h-[78vh]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/20"
          />

          <div className="absolute inset-x-0 bottom-[12%] z-10 px-6 sm:bottom-[14%] sm:px-10 md:bottom-[16%]">
            <h2 className="mx-auto max-w-[820px] text-center text-[28px] font-semibold leading-[1.12] tracking-tight text-white sm:text-[40px] md:text-[48px]">
              Find out how businesses everywhere use TapMe.
            </h2>
          </div>
        </div>

        {/* Four columns full-bleed edge to edge, one line */}
        <div className="w-full px-5 pb-16 pt-10 sm:px-8 sm:pb-20 sm:pt-12 md:px-10 md:pb-24 lg:px-12">
          <ul className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4 lg:items-start lg:gap-6 xl:gap-10">
            {columns.map((col) => (
              <li key={col.id} id={col.id} className="scroll-mt-20">
                <p className="text-[16px] font-semibold text-white sm:text-[17px] md:text-[18px]">
                  {col.label}
                </p>
                <h3 className="mt-4 text-[22px] font-semibold leading-snug tracking-tight text-white sm:text-[24px] md:text-[26px]">
                  {col.title}
                </h3>
                <a
                  href={col.cta.href}
                  className="mt-5 inline-flex items-center gap-2 text-[17px] text-tap-link transition-colors hover:text-tap-link-hover sm:text-[18px]"
                >
                  {col.cta.label}
                  <LearnMoreIcon />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

