let comments = [];
let nextId = 1;

const buildHierarchy = (allComments, rootCommentsToProcess = null) => {
  const commentMap = new Map();
  const rootComments = rootCommentsToProcess || [];
  allComments.forEach(comment => {
    comment.children = [];
    commentMap.set(comment.id, comment);
  });
  if (rootCommentsToProcess) {
    rootCommentsToProcess.forEach(rootComment => {
      rootComment.children = [];
      commentMap.set(rootComment.id, rootComment);
    });
  } else {
    allComments.forEach(comment => {
      if (comment.parentId) {
        const parent = commentMap.get(comment.parentId);
        if (parent) {
          parent.children.push(comment);
        }
      } else {
        rootComments.push(comment);
      }
    });
  }
  allComments.forEach(comment => {
    if (comment.parentId) {
      const parent = commentMap.get(comment.parentId);
      if (parent) {
        parent.children.push(comment);
      }
    }
  });
  const sortComments = (comments) => {
    comments.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    comments.forEach(comment => {
      if (comment.children.length > 0) {
        sortComments(comment.children);
      }
    });
  };

  sortComments(rootComments);
  return rootComments;
};
const getComments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const rootComments = comments.filter(comment => !comment.parentId);
    const totalRootComments = rootComments.length;
    const totalPages = Math.ceil(totalRootComments / limit);
    const paginatedRootComments = rootComments
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(skip, skip + limit);
    const hierarchicalComments = buildHierarchy(comments, paginatedRootComments);

    res.json({
      comments: hierarchicalComments,
      pagination: {
        page,
        limit,
        total: totalRootComments,
        pages: totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
};
const createComment = async (req, res) => {
  try {
    const { text, author, parentId } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Comment text is required' });
    }

    if (!author || !author.trim()) {
      return res.status(400).json({ error: 'Author is required' });
    }

    if (text.length > 1000) {
      return res.status(400).json({ error: 'Comment text is too long (max 1000 characters)' });
    }

    if (author.length > 50) {
      return res.status(400).json({ error: 'Author name is too long (max 50 characters)' });
    }
    if (parentId) {
      const parentComment = comments.find(c => c.id === parentId);
      if (!parentComment) {
        return res.status(404).json({ error: 'Parent comment not found' });
      }
    }

    const comment = {
      _id: `comment_${nextId}`,
      id: nextId++,
      text: text.trim(),
      author: author.trim(),
      parentId: parentId || null,
      likes: 0,
      timestamp: new Date().toISOString()
    };

    comments.push(comment);

    res.status(201).json(comment);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ error: 'Failed to create comment' });
  }
};
const likeComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = comments.find(c => c.id == id);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    comment.likes += 1;

    res.json({ likes: comment.likes });
  } catch (error) {
    console.error('Error liking comment:', error);
    res.status(500).json({ error: 'Failed to like comment' });
  }
};

const getReplies = async (req, res) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = parseInt(req.query.skip) || 0;

    const comment = comments.find(c => c.id == id);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    const directReplies = comments
      .filter(c => c.parentId == id)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    const totalReplies = directReplies.length;
    const paginatedReplies = directReplies.slice(skip, skip + limit);
    const hierarchicalReplies = buildHierarchy(comments, paginatedReplies);

    res.json({
      replies: hierarchicalReplies,
      pagination: {
        page,
        limit,
        skip,
        total: totalReplies,
        hasMore: skip + limit < totalReplies
      }
    });
  } catch (error) {
    console.error('Error fetching replies:', error);
    res.status(500).json({ error: 'Failed to fetch replies' });
  }
};

module.exports = {
  getComments,
  createComment,
  likeComment,
  getReplies
};