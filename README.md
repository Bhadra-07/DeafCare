# DeafCare

> Making healthcare communication accessible when speaking isn't an option.

**Hack Devengers 2.0 · Individual Project**  
**Developer:** Bhadra Abu  
**Live Demo:** [https://deafcare4u.netlify.app](https://deafcare4u.netlify.app)

---

## Overview

DeafCare is an accessible healthcare communication prototype designed to assist deaf, hard-of-hearing, or speech-impaired patients in effectively communicating immediate care needs to healthcare personnel. Using high-contrast, large visual touch controls alongside controlled real-time camera gesture recognition, patients can trigger urgent care requests. The system routes these requests to a Care Team / Nurse Station interface, enabling two-way visual communication and real-time response tracking.

---

## Problem

In healthcare settings, critical communication relies heavily on verbal speech and auditory call bells. Patients who are deaf, non-verbal, speech-impaired, or experiencing acute respiratory distress face significant communication barriers when trying to request urgent assistance.

A patient in a hospital setting often needs to convey specific critical needs:
* **HELP** (General emergency assistance)
* **PAIN** (Acute pain management or distress)
* **DOCTOR** (Request for physician evaluation)
* **MEDICINE** (Scheduled or emergency medication)
* **WATER** (Basic care and hydration)

Without direct visual and gesture-assisted communication tools, patients experience delays in care, increased anxiety, and heightened risk during medical emergencies.

---

## Solution

DeafCare bridges the communication gap by establishing a direct, visual, two-way loop between the patient and the care team:

```
[ Patient Interface ]
       │  (Large Visual Buttons OR Controlled Gestures)
       ▼
[ DeafCare Request Engine ]
       │  (Urgency Classification & Local Signal Broadcast)
       ▼
[ Care Team / Nurse Station ]
       │  (High-Urgency Visual/Audio Alert & Response Selection)
       ▼
[ Visual Response Dispatch ]
       │
       ▼
[ Patient Interface ] ──► (Real-Time Visual Acknowledgment)
```

**Key Principles:**
* **Accessible:** High-contrast, large-target touch interface built for low motor precision.
* **Visual:** Eliminates reliance on spoken language through clear icons and color-coded status indicators.
* **Two-Way:** Patients receive real-time visual confirmation when requests are acknowledged or answered.
* **Simple:** Zero complex menu navigation—immediate access to primary needs.
* **Urgency-Aware:** Automatically prioritizes critical requests (e.g., HELP, PAIN) with visual alerts.

---

## Features

### 1. Patient View
* **Large Accessible Request Controls:** High-visibility touch targets designed for quick interaction under distress.
  * **HELP**
  * **PAIN**
  * **DOCTOR**
  * **MEDICINE**
  * **WATER**
* **Active Request Display:** Real-time visual feedback showing current request status and care team responses.
* **Care Team Visual Responses:** Prominent display of incoming staff messages (e.g., "Nurse on the way", "Medication prepared").

### 2. Controlled Gesture Recognition
Allows patients with limited mobility or reach to trigger requests hands-free using camera-based hand gestures.

| Gesture | Mapped Request |
| :--- | :--- |
| **Open palm** | `HELP` |
| **Pointing index finger** | `DOCTOR` |
| **Thumbs up** | `MEDICINE` |
| **Closed fist** | `WATER` |
| **Hand-to-chest** | `PAIN` |

> **Note:** This system utilizes *controlled gesture recognition* mapped to specific preset commands, not full sign-language translation.

### 3. Care Team / Nurse Station
* **Incoming Requests List:** Live queue of patient care requests ordered by urgency and time.
* **Urgency Levels:** Distinct visual indicators for high, medium, and low urgency requests.
* **High-Urgency Alerts:** Immediate visual notifications for critical requests (HELP, PAIN).
* **Acknowledge & Resolve:** Workflow controls for nursing staff to claim and clear active patient requests.
* **Preset & Custom Responses:** Quick one-tap preset responses or custom text messages sent back to the patient display.
* **Response History:** Logs past interactions for duty continuity.

### 4. Staff Access Control
* **Protected Nurse Station:** Care team controls are locked behind a demo Staff PIN entry screen.
* **Staff Logout:** Allows staff to securely lock the nurse station interface when leaving the terminal.
* **Patient View Isolation:** Prevents patients from accidentally accessing or altering the nurse station dashboard.

> **Note:** Staff PIN entry serves as a client-side demo access control mechanism for hackathon presentation and prototyping.

### 5. Camera Fallback
* Full manual touch-screen fallback remains continuously accessible if the camera feed is disabled, blocked, or unavailable.

---

## How It Works

### End-to-End Operational Flow
1. **Request Creation:** Patient taps a visual control or performs a supported hand gesture.
2. **Signal Dispatch:** DeafCare generates a standardized request object containing request type, timestamp, and default urgency level.
3. **Queue Ingestion:** The request is broadcast to the Care Team interface using `BroadcastChannel` / local client state.
4. **Urgency Evaluation:** The Nurse Station triggers visual alerts if the request is classified as High Urgency.
5. **Staff Acknowledgment:** A staff member clicks **Acknowledge**, changing the status indicator on the patient interface.
6. **Response Dispatch:** Staff selects a preset response (e.g., "On my way") or types a custom message.
7. **Patient View Update:** The patient's screen displays the visual confirmation.
8. **Resolution:** Staff resolves the request once care is administered, clearing it from the active queue.

### Gesture Processing Pipeline
```
[ Browser Camera API ]
          │ (Video Frame Input)
          ▼
 [ MediaPipe Hands ]
          │ (Extracts 3D Landmark Coordinates)
          ▼
  [ Landmark Processing ]
          │ (Calculates Finger Extension / Proximity)
          ▼
[ Predefined Classifier ]
          │ (Matches Gesture to Action Thresholds)
          ▼
 [ DeafCare Request ]
```

---

## Technology Stack

* **Frontend:** HTML5, CSS3, JavaScript (ES6+)
* **Computer Vision:** MediaPipe Hands API
* **Camera Streaming:** Browser MediaDevices / getUserMedia API
* **Inter-Tab State Communication:** Web BroadcastChannel API
* **Local Persistence:** Browser `localStorage`
* **Audio Feedback:** Web Audio API / HTML5 Audio
* **Hosting & Deployment:** Netlify

---

## Architecture

### Component Data Flow
```
+------------------------+              +------------------------+
|    Patient Interface   |              |  Care Team Interface   |
|  - Large Touch Grid    |              |  - Request Queue       |
|  - Gesture Feed        |              |  - Response Sender     |
+-----------+------------+              +-----------+------------+
            |                                       ^
            | (Triggers Request)                    | (Dispatches Response)
            v                                       |
+---------------------------------------------------+--------------------+
|                         DeafCare State / Event Layer                   |
|                  (BroadcastChannel API / LocalStorage)                 |
+------------------------------------------------------------------------+
```

### Vision Pipeline Flow
```
[ Camera Stream ] ---> [ MediaPipe Pipeline ] ---> [ 21 Hand Landmarks ] ---> [ Rule-Based Gesture Logic ] ---> [ Dispatch Signal ]
```

---

## Screenshots

> **Note:** Screenshot files are stored in `assets/screenshots/`.

| Screen | Description |
| :--- | :--- |
| **Patient View** | `assets/screenshots/patient-view.jpg`- Main high-contrast touch interface |
| **Gesture Camera** | `assets/screenshots/gesture-camera.jpg` — Live gesture detection with landmark feedback |
| **Care Team Station**| `assets/screenshots/care-team.jpg` — Nurse station queue and urgency alerts |
| **Staff PIN Entry** | `assets/screenshots/staff-pin.jpg` — Demo staff authorization modal |
| **Patient Response** | `assets/screenshots/patient-response.jpg` — Visual response display received by patient |

---

## Live Demo

* **URL:** [https://deafcare4u.netlify.app](https://deafcare4u.netlify.app)

### Rapid Testing Flow:
1. Open the **Live Demo** in two separate browser tabs side-by-side.
2. Tab 1: Keep on the **Patient View**.
3. Tab 2: Enter the Nurse Station (using demo PIN) to open the **Care Team View**.
4. On Tab 1, tap **HELP** (or perform an open-palm gesture).
5. Observe Tab 2 instantly trigger a **High-Urgency Alert**.
6. On Tab 2, click **Acknowledge** and send a quick response ("Nurse coming").
7. Observe Tab 1 instantly display the visual response to the patient.

---

## Security Note

The Staff PIN feature implemented in this project is a **demo-level client-side access control mechanism** intended solely for hackathon demonstration and UI workflow presentation.

It is **NOT** a clinical or production-grade authentication system. A production-ready healthcare system would require:
* Server-side authentication and role-based access control (RBAC).
* Secure, encrypted session management.
* Compliance with healthcare privacy regulations (e.g., HIPAA / GDPR).
* Encrypted WebSocket or backend API infrastructure.

---

## Limitations

* **Prototype Stage:** This application is a hackathon proof-of-concept and has not undergone clinical trials or medical device certification.
* **Controlled Gesture Scope:** Supports a predefined set of static/simple hand gestures; it does not perform complete Sign Language (e.g., ASL/ISL) translation.
* **Environmental Camera Constraints:** Gesture detection accuracy relies on ambient lighting, camera resolution, clear hand framing, and browser hardware permissions.
* **Demo Access Control:** Uses client-side state storage and PIN validation without a backend server.
* **Device Dependency:** Requires a modern web browser supporting the WebRTC MediaDevices API and WebAssembly (for MediaPipe).
* **Usability Testing:** Requires extensive testing with deaf, hard-of-hearing, and speech-impaired community members in clinical trials.

---

## Future Scope

* **Backend Integration:** Implement secure JWT-based backend authentication and encrypted WebSockets.
* **EHR/EPR System Integration:** Connect request feeds into hospital electronic health record systems and existing nurse call hardware.
* **Multilingual Visual Icons:** Expand visual preset responses with multi-language and pictographic support.
* **Customizable Profiles:** Allow patients to set personalized shortcut requests based on specific medical conditions.
* **Advanced ML Gestures:** Train custom lightweight vision models for dynamic sign language recognition.
* **Haptic Feedback Integration:** Integrate tactile vibrating feedback on patient wearable devices upon staff acknowledgment.
* **Formal Usability & Field Studies:** Conduct structured usability testing alongside clinical accessibility consultants.

---

## Hackathon Context

* **Hackathon:** Hack Devengers 2.0  
* **Project Name:** DeafCare  
* **Category:** Healthcare & Assistive Accessibility  
* **Developer:** Bhadra Abu (Individual Submission)  

---

## Author

**Bhadra Abu**  
*Individual Developer · Hack Devengers 2.0 (2026)*

---

## License

This project is open-source and available under the [MIT License](LICENSE).
