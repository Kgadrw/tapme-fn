import { Blue, FeatureSection } from "./FeatureSection";

export function HowItWorks() {
  return (
    <FeatureSection
      id="how-it-works"
      intro={
        <>
          From small shops to busy counters, your business can accept{" "}
          <Blue>in-person, contactless payments</Blue> with a TapMe stand. It’s
          simple, fast, and private, and{" "}
          <Blue>no new wallet or payment account</Blue> is needed.
        </>
      }
      title="Tap. Confirm. Done."
      body="Customers tap their phone on the stand, confirm the amount, and pay with mobile money. You receive funds in your existing MTN or Airtel account."
    />
  );
}
