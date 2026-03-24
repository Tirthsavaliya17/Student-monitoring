const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  
  // Student endpoints
  STUDENTS: `${API_BASE_URL}/api/students`,
  STUDENT_BY_ID: (id) => `${API_BASE_URL}/api/students/${id}`,
  
  // Staff endpoints
  STAFF: `${API_BASE_URL}/api/staff`,
  STAFF_BY_ID: (id) => `${API_BASE_URL}/api/staff/${id}`,
  
  // Student Mentor endpoints
  STUDENT_MENTOR: `${API_BASE_URL}/api/studentmentor`,
  STUDENT_MENTOR_BY_ID: (id) => `${API_BASE_URL}/api/studentmentor/${id}`,
  
  // Student Mentoring endpoints
  STUDENT_MENTORING: `${API_BASE_URL}/api/studentmentoring`,
  STUDENT_MENTORING_BY_ID: (id) => `${API_BASE_URL}/api/studentmentoring/${id}`,
};

export default API_BASE_URL;
