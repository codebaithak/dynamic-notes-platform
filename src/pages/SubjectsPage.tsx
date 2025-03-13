
import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import SubjectCard from "@/components/SubjectCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getSubjects } from "@/api";
import { useToast } from "@/components/ui/use-toast";

const SubjectsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  
  const { data: subjects = [], isLoading, error } = useQuery({
    queryKey: ['subjects'],
    queryFn: getSubjects,
    onError: (err) => {
      console.error("Error fetching subjects:", err);
      toast({
        title: "Error",
        description: "Failed to load subjects. Please try again later.",
        variant: "destructive",
      });
    }
  });

  // Filter subjects based on search term
  const filteredSubjects = subjects.filter(subject => 
    subject.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="container py-10">
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold tracking-tight">Subjects</h1>
            <p className="text-muted-foreground">
              Browse through our collection of subjects and start learning today.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search subjects..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon" className="shrink-0">
              <Filter className="h-4 w-4" />
              <span className="sr-only">Filter</span>
            </Button>
          </div>

          {isLoading ? (
            <div className="mt-16 flex flex-col items-center justify-center text-center">
              <p className="text-lg font-medium">Loading subjects...</p>
            </div>
          ) : error ? (
            <div className="mt-16 flex flex-col items-center justify-center text-center">
              <p className="text-lg font-medium">Failed to load subjects</p>
              <p className="text-sm text-muted-foreground">
                Please try refreshing the page
              </p>
            </div>
          ) : filteredSubjects.length > 0 ? (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredSubjects.map((subject) => (
                <SubjectCard key={subject.id} subject={{
                  id: subject.id,
                  title: subject.title,
                  description: subject.description,
                  image: subject.image || '/placeholder.svg',
                  lessonsCount: subject.lessonsCount,
                  progress: subject.progress
                }} />
              ))}
            </div>
          ) : (
            <div className="mt-16 flex flex-col items-center justify-center text-center">
              <p className="text-lg font-medium">No subjects found</p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default SubjectsPage;
