import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserProfile } from '../services/mockApi';
import { Star, User, Calendar, Award, ArrowLeft } from 'lucide-react';

export default function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile(id);
        setProfile(data);
      } catch (error) {
        console.error('Failed to fetch profile', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div style={{ fontSize: '16px', color: 'var(--muted)' }}>Loading profile...</div>
      </div>
    );
  }

  if (!profile || !profile.user) {
    return (
      <div className="content" style={{ textAlign: 'center', paddingTop: '80px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>User not found</h2>
        <button onClick={() => navigate(-1)} className="btn btn-ghost">Go back</button>
      </div>
    );
  }

  const { user, reviews } = profile;

  return (
    <div className="content animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto' }}>
      <button
        onClick={() => navigate(-1)}
        className="btn btn-ghost"
        style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', padding: '8px 16px' }}
      >
        <ArrowLeft size={16} /> Back
      </button>

      {/* Header Profile Card */}
      <div className="card" style={{ padding: '32px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%',
            background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid rgba(200,255,0,0.2)', flexShrink: 0
          }}>
            {user.avatar_url ? (
              <img src={user.avatar_url} alt={user.full_name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              <User size={32} style={{ color: 'var(--muted)' }} />
            )}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '24px', fontWeight: '800' }}>{user.full_name}</h1>
              <span style={{
                fontSize: '11px', padding: '4px 10px',
                background: 'var(--bg3)', color: 'var(--muted)',
                borderRadius: '6px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px'
              }}>
                {user.role}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '16px', marginTop: '8px', flexWrap: 'wrap', fontSize: '13px', color: 'var(--muted)' }}>
              <span style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                background: 'rgba(200,255,0,0.08)', color: 'var(--accent)',
                padding: '4px 10px', borderRadius: '6px', fontWeight: '600'
              }}>
                <Star size={14} /> {Number(user.avg_rating || 0).toFixed(1)} Rating
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={14} /> Joined {new Date(user.created_at).toLocaleDateString()}
              </span>
            </div>

            <p style={{ marginTop: '12px', color: 'var(--muted)', lineHeight: '1.6', fontSize: '14px' }}>
              {user.bio || "This user hasn't added a bio yet."}
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '24px' }}>
        {/* Skills */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={18} style={{ color: 'var(--accent)' }} /> Skills
          </h3>
          {user.skills && user.skills.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {user.skills.map((skill, index) => (
                <span key={index} style={{
                  padding: '6px 12px', background: 'var(--bg3)',
                  border: '1px solid var(--border)', color: 'var(--text)',
                  borderRadius: '8px', fontSize: '13px'
                }}>
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: '13px', color: 'var(--muted2)' }}>No skills listed.</p>
          )}
        </div>

        {/* Reviews */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px' }}>Recent Reviews</h3>

          {reviews && reviews.length > 0 ? (
            <div>
              {reviews.map((review, i) => (
                <div key={i} style={{ borderBottom: i < reviews.length - 1 ? '1px solid var(--border)' : 'none', paddingBottom: '20px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontWeight: '600' }}>{review.users?.full_name}</span>
                    <span style={{ fontSize: '12px', color: 'var(--muted2)' }}>
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
                    {[...Array(5)].map((_, idx) => (
                      <Star
                        key={idx}
                        size={14}
                        style={{
                          color: idx < review.rating ? 'var(--accent)' : 'var(--muted2)',
                          fill: idx < review.rating ? 'var(--accent)' : 'none'
                        }}
                      />
                    ))}
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: '1.5' }}>
                    "{review.comment}"
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <p style={{ color: 'var(--muted2)' }}>No reviews yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
