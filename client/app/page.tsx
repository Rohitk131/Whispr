'use client';

import DarkVeil from "@/components/DarkVeil";
import Navbar from "@/components/Navbar";
import { IconMicrophone } from '@tabler/icons-react';
import BlurText from "@/components/BlurText";
import DecryptedText from "@/components/DecryptedText";
import DarkGlossyButton from "@/components/Button";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [text, setText] = useState("Press start to begin...");
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');

  const ws = useRef<WebSocket | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Get WebSocket URL based on environment
  const getWebSocketUrl = () => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = process.env.NEXT_PUBLIC_WS_HOST || window.location.hostname;
    const port = process.env.NEXT_PUBLIC_WS_PORT || '8000';
    return `${protocol}//${host}:${port}/ws/transcribe/`;
  };

  // Function to start recording
  const startRecording = async () => {
    try {
      if (isRecording) return; // already running
      setError(null);
      setStatus('connecting');
      setText("Connecting to server...");

      // 🔹 1. Setup WebSocket connection
      const wsUrl = getWebSocketUrl();
      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        setStatus('connected');
        setText("Listening...");
        console.log("✅ WebSocket connected");
      };

      ws.current.onerror = (err) => {
        console.error("❌ WebSocket error", err);
        setError("Connection error. Please try again.");
        setStatus('error');
        stopRecording();
      };

      ws.current.onclose = () => {
        console.log("🔒 WebSocket closed");
        if (isRecording) {
          setError("Connection lost. Please try again.");
          setStatus('error');
          stopRecording();
        }
      };

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.error) {
            setError(data.error);
            return;
          }
          if (data.text?.trim()) {
            setText(prev => {
              const words = (prev + " " + data.text).split(" ");
              return words.slice(-100).join(" ").trim();
            });
          }
        } catch (err) {
          console.error("Message parse error:", err);
          setError("Failed to process server response");
        }
      };

      // 🔹 2. Capture microphone
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            channelCount: 1,
            sampleRate: 44100,
          } 
        });
        
        streamRef.current = stream;
        const audioCtx = new AudioContext();
        const source = audioCtx.createMediaStreamSource(stream);
        const processor = audioCtx.createScriptProcessor(2048, 1, 1);

        audioCtxRef.current = audioCtx;
        processorRef.current = processor;

        source.connect(processor);
        processor.connect(audioCtx.destination);

        // 🔹 3. Stream audio to backend
        processor.onaudioprocess = (e) => {
          if (ws.current?.readyState === WebSocket.OPEN) {
            const input = e.inputBuffer.getChannelData(0);
            // Convert Float32Array → Int16Array for better network efficiency
            const buffer = new ArrayBuffer(input.length * 2);
            const view = new DataView(buffer);
            for (let i = 0; i < input.length; i++) {
              const s = Math.max(-1, Math.min(1, input[i]));
              view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
            }
            ws.current.send(buffer);
          }
        };

        setIsRecording(true);
      } catch (err) {
        console.error("Microphone access error:", err);
        setError("Could not access microphone. Please check permissions.");
        setStatus('error');
        ws.current?.close();
      }
    } catch (err) {
      console.error("Recording error:", err);
      setError("Unexpected error during recording.");
      setStatus('error');
      ws.current?.close();
    }
  };

  // Function to stop recording
  const stopRecording = () => {
    setIsRecording(false);
    setStatus('idle');
    
    // Close WebSocket
    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }

    // Stop audio processing
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }

    // Close audio context
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }

    // Stop microphone
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    setText(prev => prev + "\n[Recording stopped]");
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden text-white">
      <DarkVeil />

      <div className="absolute inset-0 z-10 flex flex-col">
        <Navbar />

        <div className="flex flex-1 flex-col items-center justify-center px-4 text-center">

          <BlurText
            text="Turn your voice into text, instantly."
            delay={150}
            animateBy="words"
            direction="top"
            className="text-4xl md:text-5xl lg:text-6xl font-medium mb-2 px-4"
          />

          <DecryptedText
            text="Start Speaking. Stop Typing."
            animateOn="view"
            revealDirection="start"
            speed={80}
            maxIterations={30}
            className="text-sm md:text-base lg:text-lg"
          />

          {error && (
            <div className="w-full max-w-2xl bg-red-500/20 border border-red-500/50 rounded-lg p-3 mb-4 mx-4">
              <p className="text-red-400 text-sm md:text-base">{error}</p>
            </div>
          )}

          <div className="w-full max-w-2xl h-3/5 md:h-1/2 bg-black/40 border border-gray-800 rounded-lg flex mb-4 md:mb-6 mt-4 md:mt-6 p-3 md:p-4 mx-4">
            <p className="text-gray-400 text-sm md:text-base text-left whitespace-pre-wrap">{text}</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <DarkGlossyButton
              onClick={isRecording ? stopRecording : startRecording}
              disabled={status === 'connecting'}
              className={`flex flex-row gap-2 ${
                isRecording ? "bg-red-600" : ""
              } ${status === 'connecting' ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <IconMicrophone stroke={2} />
              {status === 'connecting' ? "Connecting..." :
               isRecording ? "Stop Recording" : "Start Recording"}
            </DarkGlossyButton>

            {status === 'connected' && (
              <span className="text-green-400 text-xs sm:text-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Connected
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
