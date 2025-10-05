import React, { useState, useEffect } from 'react';
import CommentList from './components/CommentList';
import ReplyBox from './components/ReplyBox';
import AuthModal from './components/AuthModal';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { api } from './utils/api';

function App() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const { user, isAuthenticated } = useAuth();

  const fetchComments = async (page = 1, append = false) => {
    try {
      if (!append) setLoading(true);
      const data = await api.getComments(page, 10);
      
      if (append) {
        setComments(prev => [...prev, ...data.comments]);
      } else {
        setComments(data.comments);
      }
      
      setHasNextPage(data.pagination.hasNextPage);
      setCurrentPage(data.pagination.page);
      setError(null);
    } catch (err) {
      setError('Failed to load comments');
      console.error('Error fetching comments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleCommentSubmit = () => {
    fetchComments();
  };

  const handleReply = () => {
    fetchComments();
  };

  const handleLike = () => {
    fetchComments();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading comments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-6 max-w-4xl">
        {/* Navigation Bar */}
        <nav className="border-b border-gray-200 pb-4 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex space-x-8">
              <button className="text-blue-600 font-bold border-b-2 border-blue-600 pb-1">
                Thoughts({comments.length})
              </button>
              <button className="text-gray-500 font-normal hover:text-gray-700 transition-colors">
                Top Holders
              </button>
              <button className="text-gray-500 font-normal hover:text-gray-700 transition-colors">
                Activity
              </button>
            </div>
            
            {/* Auth Section */}
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {user?.username?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-gray-700">{user?.username}</span>
                  <button
                    onClick={() => {
                      // Add logout functionality
                      localStorage.removeItem('authToken');
                      window.location.reload();
                    }}
                    className="text-gray-500 hover:text-gray-700 text-sm"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setAuthMode('login');
                      setShowAuthModal(true);
                    }}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      setAuthMode('register');
                      setShowAuthModal(true);
                    }}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Register
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>

        <ReplyBox onSubmit={handleCommentSubmit} />

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Error loading comments
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={fetchComments}
                    className="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200 transition-colors duration-200"
                  >
                    Try again
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        <CommentList
          comments={comments}
          onReply={handleReply}
          onLike={handleLike}
        />
        {hasNextPage && (
          <div className="text-center mt-6">
            <button
              onClick={() => fetchComments(currentPage + 1, true)}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? 'Loading...' : 'Load More Comments'}
            </button>
          </div>
        )}
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          mode={authMode}
        />
      </div>
    </div>
  );
}

export default App;