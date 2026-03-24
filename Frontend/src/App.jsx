import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ProtectedRoute from './routes/ProtectedRoutes';
// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageMentors from './pages/admin/ManageMentors';
import AddMentor from './pages/admin/AddMentor';
import EditMentor from './pages/admin/EditMentor';
import MentorMenteesList from './pages/admin/MentorMenteesList';
import ManageStudents from './pages/admin/ManageStudents';
import EnrollStudent from './pages/admin/EnrollStudent';
import EditStudent from './pages/admin/EditStudent';
import Sessions from './pages/admin/Sessions';
import AssignMentor from './pages/admin/AssignMentor';
import MentorSessions from './pages/admin/MentorSessions';
import Reports from './pages/admin/Reports';

// Mentor Pages
import MentorDashboard from './pages/mentor/MentorDashboard';
import AssignedStudents from './pages/mentor/AssignedStudents';
import ScheduleSession from './pages/mentor/ScheduleSession';
import SessionHistory from './pages/mentor/SessionHistory';
import AttendMentoring from './pages/mentor/AttendMentoring';
import MentorFeedback from './pages/mentor/MentorFeedback';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import AssignedMentor from './pages/student/AssignedMentor';
import UpcomingSessions from './pages/student/UpcomingSessions';
import Feedback from './pages/student/Feedback';
// Layout Wrapper
import DashboardLayout from './components/Layout/DashboardLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />


        {/* ADMIN ROUTES */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route element={<DashboardLayout />}>

            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/mentors" element={<ManageMentors />} />
            <Route path="/admin/mentors/add" element={<AddMentor />} />
            <Route path="/admin/mentors/edit/:id" element={<EditMentor />} />
            <Route path="/admin/mentors/:id/mentees" element={<MentorMenteesList />} />
            <Route path="/admin/students" element={<ManageStudents />} />
            <Route path="/admin/students/enroll" element={<EnrollStudent />} />
            <Route path="/admin/students/edit/:id" element={<EditStudent />} />
            <Route path="/admin/sessions" element={<Sessions />} />
            <Route path="/admin/assign-mentor" element={<AssignMentor />} />
            <Route path="/admin/sessions/mentor/:staffId" element={<MentorSessions />} />
            <Route path="/admin/reports" element={<Reports />} />

          </Route>
        </Route>


        {/* MENTOR ROUTES */}
        <Route element={<ProtectedRoute allowedRoles={['staff']} />}>
          <Route element={<DashboardLayout />}>

            <Route path="/mentor" element={<Navigate to="/mentor/dashboard" replace />} />
            <Route path="/mentor/dashboard" element={<MentorDashboard />} />
            <Route path="/mentor/students" element={<AssignedStudents />} />
            <Route path="/mentor/sessions" element={<MentorDashboard />} />
            <Route path="/mentor/schedule" element={<ScheduleSession />} />
            <Route path="/mentor/attend" element={<AttendMentoring />} />
            <Route path="/mentor/history" element={<SessionHistory />} />
            <Route path="/mentor/feedback" element={<MentorFeedback />} />

          </Route>
        </Route>


        {/* STUDENT ROUTES */}
        <Route element={<ProtectedRoute allowedRoles={['student']} />}>
          <Route element={<DashboardLayout />}>

            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/student/mentor" element={<AssignedMentor />} />
            <Route path="/student/sessions" element={<UpcomingSessions />} />
            <Route path="/student/feedback" element={<Feedback />} />

          </Route>
        </Route>


        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
