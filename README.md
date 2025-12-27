# WebRTC Video Call App

A peer-to-peer video and voice calling application built using WebRTC. The app allows two users to join a shared room and communicate directly with real-time audio and video.

## Features
- One-to-one video calling
- Inbuilt voice (audio) calling
- Peer-to-peer connection using WebRTC
- Room-based call system
- Low-latency real-time communication

## Tech Stack
- React (Frontend)
- Express.js (Backend)
- WebRTC
- Socket-based signaling

## How It Works
Users join a common room to start a call. The Express server handles signaling for exchanging SDP offers, answers, and ICE candidates. Once the connection is established, audio and video streams are sent directly between the two peers using WebRTC.

## Use Cases
- One-to-one video calls
- Voice-only calls
- Learning WebRTC and P2P communication
- Real-time communication demos

## License
ISC

## Author
**Jitendra Prajapati**
