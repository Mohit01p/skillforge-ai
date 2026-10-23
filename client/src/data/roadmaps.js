const build = (prefix, title, items) => {
  const nodes = items.map(([label], i) => ({
    id: `${prefix}${i + 1}`,
    data: { label },
    position: { x: 250, y: i * 100 },
  }));
  const edges = items.slice(1).map((_, i) => ({
    id: `e${prefix}${i + 1}-${i + 2}`,
    source: `${prefix}${i + 1}`,
    target: `${prefix}${i + 2}`,
  }));
  return { title, nodes, edges };
};

const details = (prefix, items) =>
  Object.fromEntries(
    items.map(([label, doc, practice], i) => [
      `${prefix}${i + 1}`,
      {
        label, doc, practice,
        youtube: `https://youtube.com/results?search_query=${encodeURIComponent(label)}`,
      },
    ])
  );

// [label, docLink, practiceLink]
const mern = [
  ["HTML & CSS", "https://developer.mozilla.org/en-US/docs/Web/HTML", "https://www.w3schools.com/html/"],
  ["JavaScript", "https://developer.mozilla.org/en-US/docs/Web/JavaScript", "https://leetcode.com"],
  ["React", "https://react.dev", "https://react.dev/learn"],
  ["Node.js", "https://nodejs.org/en/docs", "https://nodejs.dev"],
  ["MongoDB", "https://www.mongodb.com/docs/", "https://university.mongodb.com"],
];
const java = [
  ["Java Basics", "https://docs.oracle.com/javase/tutorial/", "https://leetcode.com"],
  ["OOP in Java", "https://docs.oracle.com/javase/tutorial/java/concepts/", "https://www.hackerrank.com/domains/java"],
  ["Collections", "https://docs.oracle.com/javase/tutorial/collections/", "https://www.hackerrank.com/domains/java"],
  ["Spring Boot", "https://spring.io/guides", "https://spring.io/guides"],
  ["MySQL", "https://dev.mysql.com/doc/", "https://www.hackerrank.com/domains/sql"],
];
const python = [
  ["Python Basics", "https://docs.python.org/3/tutorial/", "https://www.hackerrank.com/domains/python"],
  ["Python OOP", "https://docs.python.org/3/tutorial/classes.html", "https://leetcode.com"],
  ["Django", "https://docs.djangoproject.com/", "https://docs.djangoproject.com/en/stable/intro/tutorial01/"],
  ["Flask", "https://flask.palletsprojects.com/", "https://flask.palletsprojects.com/en/stable/tutorial/"],
  ["PostgreSQL", "https://www.postgresql.org/docs/", "https://www.hackerrank.com/domains/sql"],
];
const devops = [
  ["Linux", "https://linuxcommand.org/", "https://overthewire.org/wargames/bandit/"],
  ["Git & GitHub", "https://git-scm.com/doc", "https://learngitbranching.js.org/"],
  ["Docker", "https://docs.docker.com/", "https://labs.play-with-docker.com/"],
  ["Kubernetes", "https://kubernetes.io/docs/", "https://killercoda.com/"],
  ["AWS", "https://docs.aws.amazon.com/", "https://aws.amazon.com/free/"],
];
const dsa = [
  ["Arrays", "https://www.geeksforgeeks.org/array-data-structure/", "https://leetcode.com/tag/array/"],
  ["Strings", "https://www.geeksforgeeks.org/string-data-structure/", "https://leetcode.com/tag/string/"],
  ["Linked List", "https://www.geeksforgeeks.org/data-structures/linked-list/", "https://leetcode.com/tag/linked-list/"],
  ["Trees", "https://www.geeksforgeeks.org/binary-tree-data-structure/", "https://leetcode.com/tag/tree/"],
  ["Dynamic Programming", "https://www.geeksforgeeks.org/dynamic-programming/", "https://leetcode.com/tag/dynamic-programming/"],
];

export const roadmaps = {
  mern: build("", "MERN Stack Roadmap", mern),
  "java-backend": build("j", "Java Backend Roadmap", java),
  python: build("p", "Python Roadmap", python),
  devops: build("d", "DevOps Roadmap", devops),
  "dsa-focus": build("s", "DSA Roadmap", dsa),
};

export const topicDetails = {
  ...details("", mern),
  ...details("j", java),
  ...details("p", python),
  ...details("d", devops),
  ...details("s", dsa),
};