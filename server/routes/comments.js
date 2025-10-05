const express = require('express');
const {
  getComments,
  createComment,
  likeComment,
  getReplies
} = require('../controllers/commentController');

const router = express.Router();
router.get('/', getComments);
router.get('/:id/replies', getReplies);
router.post('/', createComment);
router.post('/:id/like', likeComment);
module.exports = router;