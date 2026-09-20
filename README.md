# DeafCare

> **Making healthcare communication accessible when speaking isn't an option.**

**Hack Devengers 2.0 · Individual Project**  
**Developer:** Bhadra Abu  
**Repository:** [https://github.com/Bhadra-07/DeafCare.git](https://github.com/Bhadra-07/DeafCare.git)  
**Live Demo:**   https://deafcare4u.netlify.app

---

## Overview

**DeafCare** is an accessible healthcare communication prototype designed to bridge the critical gap between non-verbal patients and clinical care teams. Built for hospital bedsides, ICUs, and emergency care settings, DeafCare empowers Deaf, Hard-of-Hearing, intubated, stroke-recovering, or non-verbal patients to instantly communicate urgent care needs using high-contrast touch controls or touchless controlled hand gestures.

The system establishes a direct, two-way visual communication loop: requests dispatched from the patient's bedside terminal appear immediately on the central Nurse Station console with urgency prioritization, and caregivers can respond visually with one-click preset or custom status messages.

---

## The Problem

In clinical environments, traditional patient-to-nurse communication relies heavily on audio intercoms and basic call cords:

* **Speech-Dependent Intercoms:** Patients who are Deaf, Hard-of-Hearing, intubated, or speech-impaired cannot verbally state their needs over room speakers.
* **Lack of Context:** Traditional nurse call buttons signal an alert light without indicating whether the patient requires immediate emergency help, pain medication, or simple hydration.
* **High Anxiety & Triage Delays:** Without visual confirmation that a nurse has understood their specific request, non-verbal patients experience heightened anxiety, while nursing staff face inefficient trips to identify basic needs.

---

## The Solution

DeafCare provides a fully visual, two-way, urgency-aware communication channel operating entirely within the web browser.

```
┌─────────────────┐       ┌───────────────────────┐       ┌─────────────────────┐
│  Patient Bed    │ ────> │  DeafCare Dispatch    │ ────> │ Care Team Console   │
│ (Touch/Gesture) │       │ (Urgency Priority)    │       │ (Chime/Pulse Alert) │
└─────────────────┘       └───────────────────────┘       └─────────────────────┘
         ▲                                                           │
         │                    Visual Response                        │
         └───────────────────────────────────────────────────────────┘
```

* **Accessible:** Touch controls with high-contrast text and icons alongside gesture recognition.
* **Visual:** All incoming requests and outgoing status responses are displayed clearly on screen.
* **Two-Way:** Patients receive real-time, written feedback confirming that care is on the way.
* **Urgency-Aware:** Automatic classification of requests (`HIGH`, `MEDIUM`, `NORMAL`) with distinct visual strobes and audio chimes for rapid triage.

---

## Features

### 1. Patient Bedside View
* **Accessible Request Cards:** High-visibility, large touch controls supporting 5 core bedside needs:
  * 🔴 **HELP** (`HIGH` Urgency — Immediate Emergency)
  * 🔴 **PAIN** (`HIGH` Urgency — Severe Pain or Discomfort)
  * 🔵 **DOCTOR** (`MEDIUM` Urgency — Consultation Request)
  * 🟡 **MEDICINE** (`MEDIUM` Urgency — Scheduled Medication or Pain Relief)
  * 🩵 **WATER** (`NORMAL` Urgency — Hydration / Food Request)
* **Active Status Banner:** Displays real-time status (`PENDING` or `ACKNOWLEDGED`) of the patient's active request.
* **Live Message Feed:** Shows time-stamped written replies dispatched directly from the care team.

### 2. Controlled Gesture Recognition Engine
* **Touchless Computer Vision:** Utilizes browser-based hand landmark tracking via MediaPipe Hands to detect 5 distinct bedside gestures:
  * ✋ **Open Palm** ➔ `HELP`
  * 🤚 **Lowered Hand / Hand-to-Chest** ➔ `PAIN`
  * ☝️ **Pointing Up** ➔ `DOCTOR`
  * 👍 **Thumbs Up** ➔ `MEDICINE`
  * ✊ **Closed Fist** ➔ `WATER`
* **Accidental Trigger Protection:** Employs a 12-consecutive-frame stability check (~1 second hold) and progress gauge before dispatching requests.
* *Note: This engine performs predefined controlled gesture classification for standard bedside requests; it is not a full natural sign-language translator.*

### 3. Care Team / Nurse Station Console
* **Real-Time Request Queue:** Incoming calls are automatically sorted and highlighted.
* **Visual & Audio Urgency Alarms:** High-urgency calls (`HELP`, `PAIN`) activate CSS pulse strobes and synthesize an audio chime via the Web Audio API.
* **One-Click Acknowledgement & Resolution:** Caregivers can acknowledge calls to stop alarms and mark them resolved once fulfilled.
* **Preset & Custom Replies:** Instant dispatch of common reassurance messages (*"Doctor is coming right now"*, *"Water is being brought to your room"*) or custom typed text.

### 4. Demo-Level Access Control
* **Protected Staff Portal:** Care Station and Dual Split views are protected by a demo Staff PIN modal (Default PIN: `1234`).
* **Session Logout:** Staff can manually lock the console when stepping away.
* *Note: This PIN check represents a front-end demo access control mechanism for prototype presentation, not a production-grade authentication provider.*

### 5. Camera Fallback Guarantee
* If webcam access is unavailable, denied, or turned off, the interface guarantees full functional continuity through the Touch Control cards.

---

## How It Works

### End-to-End Communication Lifecycle
1. **Patient Trigger:** The patient taps a request card or holds a supported gesture in front of the bedside tablet camera for ~1 second.
2. **Request Dispatch:** DeafCare assigns a timestamp, origin tag (`TOUCH_UI` or `GESTURE_AI`), and urgency rating, saving state locally and broadcasting cross-tab updates.
3. **Care Team Alert:** The Care Station console receives the request, triggering a visual pulse and audio chime for high-urgency alerts.
4. **Acknowledgement:** Nursing staff click **Acknowledge**, notifying the patient that their call has been seen.
5. **Visual Response:** Staff click a preset response or type a custom message, which immediately renders on the patient's screen.
6. **Resolution:** Once attended to, staff click **Resolve** to archive the active request.

### Gesture Processing Pipeline
```
┌──────────────┐     ┌─────────────────────┐     ┌────────────────┐
│ Browser      │ ──> │ MediaPipe Hands     │ ──> │ 21 Hand        │
│ Video Stream │     │ Landmark Extraction │     │ Keypoints (x,y)│
└──────────────┘     └─────────────────────┘     └────────────────┘
                                                         │
                                                         ▼
┌──────────────┐     ┌─────────────────────┐     ┌────────────────┐
│ DeafCare     │ <── │ 12-Frame Stability  │ <── │ Geometric Rule │
│ Dispatch     │     │ Debounce (~1 sec)   │     │ Classification │
└──────────────┘     └─────────────────────┘     └────────────────┘
```

---

## Technology Stack

* **Frontend Framework:** React 18 (Browser UMD Bundle)
* **Styling & UI:** Tailwind CSS (CDN Runtime) & FontAwesome 6 Icons
* **Computer Vision:** MediaPipe Hands API (`@mediapipe/hands` & `@mediapipe/camera_utils`)
* **State Synchronization:** Browser `BroadcastChannel` API (`deafcare_sync`) with `localStorage` fallback
* **Audio Synthesis:** Web Audio API (`AudioContext` oscillator for chime alerts)
* **Hosting & Deployment:** Netlify Edge Hosting

---

## Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        DeafCare Application                            │
├───────────────────────────────────┬────────────────────────────────────┤
│           Patient View            │         Care Station Console       │
│  - Touch Card Controls            │  - Real-Time Dispatch Queue        │
│  - AI Gesture Tracking Camera     │  - High-Urgency Pulse / Chime      │
│  - Active Call & Reply Feed       │  - Preset & Custom Response Panel  │
└─────────────────┬─────────────────┴──────────────────┬─────────────────┘
                  │                                    │
                  └─── Local State & BroadcastChannel ─┘
```

---

## Screenshots

| Patient Terminal View | AI Gesture Tracking Camera |
| :---: | :---: |
| ![Patient View](assets/screenshots/patient-view.png) | ![Gesture Camera Module](assets/screenshots/gesture-camera.png) |

| Care Station Console | Staff PIN Security Modal |
| :---: | :---: |
| ![Care Team View](assets/screenshots/care-team.png) | ![Staff PIN Verification](assets/screenshots/staff-pin.png) |

---

## Repository Structure

```
DeafCare/
│
├── README.md                           # Main Project Overview & Guide
├── LICENSE                             # MIT Open Source License
├── .gitignore                          # Git Ignore rules
├── index.html                          # Complete Single-File DeafCare Application
│
├── assets/
│   └── screenshots/
│       ├── patient-view.png            # Patient terminal UI screenshot
│       ├── gesture-camera.png          # Gesture camera tracking UI screenshot
│       ├── care-team.png               # Nurse care station UI screenshot
│       └── staff-pin.png               # Staff authentication modal screenshot
│
└── docs/
    └── project-documentation.md        # Technical documentation & implementation details
```

---

## Quick Start / Installation

Because DeafCare is engineered as an edge-capable, single-file browser application, running it locally requires no build tooling, bundlers, or `npm install`.

### Option 1: Direct File Access
1. Clone this repository:
   ```bash
   git clone https://github.com/Bhadra-07/DeafCare.git
   cd DeafCare
   ```
2. Open `index.html` directly in any modern web browser (Google Chrome, Microsoft Edge, Brave, or Firefox).

### Option 2: Local HTTP Server (Recommended for Camera Access)
To test camera gesture recognition, serve the file over an HTTP server (browser security policies require HTTP/HTTPS for webcam access):

```bash
# Using Python 3
python3 -m http.server 8000

# Using Node.js npx
npx serve .
```
Open `http://localhost:8000` in your browser.

---

## Demo Access Information

* **Live URL:** [https://deafcare.netlify.app](https://deafcare.netlify.app)
* **Care Station PIN:** `1234`

To test cross-tab synchronization:
1. Open [https://deafcare.netlify.app](https://deafcare.netlify.app) in Tab A (Patient View).
2. Open [https://deafcare.netlify.app](https://deafcare.netlify.app) in Tab B, launch the Terminal, select **Care Station**, and enter PIN `1234`.
3. Trigger a request in Tab A to observe instant dispatch and audio-visual alerts in Tab B.

---

## Project Disclaimer & Scope

* **Prototype Status:** DeafCare is a proof-of-concept prototype developed for **Hack Devengers 2.0**.
* **Medical Certification:** DeafCare is an assistive communication prototype. It has not undergone clinical validation, medical device certification (FDA/CE), or formal hospital integration trials.
* **Gesture Scope:** The gesture engine recognizes 5 specific predefined hand configurations mapped to bedside communication needs. It does not perform full American Sign Language (ASL) or natural language translation.
* **Security Scope:** The PIN authentication implemented in this repository is designed for demonstration and presentation workflows.

---

## Author & Acknowledgments

* **Developer:** Bhadra Abu
* **Hackathon:** Hack Devengers 2.0
* **Repository:** [https://github.com/Bhadra-07/DeafCare.git](https://github.com/Bhadra-07/DeafCare.git)
* **License:** [MIT License](LICENSE)
