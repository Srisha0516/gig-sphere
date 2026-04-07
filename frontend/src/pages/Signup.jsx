import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Briefcase, UserCheck, ArrowRight, CheckCircle } from "lucide-react";
import { registerUser } from "../services/mockApi";

export default function Signup() {
  const [formData, setFormData] = useState({
    full_name: "", email: "", password: "", role: "freelancer"
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Basic validation
    if (formData.full_name.trim().length < 2) {
      setError("Name must be at least 2 characters");
      setIsLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    try {
      await registerUser(formData);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '420px', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div className="logo-mark" style={{ margin: '0 auto 16px' }}>G</div>
          <h1 style={{ fontSize: '24px', fontWeight: '800' }}>Join GigSphere</h1>
          <p style={{ color: 'var(--muted)', fontSize: '14px', marginTop: '8px' }}>Create an account to get started</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(255,71,87,0.1)', color: 'var(--red)', padding: '12px', borderRadius: '10px', fontSize: '13px', marginBottom: '20px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ background: 'rgba(200,255,0,0.1)', color: 'var(--accent)', padding: '12px', borderRadius: '10px', fontSize: '13px', marginBottom: '20px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <CheckCircle size={16} /> Account created! Redirecting to login...
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--muted2)', textTransform: 'uppercase', marginBottom: '8px' }}>Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
              <input
                id="signup-name"
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
                id="signup-email"
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
                id="signup-password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                required
                minLength={6}
                style={{ width: '100%', padding: '12px 16px 12px 48px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '12px', color: 'var(--text)', fontSize: '14px' }}
              />
            </div>
            <p style={{ fontSize: '11px', color: 'var(--muted2)', marginTop: '6px' }}>Minimum 6 characters</p>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--muted2)', textTransform: 'uppercase', marginBottom: '8px' }}>Account Role</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'freelancer' })}
                className="btn"
                style={{ flex: 1, padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: formData.role === 'freelancer' ? 'var(--accent)' : 'var(--bg3)', color: formData.role === 'freelancer' ? '#000' : 'var(--muted)', border: formData.role === 'freelancer' ? 'none' : '1px solid var(--border)' }}
              >
                <Briefcase size={16} /> Freelancer
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'client' })}
                className="btn"
                style={{ flex: 1, padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: formData.role === 'client' ? 'var(--accent)' : 'var(--bg3)', color: formData.role === 'client' ? '#000' : 'var(--muted)', border: formData.role === 'client' ? 'none' : '1px solid var(--border)' }}
              >
                <UserCheck size={16} /> Client
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: isLoading ? 0.7 : 1 }}
          >
            {isLoading ? 'Creating Account...' : 'Get Started'} {!isLoading && <ArrowRight size={18} />}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--muted)' }}>
          Already have an account? <NavLink to="/login" style={{ color: 'var(--accent)', fontWeight: '600', textDecoration: 'none' }}>Log in</NavLink>
        </p>
      </div>
    </div>
  );
}
