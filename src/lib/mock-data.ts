
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
      content: `# Introduction to C Programming

C is a general-purpose programming language that was originally developed by Dennis Ritchie at Bell Labs between 1972 and 1973. It was designed to be a system programming language and has influenced many modern programming languages.

## Why Learn C?

- **Foundation for other languages**: Many languages like C++, Java, and Python have syntax influenced by C
- **Efficiency**: C provides low-level access to memory and hardware
- **Portability**: Programs written in C can run on different platforms with minimal changes
- **Widely used**: Still extensively used in operating systems, embedded systems, and more

## Basic Structure of a C Program

\`\`\`c
#include <stdio.h>

int main() {
    // Your code goes here
    printf("Hello, World!\\n");
    return 0;
}
\`\`\`

This simple program demonstrates the basic structure:
1. Include necessary header files
2. Define the main function (entry point)
3. Write your code inside the main function
4. Return an integer value to the operating system

## Compiling and Running C Programs

To compile a C program, you typically use a C compiler like GCC:

\`\`\`bash
gcc program.c -o program
./program
\`\`\`

In the next lesson, we'll explore variables and data types in C.`,
      order: 1,
    },
    {
      id: "c2",
      subjectId: "c-programming",
      title: "Variables and Data Types",
      content: `# Variables and Data Types in C

In C programming, variables are used to store data that can be manipulated throughout the program. Each variable must have a specific data type that determines what kind of data it can store and how much memory it will occupy.

## Basic Data Types

| Type | Description | Format Specifier | Size (typically) |
|------|-------------|------------------|------------------|
| \`int\` | Integer values | %d | 4 bytes |
| \`float\` | Single precision floating point | %f | 4 bytes |
| \`double\` | Double precision floating point | %lf | 8 bytes |
| \`char\` | Single character | %c | 1 byte |

## Variable Declaration

In C, variables must be declared before they are used. The basic syntax is:

\`\`\`c
data_type variable_name;
\`\`\`

For example:

\`\`\`c
int age;
float salary;
char grade;
\`\`\`

## Variable Initialization

You can declare and initialize variables in a single statement:

\`\`\`c
int age = 25;
float salary = 5000.50;
char grade = 'A';
\`\`\`

## Constants

Constants are variables whose values cannot be changed after initialization:

\`\`\`c
const int MAX_VALUE = 100;
// MAX_VALUE = 200; // This would cause an error
\`\`\`

## Example Program

\`\`\`c
#include <stdio.h>

int main() {
    // Variable declarations
    int age;
    float height;
    char initial;
    
    // Variable assignments
    age = 25;
    height = 5.9;
    initial = 'J';
    
    // Output the values
    printf("Age: %d years\\n", age);
    printf("Height: %.1f feet\\n", height);
    printf("Initial: %c\\n", initial);
    
    return 0;
}
\`\`\`

## Type Conversion

C allows conversion between different data types:

1. **Implicit conversion**: Automatically done by the compiler
   \`\`\`c
   int x = 10;
   float y = x;  // int implicitly converted to float
   \`\`\`

2. **Explicit conversion (casting)**: Done manually by the programmer
   \`\`\`c
   float a = 5.67;
   int b = (int)a;  // Explicitly cast float to int, b will be 5
   \`\`\`

In the next lesson, we'll explore operators and expressions in C.`,
      order: 2,
    },
    {
      id: "c3",
      subjectId: "c-programming",
      title: "Operators and Expressions",
      content: `# Operators and Expressions in C

Operators are symbols that tell the compiler to perform specific mathematical or logical operations. C provides a rich set of operators to manipulate variables and values.

## Arithmetic Operators

| Operator | Description | Example |
|----------|-------------|---------|
| + | Addition | a + b |
| - | Subtraction | a - b |
| * | Multiplication | a * b |
| / | Division | a / b |
| % | Modulus (remainder) | a % b |
| ++ | Increment | a++ or ++a |
| -- | Decrement | a-- or --a |

### Example:

\`\`\`c
#include <stdio.h>

int main() {
    int a = 10, b = 3;
    
    printf("a + b = %d\\n", a + b);   // 13
    printf("a - b = %d\\n", a - b);   // 7
    printf("a * b = %d\\n", a * b);   // 30
    printf("a / b = %d\\n", a / b);   // 3 (integer division)
    printf("a %% b = %d\\n", a % b);  // 1 (remainder)
    
    return 0;
}
\`\`\`

## Relational Operators

| Operator | Description | Example |
|----------|-------------|---------|
| == | Equal to | a == b |
| != | Not equal to | a != b |
| > | Greater than | a > b |
| < | Less than | a < b |
| >= | Greater than or equal to | a >= b |
| <= | Less than or equal to | a <= b |

### Example:

\`\`\`c
#include <stdio.h>

int main() {
    int a = 10, b = 5;
    
    printf("a == b: %d\\n", a == b);  // 0 (false)
    printf("a != b: %d\\n", a != b);  // 1 (true)
    printf("a > b: %d\\n", a > b);    // 1 (true)
    printf("a < b: %d\\n", a < b);    // 0 (false)
    
    return 0;
}
\`\`\`

## Logical Operators

| Operator | Description | Example |
|----------|-------------|---------|
| && | Logical AND | a && b |
| \\|\\| | Logical OR | a \\|\\| b |
| ! | Logical NOT | !a |

### Example:

\`\`\`c
#include <stdio.h>

int main() {
    int a = 1, b = 0;  // In C, 0 is false, any non-zero value is true
    
    printf("a && b: %d\\n", a && b);   // 0 (false)
    printf("a || b: %d\\n", a || b);   // 1 (true)
    printf("!a: %d\\n", !a);           // 0 (false)
    
    return 0;
}
\`\`\`

## Assignment Operators

| Operator | Description | Example | Equivalent |
|----------|-------------|---------|------------|
| = | Assign | a = b | a = b |
| += | Add and assign | a += b | a = a + b |
| -= | Subtract and assign | a -= b | a = a - b |
| *= | Multiply and assign | a *= b | a = a * b |
| /= | Divide and assign | a /= b | a = a / b |
| %= | Modulus and assign | a %= b | a = a % b |

### Example:

\`\`\`c
#include <stdio.h>

int main() {
    int a = 10;
    
    a += 5;  // a = a + 5
    printf("a after a += 5: %d\\n", a);  // 15
    
    a -= 3;  // a = a - 3
    printf("a after a -= 3: %d\\n", a);  // 12
    
    a *= 2;  // a = a * 2
    printf("a after a *= 2: %d\\n", a);  // 24
    
    return 0;
}
\`\`\`

## Bitwise Operators

C also provides bitwise operators for bit-level operations:
- & (AND)
- | (OR)
- ^ (XOR)
- ~ (complement)
- << (left shift)
- >> (right shift)

In the next lesson, we'll explore control flow statements in C.`,
      order: 3,
    },
  ],
  "python": [
    {
      id: "py1",
      subjectId: "python",
      title: "Introduction to Python",
      content: `# Introduction to Python

Python is a high-level, interpreted programming language known for its readability and simplicity. Created by Guido van Rossum and first released in 1991, Python has grown to become one of the most popular programming languages in the world.

## Why Python?

- **Readability**: Clean syntax with emphasis on readability
- **Versatility**: Used in web development, data science, AI, automation, and more
- **Large Standard Library**: Comes with "batteries included"
- **Strong Community**: Active development and extensive third-party packages

## Installing Python

Python can be downloaded from the official website: [python.org](https://python.org)

For most users, the latest stable version is recommended. Python comes in two major versions:
- Python 3.x (recommended for all new projects)
- Python 2.x (legacy, no longer supported)

## Your First Python Program

Creating a "Hello World" program in Python is extremely simple:

\`\`\`python
print("Hello, World!")
\`\`\`

This single line of code prints the text "Hello, World!" to the console.

## Running Python Code

There are several ways to run Python code:

1. **Interactive Mode**: Open a terminal and type \`python\` to start the Python interpreter
   \`\`\`
   >>> print("Hello, World!")
   Hello, World!
   \`\`\`

2. **Script Mode**: Save your code in a .py file and run it
   \`\`\`bash
   python hello.py
   \`\`\`

3. **IDEs/Editors**: Use environments like PyCharm, VS Code, or Jupyter Notebooks

## Python Philosophy

Python's design philosophy emphasizes code readability and simplicity. The Python community has codified these principles in "The Zen of Python", which can be viewed by typing:

\`\`\`python
import this
\`\`\`

Key principles include:
- Beautiful is better than ugly
- Explicit is better than implicit
- Simple is better than complex
- Readability counts

In the next lesson, we'll explore Python's basic syntax and data types.`,
      order: 1,
    },
    {
      id: "py2",
      subjectId: "python",
      title: "Variables and Data Types",
      content: `# Variables and Data Types in Python

Python is a dynamically typed language, which means you don't need to declare variable types explicitly. The type is determined automatically at runtime.

## Variables

In Python, you can create variables simply by assigning values to them:

\`\`\`python
name = "John"
age = 30
height = 5.9
is_student = True
\`\`\`

Variable names must follow these rules:
- Must start with a letter or underscore
- Can contain letters, numbers, and underscores
- Are case-sensitive (age and Age are different variables)

## Basic Data Types

Python has several built-in data types:

### 1. Numeric Types

- **int**: Integer values (e.g., \`42\`, \`-7\`)
- **float**: Floating-point values (e.g., \`3.14\`, \`-0.001\`)
- **complex**: Complex numbers (e.g., \`3+4j\`)

\`\`\`python
x = 10          # int
y = 3.14        # float
z = 2 + 3j      # complex
\`\`\`

### 2. Text Type

- **str**: Strings - sequences of characters (e.g., \`"Hello"\`, \`'Python'\`)

\`\`\`python
name = "Alice"
message = 'Hello, Python!'

# Multi-line strings use triple quotes
description = """Python is a
programming language
that lets you work quickly."""
\`\`\`

### 3. Boolean Type

- **bool**: Boolean values - \`True\` or \`False\`

\`\`\`python
is_active = True
has_permission = False
\`\`\`

### 4. Sequence Types

- **list**: Ordered, mutable collection (e.g., \`[1, 2, 3]\`)
- **tuple**: Ordered, immutable collection (e.g., \`(1, 2, 3)\`)
- **range**: Represents a sequence of numbers

\`\`\`python
# List - mutable
fruits = ["apple", "banana", "cherry"]
fruits[0] = "orange"  # Valid, lists are mutable

# Tuple - immutable
coordinates = (10, 20)
# coordinates[0] = 15  # Error! Tuples are immutable

# Range
numbers = range(1, 6)  # Represents numbers 1 through 5
\`\`\`

### 5. Mapping Type

- **dict**: Key-value pairs (e.g., \`{"name": "John", "age": 30}\`)

\`\`\`python
person = {
    "name": "John",
    "age": 30,
    "city": "New York"
}
\`\`\`

### 6. Set Types

- **set**: Unordered collection of unique items (e.g., \`{1, 2, 3}\`)
- **frozenset**: Immutable version of a set

\`\`\`python
fruits = {"apple", "banana", "cherry"}
# No duplicates allowed
fruits.add("apple")  # Set remains {"apple", "banana", "cherry"}
\`\`\`

### 7. None Type

- **NoneType**: Represents the absence of a value

\`\`\`python
result = None
\`\`\`

## Type Conversion

Python allows you to convert between different data types:

\`\`\`python
# Convert to integer
x = int(3.14)    # x will be 3
y = int("10")    # y will be 10

# Convert to float
a = float(5)     # a will be 5.0
b = float("3.2") # b will be 3.2

# Convert to string
s = str(42)      # s will be "42"

# Check type
print(type(x))   # <class 'int'>
\`\`\`

## Example Program

\`\`\`python
# Basic data types demo
name = "Alice"
age = 30
height = 5.7
is_student = False

# Display information
print(f"Name: {name}")
print(f"Age: {age}")
print(f"Height: {height} feet")
print(f"Student: {is_student}")

# Type checking
print(f"Type of name: {type(name)}")
print(f"Type of age: {type(age)}")
print(f"Type of height: {type(height)}")
print(f"Type of is_student: {type(is_student)}")
\`\`\`

In the next lesson, we'll explore operators and expressions in Python.`,
      order: 2,
    },
  ],
  "data-structures": [
    {
      id: "ds1",
      subjectId: "data-structures",
      title: "Introduction to Data Structures",
      content: `# Introduction to Data Structures

Data structures are specialized formats for organizing, processing, retrieving, and storing data. Choosing the right data structure for a specific task can significantly impact performance and efficiency.

## Why Study Data Structures?

- **Efficiency**: Well-designed data structures help optimize algorithm performance
- **Problem-solving**: Many complex problems require appropriate data structures
- **Memory management**: Different data structures have different memory requirements
- **Real-world applications**: Used in databases, file systems, AI, and more

## Classification of Data Structures

### 1. Primitive Data Structures
- Integer
- Float
- Character
- Boolean

### 2. Non-Primitive Data Structures

#### Linear Data Structures
- Arrays
- Linked Lists
- Stacks
- Queues

#### Non-Linear Data Structures
- Trees
- Graphs
- Tries
- Hash Tables

## Operations on Data Structures

Most data structures support these basic operations:

1. **Insertion**: Adding new elements
2. **Deletion**: Removing elements
3. **Traversal**: Accessing each element exactly once
4. **Searching**: Finding a specific element
5. **Sorting**: Arranging elements in a particular order
6. **Merging**: Combining two data structures

## Analyzing Data Structures

When evaluating data structures, we consider:

### Time Complexity
How execution time increases with input size.

### Space Complexity
How memory usage increases with input size.

We use Big O notation to express these complexities:
- O(1): Constant time
- O(log n): Logarithmic time
- O(n): Linear time
- O(n log n): Log-linear time
- O(n²): Quadratic time
- O(2ⁿ): Exponential time

## Choosing the Right Data Structure

| Data Structure | Strengths | Typical Applications |
|----------------|-----------|----------------------|
| Array | Fast access by index | When index-based access is frequent |
| Linked List | Efficient insertions/deletions | When frequent modifications are needed |
| Stack | LIFO operations | Expression evaluation, backtracking |
| Queue | FIFO operations | Job scheduling, breadth-first search |
| Hash Table | Fast lookups | Dictionaries, caches |
| Tree | Hierarchical data | File systems, decision trees |
| Graph | Represent networks | Social networks, maps |

## Example: Comparing Array vs. Linked List

\`\`\`
Operation       | Array     | Linked List
----------------|-----------|-------------
Access          | O(1)      | O(n)
Insertion       | O(n)      | O(1)
Deletion        | O(n)      | O(1)
\`\`\`

In the next lesson, we'll explore arrays in detail, including implementation and common operations.`,
      order: 1,
    }
  ],
  "web-development": [
    {
      id: "web1",
      subjectId: "web-development",
      title: "Introduction to Web Development",
      content: `# Introduction to Web Development

Web development is the process of building and maintaining websites and web applications. It involves a combination of programming, markup languages, and design to create interactive experiences on the internet.

## Front-End vs. Back-End Development

Web development is typically divided into two major areas:

### Front-End Development (Client-Side)
- Deals with what users see and interact with
- Technologies: HTML, CSS, JavaScript
- Frameworks: React, Angular, Vue.js
- Focus on user experience, design, and interactivity

### Back-End Development (Server-Side)
- Handles the "behind the scenes" logic
- Technologies: Node.js, Python, PHP, Ruby, Java
- Databases: MySQL, MongoDB, PostgreSQL
- Focus on servers, applications, and databases

### Full-Stack Development
- Combines both front-end and back-end development
- Full understanding of the entire web development process
- Ability to work on all aspects of a web application

## Essential Web Technologies

### HTML (HyperText Markup Language)
- The standard markup language for creating web pages
- Defines the structure and content of web pages
- Example:

\`\`\`html
<!DOCTYPE html>
<html>
<head>
    <title>My First Web Page</title>
</head>
<body>
    <h1>Hello, World!</h1>
    <p>This is a paragraph.</p>
</body>
</html>
\`\`\`

### CSS (Cascading Style Sheets)
- Used for describing the presentation of a document
- Controls layout, colors, fonts, and visual effects
- Example:

\`\`\`css
body {
    font-family: Arial, sans-serif;
    background-color: #f0f0f0;
}

h1 {
    color: #0066cc;
    text-align: center;
}
\`\`\`

### JavaScript
- Programming language that makes web pages interactive
- Can update content dynamically, control multimedia, and more
- Example:

\`\`\`javascript
// Change the text of an element when clicked
document.getElementById("demo").addEventListener("click", function() {
    this.innerHTML = "Text changed!";
});
\`\`\`

## Web Development Workflow

A typical web development process includes:

1. **Planning**: Define the purpose and goals of the website
2. **Design**: Create wireframes and visual designs
3. **Development**: Write code to implement the designs
4. **Testing**: Ensure everything works as expected
5. **Deployment**: Make the website available on the internet
6. **Maintenance**: Update and improve the website over time

## Tools for Web Development

### Code Editors
- Visual Studio Code
- Sublime Text
- Atom

### Version Control
- Git and GitHub
- Bitbucket
- GitLab

### Development Tools
- Browser Developer Tools
- Package Managers (npm, yarn)
- Task Runners (Gulp, Webpack)

## Responsive Web Design

Making websites work on different devices and screen sizes:

- Flexible grid layouts
- Media queries in CSS
- Flexible images
- Mobile-first approach

## Web Standards and Best Practices

- Semantic HTML
- Accessibility (a11y)
- Performance optimization
- Cross-browser compatibility
- SEO (Search Engine Optimization)

In the next lesson, we'll dive deeper into HTML and start building our first web page.`,
      order: 1,
    }
  ],
};
