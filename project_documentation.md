# DeafCare — Technical Project Documentation

## Project Summary
* **Project:** DeafCare
* **Author:** Bhadra Abu
* **Hackathon:** Hack Devengers 2.0
* **Demo URL:** https://deafcare4u.netlify.app

---

## System Architecture & Data Architecture

DeafCare runs entirely on client-side web standards, allowing zero-latency prototyping across browser tabs without needing external backend servers during hackathon testing.

### Event Architecture
When an action is performed on the Patient Interface:
1. `dispatchRequest(type, urgency)` is invoked.
2. The request payload is stored in `localStorage` under active requests.
3. A `BroadcastChannel('deafcare_channel')` message is posted.
4. The Care Team tab listens to `deafcare_channel.onmessage`, triggers a visual/audio alert, and updates its DOM queue.
5. When staff respond, the response payload is posted back over the channel, triggering a UI state update on the Patient Interface.

---

## Gesture Recognition Mapping

Gesture classification is handled in real-time by processing the 21 3D hand landmarks emitted by MediaPipe Hands.

| Request | Gesture Target | Landmark Condition |
| :--- | :--- | :--- |
| **HELP** | Open Palm | All 5 fingers fully extended |
| **DOCTOR** | Pointing Index | Index finger extended; middle, ring, pinky curled |
| **MEDICINE** | Thumbs Up | Thumb extended upward; all four fingers curled |
| **WATER** | Closed Fist | All 5 fingers fully curled towards palm |
| **PAIN** | Hand-to-Chest | Hand landmark center depth/position near chest area |

---

## Code Annotations & Implementation Notes

### Request Types & Urgency Levels
```javascript
const REQUEST_TYPES = {
  HELP:     { label: 'HELP',     urgency: 'HIGH' },
  PAIN:     { label: 'PAIN',     urgency: 'HIGH' },
  DOCTOR:   { label: 'DOCTOR',   urgency: 'MEDIUM' },
  MEDICINE: { label: 'MEDICINE', urgency: 'MEDIUM' },
  WATER:    { label: 'WATER',    urgency: 'LOW' }
};
```

### Demo Security Note
```javascript
// NOTE FOR DEVELOPERS:
// The Staff PIN validation below is strictly for hackathon UI workflow demonstration.
// Do NOT treat this client-side check as production security.
const DEMO_STAFF_PIN = "1234"; 
```
