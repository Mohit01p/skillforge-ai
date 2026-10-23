const callGemini = require("../utils/geminiHelper");

exports.topicExplain = async (req, res) => {
  try {
    const { topic } = req.body;
    const prompt = `You are a teacher. Explain the topic "${topic}" simply.
Return ONLY JSON: { "explanation": "...", "analogy": "...", "keyPoints": ["...","...","..."] }
No extra text, only JSON.`;
    const data = await callGemini(prompt);
    res.json(data);
  } catch (err) {
  console.error(err);
  res.status(500).json({ message: err.message });
}
};
exports.roadmapGenerator = async (req, res) => {
  try {
    const { goal, currentSkills, months } = req.body;
    const prompt = `You are a senior developer and career coach.
User Goal: ${goal}
Current Skills: ${currentSkills.join(", ")}
Available Time: ${months} months
Return ONLY a JSON array:
[{ "month": 1, "title": "...", "topics": ["..."], "goal": "..." }]
No extra text, only JSON.`;
    const data = await callGemini(prompt);
    res.json(data);
  } catch (err) {
  console.error(err);
  res.status(500).json({ message: err.message });
}
};

exports.skillGap = async (req, res) => {
  try {
    const { targetRole, userSkills } = req.body;
    const prompt = `You are a technical hiring manager.
Target Role: ${targetRole}
Current Skills: ${userSkills.join(", ")}
Return ONLY JSON:
{ "missingSkills": [...], "priorityOrder": [...],
  "estimatedTime": "X months", "readinessPercent": 45 }
No extra text, only JSON.`;
    const data = await callGemini(prompt);
    res.json(data);
  } catch (err) {
  console.error(err);
  res.status(500).json({ message: err.message });
}
};
exports.dailyPlanner = async (req, res) => {
  try {
    const { remainingTopics, hours } = req.body;
    const prompt = `You are a study planner.
Remaining Topics: ${remainingTopics.join(", ")}
Available Hours Today: ${hours}
Create 4-6 tasks that fit the available time.
Return ONLY JSON:
{ "tasks": [{ "task": "...", "category": "Study", "minutes": 45 }], "motivationalNote": "..." }
category must be one of: Study, Project, DSA, Review.
No extra text, only JSON.`;
    const data = await callGemini(prompt);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.projectIdeas = async (req, res) => {
  try {
    const { skills, goal } = req.body;
    const prompt = `You are a senior developer mentor.
Skills: ${skills.join(", ")}
Goal: ${goal}
Suggest exactly 3 portfolio projects.
Return ONLY JSON:
{ "projects": [{ "title": "...", "description": "...", "features": ["..."], "techStack": ["..."], "difficulty": "Beginner", "estimatedDays": 7 }] }
difficulty must be one of: Beginner, Intermediate, Advanced.
No extra text, only JSON.`;
    const data = await callGemini(prompt);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.mentorChat = async (req, res) => {
  try {
    const { history, userContext, message } = req.body;
    const prompt = `You are a friendly senior developer mentor.
User Context: ${JSON.stringify(userContext)}
Conversation History: ${JSON.stringify(history)}
User's new message: ${message}
Return ONLY JSON: { "reply": "..." }
No extra text, only JSON.`;
    const data = await callGemini(prompt);
    res.json(data);
  } catch (err) {
  console.error(err);
  res.status(500).json({ message: err.message });
}
};

exports.generateQuiz = async (req, res) => {
  try {
    const { topic, difficulty } = req.body;
    const prompt = `You are a technical quiz generator.
Topic: ${topic}, Difficulty: ${difficulty}
Generate exactly 10 multiple choice questions.
Return ONLY a JSON array:
[{ "id": 1, "question": "...", "options": ["A","B","C","D"],
   "correctAnswer": "A", "explanation": "..." }]
No extra text, only JSON.`;
    const data = await callGemini(prompt);
    res.json(data);
  } catch (err) {
  console.error(err);
  res.status(500).json({ message: err.message });
}
};

exports.interviewCoach = async (req, res) => {
  try {
    const { question, userAnswer } = req.body;
    const prompt = `You are a senior technical interviewer.
Question: ${question}
Candidate Answer: ${userAnswer}
Return ONLY JSON:
{ "score": 7, "whatWasGood": "...", "whatWasMissing": "...",
  "idealAnswer": "...", "tip": "..." }
No extra text, only JSON.`;
    const data = await callGemini(prompt);
    res.json(data);
  } catch (err) {
  console.error(err);
  res.status(500).json({ message: err.message });
}
};

exports.buildResume = async (req, res) => {
  try {
    const { name, email, careerGoal, skills, experience, education, projects } = req.body;
    const prompt = `You are a professional resume writer.
Name: ${name}, Email: ${email}, Career Goal: ${careerGoal}
Skills: ${skills.join(", ")}
Experience: ${JSON.stringify(experience)}
Education: ${JSON.stringify(education)}
Projects: ${JSON.stringify(projects)}
Return ONLY JSON:
{ "summary": "...", "skillsSection": ["..."], 
  "experienceBullets": [{ "company": "...", "role": "...", "bullets": ["..."] }],
  "projectBullets": [{ "name": "...", "bullets": ["..."] }],
  "educationLine": "...", "keywords": ["..."] }
No extra text, only JSON.`;
    const data = await callGemini(prompt);
    res.json(data);
  } catch (err) {
  console.error(err);
  res.status(500).json({ message: err.message });
}
};

exports.atsScore = async (req, res) => {
  try {
    const { resumeContent, jobDescription } = req.body;
    const prompt = `You are an ATS expert and hiring manager.
Resume: ${JSON.stringify(resumeContent)}
Job Description: ${jobDescription}
Return ONLY JSON:
{ "score": 72, "verdict": "...", "matchedKeywords": [...],
  "missingKeywords": [...], "suggestions": [...],
  "sectionScores": { "skills": 80, "experience": 70, "projects": 60, "education": 90 } }
No extra text, only JSON.`;
    const data = await callGemini(prompt);
    res.json(data);
  } catch (err) {
  console.error(err);
  res.status(500).json({ message: err.message });
}
};