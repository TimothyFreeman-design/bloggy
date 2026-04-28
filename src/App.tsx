import { useEffect, useState } from 'react';
import { Home, LogIn, LogOut, Edit, Trash2, Plus, Music, Calendar, ArrowRight, Sparkles } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

interface Post {
  id: number;
  title: string;
  content: string;
  date: string;
  image?: string;
  audio?: string;
}

type PageType = 'home' | 'post' | 'login' | 'admin';

const App = () => {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const fetchSession = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/session`, {
        method: 'GET',
        credentials: 'include',
      });
      const result = await response.json();
      setIsLoggedIn(Boolean(result.loggedIn));
    } catch {
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  const handleLogin = async (username: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      if (!response.ok) {
        return false;
      }

      const result = await response.json();
      if (result.success) {
        setIsLoggedIn(true);
        setCurrentPage('admin');
        return true;
      }
    } catch {
      // ignore network errors and keep failed login simple
    }

    return false;
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      // ignore logout errors
    }

    setIsLoggedIn(false);
    setCurrentPage('home');
  };

  const addPost = (post: Omit<Post, 'id' | 'date'>) => {
    const newPost: Post = {
      ...post,
      id: Date.now(),
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    };
    setPosts([newPost, ...posts]);
  };

  const updatePost = (id: number, updatedPost: Omit<Post, 'id' | 'date'>) => {
    setPosts(posts.map(p => p.id === id ? { ...updatedPost, id, date: p.date } : p));
  };

  const deletePost = (id: number) => {
    setPosts(posts.filter(p => p.id !== id));
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 50%, #ddd6fe 100%)' }}>
      <Navigation 
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />
      
      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '48px 16px' }}>
        {currentPage === 'home' && <HomePage posts={posts} setSelectedPost={setSelectedPost} setCurrentPage={setCurrentPage} />}
        {currentPage === 'post' && <PostPage post={selectedPost} setCurrentPage={setCurrentPage} />}
        {currentPage === 'login' && <LoginPage onLogin={handleLogin} />}
        {currentPage === 'admin' && isLoggedIn && (
          <AdminPage 
            posts={posts}
            onAddPost={addPost}
            onUpdatePost={updatePost}
            onDeletePost={deletePost}
          />
        )}
      </main>
      
      <footer style={{ background: 'rgba(255, 255, 255, 0.5)', backdropFilter: 'blur(10px)', borderTop: '1px solid #e5e7eb', marginTop: '80px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 16px', textAlign: 'center', color: '#6b7280' }}>
          <p style={{ fontSize: '14px' }}>© 2024 My Blog. Crafted with passion and creativity.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;

const Navigation = ({ currentPage, setCurrentPage, isLoggedIn, onLogout }: {
  currentPage: PageType;
  setCurrentPage: (page: PageType) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
}) => (
  <nav style={{ position: 'sticky', top: 0, zIndex: 1000, background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', borderBottom: '1px solid #e5e7eb' }}>
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' }}>
          <Sparkles style={{ color: 'white' }} size={20} />
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: 900, background: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          My Blog
        </h1>
      </div>
      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={() => setCurrentPage('home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '12px',
            fontWeight: 600,
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.3s',
            background: currentPage === 'home' ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : 'rgba(255, 255, 255, 0.5)',
            color: currentPage === 'home' ? 'white' : '#374151',
            boxShadow: currentPage === 'home' ? '0 4px 12px rgba(59, 130, 246, 0.5)' : 'none',
            transform: currentPage === 'home' ? 'scale(1.05)' : 'scale(1)'
          }}
        >
          <Home size={18} />
          Home
        </button>
        
        {isLoggedIn ? (
          <>
            <button
              onClick={() => setCurrentPage('admin')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.3s',
                background: currentPage === 'admin' ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : 'rgba(255, 255, 255, 0.5)',
                color: currentPage === 'admin' ? 'white' : '#374151',
                boxShadow: currentPage === 'admin' ? '0 4px 12px rgba(59, 130, 246, 0.5)' : 'none',
                transform: currentPage === 'admin' ? 'scale(1.05)' : 'scale(1)'
              }}
            >
              <Edit size={18} />
              Admin
            </button>
            <button
              onClick={onLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.3s',
                background: '#fef2f2',
                color: '#dc2626'
              }}
            >
              <LogOut size={18} />
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => setCurrentPage('login')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '12px',
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.3s',
              background: currentPage === 'login' ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : 'rgba(255, 255, 255, 0.5)',
              color: currentPage === 'login' ? 'white' : '#374151',
              boxShadow: currentPage === 'login' ? '0 4px 12px rgba(59, 130, 246, 0.5)' : 'none',
              transform: currentPage === 'login' ? 'scale(1.05)' : 'scale(1)'
            }}
          >
            <LogIn size={18} />
            Login
          </button>
        )}
      </div>
    </div>
  </nav>
);

const HomePage = ({ posts, setSelectedPost, setCurrentPage }: {
  posts: Post[];
  setSelectedPost: (post: Post) => void;
  setCurrentPage: (page: PageType) => void;
}) => (
  <div style={{ animation: 'fadeIn 0.6s ease-in' }}>
    <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    <div style={{ textAlign: 'center', marginBottom: '64px' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: 'white', padding: '8px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: 600, marginBottom: '24px', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' }}>
        <Sparkles size={16} />
        Welcome to my corner of the internet
      </div>
      <h2 style={{ fontSize: '72px', fontWeight: 900, background: 'linear-gradient(135deg, #1f2937, #1e40af, #6d28d9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: '24px', lineHeight: '1.1' }}>
        Latest Stories
      </h2>
      <p style={{ fontSize: '24px', color: '#6b7280', maxWidth: '800px', margin: '0 auto', fontWeight: 300 }}>
        This is where I share my thoughts, ideas, adventures, and experiences as a human navigating life as a disabled hooman
      </p>
    </div>

    {posts.length === 0 ? (
      <div style={{ textAlign: 'center', padding: '128px 0' }}>
        <div style={{ width: '96px', height: '96px', background: 'linear-gradient(135deg, #dbeafe, #e9d5ff)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <Edit style={{ color: '#3b82f6' }} size={40} />
        </div>
        <p style={{ color: '#6b7280', fontSize: '24px', fontWeight: 300 }}>No posts yet</p>
        <p style={{ color: '#9ca3af', marginTop: '8px' }}>Check back soon for new content!</p>
      </div>
    ) : (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '32px' }}>
        {posts.map((post) => (
          <article 
            key={post.id} 
            onClick={() => {
              setSelectedPost(post);
              setCurrentPage('post');
            }}
            style={{
              background: 'white',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.5s',
              cursor: 'pointer',
              border: '1px solid #f3f4f6'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
            }}
          >
            {post.image ? (
              <div style={{ position: 'relative', width: '100%', height: '224px', overflow: 'hidden', background: 'linear-gradient(135deg, #dbeafe, #e9d5ff)' }}>
                <img 
                  src={post.image} 
                  alt={post.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.7s' }}
                />
              </div>
            ) : (
              <div style={{ width: '100%', height: '224px', background: 'linear-gradient(135deg, #60a5fa, #a78bfa, #f472b6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles style={{ color: 'white', opacity: 0.5 }} size={60} />
              </div>
            )}
            <div style={{ padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#6b7280', marginBottom: '12px', fontWeight: 500 }}>
                <Calendar size={14} />
                <span>{post.date}</span>
              </div>
              <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#1f2937', marginBottom: '12px', lineHeight: '1.3', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {post.title}
              </h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: '16px' }}>{post.content}</p>
              <div style={{ color: '#3b82f6', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                Read more 
                <ArrowRight size={18} />
              </div>
            </div>
          </article>
        ))}
      </div>
    )}
  </div>
);

const PostPage = ({ post, setCurrentPage }: {
  post: Post | null;
  setCurrentPage: (page: PageType) => void;
}) => {
  if (!post) return null;
  
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', animation: 'fadeIn 0.6s ease-in' }}>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      <button
        onClick={() => setCurrentPage('home')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: '#3b82f6',
          fontWeight: 600,
          fontSize: '18px',
          marginBottom: '32px',
          cursor: 'pointer',
          background: 'none',
          border: 'none',
          padding: 0
        }}
      >
        <ArrowRight size={20} style={{ transform: 'rotate(180deg)' }} />
        Back to all posts
      </button>
      <article style={{ background: 'white', borderRadius: '32px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15)', border: '1px solid #f3f4f6' }}>
        {post.image && (
          <div style={{ position: 'relative', width: '100%', height: '500px', overflow: 'hidden' }}>
            <img 
              src={post.image} 
              alt={post.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        )}
        <div style={{ padding: '48px 64px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>
            <Calendar size={16} />
            <span style={{ fontWeight: 500 }}>{post.date}</span>
          </div>
          <h1 style={{ fontSize: '56px', fontWeight: 900, background: 'linear-gradient(135deg, #1f2937, #4b5563)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: '48px', lineHeight: '1.1' }}>
            {post.title}
          </h1>
          
          <div style={{ fontSize: '18px', lineHeight: '1.8', color: '#374151', whiteSpace: 'pre-wrap' }}>
            {post.content.split('\n\n').map((paragraph, i) => (
              <p key={i} style={{ marginBottom: '24px' }}>{paragraph}</p>
            ))}
          </div>

          {post.audio && (
            <div style={{ marginTop: '48px', padding: '32px', background: 'linear-gradient(135deg, #eff6ff, #f5f3ff)', borderRadius: '24px', border: '2px solid #dbeafe' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Music style={{ color: 'white' }} size={24} />
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#1f2937' }}>Audio Content</h3>
              </div>
              <audio controls style={{ width: '100%', marginTop: '8px' }}>
                <source src={post.audio} />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
        </div>
      </article>
    </div>
  );
};

const LoginPage = ({ onLogin }: {
  onLogin: (username: string, password: string) => Promise<boolean>;
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    if (!lockoutUntil) {
      setSecondsLeft(0);
      return;
    }

    const tick = () => {
      const remaining = Math.max(0, Math.ceil((lockoutUntil - Date.now()) / 1000));
      setSecondsLeft(remaining);
      if (remaining <= 0) {
        setLockoutUntil(null);
      }
    };

    tick();
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, [lockoutUntil]);

  const handleSubmit = async () => {
    if (lockoutUntil && Date.now() < lockoutUntil) {
      return;
    }

    setError('');

    const success = await onLogin(username, password);
    if (!success) {
      const attempts = failedAttempts + 1;
      setFailedAttempts(attempts);

      if (attempts >= 3) {
        setLockoutUntil(Date.now() + 30000);
        setError('Too many failed attempts. Please wait 30 seconds before trying again.');
      } else {
        setError('Invalid username or password.');
      }

      return;
    }

    setFailedAttempts(0);
    setError('');
  };

  return (
    <div style={{ maxWidth: '500px', margin: '80px auto', animation: 'fadeIn 0.6s ease-in' }}>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      <div style={{ background: 'white', borderRadius: '32px', padding: '48px', boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15)', border: '1px solid #f3f4f6' }}>
        <div style={{ width: '64px', height: '64px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <LogIn style={{ color: 'white' }} size={32} />
        </div>
        <h2 style={{ fontSize: '36px', fontWeight: 900, color: '#1f2937', textAlign: 'center', marginBottom: '8px' }}>Welcome Back</h2>
        <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '32px' }}>Sign in to manage your blog</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: '#374151', marginBottom: '8px' }}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              style={{ width: '100%', padding: '16px 20px', border: '2px solid #e5e7eb', borderRadius: '12px', fontSize: '16px', transition: 'all 0.3s', fontFamily: 'inherit', boxSizing: 'border-box' }}
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: '#374151', marginBottom: '8px' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !lockoutUntil && handleSubmit()}
              autoComplete="current-password"
              style={{ width: '100%', padding: '16px 20px', border: '2px solid #e5e7eb', borderRadius: '12px', fontSize: '16px', transition: 'all 0.3s', fontFamily: 'inherit', boxSizing: 'border-box' }}
              placeholder="Enter your password"
            />
          </div>
          {error && (
            <div style={{ background: '#fef2f2', border: '2px solid #fecaca', color: '#dc2626', padding: '16px', borderRadius: '12px', fontSize: '14px', fontWeight: 600 }}>
              {error}
            </div>
          )}
          <button
            onClick={handleSubmit}
            disabled={Boolean(lockoutUntil) || !username.trim() || !password}
            style={{
              width: '100%',
              background: lockoutUntil || !username.trim() || !password ? '#93c5fd' : 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              color: 'white',
              padding: '16px',
              borderRadius: '12px',
              border: 'none',
              cursor: lockoutUntil || !username.trim() || !password ? 'not-allowed' : 'pointer',
              fontSize: '18px',
              fontWeight: 700,
              boxShadow: lockoutUntil || !username.trim() || !password ? 'none' : '0 4px 12px rgba(59, 130, 246, 0.5)',
              transition: 'all 0.3s'
            }}
          >
            {lockoutUntil ? `Try again in ${secondsLeft}s` : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
};

const PostEditor = ({ post, onSave, onCancel }: {
  post: Post | null;
  onSave: (post: Omit<Post, 'id' | 'date'>) => void;
  onCancel: () => void;
}) => {
  const [title, setTitle] = useState(post?.title || '');
  const [content, setContent] = useState(post?.content || '');
  const [image, setImage] = useState(post?.image || '');
  const [audio, setAudio] = useState(post?.audio || '');

  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      alert('Please fill in title and content');
      return;
    }
    onSave({ title, content, image: image || undefined, audio: audio || undefined });
  };

  return (
    <div style={{ background: 'white', borderRadius: '32px', padding: '48px', boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15)', border: '1px solid #f3f4f6', animation: 'fadeIn 0.6s ease-in' }}>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      <h2 style={{ fontSize: '36px', fontWeight: 900, color: '#1f2937', marginBottom: '32px' }}>{post ? 'Edit Post' : 'Create New Post'}</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: '#374151', marginBottom: '8px' }}>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: '100%', padding: '16px 20px', border: '2px solid #e5e7eb', borderRadius: '12px', fontSize: '16px', fontFamily: 'inherit', boxSizing: 'border-box' }}
            placeholder="Post title"
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: '#374151', marginBottom: '8px' }}>Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{ width: '100%', padding: '16px 20px', border: '2px solid #e5e7eb', borderRadius: '12px', fontSize: '16px', fontFamily: 'inherit', boxSizing: 'border-box', minHeight: '300px', resize: 'vertical' }}
            placeholder="Post content"
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: '#374151', marginBottom: '8px' }}>Image URL</label>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            style={{ width: '100%', padding: '16px 20px', border: '2px solid #e5e7eb', borderRadius: '12px', fontSize: '16px', fontFamily: 'inherit', boxSizing: 'border-box' }}
            placeholder="Image URL (optional)"
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: '#374151', marginBottom: '8px' }}>Audio URL</label>
          <input
            type="text"
            value={audio}
            onChange={(e) => setAudio(e.target.value)}
            style={{ width: '100%', padding: '16px 20px', border: '2px solid #e5e7eb', borderRadius: '12px', fontSize: '16px', fontFamily: 'inherit', boxSizing: 'border-box' }}
            placeholder="Audio URL (optional)"
          />
        </div>
        <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
          <button
            onClick={handleSave}
            style={{ flex: 1, background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', padding: '16px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '18px', fontWeight: 700, boxShadow: '0 4px 12px rgba(16, 185, 129, 0.5)' }}
          >
            {post ? 'Update Post' : 'Create Post'}
          </button>
          <button
            onClick={onCancel}
            style={{ flex: 1, background: '#f3f4f6', color: '#374151', padding: '16px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '18px', fontWeight: 700 }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminPage = ({ posts, onAddPost, onUpdatePost, onDeletePost }: {
  posts: Post[];
  onAddPost: (post: Omit<Post, 'id' | 'date'>) => void;
  onUpdatePost: (id: number, post: Omit<Post, 'id' | 'date'>) => void;
  onDeletePost: (id: number) => void;
}) => {
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setShowEditor(true);
  };

  const handleNew = () => {
    setEditingPost(null);
    setShowEditor(true);
  };

  return (
    <div style={{ animation: 'fadeIn 0.6s ease-in' }}>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h2 style={{ fontSize: '48px', fontWeight: 900, color: '#1f2937', marginBottom: '8px' }}>Dashboard</h2>
          <p style={{ fontSize: '18px', color: '#6b7280' }}>Manage your blog posts</p>
        </div>
        {!showEditor && (
          <button
            onClick={handleNew}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white',
              padding: '16px 32px',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '18px',
              fontWeight: 700,
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.5)',
              transition: 'all 0.3s'
            }}
          >
            <Plus size={24} />
            New Post
          </button>
        )}
      </div>

      {showEditor ? (
        <PostEditor
          post={editingPost}
          onSave={(post) => {
            if (editingPost) {
              onUpdatePost(editingPost.id, post);
            } else {
              onAddPost(post);
            }
            setShowEditor(false);
            setEditingPost(null);
          }}
          onCancel={() => {
            setShowEditor(false);
            setEditingPost(null);
          }}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {posts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px', background: 'white', borderRadius: '32px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', border: '1px solid #f3f4f6' }}>
              <div style={{ width: '96px', height: '96px', background: 'linear-gradient(135deg, #dbeafe, #e9d5ff)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <Edit style={{ color: '#3b82f6' }} size={40} />
              </div>
              <p style={{ color: '#6b7280', fontSize: '24px', fontWeight: 300, marginBottom: '8px' }}>No posts yet</p>
              <p style={{ color: '#9ca3af' }}>Create your first post to get started!</p>
            </div>
          ) : (
            posts.map(post => (
              <div key={post.id} style={{ background: 'white', borderRadius: '20px', padding: '24px', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)', border: '1px solid #f3f4f6', transition: 'all 0.3s', display: 'flex', gap: '24px' }}>
                {post.image ? (
                  <img 
                    src={post.image} 
                    alt={post.title}
                    style={{ width: '128px', height: '128px', objectFit: 'cover', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
                  />
                ) : (
                  <div style={{ width: '128px', height: '128px', background: 'linear-gradient(135deg, #60a5fa, #a78bfa)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
                    <Sparkles style={{ color: 'white', opacity: 0.5 }} size={40} />
                  </div>
                )}
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#1f2937', marginBottom: '8px' }}>{post.title}</h3>
                  <p style={{ color: '#6b7280', marginBottom: '16px' }}>{post.date}</p>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      onClick={() => handleEdit(post)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                        color: 'white',
                        padding: '10px 20px',
                        borderRadius: '12px',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 600,
                        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.5)',
                        transition: 'all 0.3s'
                      }}
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => onDeletePost(post.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: '#fef2f2',
                        color: '#dc2626',
                        padding: '10px 20px',
                        borderRadius: '12px',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 600,
                        transition: 'all 0.3s'
                      }}
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};