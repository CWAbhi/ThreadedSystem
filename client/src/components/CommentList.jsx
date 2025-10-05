import React from 'react';
import Comment from './Comment';

const CommentList = ({ comments, onReply, onLike }) => {
  if (!comments || comments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No comments yet. Be the first to comment!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <Comment
          key={comment._id}
          comment={comment}
          onReply={onReply}
          onLike={onLike}
          depth={0}
        />
      ))}
    </div>
  );
};

export default CommentList;


