import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LayoutDashboard, Briefcase, MessageSquare, Settings, LogOut } from "lucide-react";

export default function Sidebar() {
  const { user, logout } = useAuth();
  
  const clientNav = [
    { icon: <LayoutDashboard size={18} />, label: "Overview", to: "/" },
    { icon: <Briefcase size={18} />, label: "My Gigs", to: "/gigs" },
    { icon: <MessageSquare size={18} />, label: "Messages", to: "/chat/all" },
    { icon: <Settings size={18} />, label: "Settings", to: "/settings" },
  ];

  const freelancerNav = [
    { icon: <LayoutDashboard size={18} />, label: "Overview", to: "/" },
    { icon: <Briefcase size={18} />, label: "Find Gigs", to: "/gigs" },
    { icon: <MessageSquare size={18} />, label: "Messages", to: "/chat/all" },
    { icon: <Settings size={18} />, label: "Settings", to: "/settings" },
  ];

  const nav = user.role === 'client' ? clientNav : freelancerNav;

  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logo-mark">G</div>
        <div className="logo-text">Gig<span>Sphere</span></div>
      </div>

      <nav className="nav-section">
        <div className="nav-label">Main Menu</div>
        {nav.map((item, i) => (
          <NavLink 
            key={i} 
            to={item.to} 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div style={{ marginTop: 'auto', padding: '20px' }}>
        <button className="nav-item" onClick={logout} style={{ width: '100%', background: 'transparent', border: 'none' }}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
