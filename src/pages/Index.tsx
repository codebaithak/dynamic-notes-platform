
import { Link } from "react-router-dom";
import { BookOpen, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Dynamic Learning Platform
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Explore structured notes for various subjects with charts, diagrams, and code snippets.
                </p>
              </div>
              <div className="space-x-4">
                <Button asChild size="lg" className="gap-1">
                  <Link to="/subjects">
                    Browse Subjects
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="mx-auto grid max-w-5xl items-center gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-muted p-2">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  Feature-Rich Learning Experience
                </h2>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Our platform offers a modern approach to learning with structured content, code examples, and visual aids.
                </p>
              </div>
              <div className="space-y-4">
                <ul className="grid gap-6">
                  <li className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <ChevronRight className="h-4 w-4" />
                    </div>
                    <span>Structured lesson-wise content</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <ChevronRight className="h-4 w-4" />
                    </div>
                    <span>Code snippets with syntax highlighting</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <ChevronRight className="h-4 w-4" />
                    </div>
                    <span>Charts and diagrams for visual learning</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <ChevronRight className="h-4 w-4" />
                    </div>
                    <span>Responsive design for learning on any device</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2023 Dynamic Learning Platform. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
