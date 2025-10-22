import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { OnboardingForm } from "./_components/OnboardingForm"
import PageWrapper from "./_components/PageWrapper"

export default function OnboardingPage() {
  return (
    <PageWrapper>
      {/* Main Content - Server Component */}
      <main className="relative z-0 min-h-dvh">
        <section className="mx-auto w-full max-w-4xl px-4 py-10 md:py-14">
          <header className="mb-8">
            <div className="mb-3 inline-flex items-center rounded-md px-3 py-1 text-xs font-medium bg-background/20 backdrop-blur-sm border border-border/20 text-foreground">
              ProjectStack — College Project Management Platform
            </div>
            <h1 className="text-pretty text-3xl font-semibold leading-tight md:text-4xl text-foreground">
              Share, discover, and collaborate on real-time student projects
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 md:text-base text-muted-foreground">
              A collaborative platform for university students to showcase work, find contributors, and build a mini
              project portfolio.
            </p>
          </header>

          <Card className="border border-border/20 bg-background/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-foreground">Create your profile</CardTitle>
              <CardDescription className="text-muted-foreground">
                Tell us about yourself so we can match you to the right projects and collaborators.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <OnboardingForm />
            </CardContent>
            <CardFooter className="flex items-center justify-center">
              <p className="text-xs text-muted-foreground text-center">
                By continuing, you agree to our terms of use.
                <span className="sr-only"> and privacy policy</span>
              </p>
            </CardFooter>
          </Card>

          <footer className="mt-8 flex items-center justify-center">
            <div className="rounded-md px-3 py-2 text-center text-xs bg-background/20 backdrop-blur-sm border border-border/20 text-foreground">
              Built to streamline collaborative learning and innovation on campus.
            </div>
          </footer>
        </section>
      </main>
    </PageWrapper>
  )
}