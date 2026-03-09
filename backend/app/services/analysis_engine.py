import json
from app.services.openai_client import call_openai


def parse_job_description(text: str) -> dict:
    """Parse a job description to extract structured requirements."""

    system_prompt = (
        "You are an HR technology system that parses job descriptions to extract "
        "structured requirements. You understand job market trends and can infer "
        "requirement priority levels."
    )

    user_prompt = f"""Parse the following job description and extract all requirements. Categorize and prioritize each requirement.

Rules:
1. Separate "Required" vs "Nice-to-Have" / "Preferred" qualifications
2. Categorize into: Technical Skills, Experience, Education, Certifications, Soft Skills
3. Assign priority: Critical, Important, Nice-to-Have
4. Extract minimum years of experience if mentioned
5. Note specific tool/technology versions if mentioned

Return STRICTLY valid JSON:
{{
  "job_title": "string",
  "company": "string or null",
  "seniority_level": "Junior|Mid|Senior|Lead|Principal",
  "requirements": [
    {{
      "skill": "string",
      "category": "string",
      "priority": "Critical|Important|Nice-to-Have",
      "min_years": null,
      "details": "string"
    }}
  ],
  "min_experience_years": null,
  "education_requirements": ["string"],
  "salary_range": null
}}

Job Description:
\"\"\"
{text}
\"\"\""""

    return call_openai(system_prompt, user_prompt)


def perform_gap_analysis(candidate_skills: dict, job_requirements: dict) -> dict:
    """Perform a full skill gap analysis given extracted skills and job requirements."""

    system_prompt = (
        "You are a supportive and encouraging senior career advisor. You provide "
        "constructive, positive career guidance. You always look for the best in candidates "
        "and recognize transferable skills, related experience, and potential. "
        "You score candidates GENEROUSLY — most candidates with any relevant background "
        "should score at least 40-60. A candidate with several matching skills should score 60-80. "
        "Only someone with zero relevant skills would score below 30."
    )

    user_prompt = f"""Given the candidate's extracted skills and the job requirements, perform a comprehensive skill gap analysis and generate a detailed career improvement report.

Candidate Skills (JSON):
{json.dumps(candidate_skills, indent=2)}

Job Requirements (JSON):
{json.dumps(job_requirements, indent=2)}

Perform the following analysis and return STRICTLY valid JSON:

{{
  "overall_match_score": 0,
  "category_scores": {{
    "technical_skills": 0,
    "experience": 0,
    "education": 0,
    "certifications": 0
  }},
  "matched_skills": [
    {{
      "skill": "string",
      "candidate_level": "string",
      "required_level": "string",
      "match_quality": "Exact|Partial|Exceeds"
    }}
  ],
  "skill_gaps": [
    {{
      "skill": "string",
      "category": "string",
      "priority": "High|Medium|Low",
      "required_level": "string",
      "current_level": "None|Beginner|Intermediate",
      "gap_severity": 5,
      "why_important": "string",
      "recommended_resource": {{
        "title": "string",
        "platform": "string",
        "url": "string or null",
        "estimated_hours": 0
      }}
    }}
  ],
  "bonus_skills": [
    {{
      "skill": "string",
      "value_add": "string"
    }}
  ],
  "learning_path": [
    {{
      "week_range": "Week 1-2",
      "focus": "string",
      "resource": "string",
      "goal": "string"
    }}
  ],
  "executive_summary": "string (3-5 sentence overview)",
  "strengths_narrative": "string (paragraph highlighting what the candidate does well)",
  "gaps_narrative": "string (paragraph explaining key gaps constructively)",
  "market_positioning": "string (paragraph on how candidate compares to typical applicants)",
  "action_plan": "string (paragraph with concrete next steps)"
}}

IMPORTANT SCORING GUIDELINES — follow these strictly:
- overall_match_score MUST be between 0-100
- If the candidate has ANY relevant skills at all, the minimum score should be 35-45
- If the candidate matches 30-50% of requirements, score should be 50-65
- If the candidate matches 50-75% of requirements, score should be 65-80
- If the candidate matches 75%+ of requirements, score should be 80-95
- Count related/similar skills as partial matches (e.g. "Python" matches "Programming", "React" partially matches "Frontend")
- Consider transferable skills — a skill in one framework counts partially for related frameworks
- Education in a related field should score at least 50 in the education category
- category_scores should each be between 20-95 (never 0 unless truly zero relevance)

Analysis Rules:
1. Be ENCOURAGING and positive — highlight strengths before gaps
2. Look for transferable and related skills, not just exact keyword matches
3. Count similar technologies as partial matches (e.g. MySQL experience partially matches PostgreSQL)
4. Suggest REAL, specific learning resources (Coursera, Udemy, official docs, YouTube channels)
5. Learning path should be realistic (assume 10-15 hours/week of study)
6. Market positioning should be encouraging and reference current industry trends
7. Overall score formula: 40% technical match + 25% experience + 20% education + 15% certifications
8. When in doubt, score HIGHER not lower — be generous"""

    return call_openai(system_prompt, user_prompt)


# Job description presets
JOB_PRESETS = [
    {
        "id": "software_engineer",
        "title": "Software Engineer",
        "description": """Software Engineer - Full-Time

We are looking for a Software Engineer to join our team.

Requirements:
- Bachelor's degree in Computer Science or related field
- 2+ years of experience in software development
- Proficiency in Python, JavaScript, or Java
- Experience with REST APIs and microservices
- Familiarity with Git version control
- Knowledge of SQL and relational databases
- Understanding of data structures and algorithms
- Experience with Agile/Scrum methodologies

Nice to have:
- Experience with cloud platforms (AWS, GCP, or Azure)
- Knowledge of Docker and containerization
- Experience with CI/CD pipelines
- Familiarity with React or Angular"""
    },
    {
        "id": "data_scientist",
        "title": "Data Scientist",
        "description": """Data Scientist - Full-Time

We are seeking a Data Scientist to drive data-driven decision making.

Requirements:
- Master's degree in Data Science, Statistics, Mathematics, or related field
- 3+ years of experience in data science or machine learning
- Strong proficiency in Python (NumPy, Pandas, Scikit-learn)
- Experience with deep learning frameworks (TensorFlow or PyTorch)
- Strong SQL skills and experience with large datasets
- Statistical analysis and hypothesis testing
- Data visualization (Matplotlib, Seaborn, Tableau)
- Experience with A/B testing

Nice to have:
- Experience with NLP or Computer Vision
- Knowledge of Spark or big data technologies
- Cloud ML services (AWS SageMaker, GCP Vertex AI)
- PhD in a relevant field"""
    },
    {
        "id": "frontend_developer",
        "title": "Frontend Developer",
        "description": """Frontend Developer - Full-Time

We are looking for a Frontend Developer to build exceptional user experiences.

Requirements:
- 2+ years of frontend development experience
- Expert-level HTML5, CSS3, and JavaScript (ES6+)
- Proficiency in React.js and its ecosystem (Redux, React Router, Hooks)
- Experience with responsive design and mobile-first development
- Knowledge of RESTful APIs and async programming
- Familiarity with build tools (Webpack, Vite)
- Version control with Git
- Understanding of web performance optimization

Nice to have:
- Experience with TypeScript
- Knowledge of Next.js or server-side rendering
- UI/UX design sensibility
- Experience with testing (Jest, React Testing Library)
- Knowledge of CSS-in-JS or Tailwind CSS"""
    },
    {
        "id": "backend_developer",
        "title": "Backend Developer",
        "description": """Backend Developer - Full-Time

We are hiring a Backend Developer to build scalable server-side applications.

Requirements:
- 3+ years of backend development experience
- Strong proficiency in Python (FastAPI/Django) or Node.js (Express)
- Database design and management (PostgreSQL, MySQL, MongoDB)
- RESTful API design and implementation
- Authentication and authorization (JWT, OAuth)
- Version control with Git
- Understanding of software design patterns
- Experience with Linux/Unix systems

Nice to have:
- Experience with message queues (RabbitMQ, Kafka)
- Knowledge of Docker and Kubernetes
- CI/CD pipeline experience
- Cloud services (AWS, GCP)
- GraphQL experience
- Caching strategies (Redis)"""
    },
    {
        "id": "devops_engineer",
        "title": "DevOps Engineer",
        "description": """DevOps Engineer - Full-Time

We need a DevOps Engineer to streamline our development and deployment processes.

Requirements:
- 3+ years of DevOps or SRE experience
- Strong knowledge of Linux system administration
- Experience with Docker and Kubernetes
- CI/CD tools (Jenkins, GitHub Actions, GitLab CI)
- Infrastructure as Code (Terraform, CloudFormation)
- Cloud platforms (AWS or GCP or Azure)
- Scripting (Bash, Python)
- Monitoring and logging (Prometheus, Grafana, ELK Stack)

Nice to have:
- Kubernetes certification (CKA/CKAD)
- AWS/GCP/Azure certifications
- Experience with service mesh (Istio)
- Security best practices (DevSecOps)
- Database administration experience"""
    },
    {
        "id": "fullstack_developer",
        "title": "Full Stack Developer",
        "description": """Full Stack Developer - Full-Time

We are looking for a Full Stack Developer who can work across the entire stack.

Requirements:
- 3+ years of full stack development experience
- Frontend: React.js, HTML5, CSS3, JavaScript (ES6+)
- Backend: Node.js/Express or Python/FastAPI
- Database: PostgreSQL and MongoDB
- RESTful API design and consumption
- Git version control
- Responsive design and cross-browser compatibility
- Basic understanding of DevOps concepts

Nice to have:
- TypeScript experience
- Docker knowledge
- Cloud deployment experience (AWS, Vercel, Heroku)
- WebSocket/real-time applications
- Testing frameworks (Jest, Pytest)
- CI/CD experience"""
    },
    {
        "id": "ml_engineer",
        "title": "ML Engineer",
        "description": """Machine Learning Engineer - Full-Time

We are seeking an ML Engineer to build and deploy machine learning systems at scale.

Requirements:
- Master's degree in CS, ML, or related field
- 3+ years of experience in ML engineering
- Strong Python programming (NumPy, Pandas, Scikit-learn)
- Deep learning frameworks (PyTorch or TensorFlow)
- ML model deployment and serving (MLflow, TorchServe, TF Serving)
- Feature engineering and data pipeline development
- Experience with cloud ML platforms (AWS SageMaker, GCP Vertex AI)
- Docker and containerization
- SQL and NoSQL databases

Nice to have:
- Experience with LLMs and generative AI
- Knowledge of Kubernetes for ML workloads
- Real-time ML inference systems
- A/B testing and experimentation platforms
- Publications or open-source ML contributions"""
    },
    {
        "id": "product_manager",
        "title": "Product Manager",
        "description": """Product Manager - Full-Time

We are looking for a Product Manager to drive product strategy and execution.

Requirements:
- 3+ years of product management experience
- Strong analytical skills and data-driven decision making
- Experience with product analytics tools (Mixpanel, Amplitude, Google Analytics)
- Proficiency in creating PRDs, user stories, and product roadmaps
- Experience with Agile/Scrum methodologies
- Excellent stakeholder communication
- User research and customer interview experience
- Basic understanding of technical architecture

Nice to have:
- Experience in B2B SaaS products
- SQL knowledge for data analysis
- Familiarity with design tools (Figma)
- A/B testing and experimentation experience
- Technical background (CS degree or coding experience)"""
    },
]
