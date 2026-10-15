import { BusinessStories } from "../components/BusinessStories";
import { Faq } from "../components/Faq";
import { HomeHero } from "../components/HomeHero";
import { HowItWorks } from "../components/HowItWorks";

export function HomePage() {
  return (
    <>
      <HomeHero />
      <HowItWorks />
      <Faq />
      <BusinessStories />
    </>
  );
}
