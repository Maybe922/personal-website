import { projects } from "@/lib/site-data";
import { SectionHeading } from "@/components/section-heading/SectionHeading";
import { ProjectCard } from "@/components/projects/ProjectCard";

export function ProjectShowcase() {
  return (
    <section id="projects" className="scroll-mt-24 py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-5">
        <SectionHeading title="自己动手的小玩意" />

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {projects.map((project, index) => (
            <ProjectCard key={project.slug} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
