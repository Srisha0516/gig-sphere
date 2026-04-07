import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getGigs, createGig } from "../services/mockApi";
import { Plus, Search, Filter, DollarSign, ArrowRight, X } from "lucide-react";

export default function Gigs() {
  const { user } = useAuth();
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPostModal, setShowPostModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newGig, setNewGig] = useState({ title: '', description: '', skills_required: '', budget: '' });

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        const data = await getGigs();
        setGigs(data);
      } catch {
        setGigs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchGigs();
  }, []);

  const handlePostGig = async (e) => {
    e.preventDefault();
    const gig = await createGig({
      ...newGig,
      budget: Number(newGig.budget),
      skills_required: newGig.skills_required.split(',').map(s => s.trim()).filter(Boolean),
      client_id: user.id,
    });
    setGigs([gig, ...gigs]);
    setShowPostModal(false);
    setNewGig({ title: '', description: '', skills_required: '', budget: '' });
  };

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago';
    if (diff < 86400000) return Math.floor(diff / 3600000) + 'h ago';
    return Math.floor(diff / 86400000) + 'd ago';
  };

  const filteredGigs = gigs.filter(g =>
    g.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.skills_required.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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

      {/* Post Gig Modal */}
      {showPostModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
          <div className="card" style={{ width: '100%', maxWidth: '500px', padding: '32px', position: 'relative' }}>
            <button onClick={() => setShowPostModal(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer' }}><X size={20} /></button>
            <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '24px' }}>Post a New Gig</h2>
            <form onSubmit={handlePostGig}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--muted2)', textTransform: 'uppercase', marginBottom: '6px' }}>Title</label>
                <input type="text" required value={newGig.title} onChange={e => setNewGig({...newGig, title: e.target.value})} placeholder="e.g. React Native Mobile App" style={{ width: '100%', padding: '10px 14px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text)', fontSize: '14px' }} />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--muted2)', textTransform: 'uppercase', marginBottom: '6px' }}>Description</label>
                <textarea required value={newGig.description} onChange={e => setNewGig({...newGig, description: e.target.value})} placeholder="Describe what you need..." rows={3} style={{ width: '100%', padding: '10px 14px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text)', fontSize: '14px', resize: 'vertical', fontFamily: 'inherit' }} />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--muted2)', textTransform: 'uppercase', marginBottom: '6px' }}>Skills (comma-separated)</label>
                <input type="text" required value={newGig.skills_required} onChange={e => setNewGig({...newGig, skills_required: e.target.value})} placeholder="React, Node.js, PostgreSQL" style={{ width: '100%', padding: '10px 14px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text)', fontSize: '14px' }} />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--muted2)', textTransform: 'uppercase', marginBottom: '6px' }}>Budget (USD)</label>
                <input type="number" required min={1} value={newGig.budget} onChange={e => setNewGig({...newGig, budget: e.target.value})} placeholder="2500" style={{ width: '100%', padding: '10px 14px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text)', fontSize: '14px' }} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Publish Gig</button>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', gap: '16px', flex: 1 }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
              <input
                type="text"
                placeholder="Search gigs by title or skill..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '10px', padding: '10px 10px 10px 40px', color: 'var(--text)', fontSize: '14px' }}
              />
            </div>
            <button className="btn btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Filter size={16} /> Filters
            </button>
          </div>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--muted)' }}>Loading gigs...</div>
          ) : filteredGigs.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--muted)' }}>No gigs found</div>
          ) : (
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
                  {filteredGigs.map(gig => (
                    <tr key={gig.id}>
                      <td>
                        <div style={{ fontWeight: '700', fontSize: '15px', marginBottom: '6px' }}>{gig.title}</div>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {gig.skills_required.map(skill => (
                            <span key={skill} style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '4px', background: 'var(--bg4)', color: 'var(--muted)', border: '1px solid var(--border)', textTransform: 'uppercase', fontWeight: '600' }}>{skill}</span>
                          ))}
                        </div>
                      </td>
                      <td style={{ color: 'var(--accent)', fontWeight: '700', fontFamily: 'var(--font-mono)' }}>${gig.budget}</td>
                      <td style={{ fontSize: '13px', color: 'var(--muted)' }}>
                        {user?.role === 'client' ? gig.proposals : timeAgo(gig.created_at)}
                      </td>
                      <td>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: '700',
                          background: gig.status === 'open' ? 'rgba(74,158,255,0.1)' : 'rgba(200,255,0,0.1)',
                          color: gig.status === 'open' ? 'var(--blue)' : 'var(--accent)'
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
          )}
        </div>
      </div>
    </div>
  );
}
