// src/App.js

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";

import { useState, useContext } from "react";
import { ShoppingCart, Search, Sun, Moon } from "lucide-react";

import CartProvider, { CartContext } from "./context/CartContext";
import { UserProvider, UserContext } from "./context/UserContext";
import ThemeProvider, { ThemeContext } from "./context/ThemeContext";

import NotificationBell from "./components/NotificationBell";

import "./App.css";

/* USER PAGES */
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Coins from "./pages/Coins";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Payment from "./pages/Payment";
import PaymentSuccess from "./pages/PaymentSuccess";
import Dashboard from "./pages/Dashboard";
import UserNotifications from "./pages/UserNotifications";

/* ADMIN */
import AdminOrders from "./pages/AdminOrders";
import AdminFoods from "./pages/Admin";

/* LANDING PAGE */
import bgFood from "./assets/bg-food.jpg";

/* ================= LANDING PAGE ================= */
const LandingPage = () => {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  const isDark = theme === "dark";

  return (
    <div
      style={{
        height: "100vh",
        backgroundImage: `url(${bgFood})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        color: "#fff",
      }}
    >
      {/* ✅ FIXED OVERLAY (NO BLUR IN LIGHT MODE) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: isDark ? "rgba(0,0,0,0.6)" : "transparent",
        }}
      ></div>

      {/* CONTENT */}
      <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        <h1>Welcome to FoodieHub 🍔</h1>
        <p>Delicious food delivered right to your doorstep!</p>

        <button
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            fontSize: "1rem",
            borderRadius: "5px",
            border: "none",
            cursor: "pointer",
            color: "#fff",
            background: isDark ? "#111827" : "#ff4d4d",
          }}
          onClick={() => navigate("/home")}
        >
          Explore Menu
        </button>
      </div>
    </div>
  );
};

/* ================= APP CONTENT ================= */
function AppContent() {
  const { user, logoutUser } = useContext(UserContext);
  const { totalItems = 0 } = useContext(CartContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const isAdmin = user?.isAdmin;
  const isNormalUser = user && !isAdmin;

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <div className={theme}>
      {/* NAVBAR */}
      <nav style={styles.navbar(theme)}>
        <h2 style={styles.logo}>FoodieHub 🍔</h2>

        <div style={styles.navLinks}>
          <Link to="/home" style={styles.navItem}>
            🏠 <span>Home</span>
          </Link>

          {isNormalUser && (
            <Link to="/cart" style={styles.navItem}>
              <ShoppingCart size={22} />
              {totalItems > 0 && (
                <span style={styles.cartBadge}>{totalItems}</span>
              )}
              <span>Cart</span>
            </Link>
          )}

          {isNormalUser && (
            <Link to="/coins" style={styles.navItem}>
              💰 <span>Coins</span>
            </Link>
          )}

          {isNormalUser && user && <NotificationBell user={user} />}

          {isAdmin ? (
            <>
              <Link to="/admin-orders" style={styles.navItem}>
                📊 <span>Orders</span>
              </Link>
              <Link to="/admin-foods" style={styles.navItem}>
                🍔 <span>Foods</span>
              </Link>
            </>
          ) : (
            <Link to="/dashboard" style={styles.navItem}>
              📊 <span>Dashboard</span>
            </Link>
          )}
        </div>

        {/* SEARCH */}
        <div style={styles.searchBox}>
          <Search size={16} />
          <input
            type="text"
            placeholder="Search food..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        {/* RIGHT SIDE */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button onClick={toggleTheme} style={styles.themeBtn}>
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          {!user ? (
            <>
              <Link to="/login" style={styles.authLink}>
                Login
              </Link>
              <Link to="/signup" style={styles.authLink}>
                Signup
              </Link>
            </>
          ) : (
            <>
              <div style={styles.profileBox}>
                <div style={styles.profileIcon}>👤</div>
                <div style={styles.profileText}>
                  {user?.name || "User"}
                </div>
              </div>

              <button onClick={handleLogout} style={styles.logoutBtn}>
                Logout
              </button>
            </>
          )}
        </div>
      </nav>

      {/* ROUTES */}
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<Home search={search} user={user} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/payment" element={<PaymentWrapper />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />

          <Route
            path="/cart"
            element={isNormalUser ? <Cart /> : <AccessDenied />}
          />
          <Route
            path="/coins"
            element={isNormalUser ? <Coins /> : <AccessDenied />}
          />
          <Route
            path="/dashboard"
            element={
              isNormalUser ? <Dashboard user={user} /> : <AccessDenied />
            }
          />
          <Route
            path="/admin-orders"
            element={
              isAdmin ? <AdminOrders user={user} /> : <AccessDenied />
            }
          />
          <Route
            path="/admin-foods"
            element={
              isAdmin ? <AdminFoods user={user} /> : <AccessDenied />
            }
          />
          <Route
            path="/notifications"
            element={
              isNormalUser ? (
                <UserNotifications userId={user?._id} />
              ) : (
                <AccessDenied />
              )
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      {/* FOOTER */}
      <footer style={styles.footer(theme)}>
        <p>© {new Date().getFullYear()} FoodieHub</p>
      </footer>
    </div>
  );
}

/* PAYMENT WRAPPER */
function PaymentWrapper() {
  const user = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");

  return <Payment user={user} cartItems={cartItems} />;
}

/* MAIN APP */
export default function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <CartProvider>
          <Router>
            <AppContent />
          </Router>
        </CartProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

/* SMALL COMPONENTS */
const AccessDenied = () => (
  <h2 style={{ textAlign: "center", marginTop: 40, color: "red" }}>
    Access Denied
  </h2>
);

const NotFound = () => (
  <h2 style={{ textAlign: "center", marginTop: 40 }}>
    Page Not Found
  </h2>
);

/* STYLES */
const styles = {
  navbar: (theme) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 25px",
    background: theme === "light" ? "#ff4d4d" : "#111827",
    color: "#fff",
  }),

  logo: { fontSize: "22px", fontWeight: "bold" },

  navLinks: { display: "flex", gap: "20px", alignItems: "center" },

  navItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textDecoration: "none",
    color: "#fff",
  },

  cartBadge: {
    position: "absolute",
    background: "#fff",
    color: "#ff4d4d",
    borderRadius: "50%",
    padding: "2px 6px",
    fontSize: "10px",
  },

  searchBox: {
    display: "flex",
    alignItems: "center",
    background: "#fff",
    padding: "4px 8px",
    borderRadius: "20px",
  },

  searchInput: {
    border: "none",
    outline: "none",
    marginLeft: "6px",
  },

  themeBtn: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    color: "#fff",
  },

  authLink: { color: "#fff", marginRight: "10px" },

  logoutBtn: {
    background: "#222",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
  },

  profileBox: { display: "flex", flexDirection: "column", alignItems: "center" },

  profileIcon: { fontSize: "26px" },

  profileText: { fontSize: "14px", fontWeight: "bold" },

  footer: (theme) => ({
    background: theme === "light" ? "#ff4d4d" : "#111827",
    color: "#fff",
    textAlign: "center",
    padding: "15px",
  }),
};
