const express = require('express');
const router = express.Router();
const sweetController = require('../controllers/sweetController');
const { auth, adminAuth } = require('../middleware/auth');

router.get('/', sweetController.getAllSweets);
router.get('/search', sweetController.searchSweets);

router.post('/', auth, adminAuth, sweetController.createSweet);
router.put('/:id', auth, adminAuth, sweetController.updateSweet);
router.delete('/:id', auth, adminAuth, sweetController.deleteSweet);
router.post('/:id/purchase', auth, sweetController.purchaseSweet);
router.post('/:id/restock', auth, adminAuth, sweetController.restockSweet);

module.exports = router;