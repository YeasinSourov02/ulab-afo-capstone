
# IoT-Based Explainable Multiclass Gait Analysis for Neurological Condition Assessment and Progress Monitoring

An IoT-enabled, sensor-fused smart Ankle-Foot Orthosis (AFO) for multiclass gait pattern classification, explainable AI-based assessment, and longitudinal rehabilitation monitoring.

## Overview

Gait abnormalities associated with neurological conditions such as stroke, cerebral palsy, and Parkinson's disease can significantly affect mobility, balance, and quality of life. However, conventional clinical gait analysis often relies on expensive, laboratory-based motion-capture systems that are not readily accessible to all patients.

This project aims to develop an affordable, wearable, and explainable gait analysis system integrated into a passive smart Ankle-Foot Orthosis (AFO).

The system combines bilateral Inertial Measurement Units (IMUs), surface Electromyography (sEMG) sensors, and a Force Sensitive Resistor (FSR) insole to collect synchronized biomechanical and physiological data during walking.

Machine learning models will analyze the collected signals to identify distinct gait patterns. Explainable Artificial Intelligence (XAI), particularly SHapley Additive exPlanations (SHAP), will help explain the features contributing to each classification.

A clinician-facing dashboard will visualize gait characteristics, classification results, and longitudinal changes in gait symmetry to support rehabilitation progress monitoring.

**The ultimate goal is to provide an accessible and interpretable decision-support tool for objective gait assessment outside specialized motion-capture laboratories.**

---

## Key Features

### 1. IoT-Based Gait Monitoring
- Wearable sensor integration using an ESP32-based data acquisition system.
- Synchronized acquisition of IMU, sEMG, and FSR measurements.
- Timestamped sensor data for temporal alignment and sensor fusion.
- Data transmission and storage for subsequent analysis.

### 2. Multiclass Gait Pattern Classification

The system aims to distinguish five gait patterns:

| Class | Description |
|---|---|
| Healthy | Reference pattern representing healthy walking |
| Drop Foot | Gait characterized by impaired ankle dorsiflexion during the swing phase |
| Hemiplegic | Gait pattern associated with unilateral motor impairment |
| Parkinsonian | Gait pattern associated with Parkinsonian motor characteristics |

The classification framework is designed to move beyond binary normal/abnormal detection and provide more specific biomechanical gait profiles.

**Note:** These categories represent target gait patterns for research classification. The system is intended to support clinical assessment, not independently diagnose neurological diseases.

### 3. Explainable Artificial Intelligence
- Application of SHAP to interpret machine learning predictions.
- Identification of sensor-derived features contributing to each classification.
- Visualization of feature importance and individual prediction explanations.
- Support for transparent, evidence-informed interpretation of model outputs.

### 4. Gait Symmetry and Progress Monitoring
- Calculation of a Gait Symmetry Index (GSI).
- Comparison of left and right lower-limb gait characteristics.
- Visualization of historical gait measurements and trends.
- Longitudinal monitoring of changes during rehabilitation.

### 5. Clinician-Facing Dashboard
- Visualization of recorded gait data.
- Presentation of predicted gait patterns and confidence scores.
- Display of important features contributing to predictions.
- Historical session comparison and progress visualization.

---

## Hardware Components

The planned hardware configuration includes:

| Component | Purpose |
| --- | --- |
| ESP32 | Embedded processing, sensor acquisition, and communication |
| Bilateral IMUs | Measurement of lower-limb motion and orientation |
| Surface EMG Sensors | Measurement of muscle activation patterns |
| FSR Smart Insole | Measurement of plantar loading and identification of foot-contact events |
| Passive AFO Frame | Provides a repeatable structural platform for sensor integration |
| Power Supply | Powers the embedded electronics and sensors |

The exact sensor models, mounting positions, sampling frequencies, and communication interfaces will be documented as the hardware implementation develops.

---

## Software Stack

The project is organized into four primary software components.

| Component | Responsibilities | Planned Technologies |
| --- | --- | --- |
| Firmware | Sensor acquisition, timing synchronization, and communication | ESP32, C/C++, Arduino Framework, FreeRTOS |
| Backend | API endpoints, data validation, and storage | Python, FastAPI |
| Frontend | Data visualization and clinician dashboard | React, TypeScript |
| Machine Learning | Signal processing, feature extraction, classification, and explainability | Python, NumPy, SciPy, scikit-learn, SHAP |

The technology choices may evolve during development.

---

## Research Scope and Intended Use

This project focuses on developing and evaluating a wearable system for gait pattern characterization and rehabilitation monitoring.

The proposed system is intended to provide quantitative measurements and explainable model outputs that may support clinical assessment.

It is not intended to replace professional clinical evaluation or independently diagnose neurological diseases.

The reliability of classification and progress measurements will depend on sensor quality, participant diversity, data labeling, model validation, and clinical evaluation.

---

## Getting Started

Development instructions will be added as each component becomes available.

### Firmware

The firmware is intended to run on an ESP32 using the Arduino framework and FreeRTOS.


### Backend

The backend will expose APIs for receiving, validating, and retrieving sensor data.

Installation and execution instructions will be provided when the API implementation is available.


### Frontend

The frontend will provide the interface for reviewing gait measurements, classification results, explanations, and historical trends.


### Machine Learning

The ML environment will support preprocessing, feature extraction, model training, evaluation, and inference.

Dataset preparation and model execution instructions will be documented as the pipeline develops.

---

## Research and Documentation

Technical documentation will be maintained in the `docs/` directory.

Planned documentation includes:

- System architecture.
- Sensor integration and calibration.
- Sampling and timestamp synchronization.
- Sensor data format and communication protocol.
- Signal preprocessing and feature extraction.
- Machine learning methodology and evaluation.
- SHAP-based explanation methods.
- Gait Symmetry Index formulation.
- Experimental protocol and validation.

---

## Contributing

Contributions should follow a consistent workflow to keep the codebase organized, maintainable, and easy to review.

The project is organized into four main components:

- `firmware/` — ESP32 firmware and IoT sensor integration.
- `backend/` — Server-side logic and API development.
- `frontend/` — Web application and dashboard.
- `ml/` — Signal processing, machine learning, and explainable AI.

### Branch Naming Convention

Use descriptive branch names with a prefix indicating the type of work.

| Prefix | Purpose | Example |
|---|---|---|
| `feature/` | Develop new functionality | `feature/multi-sensor-synchronization` |
| `fix/` | Fix bugs or unexpected behavior | `fix/timestamp-alignment` |
| `test/` | Add or improve tests | `test/sampling-frequency` |
| `docs/` | Update documentation | `docs/system-architecture` |
| `refactor/` | Improve code structure | `refactor/sensor-acquisition` |
| `experiment/` | Explore experimental approaches | `experiment/gait-classification` |

Use lowercase letters and hyphens to separate words.

### Commit Message Convention

This project follows the [Conventional Commits](https://www.conventionalcommits.org/) specification.

Commit messages should follow this format:

`<type>(<scope>): <description>`

The scope is optional and identifies the component affected by the change.

| Type | Purpose | Example |
|---|---|---|
| `feat` | Introduce a new feature | `feat(firmware): implement synchronized sensor sampling` |
| `fix` | Fix a bug | `fix(firmware): correct timer interval` |
| `docs` | Update documentation | `docs: update project README` |
| `refactor` | Restructure code without changing behavior | `refactor(backend): reorganize API services` |
| `test` | Add or update tests | `test(firmware): validate sampling frequency` |
| `perf` | Improve performance | `perf(firmware): optimize IMU data acquisition` |
| `build` | Update build configuration or dependencies | `build(firmware): configure PlatformIO` |
| `ci` | Update continuous integration workflows | `ci: add automated testing workflow` |
| `style` | Make formatting-only changes | `style(firmware): format sensor acquisition code` |
| `chore` | Perform maintenance tasks | `chore: update gitignore` |

Keep commit descriptions concise, use the imperative mood, and avoid vague messages such as `update code`, `fixes`, or `final version`.

Examples of project-specific commit messages:

- `feat(firmware): add microsecond sensor timestamps`
- `feat(ml): implement gait feature extraction`
- `feat(xai): integrate SHAP explanations`
- `feat(gsi): calculate gait symmetry index`
- `feat(frontend): add gait monitoring dashboard`
- `docs: document sensor synchronization architecture`

Commit messages should accurately describe the changes included in each commit.

### Development Workflow

Follow these steps when working on a new feature or fix.

1. Create a new branch from the latest `main` branch.
2. Implement the feature or fix in the appropriate directory.
3. Test the changes and review the resulting code.
4. Commit the changes using the Conventional Commits format.
5. Push the branch to the remote repository.
6. Open a pull request for review before merging into `main`.

Example:
```

# Update the main branch

git switch main git pull origin main

# Create a feature branch

git switch -c feature/multi-sensor-synchronization

# Review changes

git status git diff

# Stage the relevant files

git add firmware/

# Commit changes

git commit -m "feat(firmware): design synchronized sensor sampling"

# Push the branch

git push -u origin feature/multi-sensor-synchronization

```

### Code Quality and Documentation

- Keep each commit focused on one logical change.
- Test new functionality before submitting a pull request.
- Update relevant documentation when changing system behavior, interfaces, or data formats.
- Maintain consistent sensor data structures and timestamp conventions across components.
- Do not commit credentials, API keys, private participant information, or other sensitive data.
- Keep large datasets, temporary files, and unnecessary generated artifacts out of version control.
- Document significant changes to the sensor acquisition pipeline, machine learning models, and Gait Symmetry Index (GSI).

### Pull Request Guidelines

Pull requests should:

- Have a clear and descriptive title.
- Explain the purpose of the changes.
- Summarize the main implementation details.
- Include relevant test results or explain what remains untested.
- Identify any changes that affect other components.
- Reference related issues or project tasks when applicable.

Changes should be reviewed and validated before being merged into `main`.

The `main` branch should remain as stable as practical, with new features and experimental work developed on separate branches.

## License

The project license will be specified when the repository's distribution and usage requirements have been determined.

---

## Acknowledgements

This project builds on research in wearable sensing, surface electromyography, biomechanical gait analysis, sensor fusion, machine learning, and explainable artificial intelligence.

Relevant research publications and datasets will be documented as they are incorporated into the project.
