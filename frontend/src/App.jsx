import { useState } from "react";
import "./App.css";

function App() {
  const [activePage, setActivePage] = useState("dashboard");

  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [message, setMessage] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [skills, setSkills] = useState([]);
  const [missingSkills, setMissingSkills] = useState([]);
  const [matchScore, setMatchScore] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [jobRoles, setJobRoles] = useState([]);
  const [resumeImprovements, setResumeImprovements] = useState([]);
  const [projectedScore, setProjectedScore] = useState(null);
  const [interviewQuestions, setInterviewQuestions] = useState([]);

  const menuItems = [
    ["dashboard", "⌂", "Dashboard"],
    ["resume", "📄", "Resume Analysis"],
    ["job", "🎯", "Job Match"],
    ["skills", "🧠", "Skill Gap"],
    ["roadmap", "📚", "Learning Roadmap"],
    ["interview", "🎤", "Interview Prep"],
    ["career", "💼", "Career Predictor"],
    ["improve", "✏️", "Resume Improve"],
    ["history", "🕘", "History"],
    ["settings", "⚙️", "Settings"],
  ];

  const generateInterviewQuestions = (detectedSkills, roles) => {
    const questions = [
      "Tell me about yourself and your technical skills.",
      "Explain your most important project and your contribution to it.",
      "How do you approach solving a programming problem?",
      "How do you handle errors or bugs in your project?",
      "Explain the difference between SQL and NoSQL databases.",
      "What is the difference between supervised and unsupervised learning?",
      "How do you evaluate the performance of a machine learning model?",
      "Why should we select you for this position?",
    ];

    if (detectedSkills.includes("Python")) {
      questions.push(
        "What are the main features of Python?",
        "What is the difference between a list, tuple and dictionary in Python?"
      );
    }

    if (detectedSkills.includes("Java")) {
      questions.push(
        "Explain the main principles of Object-Oriented Programming.",
        "What is the difference between method overloading and method overriding?"
      );
    }

    if (detectedSkills.includes("SQL") || detectedSkills.includes("DBMS")) {
      questions.push(
        "What is a primary key and a foreign key?",
        "Explain different types of SQL JOINs."
      );
    }

    if (
      detectedSkills.includes("Machine Learning") ||
      detectedSkills.includes("Data Science")
    ) {
      questions.push(
        "Explain how a machine learning model is trained.",
        "What is the difference between classification and regression?"
      );
    }

    if (detectedSkills.includes("React")) {
      questions.push(
        "What is React and why is it used?",
        "What are React components and state?"
      );
    }

    if (roles.length > 0) {
      questions.push(
        `Why are you interested in the ${roles[0]} role?`
      );
    }

    return [...new Set(questions)].slice(0, 15);
  };

  const handleFileChange = (event) => {
    setResume(event.target.files[0]);
    setMessage("");
    setResumeText("");
    setSkills([]);
    setMissingSkills([]);
    setMatchScore(null);
    setRecommendations([]);
    setJobRoles([]);
    setResumeImprovements([]);
    setProjectedScore(null);
    setInterviewQuestions([]);
  };

  const handleAnalyze = async () => {
    if (!resume) {
      setMessage("Please upload your resume first.");
      return;
    }

    if (!jobDescription.trim()) {
      setMessage("Please enter the job description.");
      return;
    }

    setMessage("Analyzing your resume...");

    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("job_description", jobDescription);

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/analyze",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      setMessage(data.message || "Analysis completed.");
      setResumeText(data.resume_text || "");
      setSkills(data.skills || []);
      setMissingSkills(data.missing_skills || []);
      setMatchScore(data.match_score ?? null);
      setRecommendations(data.recommendations || []);
      setJobRoles(data.job_roles || []);
      setResumeImprovements(data.resume_improvements || []);
      setProjectedScore(data.projected_score ?? null);

      setInterviewQuestions(
        generateInterviewQuestions(
          data.skills || [],
          data.job_roles || []
        )
      );

      setActivePage("dashboard");
    } catch (error) {
      setMessage("Could not connect to the backend.");
    }
  };

  const PageTitle = ({ title, subtitle }) => (
    <div className="page-title">
      <p className="small-title">AI CAREER INTELLIGENCE</p>
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </div>
  );

  const EmptyState = ({ text }) => (
    <div className="empty-state">
      <div>📊</div>
      <h3>No analysis available yet</h3>
      <p>{text}</p>
    </div>
  );

  const renderDashboard = () => (
    <>
      <PageTitle
        title="AI Resume Dashboard"
        subtitle="Your complete career analysis at a glance."
      />

      <div className="welcome-card">
        <div>
          <span className="welcome-label">WELCOME TO YOUR CAREER DASHBOARD</span>
          <h2>Build a stronger career with AI-powered insights.</h2>
          <p>
            Upload your resume and compare it with a job description
            to discover your skills, gaps and improvement areas.
          </p>
        </div>
        <div className="welcome-icon">🚀</div>
      </div>

      <div className="stat-grid">
        <div className="stat-card green">
          <span>Job Match</span>
          <strong>{matchScore !== null ? `${matchScore}%` : "--"}</strong>
        </div>

        <div className="stat-card blue">
          <span>Detected Skills</span>
          <strong>{skills.length}</strong>
        </div>

        <div className="stat-card red">
          <span>Missing Skills</span>
          <strong>{missingSkills.length}</strong>
        </div>

        <div className="stat-card purple">
          <span>Suggested Roles</span>
          <strong>{jobRoles.length}</strong>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-heading">
            <span>📄</span>
            <div>
              <h2>Resume Status</h2>
              <p>Your uploaded resume</p>
            </div>
          </div>

          {resume ? (
            <div className="file-status">
              ✓ {resume.name}
            </div>
          ) : (
            <div className="file-status muted">
              No resume uploaded yet.
            </div>
          )}
        </div>

        <div className="dashboard-card">
          <div className="card-heading">
            <span>🎯</span>
            <div>
              <h2>Career Status</h2>
              <p>Current analysis summary</p>
            </div>
          </div>

          <div className="career-status">
            {matchScore !== null
              ? `Your current job match score is ${matchScore}%.`
              : "Analyze your resume to see your career insights."}
          </div>
        </div>
      </div>
    </>
  );

  const renderResumeAnalysis = () => (
    <>
      <PageTitle
        title="Resume Analysis"
        subtitle="Upload your resume and analyze its content."
      />

      <div className="upload-grid">
        <div className="dashboard-card">
          <div className="card-heading">
            <span>📄</span>
            <div>
              <h2>Upload Resume</h2>
              <p>Upload your resume in PDF format.</p>
            </div>
          </div>

          <input
            className="file-input"
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
          />

          {resume && (
            <p className="selected-file">
              Selected: {resume.name}
            </p>
          )}
        </div>

        <div className="dashboard-card">
          <div className="card-heading">
            <span>💼</span>
            <div>
              <h2>Job Description</h2>
              <p>Enter the job description you want to match.</p>
            </div>
          </div>

          <textarea
            rows="8"
            placeholder="Paste the job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
        </div>
      </div>

      <button className="analyze-button" onClick={handleAnalyze}>
        🔍 Analyze Resume
      </button>

      {message && <p className="status-message">{message}</p>}

      {resumeText && (
        <div className="dashboard-card">
          <div className="card-heading">
            <span>📑</span>
            <div>
              <h2>Extracted Resume Text</h2>
              <p>Text extracted from your uploaded PDF.</p>
            </div>
          </div>

          <pre className="resume-text">{resumeText}</pre>
        </div>
      )}
    </>
  );

  const renderJobMatch = () => (
    <>
      <PageTitle
        title="Job Match Analysis"
        subtitle="See how closely your resume matches the selected job."
      />

      {matchScore === null ? (
        <EmptyState text="Analyze your resume to calculate the job match score." />
      ) : (
        <>
          <div className="big-score-card">
            <span>JOB MATCH SCORE</span>
            <strong>{matchScore}%</strong>
            <p>
              Your resume currently matches approximately{" "}
              {matchScore}% of the provided job requirements.
            </p>
          </div>

          <div className="dashboard-grid">
            <div className="dashboard-card">
              <div className="card-heading">
                <span>✓</span>
                <div>
                  <h2>Matched Skills</h2>
                  <p>Skills found in your resume.</p>
                </div>
              </div>

              <div className="skill-list">
                {skills.map((skill) => (
                  <span className="skill detected" key={skill}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="dashboard-card">
              <div className="card-heading">
                <span>!</span>
                <div>
                  <h2>Missing Skills</h2>
                  <p>Skills required by the job.</p>
                </div>
              </div>

              <div className="skill-list">
                {missingSkills.length > 0 ? (
                  missingSkills.map((skill) => (
                    <span className="skill missing" key={skill}>
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="success-text">
                    ✓ No major missing skills detected.
                  </p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );

  const renderSkillGap = () => (
    <>
      <PageTitle
        title="Skill Gap"
        subtitle="Understand your current skills and the skills you need."
      />

      {matchScore === null ? (
        <EmptyState text="Analyze your resume to see your skill gap." />
      ) : (
        <div className="dashboard-grid">
          <div className="dashboard-card large-card">
            <div className="card-heading">
              <span>✓</span>
              <div>
                <h2>Detected Skills</h2>
                <p>Skills found in your resume.</p>
              </div>
            </div>

            <div className="skill-list large">
              {skills.map((skill) => (
                <span className="skill detected" key={skill}>
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="dashboard-card large-card">
            <div className="card-heading">
              <span>!</span>
              <div>
                <h2>Missing Skills</h2>
                <p>Skills you can consider learning.</p>
              </div>
            </div>

            <div className="skill-list large">
              {missingSkills.map((skill) => (
                <span className="skill missing" key={skill}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );

  const renderRoadmap = () => (
    <>
      <PageTitle
        title="Learning Roadmap"
        subtitle="Personalized learning suggestions based on your skill gaps."
      />

      {recommendations.length === 0 ? (
        <EmptyState text="Analyze your resume to generate your learning recommendations." />
      ) : (
        <div className="roadmap-list">
          {recommendations.map((item, index) => (
            <div className="roadmap-item" key={index}>
              <div className="roadmap-number">{index + 1}</div>
              <div>
                <h3>Recommended Skill</h3>
                <p>{item}</p>
              </div>
              <span>→</span>
            </div>
          ))}
        </div>
      )}
    </>
  );

  const renderInterview = () => (
    <>
      <PageTitle
        title="Interview Preparation"
        subtitle="Practice questions based on your resume and skills."
      />

      {interviewQuestions.length === 0 ? (
        <EmptyState text="Analyze your resume to generate personalized interview questions." />
      ) : (
        <div className="interview-list">
          {interviewQuestions.map((question, index) => (
            <div className="interview-question" key={index}>
              <span className="question-number">
                {index + 1}
              </span>
              <p>{question}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );

  const renderCareer = () => (
    <>
      <PageTitle
        title="Career Predictor"
        subtitle="Explore roles related to your detected skills."
      />

      {jobRoles.length === 0 ? (
        <EmptyState text="Analyze your resume to see suggested career roles." />
      ) : (
        <div className="role-grid-big">
          {jobRoles.map((role, index) => (
            <div className="role-card-big" key={role}>
              <div>{index + 1}</div>
              <span>💼</span>
              <h2>{role}</h2>
              <p>Based on your current skills</p>
            </div>
          ))}
        </div>
      )}
    </>
  );

  const renderImprove = () => (
    <>
      <PageTitle
        title="Resume Improvement"
        subtitle="Suggestions to make your resume stronger."
      />

      {resumeImprovements.length === 0 ? (
        <EmptyState text="Analyze your resume to receive improvement suggestions." />
      ) : (
        <>
          {projectedScore !== null && matchScore !== null && (
            <div className="score-comparison">
              <div>
                <span>Current Score</span>
                <strong>{matchScore}%</strong>
              </div>

              <div className="arrow">→</div>

              <div className="projected">
                <span>Potential Score</span>
                <strong>{projectedScore}%</strong>
              </div>
            </div>
          )}

          <div className="improvement-list">
            {resumeImprovements.map((item, index) => (
              <div className="improvement" key={index}>
                <span>✓</span>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );

  const renderHistory = () => (
    <>
      <PageTitle
        title="Analysis History"
        subtitle="Your current resume analysis information."
      />

      {matchScore === null ? (
        <EmptyState text="Your analysis information will appear here after analysis." />
      ) : (
        <div className="history-card">
          <div className="history-icon">📊</div>
          <div>
            <h2>Latest Resume Analysis</h2>
            <p>Resume: {resume?.name || "Uploaded resume"}</p>
            <p>Job Match Score: {matchScore}%</p>
            <p>Skills Detected: {skills.length}</p>
            <p>Missing Skills: {missingSkills.length}</p>
          </div>
        </div>
      )}
    </>
  );

  const renderSettings = () => (
    <>
      <PageTitle
        title="Settings"
        subtitle="Application information."
      />

      <div className="settings-card">
        <div>
          <h2>AI Resume Analyzer</h2>
          <p>Career Intelligence Dashboard</p>
        </div>

        <div className="setting-row">
          <span>Theme</span>
          <strong>Dark Dashboard</strong>
        </div>

        <div className="setting-row">
          <span>Analysis</span>
          <strong>AI Resume Analysis</strong>
        </div>

        <div className="setting-row">
          <span>Version</span>
          <strong>1.0</strong>
        </div>
      </div>
    </>
  );

  const renderPage = () => {
    switch (activePage) {
      case "resume":
        return renderResumeAnalysis();
      case "job":
        return renderJobMatch();
      case "skills":
        return renderSkillGap();
      case "roadmap":
        return renderRoadmap();
      case "interview":
        return renderInterview();
      case "career":
        return renderCareer();
      case "improve":
        return renderImprove();
      case "history":
        return renderHistory();
      case "settings":
        return renderSettings();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="dashboard">

      <aside className="sidebar">

        <div className="logo">
          <div className="logo-icon">AI</div>
          <div>
            <h2>Resume</h2>
            <span>Analyzer</span>
          </div>
        </div>

        <nav>
          {menuItems.map(([id, icon, label]) => (
            <button
              key={id}
              className={activePage === id ? "active" : ""}
              onClick={() => setActivePage(id)}
            >
              <span>{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-score">
            <span>⭐</span>
            <p>Current Score</p>
            <strong>
              {matchScore !== null ? `${matchScore}/100` : "--"}
            </strong>
            <small>Keep improving</small>
          </div>
        </div>

      </aside>

      <main className="main-content">
        <div className="page-container">
          {renderPage()}
        </div>

        <footer>
          AI Resume Analyzer • Career Intelligence Dashboard
        </footer>
      </main>

    </div>
  );
}

export default App;