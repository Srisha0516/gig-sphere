import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Send, User, MoreVertical, Paperclip, Smile } from "lucide-react";

export default function Chat() {
  const { contractId } = useParams();
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    { senderId: 'bot', senderName: 'GigSphere AI', content: 'Welcome to your project chat! Messages are stored locally for this demo.', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef();

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const msgData = {
      contractId,
      senderId: user.id,
      senderName: user.full_name,
      content: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, msgData]);
    setInput("");

    // Simulate bot response
    setTimeout(() => {
      setMessages((prev) => [...prev, {
        senderId: 'bot',
        senderName: 'GigSphere AI',
        content: getAIResponse(input),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1000);
  };

  const getAIResponse = (msg) => {
    const lower = msg.toLowerCase();
    if (lower.includes('hello') || lower.includes('hi')) return 'Hello! How can I help with your project today?';
    if (lower.includes('deadline') || lower.includes('when')) return 'The typical project timeline is 2-4 weeks depending on complexity. Let\'s discuss your specific requirements!';
    if (lower.includes('price') || lower.includes('cost') || lower.includes('budget')) return 'Pricing depends on project scope. I\'d recommend posting a gig with your budget range to attract the right freelancers.';
    if (lower.includes('thank')) return 'You\'re welcome! Don\'t hesitate to reach out if you need anything else.';
    return 'Thanks for your message! Our AI matching system can help connect you with the perfect freelancer for your needs. Try browsing the Gigs page!';
  };

  return (
    <div className="content animate-fade-in" style={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', padding: '24px 32px' }}>
      <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div className="card-header" style={{ flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
              <User size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Project Discussion</h3>
              <p style={{ fontSize: '12px', color: 'var(--accent3)', fontWeight: '600' }}>● ONLINE</p>
            </div>
          </div>
          <button className="btn btn-ghost" style={{ padding: '8px' }}>
            <MoreVertical size={20} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', background: 'rgba(255,255,255,0.01)' }}>
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                alignSelf: m.senderId === user.id ? 'flex-end' : 'flex-start',
                maxWidth: '70%',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                alignItems: m.senderId === user.id ? 'flex-end' : 'flex-start'
              }}
            >
              <div style={{
                background: m.senderId === user.id ? 'var(--accent)' : 'var(--bg3)',
                color: m.senderId === user.id ? '#000' : 'var(--text)',
                padding: '12px 18px',
                borderRadius: m.senderId === user.id ? '16px 16px 0 16px' : '16px 16px 16px 0',
                fontSize: '14px',
                fontWeight: '500',
                lineHeight: '1.5',
                boxShadow: m.senderId === user.id ? '0 4px 12px rgba(200,255,0,0.15)' : 'none'
              }}>
                {m.content}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--muted2)', fontWeight: '600', fontFamily: 'var(--font-mono)' }}>
                {m.senderName} · {m.time}
              </div>
            </div>
          ))}
          <div ref={scrollRef} />
        </div>

        <div style={{ padding: '20px 24px', borderTop: '1px solid var(--border)', background: 'var(--bg2)' }}>
          <form onSubmit={sendMessage} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button type="button" className="btn btn-ghost" style={{ padding: '10px', color: 'var(--muted)' }}><Paperclip size={20} /></button>
            <div style={{ position: 'relative', flex: 1 }}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message here..."
                style={{
                  width: '100%',
                  background: 'var(--bg3)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  color: 'var(--text)',
                  fontSize: '14px'
                }}
              />
              <button type="button" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}><Smile size={20} /></button>
            </div>
            <button type="submit" className="btn btn-primary" style={{ padding: '12px', borderRadius: '12px' }}>
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
