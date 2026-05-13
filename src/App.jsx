import { Routes, Route, Navigate } from "react-router-dom";
import React from "react";

import Orders from "./pages/Orders";

import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import DashboardLayout from "./layouts/DashboardLayout";
import Mangemants from "./pages/Mangemants";
import Areas from "./pages/Areas";
import Compliments from "./pages/Compliments";
import Copoun from "./pages/Copoun";
import Customers from "./pages/Customers";
import Earnings from "./pages/Earnings";
import Laundry from "./pages/Laundry";
import Maintences from "./pages/Maintences";
import Price from "./pages/Price";
import Ranking from "./pages/Ranking";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Visits from "./pages/Visits";

const App = () => {
  return (
    <Routes>
      {/* LOGIN */}
      <Route path="/" element={<Login />} />

      {/* DASHBOARD */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* DEFAULT PAGE */}
        <Route index element={<Mangemants />} />

        {/* ORDERS */}
        <Route path="orders" element={<Orders />} />
        <Route path="areas" element={<Areas />} />
        <Route path="compliments" element={<Compliments />} />
        <Route path="copoun" element={<Copoun />} />
        <Route path="customers" element={<Customers />} />
        <Route path="earnings" element={<Earnings />} />
        <Route path="laundry" element={<Laundry />} />
        <Route path="maintence" element={<Maintences />} />
        <Route path="price" element={<Price />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
        <Route path="visit" element={<Visits />} />

        <Route path="ranking" element={<Ranking />} />
      </Route>

      {/* WRONG ROUTE */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
