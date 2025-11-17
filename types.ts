
export interface MedicalRecord {
  id: string;
  date: string;
  type: 'Check-up' | 'Lab Results' | 'Prescription' | 'Surgery' | 'Emergency Visit';
  summary: string;
  doctor: string;
}

export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  bloodType: string;
  allergies: string[];
  profileImageUrl: string;
  medicalHistory: MedicalRecord[];
}
