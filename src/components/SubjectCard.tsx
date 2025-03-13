
import { Link } from "react-router-dom";
import { Book, ArrowRight } from "lucide-react";
import { Subject } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface SubjectCardProps {
  subject: Subject;
}

const SubjectCard = ({ subject }: SubjectCardProps) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="aspect-video w-full overflow-hidden bg-muted">
        {subject.image ? (
          <img
            src={subject.image}
            alt={subject.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-muted">
            <Book className="h-10 w-10 text-muted-foreground/40" />
          </div>
        )}
      </div>
      <CardHeader>
        <CardTitle>{subject.title}</CardTitle>
        <CardDescription>{subject.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground">
          {subject.lessonsCount} {subject.lessonsCount === 1 ? "lesson" : "lessons"}
        </div>
        {subject.progress !== undefined && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Progress</span>
              <span>{subject.progress}%</span>
            </div>
            <Progress value={subject.progress} className="h-2" />
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full gap-1 group">
          <Link to={`/subject/${subject.id}`}>
            Explore
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SubjectCard;
