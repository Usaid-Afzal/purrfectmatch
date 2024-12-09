import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import Login from "./pages/Login";
import FAQ from "./pages/FAQ";
import Listings from "./pages/Listings";
import ListingDetails from "./pages/ListingDetails";
import Chat from "./pages/Chat";
import { AuthProvider } from "./contexts/AuthContext";
import CreateListing from "./pages/CreateListing";
import AdminDashboard from "./pages/Dashboard";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";

function App() {
  return (
    <MantineProvider>
      <ModalsProvider>
        <Notifications position="top-right" />
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/login" element={<Login />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/listings" element={<Listings />} />
              <Route path="/listings/:id" element={<ListingDetails />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/create-listing" element={<CreateListing />} />
              <Route path="/admin/*" element={<AdminDashboard />} />
            </Routes>
          </Router>
        </AuthProvider>
      </ModalsProvider>
    </MantineProvider>
  );
}
export default App;
