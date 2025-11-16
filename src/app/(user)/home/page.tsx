import ProjectCard from "@/components/ProjectCard";
import DemoOne from "@/components/ShaderBackground";
import CollapsibleHeader from "@/components/CollapseHeadbar"; // Ensure this path is correct

export default function Home() {
  return (
    <>
      <CollapsibleHeader
        title="Projects"
        subheading="Projects the community is building"
      />
      <div className="fixed -z-10 h-full w-screen">
        <DemoOne />
      </div>
      <main className="relative z-10 mt-40 flex min-h-screen flex-col">
        <div className="p-4 md:p-12">
          <ProjectCard />
        </div>
      </main>
    </>
  );
}
