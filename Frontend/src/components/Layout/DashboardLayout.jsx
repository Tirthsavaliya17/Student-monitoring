import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../Sidebar/Sidebar';
import Footer from '../Footer/Footer';
// import styles from './DashboardLayout.module.css';
import { IconDashboard, IconUsers, IconCalendar, IconBook, IconTrendingUp, IconCheckCircle } from '../Icons/Icons';

const DashboardLayout = () => {
  const [userName, setUserName] = useState('');
  const [role, setRole] = useState('');
  const [email , setEmail] = useState('');
  const [data , setData] = useState('');
  const [links, setLinks] = useState([]);

  // Determine role based on URL path for correct Sidebar links and Navbar details
  // let role = 'Student';
  // let userName = 'User Name';
  // let links = [];

  const adminLinks = [
    { label: 'Admin Dashboard', path: '/admin', icon: <IconDashboard size={18} /> },
    { label: 'Manage Mentors', path: '/admin/mentors', icon: <IconUsers size={18} /> },
    { label: 'Manage Students', path: '/admin/students', icon: <IconUsers size={18} /> },
    { label: 'Assign Mentor', path: '/admin/assign-mentor', icon: <IconUsers size={18} /> },
    { label: 'Sessions', path: '/admin/sessions', icon: <IconCalendar size={18} /> },
    { label: 'Reports', path: '/admin/reports', icon: <IconTrendingUp size={18} /> }
  ];

  const mentorLinks = [
    { label: 'Dashboard', path: '/mentor/dashboard', icon: <IconDashboard size={18} /> },
    { label: 'Assigned Students', path: '/mentor/students', icon: <IconUsers size={18} /> },
    { label: 'Schedule Session', path: '/mentor/schedule', icon: <IconCalendar size={18} /> },
    { label: 'Attend Mentoring', path: '/mentor/attend', icon: <IconCheckCircle size={18} /> },
    { label: 'Session History', path: '/mentor/history', icon: <IconBook size={18} /> },
    { label: 'Feedback', path: '/mentor/feedback', icon: <IconBook size={18} /> }
  ];

  const studentLinks = [
    { label: 'Student Profile', path: '/student', icon: <IconDashboard size={18} /> },
    { label: 'My Mentoring', path: '/student/mentor', icon: <IconUsers size={18} /> },
    { label: 'Session Records', path: '/student/sessions', icon: <IconCalendar size={18} /> },
    { label: 'Feedback', path: '/student/feedback', icon: <IconBook size={18} /> },
  ];

  useEffect(() => {

    fetch("http://localhost:3000/api/auth/me", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => res.json())
      .then(data => {
        setData(data);
        setUserName(data.user.userName);
        setRole(data.role);
        setEmail(data.user.EmailAddress);

        if (data.role === "admin") {
          setLinks(adminLinks)
        }
        else if (data.role === "staff") {
          setLinks(mentorLinks)
        }
        else {
          setLinks(studentLinks)
        }

      });

  }, []);

  return (
    <div className="layout-container">
      <div className="bg-grid"></div>
      <Sidebar links={links} />
      <div className="layout-main">
        <Navbar role={role} userName={userName} email={email}/>
        <main className="layout-content">
          <Outlet context={data}/>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;
