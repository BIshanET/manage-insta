'use client';

import { useState, useEffect } from 'react';
import { Send, Trash2, Camera, Plus, Loader2, LogOut, User } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';


export default function Home() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('queue');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ imageUrl: '', caption: '' });
  const [message, setMessage] = useState({ text: '', type: '' });

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/posts');
      const data = await res.json();
      if (data.success) setPosts(data.data);
    } catch (err) {
      console.error('Failed to fetch posts', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ text: '', type: '' });

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setForm({ imageUrl: '', caption: '' });
        fetchPosts();
        setMessage({ text: 'Post added successfully!', type: 'success' });
      } else {
        setMessage({ text: data.error || 'Failed to add post', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Something went wrong', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const deletePost = async (id) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setPosts(posts.filter(p => p._id !== id));
      }
    } catch (err) {
      alert('Failed to delete post');
    }
  };

  const publishPost = async (id) => {
    if (!confirm('Publish this post to Instagram?')) return;
    try {
      const res = await fetch(`/api/posts/${id}/publish`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        alert('Published successfully!');
        fetchPosts();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      alert('Failed to publish post');
    }
  };

  return (
    <main>
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 className="animate-fade">Instagram Post Manager</h1>
        <p style={{ color: 'var(--text-dim)', marginBottom: '1.5rem' }}>Plan and publish your content seamlessly</p>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', alignItems: 'center' }}>
          <div className="glass" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '50px', fontSize: '0.9rem' }}>
            <User size={16} />
            <span>{session?.user?.name || 'Loading...'}</span>
          </div>
          <button 
            onClick={() => signOut()} 
            className="btn-delete" 
            style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '50px', background: 'rgba(255, 59, 48, 0.1)', color: '#ff3b30', border: '1px solid rgba(255, 59, 48, 0.2)' }}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      <div className="glass form-container animate-fade">
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="imageUrl">Image URL</label>
            <div style={{ position: 'relative' }}>
              <input
                id="imageUrl"
                type="url"
                placeholder="https://images.unsplash.com/photo..."
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                required
              />
              <Camera size={20} style={{ position: 'absolute', right: '12px', top: '14px', color: 'var(--text-dim)' }} />
            </div>
          </div>
          <div className="input-group">
            <label htmlFor="caption">Caption</label>
            <textarea
              id="caption"
              rows="4"
              placeholder="Write something engaging..."
              value={form.caption}
              onChange={(e) => setForm({ ...form, caption: e.target.value })}
              required
            ></textarea>
          </div>
          <button type="submit" className="btn-primary" disabled={submitting} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            {submitting ? <Loader2 className="spin" size={20} /> : <Plus size={20} />}
            {submitting ? 'Adding...' : 'Add to Queue'}
          </button>
          {message.text && (
            <p style={{ marginTop: '1rem', color: message.type === 'success' ? '#30d158' : '#ff3b30', textAlign: 'center', fontSize: '0.9rem' }}>
              {message.text}
            </p>
          )}
        </form>
      </div>

      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem' }}>{activeTab === 'queue' ? 'Your Queue' : 'Published Posts'}</h2>
          <div className="glass" style={{ display: 'flex', padding: '4px', borderRadius: '12px', gap: '4px' }}>
            <button 
              onClick={() => setActiveTab('queue')}
              style={{ 
                padding: '8px 16px', 
                borderRadius: '8px', 
                border: 'none', 
                cursor: 'pointer',
                background: activeTab === 'queue' ? 'var(--primary)' : 'transparent',
                color: activeTab === 'queue' ? 'white' : 'var(--text-dim)',
                transition: 'all 0.2s'
              }}
            >
              Queue
            </button>
            <button 
              onClick={() => setActiveTab('published')}
              style={{ 
                padding: '8px 16px', 
                borderRadius: '8px', 
                border: 'none', 
                cursor: 'pointer',
                background: activeTab === 'published' ? 'var(--primary)' : 'transparent',
                color: activeTab === 'published' ? 'white' : 'var(--text-dim)',
                transition: 'all 0.2s'
              }}
            >
              Published
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <Loader2 size={40} className="spin" style={{ color: 'var(--primary)' }} />
          </div>
        ) : (
          (() => {
            const filteredPosts = posts.filter(post => 
              activeTab === 'published' ? post.status === 'published' : post.status !== 'published'
            );

            if (filteredPosts.length === 0) {
              return (
                <div className="glass" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-dim)' }}>
                  {activeTab === 'queue' ? 'No posts in queue yet.' : 'No published posts yet.'}
                </div>
              );
            }

            return (
              <div className="posts-grid">
                {filteredPosts.map((post) => (
              <div key={post._id} className="glass post-card animate-fade">
                <img src={post.imageUrl} alt="Post" className="post-image" onError={(e) => e.target.src = 'https://via.placeholder.com/400x400?text=Invalid+Image+URL'} />
                <div className="post-content">
                  <span className={`status-badge status-${post.status}`}>
                    {post.status}
                  </span>
                  <p className="post-caption">{post.caption}</p>
                  <div className="post-actions">
                    <button 
                      className="btn-publish" 
                      onClick={() => publishPost(post._id)}
                      disabled={post.status === 'published'}
                      style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    >
                      <Send size={16} />
                      {post.status === 'published' ? 'Published' : 'Publish'}
                    </button>
                    <button 
                      className="btn-delete" 
                      onClick={() => deletePost(post._id)}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
              </div>
            );
          })()
        )}
      </section>

    </main>
  );
}
