# API Design

## Authentication APIs

POST /auth/register

Purpose:
Create user account.

---

POST /auth/login

Purpose:
Generate JWT token.

---

GET /auth/me

Purpose:
Retrieve current user.

---

# Resume APIs

POST /resume/upload

Purpose:
Upload resume.

---

GET /resume/{id}

Purpose:
Retrieve resume information.

---

# Interview APIs

POST /interview/start

Purpose:
Start interview session.

---

GET /interview/{id}

Purpose:
Retrieve session.

---

POST /interview/question

Purpose:
Get next interview question.

---

POST /interview/submit-answer

Purpose:
Submit answer.

---

# Speech APIs

POST /speech/analyze

Purpose:
Analyze audio metrics.

Output

- Fluency
- Clarity
- Pause Quality

---

# Vision APIs

POST /vision/analyze

Purpose:
Analyze visual features.

Output

- Eye Contact
- Face Presence
- Head Pose

---

# Coding APIs

POST /coding/submit

Purpose:
Evaluate coding solution.

Output

- Correctness
- Complexity
- Maintainability

---

# Assessment APIs

POST /assessment/generate

Purpose:
Generate final performance score.

Inputs

- NLP Features
- Speech Features
- Vision Features
- Coding Features

Output

- Interview Score

---

# Recommendation APIs

GET /recommendations/{session_id}

Purpose:
Generate personalized learning recommendations.

---

# Reports APIs

GET /reports/{session_id}

Purpose:
Generate detailed assessment report.