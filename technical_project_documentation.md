# DeafCare — Technical Architecture & Implementation Guide

**Project:** DeafCare  
**Developer:** Bhadra Abu  
**Hackathon:** Hack Devengers 2.0  
**Live Site:** [https://deafcare.netlify.app](https://deafcare.netlify.app)  

---

## 1. System Overview

DeafCare is a browser-native, zero-dependency patient communication engine engineered specifically for non-verbal bedside interaction. The architecture emphasizes zero latency, privacy-first edge processing, and multi-interface synchronization without requiring a dedicated back-end infrastructure.

---

## 2. Technical Stack Breakdown

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Client Runtime** | React 18 (Standalone UMD) | Declarative UI state rendering across Patient and Care Team views. |
| **Presentation** | Tailwind CSS CDN | High-contrast, responsive glassmorphism UI framework. |
| **Computer Vision** | MediaPipe Hands CDN | Edge-based hand landmark detection (21 3D coordinates). |
| **Inter-Tab Sync** | `BroadcastChannel` API | Real-time cross-window synchronization between Patient and Care Station views. |
| **Persistence** | `localStorage` | Client-side persistence of active and historical requests. |
| **Audio Synthesis** | Web Audio API | Pure programmatic audio alarm generation without external media files. |

---

## 3. Computer Vision & Controlled Gesture Pipeline

### 3.1 Landmark Detection
The application loads MediaPipe Hands directly in the browser. When the patient enables the camera, the system captures frames via the HTML5 `video` element and processes them at native frame rates using an HTML5 `canvas` overlay.

MediaPipe returns 21 hand landmark coordinates normalized to $x, y, z \in [0.0, 1.0]$.

### 3.2 Heuristic Classification Rules
The hand landmark classification logic operates on deterministic spatial relative position calculations:

```
Index Finger Tip (8)   Middle Finger Tip (12)   Ring Finger Tip (16)   Pinky Finger Tip (20)
        │                       │                        │                      │
        ▼                       ▼                        ▼                      ▼
  y < y(Pip 6)            y < y(Pip 10)            y < y(Pip 14)          y < y(Pip 18)
```

1. **HELP (Open Palm):**
   * Condition: All four finger tips (Index `#8`, Middle `#12`, Ring `#16`, Pinky `#20`) positioned higher on the screen ($y$-axis) than their corresponding PIP joints (`#6`, `#10`, `#14`, `#18`).

2. **DOCTOR (Pointing Up):**
   * Condition: Index finger tip (`#8`) extended ($y_8 < y_6$), while Middle (`#12`), Ring (`#16`), and Pinky (`#20`) remain folded ($y_{tip} \ge y_{pip}$).

3. **MEDICINE (Thumbs Up):**
   * Condition: Thumb tip (`#4`) positioned above thumb MCP/IP joints ($y_4 < y_3$) and above index tip ($y_4 < y_8$), with all four remaining fingers curled closed.

4. **WATER (Closed Fist):**
   * Condition: All four main finger tips folded ($y_{tip} \ge y_{pip}$) and thumb distance to pinky MCP joint below extension threshold ($d(4, 17) \le 0.22$).

5. **PAIN (Lowered Hand / Hand to Chest):**
   * Condition: Wrist joint (`#0`) located in the lower portion of the frame ($y_0 > 0.65$) with Index and Middle fingers extended.

### 3.3 Temporal Debouncing & Accidental Trigger Prevention
To ensure high reliability and prevent false positives from incidental movements:
* A gesture must remain stable and unchanged across **12 consecutive video frames** (~1 second at 15-30 FPS).
* Progress is rendered live on screen via a percentage gauge bar.
* Upon dispatching a request, a 3.5-second cooldown timer is initiated to prevent duplicate triggers.

---

## 4. State Management & Real-Time Synchronization

### 4.1 BroadcastChannel Synchronization
DeafCare uses the browser's native `BroadcastChannel` API on the channel `deafcare_sync`. 

When a request is generated, acknowledged, responded to, or resolved in any open tab or split view panel:
1. The updated request array is saved to `localStorage`.
2. A `SYNC` message payload containing the fresh state is broadcasted across the channel.
3. All listening tabs receive the message and update their React state, ensuring synchronization between Patient and Nurse Station interfaces.

```
┌──────────────────┐                                ┌──────────────────┐
│ Tab A: Patient   │ ──── BroadcastChannel ───────> │ Tab B: Nurse     │
│ UI Dispatch      │      ('deafcare_sync')         │ Station Console  │
└──────────────────┘                                └──────────────────┘
```

### 4.2 Web Audio Chime Synthesis
To ensure emergency alarms function without relying on external MP3 audio assets, DeafCare synthesizes an urgent chime programmatically using the Web Audio API:

```javascript
const osc = audioCtx.createOscillator();
const gain = audioCtx.createGain();
osc.type = 'sine';
osc.frequency.setValueAtTime(880, audioCtx.currentTime); // Note A5
osc.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.4); // Downward ramp
gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
```

Audio alarms are automatically triggered when a `HIGH` urgency request (`HELP` or `PAIN`) enters the `PENDING` state.

---

## 5. Security & Access Control Scope

* **Demo PIN Protection:** Access to the Care Station and Dual Split views is controlled by a front-end PIN verification modal (Default PIN: `1234`).
* **Privacy Assurance:** All video frame processing occurs entirely inside browser client memory. No video streams, audio recordings, or patient biometric data are transmitted to external servers or logged to disk.
```
eof
```

All requested files have been created specifically according to your actual codebase without modifying any working functionality or making unverified claims.

### Summary of Created Files
* **`README.md`**: Professional, comprehensive overview detailing the problem, solution, 5 controlled gestures, triage workflow, technical architecture, and installation steps.
* **`LICENSE`**: Official MIT License attribution to Bhadra Abu.
* **`.gitignore`**: Standard ignore rules for static and edge web deployments.
* **`docs/project-documentation.md`**: Detailed technical document explaining the spatial rules for gesture classification, 12-frame debouncing, Web Audio API chime generation, and `BroadcastChannel` sync.

Would you like any adjustments to the presentation slides reference or demo script for your pitch at **Hack Devengers 2.0**?