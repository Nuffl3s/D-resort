import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login.jsx';
import AdminDash from './AdminPages/AdminDash.jsx';
import AdminList from './AdminPages/AdminList.jsx';
import AdminAttendance from './AdminPages/AdminAttendance.jsx';
import AdminSchedule from './AdminPages/AdminSchedule.jsx';
import AdminReport from './AdminPages/AdminReport.jsx';
import AdminPayroll from './AdminPages/AdminPayroll.jsx';
import AdminAddUnit from './AdminPages/AdminAddUnit.jsx';
import AuditLog from './AdminPages/AuditLog.jsx';
import Settings from './AdminPages/Settings.jsx';
import EmployeeSidebar from './components/EmployeeSidebar.jsx';
import EmployeeDash from './EmployeePages/EmployeeDash.jsx';
import EmployeeReservation from './EmployeePages/EmployeeReservation.jsx';
import ProductList from './EmployeePages/ProductList.jsx';
import AddProduct from './AdminPages/AddProduct.jsx';
import ManageProduct from './EmployeePages/ManageProduct.jsx';
import SalesReport from './EmployeePages/SalesReport.jsx';
import BookingReport from './EmployeePages/BookingReport.jsx';
import BookingMainPage from './OnlineBookingPages/BookingMainPage.jsx';
import BillingPage from './OnlineBookingPages/BillingPage.jsx';
import CottageAndLodge from './OnlineBookingPages/CottageAndLodgePage.jsx';
import SignIn from './OnlineBookingPages/LoginForm.jsx';
import Register from './OnlineBookingPages/RegisterForm.jsx';
import Payment from './OnlineBookingPages/PaymentPage.jsx';
import About from './OnlineBookingPages/AboutUsPage.jsx';
import Terms from './OnlineBookingPages/TermsAndConditionPage.jsx';
import CalendarView from './EmployeePages/CalendarView.jsx';
import AccountCreation from './AdminPages/AccountCreation.jsx';
import AccountInfoPage from './CustomerPages/AccountInfoPage.jsx';
import './index.css';

const App = () => {
  // Move the shared state here
  const [bookingDetails, setBookingDetails] = useState({});

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Admin-Only Routes */}
        <Route path="/AdminDash" element={<AdminDash />} />
        <Route path="/AdminPayroll" element={<AdminPayroll />} />
        <Route path="/AdminList" element={<AdminList />} />
        <Route path="/CreateAccount" element={<AccountCreation />} />
        <Route path="/AdminAttendance" element={<AdminAttendance />} />
        <Route path="/AdminSchedule" element={<AdminSchedule />} />
        <Route path="/AdminReport" element={<AdminReport />} />
        <Route path="/AdminAddUnit" element={<AdminAddUnit />} />
        <Route path="/AuditLog" element={<AuditLog />} />
        <Route path="/AddProduct" element={<AddProduct />} />

        {/* Shared Routes (Admin and Employee) */}
        <Route path="/Settings" element={<Settings />} />
        <Route path="/employeeSidebar" element={<EmployeeSidebar />} />
        <Route path="/EmployeeDash" element={<EmployeeDash />} />
        <Route path="/EmployeeReservation" element={<EmployeeReservation />} />
        <Route path="/ProductList" element={<ProductList />} />
        <Route path="/ManageProduct" element={<ManageProduct />} />
        <Route path="/SalesReport" element={<SalesReport />} />
        <Route path="/BookingReport" element={<BookingReport />} />

        {/* Public Pages */}
        <Route path="/AccountDetails" element={<AccountInfoPage/>} />
        <Route path="/booking" element={<BookingMainPage />} />
        <Route path="/book" element={<CottageAndLodge setBookingDetails={setBookingDetails} />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/payment" element={<Payment bookingDetails={bookingDetails} />} />
        <Route path="/billing" element={<BillingPage />} />
        <Route path="/about-us" element={<About />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/calendar/:title" element={<CalendarView />} />
      </Routes>
    </BrowserRouter>
  );
};

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
