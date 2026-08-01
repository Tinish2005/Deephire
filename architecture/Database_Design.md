# Database Design

## Overview

PostgreSQL will act as the primary database.

The database stores:

- User Information
- Resume Data
- Interview Sessions
- Answers
- Coding Results
- Speech Metrics
- Vision Metrics
- Predictions
- Recommendations
- Model Experiments

---

# Users

Purpose:

Store user account information.

Fields

- id
- name
- email
- password_hash
- role
- created_at

Relationships

1 User
→ Many Interview Sessions

1 User
→ Many Resumes

---

# Resumes

Purpose:

Store uploaded resume metadata.

Fields

- id
- user_id
- filename
- upload_date
- extracted_skills
- extracted_projects
- extracted_experience

Relationships

Many Resumes
→ One User

---

# Interview Sessions

Purpose:

Store interview attempts.

Fields

- id
- user_id
- role
- company
- interview_type
- overall_score
- start_time
- end_time

Relationships

One Session
→ Many Questions

One Session
→ Many Answers

---

# Questions

Fields

- id
- session_id
- question_text
- difficulty
- category

---

# Answers

Fields

- id
- session_id
- question_id
- answer_text
- technical_accuracy
- completeness
- relevance

---

# Speech Metrics

Fields

- id
- session_id
- fluency
- clarity
- pause_quality
- speech_rate

---

# Vision Metrics

Fields

- id
- session_id
- eye_contact_score
- face_presence_score
- head_pose_score

---

# Coding Submissions

Fields

- id
- session_id
- language
- code
- correctness_score
- complexity_score
- maintainability_score

---

# Predictions

Fields

- id
- session_id
- final_score
- model_version
- generated_at

---

# Recommendations

Fields

- id
- session_id
- weak_topics
- learning_path
- suggested_resources

---

# Model Experiments

Fields

- id
- model_name
- version
- dataset_version
- metrics
- experiment_date

Purpose:

Track MLflow-related information.