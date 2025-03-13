
import { Subject, Lesson } from "@/types";

export const subjects: Subject[] = [
  {
    id: "c-programming",
    title: "C Programming",
    description: "Learn the fundamentals of C programming language with practical examples and exercises.",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop",
    lessonsCount: 12,
    progress: 45,
  },
  {
    id: "data-structures",
    title: "Data Structures & Algorithms",
    description: "Master essential data structures and algorithms concepts for efficient problem-solving.",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&auto=format&fit=crop",
    lessonsCount: 18,
    progress: 20,
  },
  {
    id: "web-development",
    title: "Web Development",
    description: "Build modern web applications using HTML, CSS, and JavaScript frameworks.",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&auto=format&fit=crop",
    lessonsCount: 15,
  },
  {
    id: "python",
    title: "Python Programming",
    description: "Learn Python programming from basics to advanced concepts including libraries and frameworks.",
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800&auto=format&fit=crop",
    lessonsCount: 14,
    progress: 75,
  },
  {
    id: "machine-learning",
    title: "Machine Learning",
    description: "Introduction to machine learning algorithms, techniques and practical implementations.",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&auto=format&fit=crop",
    lessonsCount: 10,
  },
  {
    id: "database-systems",
    title: "Database Systems",
    description: "Learn about database design, SQL, and modern database management systems.",
    image: "",
    lessonsCount: 8,
    progress: 10,
  },
];

export const lessons: Record<string, Lesson[]> = {
  "c-programming": [
    {
      id: "c1",
      subjectId: "c-programming",
      title: "Introduction to C Programming",
      content: "# Introduction to C Programming\n\nC is a general-purpose programming language...",
      order: 1,
    },
    {
      id: "c2",
      subjectId: "c-programming",
      title: "Variables and Data Types",
      content: "# Variables and Data Types\n\nIn C, variables are used to store data...",
      order: 2,
    },
    // More lessons would be added here
  ],
  // More subjects would have their lessons here
};
