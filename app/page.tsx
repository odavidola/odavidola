import { Hero } from "@/app/components/hero";
import { MokoStage } from "@/app/components/moko-stage";
import { EbbStage } from "@/app/components/ebb-stage";
import { ExperienceTape } from "@/app/components/experience-tape";
import { MusicStage } from "@/app/components/music-stage";
import { ContactPoster } from "@/app/components/contact-poster";

export default function HomePage() {
  return (
    <>
      <Hero />
      <MokoStage />
      <EbbStage />
      <ExperienceTape />
      <MusicStage />
      <ContactPoster />
    </>
  );
}
