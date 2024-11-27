import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login.jsx';
import AdminSidebar from './components/AdminSidebar.jsx';
import AdminDash from './AdminPages/AdminDash.jsx';
import AdminManagement from './AdminPages/AdminManagement.jsx';
import AdminAttendance from './AdminPages/AdminAttendance.jsx';
import AdminSchedule from './AdminPages/AdminSchedule.jsx';
import AdminReport from './AdminPages/AdminReport.jsx';
import AdminPayroll from './AdminPages/AdminPayroll.jsx';
import AuditLog from './AdminPages/AuditLog.jsx';
import Settings from './AdminPages/Settings.jsx';
import EmployeeSidebar from './components/EmployeeSidebar.jsx';
import EmployeeDash from './EmployeePages/EmployeeDash.jsx';
import EmployeeReservation from './EmployeePages/EmployeeReservation.jsx';
import ManageProduct from './EmployeePages/ManageProduct.jsx';
import AddProduct from './EmployeePages/AddProduct.jsx';
import SalesReport from './EmployeePages/SalesReport.jsx';
import BookingMainPage from './OnlineBookingPages/BookingMainPage.jsx';
import BillingPage from './OnlineBookingPages/BillingPage.jsx';
import CottageAndLodge from './OnlineBookingPages/CottageAndLodgePage.jsx';
import SignIn from './OnlineBookingPages/LoginForm.jsx';
import Register from './OnlineBookingPages/RegisterForm.jsx';
import Payment from './OnlineBookingPages/PaymentPage.jsx';
import About from './OnlineBookingPages/AboutUsPage.jsx';
import Terms from './OnlineBookingPages/TermsAndConditionPage.jsx';
import CalendarView from './EmployeePages/CalendarView.jsx';
import './index.css';

const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/adminSidebar" element={<AdminSidebar />} />

        {/* Admin-Only Routes */}
        <Route path="/AdminDash" element={<AdminDash />} />
        <Route path="/AdminPayroll" element={<AdminPayroll />} />
        <Route path="/AdminManagement" element={<AdminManagement />} />
        <Route path="/AdminAttendance" element={<AdminAttendance />} />
        <Route path="/AdminSchedule" element={<AdminSchedule />} />
        <Route path="/AdminReport" element={<AdminReport />} />
        <Route path="/AuditLog" element={<AuditLog />} />

        {/* Shared Routes (Admin and Employee) */}
        <Route path="/Settings" element={<Settings />} />
        <Route path="/employeeSidebar" element={<EmployeeSidebar />} />
        <Route path="/EmployeeDash" element={<EmployeeDash />} />
        <Route path="/EmployeeReservation" element={<EmployeeReservation />} />
        <Route path="/ManageProduct" element={<ManageProduct />} />
        <Route path="/AddProduct" element={<AddProduct />} />
        <Route path="/SalesReport" element={<SalesReport />} />

        {/* Public Pages */}
        <Route path="/booking" element={<BookingMainPage />} />
        <Route path="/book" element={<CottageAndLodge />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/billing" element={<BillingPage />} />
        <Route path="/about-us" element={<About />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/calendar/:title" element={<CalendarView />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
