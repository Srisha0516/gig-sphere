import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Star, User, Calendar, Award, ArrowLeft, Loader2 } from 'lucide-react';

export default function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/${id}`);
        setProfile(response.data);
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
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#b0fb5d]" />
      </div>
    );
  }

  if (!profile || !profile.user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl text-white">User not found</h2>
        <button onClick={() => navigate(-1)} className="text-[#b0fb5d] mt-4 hover:underline">
          Go back
        </button>
      </div>
    );
  }

  const { user, reviews } = profile;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center text-gray-400 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </button>

      {/* Header Profile Card */}
      <div className="bg-[#111111] border border-white/10 rounded-2xl p-8 mb-8 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-[#b0fb5d]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center border-2 border-[#b0fb5d]/20 shrink-0">
            {user.avatar_url ? (
              <img src={user.avatar_url} alt={user.full_name} className="w-full h-full rounded-full object-cover" />
            ) : (
              <User className="w-10 h-10 text-gray-400" />
            )}
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-white flex items-center justify-center md:justify-start gap-3">
              {user.full_name}
              <span className="text-xs px-2 py-1 bg-white/10 text-gray-300 rounded-full font-medium uppercase tracking-wider">
                {user.role}
              </span>
            </h1>
            
            <div className="text-gray-400 mt-2 flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm">
              <span className="flex items-center gap-1 bg-[#b0fb5d]/10 text-[#b0fb5d] px-2 py-1 rounded-lg font-medium">
                <Star className="w-4 h-4 fill-current" />
                {Number(user.avg_rating).toFixed(1)} Rating
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Joined {new Date(user.created_at).toLocaleDateString()}
              </span>
            </div>

            <p className="mt-4 text-gray-300 leading-relaxed max-w-2xl">
              {user.bio || "This user hasn't added a bio yet."}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Skills */}
        <div className="md:col-span-1 space-y-8">
          <div className="bg-[#111111] border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-[#b0fb5d]" />
              Skills
            </h3>
            {user.skills && user.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill, index) => (
                  <span key={index} className="px-3 py-1.5 bg-white/5 border border-white/10 text-gray-300 rounded-lg text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No skills listed.</p>
            )}
          </div>
        </div>

        {/* Right Column: Reviews */}
        <div className="md:col-span-2">
          <div className="bg-[#111111] border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Recent Reviews</h3>
            
            {reviews && reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((review, i) => (
                  <div key={i} className="border-b border-white/5 last:border-0 pb-6 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-white">{review.users.full_name}</span>
                      <span className="text-sm text-gray-500">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, idx) => (
                        <Star 
                          key={idx} 
                          className={`w-4 h-4 ${idx < review.rating ? 'text-[#b0fb5d] fill-[#b0fb5d]' : 'text-gray-600'}`} 
                        />
                      ))}
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      "{review.comment}"
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No reviews yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
