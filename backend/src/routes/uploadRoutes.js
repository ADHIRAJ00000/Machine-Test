const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const {
    uploadAndDistribute,
    getAllLists,
    getAgentList,
    updateListItemStatus,
    clearAllLists,
    deleteListItem,
} = require('../controllers/uploadController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, upload.single('file'), uploadAndDistribute);
router.get('/lists', protect, getAllLists);
router.get('/agent-list/:id', protect, getAgentList);
router.route('/item/:id').put(protect, updateListItemStatus).delete(protect, admin, deleteListItem);
router.delete('/lists', protect, admin, clearAllLists);

module.exports = router;
