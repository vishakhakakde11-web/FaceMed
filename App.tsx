import React, { useState, useCallback } from 'react';
import { Patient } from './types';
import { getPatientData } from './services/mockPatientService';
import CameraFeed from './components/CameraFeed';
import PatientRecords from './components/PatientRecords';
import { UserScanIcon } from './components/Icons';

const App: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStartScan = useCallback(() => {
    setIsScanning(true);
    setPatient(null);
    setError(null);
  }, []);

  const handleDetectPatient = useCallback(() => {
    setIsLoading(true);
    setError(null);
    setTimeout(async () => {
      try {
        const patientData = await getPatientData();
        setPatient(patientData);
        setIsScanning(false);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred.');
        }
        setIsScanning(false);
      } finally {
        setIsLoading(false);
      }
    }, 2000); // Simulate network delay for recognition
  }, []);

  const handleUpdatePatient = useCallback((updatedPatient: Patient) => {
    setPatient(updatedPatient);
  }, []);

  const handleReset = useCallback(() => {
    setPatient(null);
    setIsScanning(false);
    setIsLoading(false);
    setError(null);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 font-sans p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-500">
        <header className="bg-slate-800 p-4 sm:p-6 text-white text-center">
          <h1 className="text-2xl sm:text-3xl font-bold">Patient Record System</h1>
          <p className="text-slate-300 mt-1">Facial Recognition Check-in</p>
        </header>
        
        <main className="p-6 sm:p-8">
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md" role="alert">
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          )}

          {!isScanning && !patient && (
            <div className="text-center flex flex-col items-center animate-fade-in">
              <UserScanIcon className="w-24 h-24 text-blue-500 mb-6" />
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-700 mb-2">Ready to Scan Patient</h2>
              <p className="text-slate-500 mb-8 max-w-md mx-auto">
                Please position the patient's face in front of the camera and start the scan to retrieve their medical records.
              </p>
              <button
                onClick={handleStartScan}
                className="bg-blue-600 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Start Facial Scan
              </button>
            </div>
          )}

          {isScanning && (
            <CameraFeed onDetect={handleDetectPatient} isLoading={isLoading} />
          )}

          {patient && (
            <PatientRecords 
              patient={patient} 
              onReset={handleReset} 
              onUpdatePatient={handleUpdatePatient}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;