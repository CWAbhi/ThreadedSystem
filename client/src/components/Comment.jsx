import React, { useState } from 'react';
import { formatTimestamp, generateAvatar } from '../utils/helpers';
import { api } from '../utils/api';

const Comment = ({ comment, onReply, onLike, depth = 0 }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReplies, setShowReplies] = useState(true);
  const [loadedReplies, setLoadedReplies] = useState([]);
  const [hasMoreReplies, setHasMoreReplies] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  const { color, initial } = generateAvatar(comment.author);
  const hasReplies = comment.children && comment.children.length > 0;

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setIsSubmitting(true);
    try {
      await api.createComment({
        text: replyText,
        author: 'Anonymous User',
        parentId: comment.id,
      });
      setReplyText('');
      setIsReplying(false);
      onReply();
    } catch (error) {
      console.error('Failed to create reply:', error);
      alert('Failed to create reply. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async () => {
    try {
      const response = await api.likeComment(comment.id);
      comment.likes = response.likes;
      onLike();
    } catch (error) {
      console.error('Failed to like comment:', error);
      console.log('Like failed, but continuing...');
    }
  };

  const loadMoreReplies = async () => {
    setIsLoadingMore(true);
    try {
      const response = await api.getReplies(comment.id, loadedReplies.length, 5);
      setLoadedReplies(prev => [...prev, ...response.replies]);
      setHasMoreReplies(response.pagination.hasMore);
    } catch (error) {
      console.error('Failed to load more replies:', error);
      alert('Failed to load more replies. Please try again.');
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <div className={`relative ${depth > 0 ? 'ml-12' : ''}`}>
      {depth > 0 && (
        <div className="absolute -left-12 top-0 w-12 h-20 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 48 80" overflow="visible">
            {/* Main vertical line - starts from parent comment */}
            <line
              x1="12"
              y1="0"
              x2="12"
              y2="40"
              stroke="#9ca3af"
              strokeWidth="1.5"
              className="transition-all duration-300"
            />
            <line
              x1="12"
              y1="20"
              x2="0"
              y2="20"
              stroke="#9ca3af"
              strokeWidth="1.5"
              className="transition-all duration-300"
            />
            <circle
              cx="12"
              cy="20"
              r="1.5"
              fill="#9ca3af"
              className="transition-all duration-300"
            />
          </svg>
        </div>
      )}

      <div className="bg-white p-4 mb-4 transition-all duration-200 hover:bg-gray-50">
        {/* Comment Header */}
        <div className="flex items-start space-x-3 mb-3">
          <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center text-white font-semibold text-sm flex-shrink-0`}>
            <img 
              src={`https://ui-avatars.com/api/?name=${comment.author}&background=${color.replace('bg-', '')}&color=fff&size=40`}
              alt={comment.author}
              className="w-full h-full rounded-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'block';
              }}
            />
            <span className="hidden">{initial}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <span className="font-bold text-gray-900 text-sm">{comment.author}</span>
              <span className="text-gray-500 text-xs">{formatTimestamp(comment.timestamp)}</span>
            </div>
            <p className="text-gray-800 text-sm leading-relaxed mb-2">
              {comment.text}
            </p>
            <div className="flex items-center space-x-4 text-sm">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-1 transition-colors duration-200 ${
                  comment.likes > 0 
                    ? 'text-red-600 hover:text-red-800' 
                    : 'text-gray-600 hover:text-red-600'
                }`}
                disabled={isSubmitting}
              >
                <svg className="w-4 h-4" fill={comment.likes > 0 ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>{comment.likes || 0}</span>
              </button>

              <button
                onClick={() => setIsReplying(!isReplying)}
                className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
              >
                Reply
              </button>
            </div>
          </div>
        </div>
        {isReplying && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <form onSubmit={handleReply} className="flex space-x-3">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                className="flex-1 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                rows="2"
                disabled={isSubmitting}
              />
              <div className="flex flex-col space-y-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !replyText.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-sm"
                >
                  {isSubmitting ? 'Posting...' : 'Reply'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsReplying(false);
                    setReplyText('');
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
      {hasReplies && showReplies && (
        <div className="space-y-2">
          {(loadedReplies.length > 0 ? loadedReplies : comment.children.slice(0, 2)).map((child) => (
            <Comment
              key={child._id}
              comment={child}
              onReply={onReply}
              onLike={onLike}
              depth={depth + 1}
            />
          ))}
          {comment.children.length > 2 && (
            <div className="ml-8 mt-2">
              <button
                onClick={loadMoreReplies}
                disabled={isLoadingMore}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200 disabled:opacity-50"
              >
                {isLoadingMore ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    <span>+ {comment.children.length - (loadedReplies.length || 2)} more replies</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}
      {hasReplies && !showReplies && (
        <div className="ml-12">
          <button
            onClick={() => setShowReplies(true)}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            <span>{comment.children.length} more {comment.children.length === 1 ? 'reply' : 'replies'}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Comment;