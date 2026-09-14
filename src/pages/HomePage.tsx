import { BusinessStories } from "../components/BusinessStories";
import { Faq } from "../components/Faq";
import { HomeHero } from "../components/HomeHero";
import { HowItWorks } from "../components/HowItWorks";
import { Partners } from "../components/Partners";

export function HomePage() {
  return (
    <>
      <HomeHero />
      <HowItWorks />
      <Faq />
      <Partners />
      <BusinessStories />
    </>
  );
}
