import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Offer from "./pages/Offer";
import Products from "./pages/Products";
import Stock from "./pages/Stock";
import Orders from "./pages/Orders";
import Users from "./pages/Users";
import Tools from "./pages/Tools";
import Category from "./pages/Category";
import AddProduct from "./components/Products/AddProduct";
import UpdateProduct from "./components/Products/UpdateProduct";
import Sales from "./pages/Sales";
import AdminSaleFull from "./components/Sales/NewSales";
import Login from "./components/Authentication/Login";
import { AuthContext, AuthProvider } from "./Context Api/AuthContext";
import PrivateRoute from "./components/private routes/PrivateRoute";
import { useContext } from "react";
import ScrollToTop from "./components/ScrollToTop";
import Accounts from "./pages/Accounts";
import { StatusManagement } from "./components/Products/StatusManagement";
import Courier from "./pages/Courier.jsx";

function AppLayout() {
  const { user } = useContext(AuthContext);

  const location = useLocation();

  // Check if current route is /login
  const hideSidebar = location.pathname === "/login" || !user;

  return (
    <div className="flex h-screen">
      {!hideSidebar && <Sidebar />}
      <div
        className={`flex-1 ${
          hideSidebar
            ? "p-0"
            : "px-2 pb-6 pt-2 md:ml-0 bg-gray-200/80 overflow-auto scroll-container"
        }`}
      >
        <ScrollToTop />
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          {/* Product routes */}
          <Route
            path="/products"
            element={
              <PrivateRoute>
                <Products />
              </PrivateRoute>
            }
          />
            <Route
            path="/products/update-product"
            element={
              <PrivateRoute>
                <UpdateProduct />
              </PrivateRoute>
            }
          />
          <Route
            path="/products/add-product"
            element={
              <PrivateRoute>
                <AddProduct />
              </PrivateRoute>
            }
          />
          <Route
            path="/products/status-management"
            element={
              <PrivateRoute>
                <StatusManagement />
              </PrivateRoute>
            }
          />

          {/* Other routes */}
          <Route
            path="/category"
            element={
              <PrivateRoute>
                <Category />
              </PrivateRoute>
            }
          />
          <Route
            path="/stock"
            element={
              <PrivateRoute>
                <Stock />
              </PrivateRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <PrivateRoute>
                <Orders />
              </PrivateRoute>
            }
          />

          {/* Sales routes */}
          <Route
            path="/sales"
            element={
              <PrivateRoute>
                <Sales />
              </PrivateRoute>
            }
          />

          {/* Accounts routes */}
          <Route
            path="/accounts"
            element={
              <PrivateRoute>
                <Accounts />
              </PrivateRoute>
            }
          />

         
          <Route
            path="/sales/new"
            element={
              <PrivateRoute>
                <AdminSaleFull />
              </PrivateRoute>
            }
          />

          <Route
            path="/users"
            element={
              <PrivateRoute>
                <Users />
              </PrivateRoute>
            }
          />
          <Route
            path="/tools"
            element={
              <PrivateRoute>
                <Tools />
              </PrivateRoute>
            }
          />

          <Route
            path="/courier"
            element={
              <PrivateRoute>
                <Courier />
              </PrivateRoute>
            }
          />
             <Route
            path="/offer"
            element={
              <PrivateRoute>
                <Offer />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </Router>
  );
}

export default App;
