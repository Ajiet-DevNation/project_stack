export const PREDEFINED_SKILLS = {
  Technical: [
    "Python", "C", "C++", "Java", "JavaScript", "TypeScript",
    "HTML", "CSS", "React", "Next.js", "Vue", "Angular", "Svelte",
    "Node.js", "Django", "Flask", "Ruby on Rails", "Express.js", "Spring Boot",
    "SQL", "PostgreSQL", "MongoDB", "MySQL", "SQLite", "Redis",
    "AWS", "Azure", "Google Cloud", "Vercel", "Netlify",
    "Docker", "Kubernetes", "Git", "Linux", "CI/CD", "Terraform",
    "TensorFlow", "PyTorch", "Scikit-learn", "Machine Learning", "Pandas", "NumPy",
    "GraphQL", "REST API", "gRPC",
    "Go", "Rust", "Kotlin", "Swift", "PHP", "Ruby", "C#",
    "React Native", "Flutter",
    "Cybersecurity", "Blockchain"
  ],

  Business: [
    "Project Management", "Agile", "Scrum", "Business Analysis",
    "Finance", "Accounting", "Operations", "Marketing", "Market Research",
    "Digital Marketing", "Sales", "Product Management", "Business Development",
    "Strategy", "Human Resources", "Recruiting", "Customer Relationship Management (CRM)",
    "Supply Chain Management", "Data Analysis", "Negotiation"
  ],

  Creative: [
    "UI/UX Design", "Figma", "Adobe XD", "Sketch", "InVision",
    "Graphic Design", "Photoshop", "Illustrator",
    "Video Editing", "Premiere Pro", "After Effects",
    "Content Writing", "User Research", "Wireframing", "Prototyping",
    "3D Modeling", "Blender"
  ],

  SoftSkills: [
    "Communication", "Leadership", "Teamwork", "Time Management",
    "Problem Solving", "Critical Thinking", "Creativity",
    "Adaptability", "Public Speaking", "Emotional Intelligence",
    "Collaboration", "Mentoring", "Conflict Resolution", "Empathy"
  ],

  Productivity: [
    "Microsoft Excel", "PowerPoint", "Word",
    "Google Sheets", "Notion", "Jira", "Trello", "Asana",
    "Slack", "Miro", "Airtable"
  ],
};

export const ALL_PREDEFINED_SKILLS = Object.values(PREDEFINED_SKILLS).flat();
