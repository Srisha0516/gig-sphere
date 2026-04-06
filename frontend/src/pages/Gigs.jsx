import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Plus, Search, Filter, Clock, DollarSign, ArrowRight } from "lucide-react";

export default function Gigs() {
  const { user } = useAuth();
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPostModal, setShowPostModal] = useState(false);

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/gigs");
        setGigs(res.data);
      } catch (err) {
        // Mock data fallback for design
        setGigs([
          { id: 1, title: "React + Node Full-Stack App", skills_required: ["React", "Node.js", "PostgreSQL"], budget: 2500, proposals: 14, status: "open", created_at: "2d ago" },
          { id: 2, title: "AI Chatbot Integration", skills_required: ["Python", "OpenAI", "FastAPI"], budget: 1800, proposals: 9, status: "in_progress", created_at: "5d ago" },
          { id: 3, title: "Mobile App UI/UX Design", skills_required: ["Figma", "iOS", "Android"], budget: 900, proposals: 22, status: "open", created_at: "1h ago" },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchGigs();
  }, []);

  return (
    <div className="content animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '-0.5px' }}>
            {user?.role === 'client' ? 'Manage Your Gigs' : 'Browse Open Gigs'}
          </h1>
          <p style={{ color: 'var(--muted)', marginTop: '4px' }}>
            {user?.role === 'client' ? 'View and manage your job listings' : 'Find your next project match'}
          </p>
        </div>
        
        {user?.role === 'client' && (
          <button className="btn btn-primary" onClick={() => setShowPostModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={18} /> Post New Gig
          </button>
        )}
      </div>

      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', gap: '16px', flex: 1 }}>
             <div style={{ position: 'relative', flex: 1 }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
                <input type="text" placeholder="Search gigs by title or skill..." style={{ width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '10px', padding: '10px 10px 10px 40px', color: 'var(--text)', fontSize: '14px' }} />
             </div>
             <button className="btn btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
               <Filter size={16} /> Filters
             </button>
          </div>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Job Details</th>
                  <th>Budget</th>
                  <th>{user?.role === 'client' ? 'Proposals' : 'Posted'}</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {gigs.map(gig => (
                  <tr key={gig.id}>
                    <td>
                      <div style={{ fontWeight: '700', fontSize: '15px', marginBottom: '6px' }}>{gig.title}</div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {gig.skills_required.map(skill => (
                          <span key={skill} style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '4px', background: 'var(--bg4)', color: 'var(--muted)', border: '1px solid var(--border)', textTransform: 'uppercase', fontWeight: '600' }}>{skill}</span>
                        ))}
                      </div>
                    </td>
                    <td style={{ color: 'var(--accent)', fontWeight: '700', fontFamily: 'var(--font-mono)' }}>${gig.budget}</td>
                    <td style={{ fontSize: '13px', color: 'var(--muted)' }}>
                      {user?.role === 'client' ? gig.proposals : gig.created_at}
                    </td>
                    <td>
                      <span style={{ 
                        padding: '4px 10px', 
                        borderRadius: '6px', 
                        fontSize: '11px', 
                        fontWeight: '700', 
                        background: 'rgba(74,158,255,0.1)', 
                        color: 'var(--blue)' 
                      }}>
                        {gig.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-ghost" style={{ padding: '6px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {user?.role === 'client' ? 'View Proposals' : 'Apply Now'} <ArrowRight size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
