import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/Layout/Layout.jsx";
import AdminLayout from "../components/Admin/AdminLayout.jsx";
import Login from "../components/Auth/Login.jsx";
import Register from "../components/Auth/Register.jsx";
import Dashboard from "../components/Dashboard/Dashboard.jsx";
import Profile from "../components/Profile/Profile.jsx";
import Wallet from "../components/Wallet/Wallet.jsx";
import Transfer from "../components/Wallet/Transfer.jsx";
import FundWallet from "../components/Wallet/FundWallet.jsx";
import VerifyPayment from "../components/Wallet/VerifyPayment.jsx";
import TransactionHistory from "../components/Wallet/TransactionHistory.jsx";
import AdminDashboard from "../components/Admin/AdminDashboard.jsx";
import AdminUsers from "../components/Admin/AdminUsers.jsx";
import AdminTransactionHistory from "../components/Admin/AdminTransactionHistory.jsx";
import Analytics from "../components/Admin/Analytics.jsx";
import Reports from "../components/Admin/Reports.jsx";
import Settings from "../components/Admin/Settings.jsx";
import ProtectedRoute from "../components/Auth/ProtectedRoute.jsx";
import NotFound from "../components/Error/NotFound.jsx";

const BrowserRouter = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute><Layout /></ProtectedRoute>,
    children: [
      { path: "/", element: <Dashboard /> },
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/profile", element: <Profile /> },
      { path: "/wallet", element: <Wallet /> },
      { path: "/transfer", element: <Transfer /> },
      { path: "/wallet/fund", element: <FundWallet /> },
      { path: "/wallet/history", element: <TransactionHistory /> },
    ]
  },
  { path: "/wallet/verify", element: <VerifyPayment /> },
  {
    path: "/admin",
    element: <ProtectedRoute><AdminLayout /></ProtectedRoute>,
    children: [
      { path: "/admin", element: <AdminDashboard /> },
      { path: "/admin/dashboard", element: <AdminDashboard /> },
      { path: "/admin/users", element: <AdminUsers /> },
      { path: "/admin/transactions", element: <AdminTransactionHistory /> },
      { path: "/admin/analytics", element: <Analytics /> },
      { path: "/admin/reports", element: <Reports /> },
      { path: "/admin/settings", element: <Settings /> },
    ]
  },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "*", element: <NotFound /> }
]);

export default BrowserRouter; 