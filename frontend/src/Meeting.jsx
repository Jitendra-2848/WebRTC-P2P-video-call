import React, { useEffect, useRef, useState, useCallback } from "react";
import { socket } from "./store/socket";
import { store } from "./store/store";
import { useParams } from "react-router-dom";

const Meeting = () => {
  const myVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const [Mystream, setMystream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [remoteSocketId, setRemoteSocketId] = useState(null);

  const [isNegotiating, setIsNegotiating] = useState(false);

  const { user, createOffer, createAnswer, setAnswer, peer } = store();
  const { id } = useParams();


  useEffect(() => {
    if (myVideoRef.current && Mystream) {
      myVideoRef.current.srcObject = Mystream;
    }
  }, [Mystream]);

  useEffect(() => {
    const handleTrack = (event) => {
      const [stream] = event.streams;
      setRemoteStream(stream);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;
      }
    };
    peer.addEventListener("track", handleTrack);
    return () => peer.removeEventListener("track", handleTrack);
  }, [peer]);

  useEffect(() => {
    const handleStateChange = () => {
      if (peer.signalingState === "stable") {
        setIsNegotiating(false);
      }
    };
    peer.addEventListener("signalingstatechange", handleStateChange);
    return () => peer.removeEventListener("signalingstatechange", handleStateChange);
  }, [peer]);

  const handleNegotiationNeeded = useCallback(async () => {
    if (peer.signalingState !== "stable" || isNegotiating) {
      return;
    }

    setIsNegotiating(true);
    try {
      const offer = await createOffer();
      socket.emit("negoNeed", { To: remoteSocketId, offer });
    } catch (err) {
      setIsNegotiating(false);
    }
  }, [remoteSocketId, createOffer, isNegotiating]);

  useEffect(() => {
    peer.addEventListener("negotiationneeded", handleNegotiationNeeded);
    return () => peer.removeEventListener("negotiationneeded", handleNegotiationNeeded);
  }, [handleNegotiationNeeded]);

  const callUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    stream.getTracks().forEach(track => {
      peer.addTrack(track, stream);
    });

    setMystream(stream);

    const offer = await createOffer();
    socket.emit("outgoingCall", { To: remoteSocketId, offer });
  }, [remoteSocketId, createOffer]);

  const handleIncomingCall = useCallback(async ({ from, offer }) => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });

    stream.getTracks().forEach(track => peer.addTrack(track, stream));

    setMystream(stream);
    setRemoteSocketId(from);

    const answer = await createAnswer(offer);
    socket.emit("answere", { To: from, ans: answer });
  }, [createAnswer]);

  const handleCallAccepted = useCallback(({ ans }) => {
    setAnswer(ans);
  }, [setAnswer]);

  const handleNegoIncoming = useCallback(async ({ offer }) => {
    const ans = await createAnswer(offer);
    socket.emit("negoAns", { To: remoteSocketId, ans });
  }, [remoteSocketId, createAnswer]);

  const handleNegoFinal = useCallback(async ({ ans }) => {
    await setAnswer(ans);
  }, [setAnswer]);

  useEffect(() => {
    socket.on("user-joined", (data) => setRemoteSocketId(data.Id));
    socket.on("incoming-call", handleIncomingCall);
    socket.on("call-accepted", handleCallAccepted);
    socket.on("negoInco", handleNegoIncoming);
    socket.on("negoAccept", handleNegoFinal);

    return () => {
      socket.off("user-joined");
      socket.off("incoming-call");
      socket.off("call-accepted");
      socket.off("negoInco");
      socket.off("negoAccept");
    };
  }, [handleIncomingCall, handleCallAccepted, handleNegoIncoming, handleNegoFinal]);

  useEffect(() => {
    socket.emit("room-join", user);
  }, [user]);

  return (
    <div className="flex flex-col space-y-11 my-10 justify-center items-center">
      <h1 className="text-6xl font-semibold">Welcome in {id}</h1>
      <h1 className="text-4xl font-semibold">
        {remoteSocketId ? "Connected" : "No one in room"}
      </h1>

      {remoteSocketId && (
        <button
          onClick={callUser}
          className="px-8 py-4 bg-green-600 text-white rounded-xl font-bold text-2xl hover:bg-green-700"
        >
          START VIDEO CALL
        </button>
      )}

      <div className="flex gap-20">
        {Mystream && (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4 text-green-400">YOU</h2>
            <video
              ref={myVideoRef}
              autoPlay
              playsInline
              muted
              className="w-96 h-96 bg-black rounded-xl object-cover scale-x-[-1]"
            />
          </div>
        )}

        {remoteStream && (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4 text-blue-400">REMOTE USER</h2>
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-96 h-96 bg-black rounded-xl object-cover scale-x-[-1]"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Meeting;