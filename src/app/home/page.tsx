// import { Dock_bar } from "@/components/Dock_bar";ctStackNavbar";
import ProjectCard from "@/components/ProjectCard";
import DemoOne from "@/components/ShaderBackground";

export default function Home() {
  return (
    <>
      <div className="fixed -z-10 h-full w-screen">
        <DemoOne />
      </div>
      <div className="relative z-0 flex min-h-screen flex-col">
        <div className="p-8 md:p-12">
          {" "}
          {/* Add some padding */}
          <h1 className="text-6xl font-bold text-foreground md:text-6xl">
            Community Projects
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            the project the community is building
          </p>
          {/* PASS THE PROJECT DATA TO THE COMPONENT 
            Using the spread operator {...myProject} is a clean
            way to pass all properties of the object as props.
          */}
          <ProjectCard />
        </div>
      </div>
    </>
  );
}