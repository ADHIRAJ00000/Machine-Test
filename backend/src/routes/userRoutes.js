const express = require('express');
const router = express.Router();
const {
    authUser,
    registerAgent,
    getAgents,
    registerUser,
    deleteUser,
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/login', authUser);
router.post('/', registerUser);
router.route('/agents').post(protect, admin, registerAgent).get(protect, admin, getAgents);
router.route('/:id').delete(protect, admin, deleteUser);

module.exports = router;
