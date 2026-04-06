import { useState } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Briefcase, UserCheck } from "lucide-react";

export default function Signup() {
  const [formData, setFormData] = useState({
    full_name: "", email: "", password: "", role: "freelancer"
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/register", formData);
      navigate("/login");
    } catch (err) {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '400px', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div className="logo-mark" style={{ margin: '0 auto 16px' }}>G</div>
          <h1 style={{ fontSize: '24px', fontWeight: '800' }}>Join GigSphere</h1>
          <p style={{ color: 'var(--muted)', fontSize: '14px', marginTop: '8px' }}>Create an account to get started</p>
        </div>

        {error && <div style={{ background: 'rgba(255,71,87,0.1)', color: 'var(--red)', padding: '12px', borderRadius: '10px', fontSize: '13px', marginBottom: '20px', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--muted2)', textTransform: 'uppercase', marginBottom: '8px' }}>Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
              <input 
                type="text" 
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="John Doe"
                required
                style={{ width: '100%', padding: '12px 16px 12px 48px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '12px', color: 'var(--text)', fontSize: '14px' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--muted2)', textTransform: 'uppercase', marginBottom: '8px' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
              <input 
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="name@company.com"
                required
                style={{ width: '100%', padding: '12px 16px 12px 48px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '12px', color: 'var(--text)', fontSize: '14px' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--muted2)', textTransform: 'uppercase', marginBottom: '8px' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
              <input 
                type="password" 
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                required
                style={{ width: '100%', padding: '12px 16px 12px 48px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '12px', color: 'var(--text)', fontSize: '14px' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--muted2)', textTransform: 'uppercase', marginBottom: '8px' }}>Account Role</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                type="button" 
                onClick={() => setFormData({ ...formData, role: 'freelancer' })}
                className="btn" 
                style={{ flex: 1, padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: formData.role === 'freelancer' ? 'var(--accent)' : 'var(--bg3)', color: formData.role === 'freelancer' ? '#000' : 'var(--muted)' }}
              >
                <Briefcase size={16} /> Freelancer
              </button>
              <button 
                type="button" 
                onClick={() => setFormData({ ...formData, role: 'client' })}
                className="btn" 
                style={{ flex: 1, padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: formData.role === 'client' ? 'var(--accent)' : 'var(--bg3)', color: formData.role === 'client' ? '#000' : 'var(--muted)' }}
              >
                <UserCheck size={16} /> Client
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            Get Started
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--muted)' }}>
          Already have an account? <NavLink to="/login" style={{ color: 'var(--accent)', fontWeight: '600', textDecoration: 'none' }}>Log in</NavLink>
        </p>
      </div>
    </div>
  );
}
