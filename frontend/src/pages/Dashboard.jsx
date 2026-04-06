import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Briefcase, Users, DollarSign, TrendingUp, Clock, CheckCircle } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState([]);
  const [recentItems, setRecentItems] = useState([]);

  useEffect(() => {
    // Mock data for initial design - in production, this would be an API call
    if (user?.role === 'client') {
      setStats([
        { label: "Active Gigs", value: "12", icon: <Briefcase />, color: "var(--accent)" },
        { label: "Proposals", value: "84", icon: <Users />, color: "var(--blue)" },
        { label: "Contracts", value: "5", icon: <CheckCircle />, color: "var(--accent3)" },
        { label: "Total Spent", value: "$9.2k", icon: <DollarSign />, color: "var(--accent4)" },
      ]);
      setRecentItems([
        { title: "React + Node App", budget: "$2,500", proposals: 14, status: "open" },
        { title: "AI Chatbot", budget: "$1,800", proposals: 9, status: "in_progress" },
        { title: "Mobile UI Design", budget: "$900", proposals: 22, status: "open" },
      ]);
    } else {
      setStats([
        { label: "Total Earned", value: "$14.8k", icon: <DollarSign />, color: "var(--accent)" },
        { label: "Active Jobs", value: "3", icon: <Briefcase />, color: "var(--accent4)" },
        { label: "Success Rate", value: "96%", icon: <TrendingUp />, color: "var(--accent3)" },
        { label: "Applied", value: "31", icon: <Clock />, color: "var(--blue)" },
      ]);
      setRecentItems([
        { title: "Data Dashboard", client: "AnalyticsPro", budget: "$1,200", status: "70%" },
        { title: "REST API Dev", client: "LogisticsTech", budget: "$900", status: "45%" },
      ]);
    }
  }, [user]);

  return (
    <div className="content animate-fade-in">
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '-0.5px' }}>
          {user?.role === 'client' ? 'Client Overview' : 'Freelancer Overview'}
        </h1>
        <p style={{ color: 'var(--muted)', marginTop: '4px' }}>Welcome back, {user?.full_name}</p>
      </div>

      <div className="stats-grid">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--muted2)', textTransform: 'uppercase', marginBottom: '8px' }}>{stat.label}</div>
                <div style={{ fontSize: '28px', fontWeight: '800', color: stat.color }}>{stat.value}</div>
              </div>
              <div style={{ padding: '10px', background: 'var(--bg3)', borderRadius: '12px', color: stat.color }}>
                {stat.icon}
              </div>
            </div>
            <div style={{ marginTop: '16px', fontSize: '12px', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <TrendingUp size={14} color="var(--accent3)" /> +12% from last month
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px' }}>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">{user?.role === 'client' ? 'Your Active Gigs' : 'Active Contracts'}</h3>
            <button className="btn btn-ghost" style={{ fontSize: '12px' }}>View All</button>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>{user?.role === 'client' ? 'Project Title' : 'Contract Name'}</th>
                    <th>Budget</th>
                    <th>{user?.role === 'client' ? 'Proposals' : 'Client'}</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentItems.map((item, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: '600' }}>{item.title}</td>
                      <td style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>{item.budget}</td>
                      <td>{user?.role === 'client' ? item.proposals : item.client}</td>
                      <td>
                        <span style={{ 
                          padding: '4px 10px', 
                          borderRadius: '6px', 
                          fontSize: '11px', 
                          fontWeight: '700', 
                          background: 'rgba(200,255,0,0.1)', 
                          color: 'var(--accent)' 
                        }}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Activity</h3>
          </div>
          <div className="card-body">
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent)', marginTop: '6px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '13px', lineHeight: '1.5' }}>
                    <strong>New Proposal</strong> from Arjun Mehta on <strong>React + Node Full-Stack App</strong>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--muted2)', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>5 MIN AGO</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
