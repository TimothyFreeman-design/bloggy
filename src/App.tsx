import React, { useState } from 'react';
import { Home, LogIn, LogOut, Edit, Trash2, Plus, Image, Music, X } from 'lucide-react';

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
      date: new Date().toLocaleDateString(),
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navigation 
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
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
    </div>
  );
};

const Navigation = ({ currentPage, setCurrentPage, isLoggedIn, onLogout }: {
  currentPage: PageType;
  setCurrentPage: (page: PageType) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
}) => (
  <nav className="bg-white shadow-lg border-b border-gray-200">
    <div className="container mx-auto px-4 py-4 max-w-6xl">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          My Blog
        </h1>
        <div className="flex gap-4">
          <button
            onClick={() => setCurrentPage('home')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              currentPage === 'home' ? 'bg-blue-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Home size={20} />
            Home
          </button>
          
          {isLoggedIn ? (
            <>
              <button
                onClick={() => setCurrentPage('admin')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  currentPage === 'admin' ? 'bg-blue-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Edit size={20} />
                Admin
              </button>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-all"
              >
                <LogOut size={20} />
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => setCurrentPage('login')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                currentPage === 'login' ? 'bg-blue-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <LogIn size={20} />
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
  <div>
    <div className="text-center mb-12">
      <h2 className="text-5xl font-bold mb-4 text-gray-800">Welcome to My Blog</h2>
      <p className="text-xl text-gray-600">Sharing thoughts, stories, and experiences</p>
    </div>

    {posts.length === 0 ? (
      <div className="text-center py-20">
        <p className="text-gray-500 text-xl">No posts yet. Check back later!</p>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map(post => (
          <article 
            key={post.id} 
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer overflow-hidden group"
            onClick={() => {
              setSelectedPost(post);
              setCurrentPage('post');
            }}
          >
            {post.image && (
              <div className="w-full h-48 overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2 text-gray-800 group-hover:text-blue-600 transition-colors">
                {post.title}
              </h3>
              <p className="text-sm text-gray-500 mb-3">{post.date}</p>
              <p className="text-gray-700 line-clamp-3">{post.content}</p>
              <div className="mt-4 text-blue-500 font-medium group-hover:text-blue-700">
                Read more →
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
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => setCurrentPage('home')}
        className="text-blue-500 hover:text-blue-700 mb-6 flex items-center gap-2"
      >
        ← Back to all posts
      </button>
      <article className="bg-white rounded-xl shadow-lg p-8 md:p-12">
        {post.image && (
          <img 
            src={post.image} 
            alt={post.title}
            className="w-full h-96 object-cover rounded-lg mb-8"
          />
        )}
        <h1 className="text-4xl md:text-5xl font-bold mb-3 text-gray-800">{post.title}</h1>
        <p className="text-sm text-gray-500 mb-8 pb-8 border-b border-gray-200">{post.date}</p>
        
        <div className="prose max-w-none text-gray-700 text-lg leading-relaxed whitespace-pre-wrap mb-8">
          {post.content}
        </div>

        {post.audio && (
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <Music className="text-blue-500" size={24} />
              <h3 className="font-semibold text-gray-800">Audio Content</h3>
            </div>
            <audio controls className="w-full">
              <source src={post.audio} />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}
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
    <div className="max-w-md mx-auto mt-20">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Admin Login</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            Login
          </button>
        </div>
        <p className="mt-6 text-sm text-gray-500 text-center">
          Demo credentials: admin / admin123
        </p>
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
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-bold text-gray-800">Manage Posts</h2>
        {!showEditor && (
          <button
            onClick={handleNew}
            className="flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 shadow-md transition-all"
          >
            <Plus size={20} />
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
        <div className="space-y-4">
          {posts.length === 0 ? (
            <p className="text-gray-500 text-center py-12 text-lg">No posts yet. Create your first post!</p>
          ) : (
            posts.map(post => (
              <div key={post.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex gap-4">
                  {post.image && (
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800">{post.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{post.date}</p>
                    <p className="text-gray-700 mt-2 line-clamp-2">{post.content}</p>
                    {post.audio && (
                      <div className="flex items-center gap-2 mt-2 text-blue-600">
                        <Music size={16} />
                        <span className="text-sm">Audio attached</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(post)}
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded h-fit"
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      onClick={() => onDeletePost(post.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded h-fit"
                    >
                      <Trash2 size={20} />
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
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h3 className="text-3xl font-bold mb-6 text-gray-800">
        {post ? 'Edit Post' : 'Create New Post'}
      </h3>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter post title..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={12}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Write your post content..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Featured Image (Optional)
          </label>
          <div className="flex gap-4 items-start">
            <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors">
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
                <img src={image} alt="Preview" className="h-20 w-20 object-cover rounded-lg" />
                <button
                  onClick={() => setImage('')}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Audio File (Optional)
          </label>
          <div className="flex gap-4 items-center">
            <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors">
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
                  className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 font-medium transition-colors"
          >
            {post ? 'Update Post' : 'Publish Post'}
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;