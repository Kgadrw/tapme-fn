const partners = [
  { name: "NZALENS High Technologies", src: "/partners/nzalens.png" },
  { name: "BLOOMiN Specialty café", src: "/partners/bloomin.png" },
  { name: "Partner", src: "/partners/tree.png" },
  { name: "mucuruzi", src: "/partners/mucuruzi.png" },
  { name: "STAR-HAWK", src: "/partners/starhawk.png" },
  { name: "UZA Solutions", src: "/partners/uza.png" },
  { name: "Partner", src: "/partners/r-logo.png" },
] as const;

export function Partners() {
  return (
    <section id="partners" className="w-full bg-white">
      <div className="mx-auto w-full max-w-[900px] px-5 py-16 text-center sm:px-8 sm:py-20 md:py-24">
        <h2 className="text-[32px] font-semibold tracking-tight text-tap-fg sm:text-[40px] md:text-[48px]">
          Works with the businesses you know.
        </h2>
        <p className="mx-auto mt-4 max-w-[620px] text-[15px] leading-relaxed text-tap-muted sm:mt-5 sm:text-[17px] md:text-[19px]">
          TapMe is already on counters across shops, cafés, and service
          businesses. Place a stand, connect your mobile-money number, and start
          accepting taps. No new wallet required.
        </p>

        <ul className="mx-auto mt-12 grid max-w-[760px] grid-cols-2 items-center justify-items-center gap-x-8 gap-y-10 sm:mt-14 sm:grid-cols-3 sm:gap-x-10 sm:gap-y-12 md:mt-16 md:grid-cols-4 md:gap-x-8 md:gap-y-14">
          {partners.map((partner) => (
            <li
              key={partner.src}
              className="flex h-16 w-full max-w-[160px] items-center justify-center sm:h-20"
            >
              <img
                src={partner.src}
                alt={partner.name}
                className="max-h-full max-w-full object-contain"
              />
            </li>
          ))}
        </ul>

        <div className="mt-14 sm:mt-16">
          <a
            href="#contact"
            className="inline-flex h-11 items-center justify-center rounded-full bg-tap-link px-8 text-[15px] font-medium text-white transition-colors hover:bg-tap-link-hover sm:h-12 sm:text-[16px]"
          >
            Order a stand
          </a>
        </div>
      </div>
    </section>
  );
}
