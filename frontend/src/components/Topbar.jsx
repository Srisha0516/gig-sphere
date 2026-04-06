import { useAuth } from "../context/AuthContext";
import { Bell, Search, User } from "lucide-react";

export default function Topbar() {
  const { user } = useAuth();

  return (
    <header className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1 }}>
        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
          <input 
            type="text" 
            placeholder="Search for Gigs or Freelancers..." 
            style={{ 
              width: '100%', 
              background: 'var(--bg3)', 
              border: '1px solid var(--border)', 
              borderRadius: '10px', 
              padding: '10px 10px 10px 40px',
              color: 'var(--text)',
              fontSize: '14px'
            }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button className="btn btn-ghost" style={{ padding: '8px' }}>
          <Bell size={20} />
        </button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '16px', borderLeft: '1px solid var(--border)' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '14px', fontWeight: '600' }}>{user?.full_name}</div>
            <div style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'capitalize' }}>{user?.role}</div>
          </div>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--accent)', color: '#000', display: 'flex', alignItems: 'center', justifyHeight: 'center', fontWeight: '700' }}>
            {user?.full_name?.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
}
