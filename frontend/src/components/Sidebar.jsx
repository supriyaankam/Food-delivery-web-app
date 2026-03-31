import { Link, useLocation } from "react-router-dom";
import { Home, List, ShoppingCart, User, Settings } from "lucide-react";

const Sidebar = ({ user }) => {
  const location = useLocation();

  // Helper to check active link
  const isActive = (path) => location.pathname === path;

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h1>Campus Canteen</h1>
      </div>

      <ul className="sidebar-links">
        <li className={isActive("/") ? "active" : ""}>
          <Link to="/">
            <Home size={18} /> Home
          </Link>
        </li>
        <li className={isActive("/menu") ? "active" : ""}>
          <Link to="/menu">
            <List size={18} /> Menu
          </Link>
        </li>
        <li className={isActive("/cart") ? "active" : ""}>
          <Link to="/cart">
            <ShoppingCart size={18} /> Cart
          </Link>
        </li>
        <li className={isActive("/profile") ? "active" : ""}>
          <Link to="/profile">
            <User size={18} /> Profile
          </Link>
        </li>
        {user?.isAdmin && (
          <li className={isActive("/dashboard") ? "active" : ""}>
            <Link to="/dashboard">
              <Settings size={18} /> Dashboard
            </Link>
          </li>
        )}
      </ul>

      <style>{`
        .sidebar {
          width: 220px;
          height: 100vh;
          background-color: #f97316;
          color: white;
          display: flex;
          flex-direction: column;
          padding: 20px 10px;
          box-sizing: border-box;
          position: fixed;
        }

        .sidebar-logo {
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 30px;
          text-align: center;
        }

        .sidebar-links {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .sidebar-links li a {
          display: flex;
          align-items: center;
          gap: 10px;
          color: white;
          text-decoration: none;
          padding: 8px 12px;
          border-radius: 6px;
          transition: 0.2s;
        }

        .sidebar-links li a:hover {
          background-color: rgba(255,255,255,0.2);
        }

        .sidebar-links li.active a {
          background-color: rgba(255,255,255,0.35);
          font-weight: bold;
        }

        /* Responsive: collapse sidebar on small screens */
        @media (max-width: 768px) {
          .sidebar {
            position: relative;
            width: 100%;
            height: auto;
            flex-direction: row;
            padding: 10px;
            overflow-x: auto;
          }
          .sidebar-links {
            flex-direction: row;
            gap: 10px;
          }
          .sidebar-links li a {
            padding: 6px 8px;
          }
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;