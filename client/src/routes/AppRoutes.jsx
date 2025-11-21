// src/routes/AppRoutes.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "../pages/auth/LoginPage";
import { DashboardPage } from "../pages/DashboardPage";
import { ProvincePage } from "../pages/admin/ProvincePage";
import { PrivateRoute } from "./PrivateRoute"; // Import file vừa sửa ở trên
import { BusStationPage } from "../pages/admin/BusStationPage";
import { BusOperatorPage } from "../pages/admin/BusOperatorPage";
import { RoutePage } from "../pages/admin/RoutePage";
import { BusPage } from "../pages/admin/BusPage";
import { RouteStopPage } from "../pages/admin/RouteStopPage";
import { TripPage } from "../pages/admin/TripPage";
import { TripSearchPage } from "../pages/client/TripSearchPage";
import { BookingPage } from "../pages/client/BookingPage";
import { ClientLayout } from "../layouts/ClientLayout";
import { HomePage } from "../pages/client/HomePage";
import { MyBookingsPage } from "../pages/client/MyBookingPage";

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- CLIENT (USER) ROUTES --- */}
        {/* Client không cần check role đặc biệt, hoặc check role USER nếu cần */}
        <Route element={<ClientLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<TripSearchPage />} />
          <Route path="/booking/:id" element={<BookingPage />} />
        </Route>
        <Route
          path="/my-bookings"
          element={
            <PrivateRoute>
              <MyBookingsPage />
            </PrivateRoute>
          }
        />

        <Route path="/login" element={<LoginPage />} />

        {/* --- admin & DASHBOARD ROUTES --- */}
        {/* Tại đây thêm requiredRole="admin" */}

        <Route
          path="/dashboard"
          element={
            <PrivateRoute requiredRole="admin">
              <DashboardPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/provinces"
          element={
            <PrivateRoute requiredRole="admin">
              <ProvincePage />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/bus-stations"
          element={
            <PrivateRoute requiredRole="admin">
              <BusStationPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/bus-operators"
          element={
            <PrivateRoute requiredRole="admin">
              <BusOperatorPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/routes"
          element={
            <PrivateRoute requiredRole="admin">
              <RoutePage />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/buses"
          element={
            <PrivateRoute requiredRole="admin">
              <BusPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/route_stops"
          element={
            <PrivateRoute requiredRole="admin">
              <RouteStopPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/trips"
          element={
            <PrivateRoute requiredRole="admin">
              <TripPage />
            </PrivateRoute>
          }
        />

        {/* --- REDIRECTS --- */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
