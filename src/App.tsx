import React, { useState } from 'react';
import { Home, LogIn, LogOut, Edit, Trash2, Plus, Image, Music, X, Calendar, ArrowRight, Sparkles } from 'lucide-react';

interface Post {
  id: number;
  title: string;
  content: string;
  date: string;
  image?: string;
  audio?: string;
}

type PageType = 'home' | 'post' | 'login' | 'admin';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;900&display=swap');
  
  * { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
  
  .gradient-bg { background: linear-gradient(135deg, #f8fafc 0%, #e0e7ff 50%, #ddd6fe 100%); }
  .gradient-text { background: linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .gradient-btn { background: linear-gradient(135deg, #3b82f6, #8b5cf6); }
  .gradient-success { background: linear-gradient(135deg, #10b981, #059669); }
  .gradient-card { background: linear-gradient(135deg, #60a5fa, #a78bfa, #f472b6); }
  
  .nav-blur { background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(10px); }
  .card-hover { transition: all 0.5s; }
  .card-hover:hover { transform: translateY(-8px) scale(1.02); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15); }
  .image-zoom { transition: transform 0.7s; }
  .card-hover:hover .image-zoom { transform: scale(1.1); }
  
  @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  .animate-fade { animation: fadeIn 0.6s ease-in; }
`;

const App = () => {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const handleLogin = (username: string, password: string) => {
    if (username === 'admin' && password === 'admin123') {
      setIsLoggedIn(true);
      setCurrentPage('admin');
      return true;
    }
    return false;
  };

  const handleLogout = () => {
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
    <>
      <style>{styles}</style>
      <div className="min-h-screen gradient-bg">
        <Navigation 
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          isLoggedIn={isLoggedIn}
          onLogout={handleLogout}
        />
        
        <main className="container mx-auto px-4 py-12 max-w-7xl">
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
        
        <footer className="bg-white/50 backdrop-blur-sm border-t border-gray-200 mt-20">
          <div className="container mx-auto px-4 py-8 max-w-7xl text-center text-gray-600">
            <p className="text-sm">© 2024 My Blog. Crafted with passion and creativity.</p>
          </div>
        </footer>
      </div>
    </>
  );
};

const Navigation = ({ currentPage, setCurrentPage, isLoggedIn, onLogout }: {
  currentPage: PageType;
  setCurrentPage: (page: PageType) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
}) => (
  <nav className="sticky top-0 z-50 nav-blur shadow-lg border-b border-gray-200">
    <div className="container mx-auto px-4 py-5 max-w-7xl">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 gradient-btn rounded-xl flex items-center justify-center shadow-lg">
            <Sparkles className="text-white" size={20} />
          </div>
          <h1 className="text-3xl font-black gradient-text">
            My Blog
          </h1>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setCurrentPage('home')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
              currentPage === 'home' 
                ? 'gradient-btn text-white shadow-lg shadow-blue-500/50 scale-105' 
                : 'text-gray-700 bg-white/50 hover:bg-gray-100 hover:scale-105'
            }`}
          >
            <Home size={18} />
            Home
          </button>
          
          {isLoggedIn ? (
            <>
              <button
                onClick={() => setCurrentPage('admin')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
                  currentPage === 'admin' 
                    ? 'gradient-btn text-white shadow-lg shadow-blue-500/50 scale-105' 
                    : 'text-gray-700 bg-white/50 hover:bg-gray-100 hover:scale-105'
                }`}
              >
                <Edit size={18} />
                Admin
              </button>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-red-600 bg-red-50 hover:bg-red-100 hover:scale-105 transition-all duration-300"
              >
                <LogOut size={18} />
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => setCurrentPage('login')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
                currentPage === 'login' 
                  ? 'gradient-btn text-white shadow-lg shadow-blue-500/50 scale-105' 
                  : 'text-gray-700 bg-white/50 hover:bg-gray-100 hover:scale-105'
              }`}
            >
              <LogIn size={18} />
              Login
            </button>
          )}
        </div>
      </div>
    </div>
  </nav>
);

const HomePage = ({ posts, setSelectedPost, setCurrentPage }: {
  posts: Post[];
  setSelectedPost: (post: Post) => void;
  setCurrentPage: (page: PageType) => void;
}) => (
  <div className="animate-fade">
    <div className="text-center mb-16">
      <div className="inline-flex items-center gap-2 gradient-btn text-white px-4 py-2 rounded-full text-sm font-semibold mb-6 shadow-lg">
        <Sparkles size={16} />
        Welcome to my corner of the internet
      </div>
      <h2 className="text-6xl md:text-7xl font-black mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent leading-tight">
        Latest Stories
      </h2>
      <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto font-light">
        Exploring ideas, sharing experiences, and connecting through words
      </p>
    </div>

    {posts.length === 0 ? (
      <div className="text-center py-32">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Edit className="text-blue-600" size={40} />
        </div>
        <p className="text-gray-500 text-2xl font-light">No posts yet</p>
        <p className="text-gray-400 mt-2">Check back soon for new content!</p>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <article 
            key={post.id} 
            className="card-hover bg-white rounded-2xl shadow-xl cursor-pointer overflow-hidden border border-gray-100"
            onClick={() => {
              setSelectedPost(post);
              setCurrentPage('post');
            }}
          >
            {post.image ? (
              <div className="relative w-full h-56 overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover image-zoom"
                />
              </div>
            ) : (
              <div className="w-full h-56 gradient-card flex items-center justify-center">
                <Sparkles className="text-white opacity-50" size={60} />
              </div>
            )}
            <div className="p-7">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                <Calendar size={14} />
                <span className="font-medium">{post.date}</span>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900 line-clamp-2">
                {post.title}
              </h3>
              <p className="text-gray-600 line-clamp-3 mb-4 leading-relaxed">{post.content}</p>
              <div className="flex items-center gap-2 text-blue-600 font-semibold">
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
    <div className="max-w-4xl mx-auto animate-fade">
      <button
        onClick={() => setCurrentPage('home')}
        className="group flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 font-semibold text-lg transition-all"
      >
        <ArrowRight size={20} className="rotate-180" />
        Back to all posts
      </button>
      <article className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        {post.image && (
          <div className="relative w-full h-96 md:h-[500px] overflow-hidden">
            <img 
              src={post.image} 
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="p-12 md:p-16">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Calendar size={16} />
            <span className="font-medium">{post.date}</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-12 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent leading-tight">
            {post.title}
          </h1>
          
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
            {post.content.split('\n\n').map((paragraph, i) => (
              <p key={i} className="mb-6 text-lg leading-relaxed">{paragraph}</p>
            ))}
          </div>

          {post.audio && (
            <div className="mt-12 p-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border-2 border-blue-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 gradient-btn rounded-xl flex items-center justify-center">
                  <Music className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Audio Content</h3>
              </div>
              <audio controls className="w-full">
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
  onLogin: (username: string, password: string) => boolean;
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const success = onLogin(username, password);
    if (!success) {
      setError('Invalid credentials. Try admin/admin123');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 animate-fade">
      <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100">
        <div className="w-16 h-16 gradient-btn rounded-2xl flex items-center justify-center mx-auto mb-6">
          <LogIn className="text-white" size={32} />
        </div>
        <h2 className="text-4xl font-black mb-2 text-gray-900 text-center">Welcome Back</h2>
        <p className="text-gray-500 text-center mb-8">Sign in to manage your blog</p>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-lg"
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-lg"
              placeholder="Enter your password"
            />
          </div>
          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
              <p className="text-red-600 text-sm font-semibold">{error}</p>
            </div>
          )}
          <button
            onClick={handleSubmit}
            className="w-full gradient-btn text-white py-4 rounded-xl hover:shadow-xl hover:scale-105 transition-all font-bold text-lg shadow-lg shadow-blue-500/50"
          >
            Sign In
          </button>
        </div>
        <div className="mt-8 p-4 bg-gray-50 rounded-xl">
          <p className="text-sm text-gray-600 text-center">
            Demo: <span className="font-mono font-bold text-gray-900">admin / admin123</span>
          </p>
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
    <div className="animate-fade">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-5xl font-black text-gray-900 mb-2">Dashboard</h2>
          <p className="text-gray-600 text-lg">Manage your blog posts</p>
        </div>
        {!showEditor && (
          <button
            onClick={handleNew}
            className="flex items-center gap-2 gradient-success text-white px-8 py-4 rounded-xl hover:shadow-xl hover:scale-105 font-bold text-lg shadow-lg shadow-green-500/50 transition-all"
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
        <div className="space-y-5">
          {posts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl shadow-lg border border-gray-100">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Edit className="text-blue-600" size={40} />
              </div>
              <p className="text-gray-500 text-2xl font-light mb-2">No posts yet</p>
              <p className="text-gray-400">Create your first post to get started!</p>
            </div>
          ) : (
            posts.map(post => (
              <div key={post.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-6 border border-gray-100 hover:scale-[1.01]">
                <div className="flex gap-6">
                  {post.image ? (
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-32 h-32 object-cover rounded-xl shadow-md"
                    />
                  ) : (
                    <div className="w-32 h-32 gradient-card rounded-xl flex items-center justify-center shadow-md">
                      <Sparkles className="text-white opacity-50" size={40} />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{post.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                      <Calendar size={14} />
                      <span>{post.date}</span>
                    </div>
                    <p className="text-gray-600 line-clamp-2 leading-relaxed">{post.content}</p>
                    {post.audio && (
                      <div className="flex items-center gap-2 mt-3 text-blue-600">
                        <Music size={16} />
                        <span className="text-sm font-semibold">Audio attached</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEdit(post)}
                      className="p-3 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl h-fit transition-all hover:scale-110"
                    >
                      <Edit size={22} />
                    </button>
                    <button
                      onClick={() => onDeletePost(post.id)}
                      className="p-3 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl h-fit transition-all hover:scale-110"
                    >
                      <Trash2 size={22} />
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

const PostEditor = ({ post, onSave, onCancel }: {
  post: Post | null;
  onSave: (post: Omit<Post, 'id' | 'date'>) => void;
  onCancel: () => void;
}) => {
  const [title, setTitle] = useState(post?.title || '');
  const [content, setContent] = useState(post?.content || '');
  const [image, setImage] = useState(post?.image || '');
  const [audio, setAudio] = useState(post?.audio || '');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setAudio(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (title && content) {
      onSave({ 
        title, 
        content, 
        image: image || undefined,
        audio: audio || undefined,
      });
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100">
      <h3 className="text-4xl font-black mb-8 text-gray-900">
        {post ? 'Edit Post' : 'Create New Post'}
      </h3>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-lg font-semibold"
            placeholder="Enter an engaging title..."
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Content
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={14}
            className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-lg leading-relaxed resize-none"
            placeholder="Share your story..."
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-3">
            Featured Image (Optional)
          </label>
          <div className="flex gap-4 items-start">
            <label className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 rounded-xl hover:shadow-md cursor-pointer transition-all border-2 border-blue-200 hover:scale-105 font-semibold">
              <Image size={20} />
              Choose Image
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
            {image && (
              <div className="relative">
                <img src={image} alt="Preview" className="h-24 w-24 object-cover rounded-xl shadow-md" />
                <button
                  onClick={() => setImage('')}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 shadow-lg hover:scale-110 transition-all"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-3">
            Audio File (Optional)
          </label>
          <div className="flex gap-4 items-center">
            <label className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 rounded-xl hover:shadow-md cursor-pointer transition-all border-2 border-purple-200 hover:scale-105 font-semibold">
              <Music size={20} />
              Choose Audio
              <input
                type="file"
                accept="audio/*"
                onChange={handleAudioUpload}
                className="hidden"
              />
            </label>
            {audio && (
              <div className="flex items-center gap-3">
                <audio controls className="h-10">
                  <source src={audio} />
                </audio>
                <button
                  onClick={() => setAudio('')}
                  className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600 shadow-lg hover:scale-110 transition-all"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-4 pt-6">
          <button
            onClick={handleSubmit}
            className="flex-1 gradient-btn text-white py-4 rounded-xl hover:shadow-xl hover:scale-105 font-bold text-lg transition-all shadow-lg shadow-blue-500/50"
          >
            {post ? 'Update Post' : 'Publish Post'}
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl hover:bg-gray-300 hover:scale-105 font-bold text-lg transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;