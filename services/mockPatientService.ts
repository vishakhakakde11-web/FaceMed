
import { Patient } from '../types';

const mockPatient: Patient = {
  id: 'PAT-001',
  name: 'Jane Doe',
  dateOfBirth: '1985-05-22',
  bloodType: 'O+',
  allergies: ['Peanuts', 'Penicillin'],
  profileImageUrl: 'https://picsum.photos/seed/janedoe/200/200',
  medicalHistory: [
    {
      id: 'REC-005',
      date: '2024-05-10',
      type: 'Check-up',
      summary: 'Annual physical examination. All vitals are normal. Recommended to continue current lifestyle.',
      doctor: 'Dr. Evelyn Reed',
    },
    {
      id: 'REC-004',
      date: '2023-11-20',
      type: 'Lab Results',
      summary: 'Blood panel results show slightly elevated cholesterol. Discussed dietary changes.',
      doctor: 'Dr. Evelyn Reed',
    },
    {
      id: 'REC-003',
      date: '2023-03-15',
      type: 'Prescription',
      summary: 'Prescribed Amoxicillin for a bacterial infection.',
      doctor: 'Dr. Ben Carter',
    },
    {
      id: 'REC-002',
      date: '2022-09-01',
      type: 'Emergency Visit',
      summary: 'Treated for a minor wrist fracture from a fall. Cast applied.',
      doctor: 'Dr. Maria Garcia',
    },
    {
      id: 'REC-001',
      date: '2021-06-05',
      type: 'Surgery',
      summary: 'Appendectomy procedure. Successful, with no complications.',
      doctor: 'Dr. Robert Chen',
    },
  ],
};

export const getPatientData = (): Promise<Patient> => {
  return new Promise((resolve, reject) => {
    // Simulate a successful API call
    setTimeout(() => {
      resolve(mockPatient);
    }, 500);
    // To test error handling, uncomment the line below
    // reject(new Error('Patient not found in the database.'));
  });
};
