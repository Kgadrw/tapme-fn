import { BusinessStories } from "./components/BusinessStories";
import { Faq } from "./components/Faq";
import { HomeHero } from "./components/HomeHero";
import { HowItWorks } from "./components/HowItWorks";
import { Partners } from "./components/Partners";
import { SiteFooter } from "./components/SiteFooter";
import { SiteNav } from "./components/SiteNav";

export default function App() {
  return (
    <div className="min-h-dvh bg-tap-bg">
      <SiteNav />
      <main>
        <HomeHero />
        <HowItWorks />
        <Faq />
        <Partners />
        <BusinessStories />
      </main>
      <SiteFooter />
    </div>
  );
}
