# JobFit: AI-Powered Resume Analyzer

JobFit is a full-stack application that leverages artificial intelligence to analyze resumes against target job descriptions. It extracts candidate skills, identifies gaps, and provides personalized learning recommendations to help candidates secure their desired roles.

## Architecture

The system is built on a modern stack separating the frontend client from the backend AI service.

*   **Frontend**: React, TypeScript, Vite, Tailwind CSS, ShadCN UI
*   **Backend**: Python, FastAPI, Uvicorn
*   **AI Engine**: Groq API (LLM integration for skill extraction and analysis)

## Core Features

1.  **Resume Parsing**: Automatically extracts text from uploaded PDF files.
2.  **Skill Extraction**: Utilizes an LLM to identify core competencies and technical skills from unstructured resume text.
3.  **Gap Analysis**: Compares extracted skills against a target job description (user-provided or preset) to calculate an overall match score.
4.  **Learning Recommendations**: Generates a tailored action plan with specific resources, time estimates, and platforms (e.g., Coursera, AWS) to address identified skill gaps.

## Prerequisites

Before running the application, ensure you have the following installed:

*   Node.js (v18 or higher)
*   npm (v9 or higher)
*   Python (3.9 or higher)
*   Git

## Local Environment Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Kevinjose102/AI-Powered-Resume-Analyzer.git
cd AI-Powered-Resume-Analyzer
```

### 2. Backend Setup

Navigate to the backend directory and set up the Python environment.

```bash
cd backend
python -m venv venv
```

Activate the virtual environment:

*   **Windows**:
    ```bash
    .\venv\Scripts\activate
    ```
*   **macOS/Linux**:
    ```bash
    source venv/bin/activate
    ```

Install the required Python dependencies:

```bash
pip install -r requirements.txt
```

Set up your environment variables. Create a `.env` file in the `backend` directory:

```bash
# Add your Groq API key to the backend/.env file
GROQ_API_KEY=your_groq_api_key_here
```

### 3. Frontend Setup

Open a new terminal session, navigate to the frontend directory, and install dependencies.

```bash
cd frontend
npm install
```

## Running the Application

To run the full stack, you need to start both the backend and frontend servers simultaneously.

### Start the Backend Server

From the `backend` directory with your virtual environment active:

```bash
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
The FastAPI backend will run on `http://localhost:8000`.

### Start the Frontend Server

From the `frontend` directory:

```bash
npm run dev
```
The Vite development server will typically start on `http://localhost:5173`. Open this URL in your browser to access the application.

## Usage Guide

1.  Navigate to the web interface.
2.  Upload your resume in PDF format.
3.  Either paste a specific job description or select one of the available industry presets.
4.  Click "Run Analysis" to initiate the AI processing.
5.  Review the extracted skills, gap analysis, and tailored learning path on the results page.

## License

This project is licensed under standard open-source terms. See the repository for exact licensing details.
