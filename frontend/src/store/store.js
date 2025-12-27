import { create } from "zustand"
import { socket } from "./socket"
// import { } from ""
export const store = create((set, get) => ({
    user: null,
    peer: new RTCPeerConnection({
        iceServers: [
            { urls: ["stun:stun.l.google.com:19302", "stun:global.stun.twilio.com:3478"] },
        ],
    }),
    onjoin: async (data) => {
        console.log(data)
        set({ user: data })
        // Socket.on("user-join")
    },
    checkuser:async()=>{
      const userData = localStorage.getItem("user");
      userData && set({user:JSON.parse(userData)}) 
    },
    createOffer: async () => {
        const offer = await get().peer.createOffer()
        await get().peer.setLocalDescription(new RTCSessionDescription(offer));
        return offer;
    },
    createAnswer: async (offer) => {
        await get().peer.setRemoteDescription(offer);
        const answer = await get().peer.createAnswer();
        await get().peer.setLocalDescription(new RTCSessionDescription(answer));
        return answer;
    },
    setAnswer: async (answer) => {
        await get().peer.setRemoteDescription(new RTCSessionDescription(answer));
    },
    
}))