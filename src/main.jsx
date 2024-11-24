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
import AuditLog from './AdminPages/AuditLog.jsx'
import Settings from './AdminPages/Settings.jsx'
import EmployeeSidebar from './components/EmployeeSidebar.jsx';
import EmployeeDash from './EmployeePages/EmployeeDash.jsx';
import EmployeeReservation from './EmployeePages/EmployeeReservation.jsx';
import ManageProduct from './EmployeePages/ManageProduct.jsx';
import AddProduct from './EmployeePages/AddProduct.jsx';
import EmployeeReport from './EmployeePages/EmployeeReport.jsx';
import BookingMainPage from './OnlineBookingPages/BookingMainPage.jsx';
import BillingPage from './OnlineBookingPages/BillingPage.jsx';
import CottageAndLodge from './OnlineBookingPages/CottageAndLodgePage.jsx'
import SignIn from './OnlineBookingPages/LoginForm.jsx'
import Register from './OnlineBookingPages/RegisterForm.jsx'
import Payment from './OnlineBookingPages/PaymentPage.jsx'
import About from './OnlineBookingPages/AboutUsPage.jsx'
import Terms from './OnlineBookingPages/TermsAndConditionPage.jsx'
import CalendarView from './EmployeePages/CalendarView.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import './index.css';
const root = createRoot(document.getElementById('root'));


root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/adminSidebar" element={ <ProtectedRoute> <AdminSidebar/> </ProtectedRoute>}/>
         {/* Admin-Only Routes */}
        <Route path="/AdminDash" element={<ProtectedRoute allowedRoles={["Admin"]}><AdminDash /></ProtectedRoute>} />
        <Route path="/AdminPayroll" element={<ProtectedRoute allowedRoles={["Admin"]}><AdminPayroll /></ProtectedRoute>} />
        <Route path="/AdminManagement" element={<ProtectedRoute allowedRoles={["Admin"]}><AdminManagement /></ProtectedRoute>} />
        <Route path="/AdminAttendance" element={<ProtectedRoute allowedRoles={["Admin"]}> <AdminAttendance/> </ProtectedRoute>}/>
        <Route path="/AdminSchedule" element={<ProtectedRoute allowedRoles={["Admin"]}> <AdminSchedule/> </ProtectedRoute>}/>
        <Route path="/AdminReport" element={<ProtectedRoute allowedRoles={["Admin"]}> <AdminReport/> </ProtectedRoute>}/>
        <Route path="/AuditLog" element={<ProtectedRoute allowedRoles={["Admin"]}> <AuditLog/> </ProtectedRoute>}/>
        
        {/* Shared Routes (Admin and Employee) */}
        <Route path="/Settings" element={<ProtectedRoute allowedRoles={["Admin", "Employee"]}> <Settings/> </ProtectedRoute>}/>
        <Route path="/employeeSidebar" element={<ProtectedRoute allowedRoles={["Admin", "Employee"]}> <EmployeeSidebar /> </ProtectedRoute>}/>
        <Route path="/EmployeeDash" element={<ProtectedRoute allowedRoles={["Admin", "Employee"]}><EmployeeDash /></ProtectedRoute>} />
        <Route path="/EmployeeReservation" element={<ProtectedRoute allowedRoles={["Admin", "Employee"]}> <EmployeeReservation /> </ProtectedRoute>}/>
        <Route path="/ManageProduct" element={<ProtectedRoute allowedRoles={["Admin", "Employee"]}><ManageProduct /></ProtectedRoute>} />
        <Route path="/AddProduct" element={<ProtectedRoute allowedRoles={["Admin", "Employee"]}> <AddProduct /> </ProtectedRoute>}/>
        <Route path="/EmployeeReport" element={<ProtectedRoute allowedRoles={["Admin", "Employee"]}> <EmployeeReport /> </ProtectedRoute>}/>
        
        <Route path="/booking" element={<BookingMainPage />}/>
        <Route path="/book" element={<CottageAndLodge />}/>
        <Route path="/sign-in" element={<SignIn />}/>
        <Route path="/register" element={<Register />}/>
        <Route path="/payment" element={<Payment />}/>
        <Route path="/billing" element={<BillingPage />}/>
        <Route path="/about-us" element={<About />}/>
        <Route path="/terms" element={<Terms />}/>
        <Route path="/calendar/:title" element={<CalendarView />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
