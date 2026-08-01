# Dataset Versioning

## Objective

Ensure reproducible experiments.

## Version Format

v1.0

v1.1

v2.0

## Rules

Raw datasets are never modified.

Processed datasets receive version numbers.

Each model training run records:

- Dataset Version
- Model Version
- Evaluation Metrics

## Tool

MLflow will track dataset versions and model versions.