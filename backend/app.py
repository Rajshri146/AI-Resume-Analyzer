from flask import Flask, request, jsonify
from flask_cors import CORS
from pypdf import PdfReader
import re

app = Flask(__name__)
CORS(app)


SKILLS = [
    "Python",
    "Java",
    "SQL",
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "Machine Learning",
    "Deep Learning",
    "AWS",
    "DSA",
    "DBMS",
    "Git",
    "GitHub",
    "Flask",
    "Data Science",
    "C++",
    "Excel",
    "Power BI",
    "MongoDB"
]


def extract_text_from_pdf(file):
    reader = PdfReader(file)

    text = ""

    for page in reader.pages:
        page_text = page.extract_text()

        if page_text:
            text += page_text + "\n"

    return text


def detect_skills(text):
    detected = []

    text_lower = text.lower()

    for skill in SKILLS:
        if skill.lower() in text_lower:
            detected.append(skill)

    return detected


def detect_missing_skills(job_description, detected_skills):
    missing = []

    job_lower = job_description.lower()

    for skill in SKILLS:
        if skill.lower() in job_lower and skill not in detected_skills:
            missing.append(skill)

    return missing


def calculate_match_score(job_description, detected_skills):
    job_lower = job_description.lower()

    required_skills = []

    for skill in SKILLS:
        if skill.lower() in job_lower:
            required_skills.append(skill)

    if not required_skills:
        return 0

    matched = 0

    for skill in required_skills:
        if skill in detected_skills:
            matched += 1

    score = round((matched / len(required_skills)) * 100)

    return score


def generate_recommendations(missing_skills):
    recommendations = []

    for skill in missing_skills[:5]:
        recommendations.append(
            f"Learn {skill} and add a practical project or achievement related to it."
        )

    if not recommendations:
        recommendations.append(
            "Continue improving your technical skills and add measurable achievements to your resume."
        )

    return recommendations


def generate_job_roles(detected_skills):
    roles = []

    skill_text = " ".join(detected_skills).lower()

    if "python" in skill_text and "sql" in skill_text:
        roles.append("Data Analyst")

    if "python" in skill_text and "machine learning" in skill_text:
        roles.append("Machine Learning Engineer")

    if "react" in skill_text or "javascript" in skill_text:
        roles.append("Frontend Developer")

    if "java" in skill_text:
        roles.append("Software Developer")

    if "flask" in skill_text and "python" in skill_text:
        roles.append("Backend Developer")

    if "aws" in skill_text:
        roles.append("Cloud Engineer")

    if not roles:
        roles = [
            "Software Developer",
            "Data Analyst",
            "Web Developer"
        ]

    return roles[:6]


def generate_resume_improvements(resume_text, missing_skills):
    improvements = []

    text_lower = resume_text.lower()

    if "project" not in text_lower:
        improvements.append(
            "Add 1–2 relevant technical projects with technologies used."
        )

    if "achievement" not in text_lower:
        improvements.append(
            "Add measurable achievements or results wherever possible."
        )

    if "github" not in text_lower:
        improvements.append(
            "Add your GitHub link and relevant project repositories."
        )

    if "summary" not in text_lower and "objective" not in text_lower:
        improvements.append(
            "Add a short professional summary focused on your technical skills."
        )

    if missing_skills:
        improvements.append(
            "Include relevant missing skills after gaining practical knowledge."
        )

    if not improvements:
        improvements.append(
            "Keep your resume concise and highlight your strongest technical skills."
        )

    return improvements[:5]


def generate_interview_questions(detected_skills):
    questions = []

    skill_text = " ".join(detected_skills).lower()

    questions.append(
        "Tell me about yourself and your technical skills."
    )

    questions.append(
        "Explain your main project and your contribution to it."
    )

    if "python" in skill_text:
        questions.append(
            "What are the main features of Python and why did you use it?"
        )

    if "java" in skill_text:
        questions.append(
            "What is the difference between a class and an object in Java?"
        )

    if "sql" in skill_text:
        questions.append(
            "What is the difference between WHERE and HAVING in SQL?"
        )

    if "dbms" in skill_text:
        questions.append(
            "What is normalization in DBMS and why is it used?"
        )

    if "machine learning" in skill_text:
        questions.append(
            "What is the difference between supervised and unsupervised learning?"
        )

    if "react" in skill_text:
        questions.append(
            "What are components and state in React?"
        )

    if "aws" in skill_text:
        questions.append(
            "Which AWS services have you used or studied?"
        )

    questions.append(
        "What challenges did you face while developing your project?"
    )

    questions.append(
        "Why should we hire you for this role?"
    )

    return questions[:10]


@app.route("/")
def home():
    return "Resume Analyzer Backend is Running!"


@app.route("/analyze", methods=["POST"])
def analyze():

    try:

        if "resume" not in request.files:
            return jsonify({
                "message": "Resume file is missing."
            }), 400

        resume_file = request.files["resume"]

        job_description = request.form.get(
            "job_description",
            ""
        )

        if not job_description.strip():
            return jsonify({
                "message": "Job description is required."
            }), 400

        resume_text = extract_text_from_pdf(resume_file)

        if not resume_text.strip():
            return jsonify({
                "message": "Could not extract text from the PDF."
            }), 400

        skills = detect_skills(resume_text)

        missing_skills = detect_missing_skills(
            job_description,
            skills
        )

        match_score = calculate_match_score(
            job_description,
            skills
        )

        recommendations = generate_recommendations(
            missing_skills
        )

        job_roles = generate_job_roles(
            skills
        )

        resume_improvements = generate_resume_improvements(
            resume_text,
            missing_skills
        )

        interview_questions = generate_interview_questions(
            skills
        )

        projected_score = min(
            100,
            match_score + min(len(missing_skills) * 5, 20)
        )

        return jsonify({

            "message": "Resume analyzed successfully!",

            "resume_text": resume_text,

            "skills": skills,

            "missing_skills": missing_skills,

            "match_score": match_score,

            "recommendations": recommendations,

            "job_roles": job_roles,

            "resume_improvements": resume_improvements,

            "projected_score": projected_score,

            "interview_questions": interview_questions
        })

    except Exception as error:

        print("ERROR:", error)

        return jsonify({
            "message": "Could not read the PDF."
        }), 500


if __name__ == "__main__":
    app.run(
        debug=True,
        port=5000
    )