export function HomeHero() {
  return (
    <section className="mt-5 px-0 sm:mt-6 sm:px-1.5 md:mt-8 md:px-2">
      <div className="mx-auto max-w-[1560px] overflow-hidden rounded-[28px] sm:rounded-[36px] md:rounded-[44px]">
        <div className="px-5 pt-9 text-center sm:px-8 sm:pt-11 md:pt-12">
          <h1 className="animate-fade-up text-[40px] font-bold leading-[1.05] tracking-[-0.02em] text-tap-fg sm:text-[56px] md:text-[80px]">
            Tap your phone.
            <br />
            Pay simply.
          </h1>

          <div className="animate-fade-up delay-1 mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 sm:mt-5">
            <a
              href="#contact"
              className="text-[17px] text-tap-link transition-colors hover:text-tap-link-hover sm:text-[19px]"
            >
              Order a stand →
            </a>
          </div>
        </div>

        <div className="animate-fade-in delay-2 relative mt-5 px-3 pb-4 sm:mt-6 sm:px-5 sm:pb-5 md:mt-7 md:px-8 md:pb-6">
          <img
            src="/tapme-stand.png"
            alt="TapMe NFC stand on a counter, phone tapping to start a mobile-money payment"
            className="mx-auto block w-full max-w-[1100px] rounded-[24px] object-cover object-center sm:rounded-[32px] md:rounded-[40px]"
          />
        </div>
      </div>
    </section>
  );
}
