export const interviewQuestions = {
  JavaScript: [
    { id: 1, question: "Difference between let, const and var?", difficulty: "Easy", answer: "var is function-scoped and hoisted; let/const are block-scoped. const cannot be reassigned." },
    { id: 2, question: "What is a closure?", difficulty: "Medium", answer: "A function that remembers variables from its outer scope even after that scope has closed." },
    { id: 3, question: "Explain event loop in JS.", difficulty: "Hard", answer: "JS is single-threaded; event loop handles async callbacks via call stack, task queue and microtask queue." },
  ],
  React: [
    { id: 1, question: "What is Virtual DOM?", difficulty: "Medium", answer: "A lightweight copy of the real DOM used to optimize re-renders via diffing." },
    { id: 2, question: "Difference between props and state?", difficulty: "Easy", answer: "Props are passed from parent (read-only); state is managed within the component." },
    { id: 3, question: "What are React hooks?", difficulty: "Medium", answer: "Functions like useState/useEffect that let you use state/lifecycle in functional components." },
  ],
  "Node.js": [
    { id: 1, question: "What is Node.js event loop?", difficulty: "Hard", answer: "Mechanism that handles async operations using libuv, processing callbacks in phases." },
    { id: 2, question: "What is middleware in Express?", difficulty: "Easy", answer: "Functions that execute during the request-response cycle, can modify req/res or end it." },
    { id: 3, question: "Difference between require and import?", difficulty: "Medium", answer: "require is CommonJS (sync), import is ES Modules (supports async, tree-shaking)." },
  ],
  MongoDB: [
    { id: 1, question: "What is an index in MongoDB?", difficulty: "Medium", answer: "A data structure that improves query performance by avoiding full collection scans." },
    { id: 2, question: "Difference between SQL and NoSQL?", difficulty: "Easy", answer: "SQL is relational with fixed schema; NoSQL (MongoDB) is document-based and flexible schema." },
    { id: 3, question: "What is aggregation pipeline?", difficulty: "Hard", answer: "A framework for data processing through stages like $match, $group, $sort." },
  ],
  Java: [
    { id: 1, question: "What is OOP?", difficulty: "Easy", answer: "Programming paradigm based on objects: encapsulation, inheritance, polymorphism, abstraction." },
    { id: 2, question: "Difference between abstract class and interface?", difficulty: "Medium", answer: "Abstract class can have implementation; interface (pre-Java8) was fully abstract." },
    { id: 3, question: "What is garbage collection?", difficulty: "Medium", answer: "Automatic memory management that removes unreferenced objects from heap." },
  ],
  Python: [
    { id: 1, question: "Difference between list and tuple?", difficulty: "Easy", answer: "List is mutable, tuple is immutable." },
    { id: 2, question: "What are decorators?", difficulty: "Medium", answer: "Functions that modify behavior of another function without changing its code." },
    { id: 3, question: "What is GIL?", difficulty: "Hard", answer: "Global Interpreter Lock — allows only one thread to execute Python bytecode at a time." },
  ],
  DSA: [
    { id: 1, question: "Time complexity of binary search?", difficulty: "Easy", answer: "O(log n)" },
    { id: 2, question: "Difference between BFS and DFS?", difficulty: "Medium", answer: "BFS explores level by level using a queue; DFS goes deep using a stack/recursion." },
    { id: 3, question: "What is dynamic programming?", difficulty: "Hard", answer: "Technique to solve problems by breaking into overlapping subproblems and storing results." },
  ],
};