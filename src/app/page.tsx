import { Interlude } from "@/components/interlude/Interlude";
import { ProjectShowcase } from "@/components/projects/ProjectShowcase";
import { SignalBoard } from "@/components/channels/SignalBoard";
import { ContactSection } from "@/components/contact/ContactSection";
import { SiteFooter } from "@/components/footer/SiteFooter";

export default function Home() {
  return (
    <>
      <main className="relative z-10">
        <Interlude />
        <ProjectShowcase />
        <SignalBoard />
        <ContactSection />
      </main>
      <SiteFooter />
    </>
  );
}
