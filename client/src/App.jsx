import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import CreateProject from "./pages/CreateProject";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import EditProject from "./pages/EditProject";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";
import SellerOrders from "./pages/SellerOrders";
import Dashboard from "./pages/Dashboard";
import PlagiarismChecker from "./pages/PlagiarismChecker.jsx";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="px-4 py-6">
        <Routes>

          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetails />} />

          <Route path="/create" element={
            <ProtectedRoute>
              <CreateProject />
            </ProtectedRoute>
          } />

          <Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>


<Route
            path="/edit/:id"
            element={
              <ProtectedRoute>
                <EditProject />
              </ProtectedRoute>
            }
          />

<Route
  path="/plagiarism-checker"
  element={
    <ProtectedRoute>
      <PlagiarismChecker />
    </ProtectedRoute>
  }
/>

          <Route path="/checkout/:projectId" element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } />

          <Route path="/my-orders" element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          } />

          <Route path="/seller-orders" element={
            <ProtectedRoute>
              <SellerOrders />
            </ProtectedRoute>
          } />

        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
