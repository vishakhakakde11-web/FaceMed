
import React, { useRef, useEffect } from 'react';
import { CameraIcon, SpinnerIcon } from './Icons';

interface CameraFeedProps {
  onDetect: () => void;
  isLoading: boolean;
}

const CameraFeed: React.FC<CameraFeedProps> = ({ onDetect, isLoading }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        // Here you might want to set an error state in the parent component
      }
    };

    startCamera();

    return () => {
      // Cleanup: stop camera stream when component unmounts
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center animate-fade-in">
      <div className="relative w-full max-w-lg aspect-video bg-slate-900 rounded-lg overflow-hidden shadow-lg mb-6 border-4 border-slate-200">
        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover"></video>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 max-w-xs aspect-[3/4] border-4 border-dashed border-white/50 rounded-2xl opacity-75"></div>
        <p className="absolute bottom-4 left-4 text-white font-semibold bg-black/30 px-3 py-1 rounded-md">Live Feed</p>
      </div>
      <button
        onClick={onDetect}
        disabled={isLoading}
        className="w-full max-w-xs bg-green-600 text-white font-bold py-3 px-6 rounded-full hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <SpinnerIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
            Detecting...
          </>
        ) : (
          <>
            <CameraIcon className="w-6 h-6 mr-2" />
            Detect Patient
          </>
        )}
      </button>
    </div>
  );
};

export default CameraFeed;
