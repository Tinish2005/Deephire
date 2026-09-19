# DeepHire

## AI-Powered, Domain-Agnostic Interview Assessment Platform

DeepHire is a full-stack application that runs a candidate through a complete interview assessment — resume analysis, a personalized technical interview, speech analysis, and computer-vision-based attention tracking — and produces a scored, explainable final report.

The platform works across professional domains. It has been tested and verified on AI/ML, Business Analytics, and HR resumes, each producing genuinely field-appropriate skill extraction and interview questions with no cross-domain bleed.

---

## What It Actually Does

DeepHire runs a candidate through five stages, all driven by a single session:

1. **Resume Upload & Analysis** — extracts skills, projects, and experience from an uploaded PDF, and computes a resume score.
2. **Voice Recording** — records a spoken answer, transcribes it, and scores clarity, pace, and filler-word usage.
3. **Vision Capture** — captures a webcam frame and scores face presence and attention (how centered the candidate is in frame).
4. **Personalized Interview** — generates 8 technical questions plus 2 behavioral questions, tailored to the candidate's actual resume content, and collects typed answers.
5. **Final Assessment** — fuses all four signals into an overall score, a recommendation, and a breakdown explaining *why* the candidate scored what they did.

Every score in the final report is computed from real analysis of what the candidate actually submitted — there are no hardcoded or placeholder numbers in the current pipeline.

---

## How the Intelligence Actually Works

This section is deliberately precise, because it's easy to overstate what's "AI" in a project like this. Here is exactly what each piece does and does not do.

### Resume Intelligence
- Skills, projects, and experience are extracted by sending the raw resume text to **Gemini 2.5 Flash**, with a prompt that explicitly does not assume any particular field — it identifies the candidate's actual professional domain from the text itself.
- If the Gemini call fails for any reason, extraction falls back to a keyword-matching approach (a curated list of ~50 technical terms) so the pipeline never hard-fails.
- The resume score is a weighted formula (skills 50%, projects 25%, experience 25%) based on how many genuine items were found, capped to avoid trivial 100% scores.

### Personalized Interview Questions
- All 8 technical questions are generated dynamically by Gemini, using the candidate's extracted skills, projects, and experience as context. There is no fixed question bank — two candidates with different resumes will never see the same set of questions.
- Each question comes with a Gemini-generated model answer, used as the reference point for scoring the candidate's response.
- 2 behavioral questions are static, since behavioral questions are not field-specific by nature.

### Answer Evaluation (NLP)
- Each candidate answer is scored using a combination of:
  - **Sentence-Transformer embeddings** (`all-MiniLM-L6-v2`) for semantic similarity between the candidate's answer and the Gemini-generated model answer.
  - **DistilBERT** (pretrained, used as a frozen feature extractor — not fine-tuned) for an independent measure of answer substance, via embedding norm and token diversity.
  - A simple rule-based length/completeness check as a baseline signal.
- These three signals are combined into a single interview score per question, then averaged across all 10 questions.
- The score is also broken down into four interpretable sub-scores — technical depth, communication quality, completeness, and relevance — shown to the candidate as an explanation, not just a single number.

### Voice Analysis
- Audio is transcribed using **Faster-Whisper** (the `base` model, running locally).
- Speaking rate, filler-word count, clarity, and pace are computed from the transcript and audio duration using rule-based heuristics — this is not a trained speech model, it's real transcription plus straightforward calculation.

### Vision Analysis
- Face detection and attention scoring use **OpenCV's Haar Cascade classifier** — a classical (non-deep-learning) computer vision technique — to detect a face and measure how centered it is in the frame.
- This is genuinely functional, but it is not a deep learning model and does not track eye gaze, emotion, or engagement beyond simple frame-centering.

### Fusion & Explainability
- The final overall score is a straightforward weighted average of the four component scores (resume, interview, voice, vision) — this is a formula, not a trained model.
- The explanation layer surfaces the sub-scores that already exist inside the NLP evaluation (technical depth, communication quality, completeness, relevance) rather than using formal techniques like SHAP or LIME.

---

## What This Project Is *Not* (Honesty Section)

To be direct about scope, since it matters for how this should be described in interviews or on a resume:

- **No model in this project has been fine-tuned or trained from scratch.** DistilBERT and the sentence-transformer are used entirely as pretrained, frozen components. There is no custom-trained speech model and no trained fusion network — "fusion" here means a weighted average formula.
- **The interview scoring formula and score caps are hand-designed heuristics**, not learned or statistically validated against real human-graded interview data.
- **Vision analysis uses classical computer vision (Haar Cascades), not a deep learning model.**
- The accurate way to describe this project is: *an applied AI system that integrates several pretrained models (Gemini, Whisper, DistilBERT, a sentence-transformer) and classical CV into a working, domain-agnostic, explainable interview pipeline* — not a project involving custom model training.

---

## Architecture

**Frontend:** React (Vite), React Router
**Backend:** FastAPI
**Database:** SQLite (development)
**AI/ML:**
- Google Gemini 2.5 Flash — resume parsing, question generation, model answers
- Sentence-Transformers (`all-MiniLM-L6-v2`) — semantic similarity
- DistilBERT (`distilbert-base-uncased`) — independent answer scoring
- Faster-Whisper (`base`) — speech-to-text
- OpenCV (Haar Cascade) — face detection and attention scoring

### Key Backend Modules
| Module | Responsibility |
|---|---|
| `app/resume/` | PDF parsing, Gemini-based skill/project/experience extraction, resume scoring |
| `app/interview/` | Dynamic question generation via Gemini, question bank (behavioral only) |
| `app/nlp/` | Embeddings, semantic similarity, DistilBERT scoring, combined answer evaluation |
| `app/audio/` | Whisper transcription, speech metric calculation |
| `app/vision/` | Face detection, attention scoring |
| `app/fusion/` | Score fusion and recommendation logic |
| `app/api/` | Session management, the end-to-end assessment pipeline, dashboard stats, history, PDF/JSON export |

### Key Frontend Routes
| Route | Purpose |
|---|---|
| `/interview` | The real, connected end-to-end assessment flow |
| `/dashboard` | Live stats: total sessions, total reports, average score |
| `/history` | All past assessments, with a score-trend chart |

---

## Running Locally

### Prerequisites
- Python 3.11
- Node.js
- A Gemini API key ([aistudio.google.com/apikey](https://aistudio.google.com/apikey))

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
```

Create a `.env` file inside `backend/` with:
```
GEMINI_API_KEY=your_key_here
```

Run the server:
```bash
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Then open `http://localhost:5173/interview` to run a full assessment.

---

## Project Status

The core pipeline — resume, interview, voice, vision, scoring, and explainability — is complete and verified end-to-end across multiple professional domains. A dashboard, history/analytics view, and PDF/JSON export are also implemented.

**Not yet done:** production deployment (the app currently runs locally with SQLite; a hosted version would need PostgreSQL, environment-based configuration, and hosting for the PyTorch/Whisper/OpenCV dependencies).

---

## Acknowledgments

Built as a portfolio project to demonstrate applied integration of multiple AI services and models into a coherent, working product — not as a research contribution in model training.# DeepHire

## AI-Powered, Domain-Agnostic Interview Assessment Platform

DeepHire is a full-stack application that runs a candidate through a complete interview assessment — resume analysis, a personalized technical interview, speech analysis, and computer-vision-based attention tracking — and produces a scored, explainable final report.

The platform works across professional domains. It has been tested and verified on AI/ML, Business Analytics, and HR resumes, each producing genuinely field-appropriate skill extraction and interview questions with no cross-domain bleed.

---

## What It Actually Does

DeepHire runs a candidate through five stages, all driven by a single session:

1. **Resume Upload & Analysis** — extracts skills, projects, and experience from an uploaded PDF, and computes a resume score.
2. **Voice Recording** — records a spoken answer, transcribes it, and scores clarity, pace, and filler-word usage.
3. **Vision Capture** — captures a webcam frame and scores face presence and attention (how centered the candidate is in frame).
4. **Personalized Interview** — generates 8 technical questions plus 2 behavioral questions, tailored to the candidate's actual resume content, and collects typed answers.
5. **Final Assessment** — fuses all four signals into an overall score, a recommendation, and a breakdown explaining *why* the candidate scored what they did.

Every score in the final report is computed from real analysis of what the candidate actually submitted — there are no hardcoded or placeholder numbers in the current pipeline.

---

## How the Intelligence Actually Works

This section is deliberately precise, because it's easy to overstate what's "AI" in a project like this. Here is exactly what each piece does and does not do.

### Resume Intelligence
- Skills, projects, and experience are extracted by sending the raw resume text to **Gemini 2.5 Flash**, with a prompt that explicitly does not assume any particular field — it identifies the candidate's actual professional domain from the text itself.
- If the Gemini call fails for any reason, extraction falls back to a keyword-matching approach (a curated list of ~50 technical terms) so the pipeline never hard-fails.
- The resume score is a weighted formula (skills 50%, projects 25%, experience 25%) based on how many genuine items were found, capped to avoid trivial 100% scores.

### Personalized Interview Questions
- All 8 technical questions are generated dynamically by Gemini, using the candidate's extracted skills, projects, and experience as context. There is no fixed question bank — two candidates with different resumes will never see the same set of questions.
- Each question comes with a Gemini-generated model answer, used as the reference point for scoring the candidate's response.
- 2 behavioral questions are static, since behavioral questions are not field-specific by nature.

### Answer Evaluation (NLP)
- Each candidate answer is scored using a combination of:
  - **Sentence-Transformer embeddings** (`all-MiniLM-L6-v2`) for semantic similarity between the candidate's answer and the Gemini-generated model answer.
  - **DistilBERT** (pretrained, used as a frozen feature extractor — not fine-tuned) for an independent measure of answer substance, via embedding norm and token diversity.
  - A simple rule-based length/completeness check as a baseline signal.
- These three signals are combined into a single interview score per question, then averaged across all 10 questions.
- The score is also broken down into four interpretable sub-scores — technical depth, communication quality, completeness, and relevance — shown to the candidate as an explanation, not just a single number.

### Voice Analysis
- Audio is transcribed using **Faster-Whisper** (the `base` model, running locally).
- Speaking rate, filler-word count, clarity, and pace are computed from the transcript and audio duration using rule-based heuristics — this is not a trained speech model, it's real transcription plus straightforward calculation.

### Vision Analysis
- Face detection and attention scoring use **OpenCV's Haar Cascade classifier** — a classical (non-deep-learning) computer vision technique — to detect a face and measure how centered it is in the frame.
- This is genuinely functional, but it is not a deep learning model and does not track eye gaze, emotion, or engagement beyond simple frame-centering.

### Fusion & Explainability
- The final overall score is a straightforward weighted average of the four component scores (resume, interview, voice, vision) — this is a formula, not a trained model.
- The explanation layer surfaces the sub-scores that already exist inside the NLP evaluation (technical depth, communication quality, completeness, relevance) rather than using formal techniques like SHAP or LIME.

---

## What This Project Is *Not* (Honesty Section)

To be direct about scope, since it matters for how this should be described in interviews or on a resume:

- **No model in this project has been fine-tuned or trained from scratch.** DistilBERT and the sentence-transformer are used entirely as pretrained, frozen components. There is no custom-trained speech model and no trained fusion network — "fusion" here means a weighted average formula.
- **The interview scoring formula and score caps are hand-designed heuristics**, not learned or statistically validated against real human-graded interview data.
- **Vision analysis uses classical computer vision (Haar Cascades), not a deep learning model.**
- The accurate way to describe this project is: *an applied AI system that integrates several pretrained models (Gemini, Whisper, DistilBERT, a sentence-transformer) and classical CV into a working, domain-agnostic, explainable interview pipeline* — not a project involving custom model training.

---

## Architecture

**Frontend:** React (Vite), React Router
**Backend:** FastAPI
**Database:** SQLite (development)
**AI/ML:**
- Google Gemini 2.5 Flash — resume parsing, question generation, model answers
- Sentence-Transformers (`all-MiniLM-L6-v2`) — semantic similarity
- DistilBERT (`distilbert-base-uncased`) — independent answer scoring
- Faster-Whisper (`base`) — speech-to-text
- OpenCV (Haar Cascade) — face detection and attention scoring

### Key Backend Modules
| Module | Responsibility |
|---|---|
| `app/resume/` | PDF parsing, Gemini-based skill/project/experience extraction, resume scoring |
| `app/interview/` | Dynamic question generation via Gemini, question bank (behavioral only) |
| `app/nlp/` | Embeddings, semantic similarity, DistilBERT scoring, combined answer evaluation |
| `app/audio/` | Whisper transcription, speech metric calculation |
| `app/vision/` | Face detection, attention scoring |
| `app/fusion/` | Score fusion and recommendation logic |
| `app/api/` | Session management, the end-to-end assessment pipeline, dashboard stats, history, PDF/JSON export |

### Key Frontend Routes
| Route | Purpose |
|---|---|
| `/interview` | The real, connected end-to-end assessment flow |
| `/dashboard` | Live stats: total sessions, total reports, average score |
| `/history` | All past assessments, with a score-trend chart |

---

## Running Locally

### Prerequisites
- Python 3.11
- Node.js
- A Gemini API key ([aistudio.google.com/apikey](https://aistudio.google.com/apikey))

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
```

Create a `.env` file inside `backend/` with:
```
GEMINI_API_KEY=your_key_here
```

Run the server:
```bash
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Then open `http://localhost:5173/interview` to run a full assessment.

---

## Project Status

The core pipeline — resume, interview, voice, vision, scoring, and explainability — is complete and verified end-to-end across multiple professional domains. A dashboard, history/analytics view, and PDF/JSON export are also implemented.

**Not yet done:** production deployment (the app currently runs locally with SQLite; a hosted version would need PostgreSQL, environment-based configuration, and hosting for the PyTorch/Whisper/OpenCV dependencies).

---

## Acknowledgments

Built as a portfolio project to demonstrate applied integration of multiple AI services and models into a coherent, working product — not as a research contribution in model training.