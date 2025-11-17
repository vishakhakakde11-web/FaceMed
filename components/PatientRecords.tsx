import React, { useState } from 'react';
import { Patient, MedicalRecord } from '../types';
import { 
  FileTextIcon, PillIcon, StethoscopeIcon, ActivityIcon, AlertTriangleIcon, 
  SyringeIcon, ArrowLeftIcon, EditIcon, SaveIcon, XIcon, DownloadIcon 
} from './Icons';

declare global {
  interface Window {
    jspdf: any;
  }
}

interface PatientRecordsProps {
  patient: Patient;
  onReset: () => void;
  onUpdatePatient: (patient: Patient) => void;
}

const getRecordIcon = (type: MedicalRecord['type']) => {
  switch (type) {
    case 'Check-up':
      return <StethoscopeIcon className="w-6 h-6 text-blue-500" />;
    case 'Lab Results':
      return <FileTextIcon className="w-6 h-6 text-purple-500" />;
    case 'Prescription':
      return <PillIcon className="w-6 h-6 text-green-500" />;
    case 'Surgery':
        return <SyringeIcon className="w-6 h-6 text-red-500" />;
    case 'Emergency Visit':
      return <ActivityIcon className="w-6 h-6 text-orange-500" />;
    default:
      return <FileTextIcon className="w-6 h-6 text-slate-500" />;
  }
};

const PatientRecords: React.FC<PatientRecordsProps> = ({ patient, onReset, onUpdatePatient }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPatient, setEditedPatient] = useState<Patient>(patient);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedPatient(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAllergiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const allergiesArray = value.split(',').map(s => s.trim()).filter(Boolean);
    setEditedPatient(prev => ({...prev, allergies: allergiesArray}));
  };

  const handleSave = () => {
    onUpdatePatient(editedPatient);
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setEditedPatient(patient);
    setIsEditing(false);
  };

  const handleDownloadPdf = () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const margin = 15;
    let y = margin;

    doc.setFontSize(22);
    doc.text(`Medical Report`, doc.internal.pageSize.getWidth() / 2, y, { align: 'center' });
    y += 10;

    doc.setFontSize(16);
    doc.text(patient.name, margin, y += 8);
    
    doc.setLineWidth(0.5);
    doc.line(margin, y + 2, doc.internal.pageSize.getWidth() - margin, y + 2);
    y += 10;
    
    doc.setFontSize(12);
    doc.text(`Date of Birth: ${patient.dateOfBirth}`, margin, y);
    doc.text(`Blood Type: ${patient.bloodType}`, doc.internal.pageSize.getWidth() - margin, y, { align: 'right' });
    y += 8;
    doc.text(`Allergies: ${patient.allergies.join(', ') || 'None'}`, margin, y);
    y += 15;

    doc.setFontSize(14);
    doc.text('Medical History', margin, y);
    y += 5;
    doc.setLineWidth(0.2);
    doc.line(margin, y, doc.internal.pageSize.getWidth() - margin, y);
    y += 8;

    patient.medicalHistory.forEach(record => {
      if (y > 270) { // Check for page break
        doc.addPage();
        y = margin;
      }
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text(record.type, margin, y);
      doc.setFont(undefined, 'normal');
      doc.text(record.date, doc.internal.pageSize.getWidth() - margin, y, { align: 'right' });
      y += 6;

      doc.setFontSize(10);
      const summaryLines = doc.splitTextToSize(record.summary, doc.internal.pageSize.getWidth() - margin * 2);
      doc.text(summaryLines, margin, y);
      y += summaryLines.length * 4 + 2;
      
      doc.setTextColor(150);
      doc.text(`Attending: ${record.doctor}`, margin, y);
      y += 10;
      doc.setTextColor(0);
    });

    doc.save(`Medical_Report_${patient.name.replace(' ', '_')}.pdf`);
  };

  return (
    <div className="animate-fade-in-up">
      <div className="relative flex flex-col sm:flex-row items-center bg-slate-100 p-6 rounded-xl mb-6">
        <div className="absolute top-4 right-4 flex items-center gap-2">
        {isEditing ? (
            <>
              <button onClick={handleSave} className="p-2 rounded-full bg-green-200 text-green-700 hover:bg-green-300 transition-colors" aria-label="Save changes">
                <SaveIcon className="w-5 h-5" />
              </button>
              <button onClick={handleCancel} className="p-2 rounded-full bg-red-200 text-red-700 hover:bg-red-300 transition-colors" aria-label="Cancel editing">
                <XIcon className="w-5 h-5" />
              </button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)} className="p-2 rounded-full bg-slate-200 text-slate-700 hover:bg-slate-300 transition-colors" aria-label="Edit patient details">
              <EditIcon className="w-5 h-5" />
            </button>
          )}
        </div>
        <img
          src={patient.profileImageUrl}
          alt={patient.name}
          className="w-28 h-28 rounded-full border-4 border-white shadow-md mb-4 sm:mb-0 sm:mr-6"
        />
        <div className="text-center sm:text-left w-full">
          {isEditing ? (
            <div className="space-y-2">
              <input type="text" name="name" value={editedPatient.name} onChange={handleInputChange} className="text-3xl font-bold text-slate-800 bg-white border border-slate-300 rounded-md px-2 py-1 w-full" />
              <div className="flex flex-col sm:flex-row gap-2">
                <input type="text" name="dateOfBirth" value={editedPatient.dateOfBirth} onChange={handleInputChange} className="text-slate-600 bg-white border border-slate-300 rounded-md px-2 py-1 w-full" placeholder="DOB: YYYY-MM-DD" />
                <input type="text" name="bloodType" value={editedPatient.bloodType} onChange={handleInputChange} className="text-slate-600 bg-white border border-slate-300 rounded-md px-2 py-1 w-full" placeholder="Blood Type"/>
              </div>
              <input type="text" name="allergies" value={editedPatient.allergies.join(', ')} onChange={handleAllergiesChange} className="text-slate-600 bg-white border border-slate-300 rounded-md px-2 py-1 w-full" placeholder="Allergies (comma-separated)" />
            </div>
          ) : (
            <>
              <h2 className="text-3xl font-bold text-slate-800">{patient.name}</h2>
              <p className="text-slate-600">DOB: {patient.dateOfBirth} | Blood Type: {patient.bloodType}</p>
              {patient.allergies.length > 0 && (
                <div className="mt-2 flex items-center justify-center sm:justify-start gap-2 text-red-600">
                  <AlertTriangleIcon className="w-5 h-5" />
                  <span className="font-semibold">Allergies: {patient.allergies.join(', ')}</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4 border-b-2 pb-2">
            <h3 className="text-xl font-semibold text-slate-700">Medical History</h3>
            <button onClick={handleDownloadPdf} className="flex items-center gap-2 bg-blue-100 text-blue-700 font-semibold py-1 px-3 rounded-full hover:bg-blue-200 transition-colors text-sm">
                <DownloadIcon className="w-4 h-4" />
                Download PDF
            </button>
        </div>
        <ul className="space-y-4 max-h-80 overflow-y-auto pr-2">
          {patient.medicalHistory.map((record) => (
            <li key={record.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-300 transition-all">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 bg-slate-100 rounded-full p-3">
                    {getRecordIcon(record.type)}
                </div>
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                     <p className="font-bold text-slate-800">{record.type}</p>
                     <p className="text-sm text-slate-500 sm:ml-4">{record.date}</p>
                  </div>
                  <p className="text-sm text-slate-600 mt-1">{record.summary}</p>
                  <p className="text-xs text-slate-400 mt-2">Attending: {record.doctor}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={onReset}
          className="bg-slate-600 text-white font-bold py-3 px-8 rounded-full hover:bg-slate-700 focus:outline-none focus:ring-4 focus:ring-slate-300 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center mx-auto"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Scan New Patient
        </button>
      </div>
    </div>
  );
};

export default PatientRecords;