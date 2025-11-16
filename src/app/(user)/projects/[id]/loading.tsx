import Loader from "@/components/Loader";

function Spinner() {
  return <Loader />;
}

export default function ProjectPageLoading() {
  return (
    // 1. Make the main container a vertical flexbox
    <main className="flex flex-col min-h-screen">
      {/* Header (no changes here) */}
      {/* <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-10">
        <div className="w-full px-4 py-4 sm:px-6 lg:px-8">
          <nav>
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to Projects
            </Link>
          </nav>
        </div>
      </header> */}

      {/* 2. Make this container grow to fill all remaining space and center its content */}
      <div className="flex-grow flex items-center justify-center">
        <Spinner />
      </div>
    </main>
  );
}