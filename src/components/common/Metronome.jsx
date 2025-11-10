import { useState, useEffect, useRef } from "react";
import { Knob } from "primereact/knob";
// Assuming these imports work correctly for your build system (e.g., Vite/Webpack)
import TokSound from "../../assets/sound/Tok.mp3";
import PropTypes from "prop-types";
import { CgChevronLeft } from "react-icons/cg";

const Metronome = ({ initialBPM = 120, timeSignature = 4 }) => {
  const [show, setShow] = useState(false);

  // State variables
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBPM] = useState(initialBPM);
  const [signature, setSignature] = useState(timeSignature);
  const [currentBeat, setCurrentBeat] = useState(1);

  // Refs for audio context and timing
  const audioContextRef = useRef(null);
  const nextBeatTimeRef = useRef(0.0);
  const timerIdRef = useRef(null);

  // Single ref for the decoded audio buffer (using TokSound)
  const beatBufferRef = useRef(null); // Will hold the TokSound data

  // --- AUDIO UTILITY FUNCTIONS ---

  // 1. Function to fetch and decode an audio file
  const loadSound = async (url, audioContext) => {
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      return await audioContext.decodeAudioData(arrayBuffer);
    } catch (e) {
      console.error(`Error loading sound from ${url}:`, e);
      return null;
    }
  };

  // 2. Modified function to play the sound with an adjustable pitch (playbackRate)
  // pitchRate: 1.0 is original pitch, < 1.0 is lower pitch.
  const playSound = (buffer, time, pitchRate = 1.0, volume = 1.0) => {
    if (!buffer) return;

    const audioContext = audioContextRef.current;

    const source = audioContext.createBufferSource();
    source.buffer = buffer;

    // 🔥 NEW: Set the playback rate to change the pitch
    source.playbackRate.setValueAtTime(pitchRate, audioContext.currentTime);

    const gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(volume, audioContext.currentTime);

    source.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Schedule the playback
    source.start(time);
  };

  // 3. Initialize AudioContext and Load Sound on mount
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext ||
      window.webkitAudioContext)();
    const audioContext = audioContextRef.current;

    const loadFiles = async () => {
      // Load ONLY the TokSound into the single beatBufferRef
      beatBufferRef.current = await loadSound(TokSound, audioContext);
    };
    loadFiles();

    return () => {
      // Cleanup context on unmount
      audioContext.close();
    };
  }, []); // Dependencies remain: []

  // 2. Function to update the visual beat indicator
  const updateVisuals = (beat) => {
    // We use a state update for the visual indicator
    setCurrentBeat(beat);
  };

  // 3. Main Metronome Logic (Scheduling Loop)
  useEffect(() => {
    if (!isPlaying) {
      window.clearTimeout(timerIdRef.current);
      return;
    }

    const audioContext = audioContextRef.current;

    if (audioContext.state === "suspended") {
      audioContext.resume();
    }

    let beatNumber = 1;
    let currentNextBeatTime = audioContext.currentTime + 0.05;

    const scheduler = () => {
      const secondsPerBeat = 60.0 / bpm;
      const lookahead = 0.1;

      while (currentNextBeatTime < audioContext.currentTime + lookahead) {
        // Determine if this is the accented beat
        const isDownbeat = beatNumber === 1;

        // 🔥 NEW: Define the playback rate for the beat
        // 1.0 is original (accented) pitch
        // 0.8 is a lower pitch (unaccented beat)
        const pitchRate = isDownbeat ? 1.0 : 0.8;

        // Play the single buffer with the determined pitch rate
        playSound(beatBufferRef.current, currentNextBeatTime, pitchRate);

        // Update visual state
        updateVisuals(beatNumber);

        // Increment the time and beat count for the next iteration
        currentNextBeatTime += secondsPerBeat;

        beatNumber++;
        if (beatNumber > signature) {
          beatNumber = 1;
        }
      }

      // Store the updated time for the next loop iteration
      nextBeatTimeRef.current = currentNextBeatTime;

      // Loop the scheduler
      timerIdRef.current = window.setTimeout(scheduler, 25);
    };

    // Start the loop
    scheduler();

    return () => window.clearTimeout(timerIdRef.current);
  }, [isPlaying, bpm, signature]); // Dependencies remain: [isPlaying, bpm, timeSignature]

  // Render the UI
  return (
    <div className={` lyrics-width c-bg-2 w-full md:w-122 ${show ? "p-4" : "p-2 px-4"} rounded-md border c-border overscroll-contain space-y-4 shadow-lg`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {show && (
            <div
              className={`flex items-center justify-center metronomeSpin`}
              style={{
                width: "20px",
                height: "20px",
                border: "10px solid",
                borderRadius: "50%",
                borderColor:
                  currentBeat === 1
                    ? "red" // Accent beat
                    : currentBeat > 1 && isPlaying
                    ? "yellow" // Regular beat
                    : "gray",
                animationDuration: bpm / 60,
                animationPlayState: isPlaying,
              }}
            >
              {/*<div className="metronome" style={{animationDuration:bpm/60,animationPlayState:isPlaying,}}></div>*/}
            </div>
          )}
          <h1
            className={`${
              show ? "text-xl" : "text-lg"
            } transition-all font-semibold`}
          >
            Metronome
          </h1>
        </div>
        <button>
          <CgChevronLeft
            size={20}
            onClick={() => setShow(!show)}
            className={`${!show ? "-rotate-90" : "rotate-90"} transition-all`}
          />
        </button>
      </div>

      {show && (
        <>
          <div className="flex items-center justify-center">
            <div className="flex items-center justify-center gap-4">
              <div>
                <p className="text-center mb-2">Beat</p>
                <input
                  type="number"
                  className="w-full text-center text-2xl c-bg-2 border c-border rounded-md"
                  value={signature}
                  max={30}
                  min={1}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (value > 30) setSignature(30);
                    else setSignature(value);
                  }}
                  disabled={isPlaying}
                />
              </div>
              <div className="flex items-center justify-center relative">
                <Knob
                  value={bpm}
                  onChange={(e) => setBPM(e.value)}
                  min={10}
                  max={250}
                  className="z-10"
                />
              </div>
              <div>
                <p className="text-center mb-2">BPM</p>
                <input
                  type="number"
                  className="w-full text-center text-2xl c-bg-2 border c-border rounded-md"
                  value={bpm}
                  max={250}
                  min={1}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (value > 100) setBPM(100);
                    else setBPM(value);
                  }}
                  disabled={isPlaying}
                />
              </div>
            </div>
            {/* Visual indicator tied to currentBeat for visual feedback */}
          </div>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-2 w-full h-8 rounded border-transparent shadow-sm c-primary c-reverse transition-all"
          >
            {isPlaying ? "Pause" : "Start"}
          </button>
        </>
      )}
    </div>
  );
};

Metronome.propTypes = {
  initialBPM: PropTypes.number,
  timeSignature: PropTypes.number,
};

export default Metronome;
