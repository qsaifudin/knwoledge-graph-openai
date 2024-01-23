// routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const nodeController = require('../controllers/nodeController');

router.get('/node/:label', nodeController.getNodesByLabel);
router.get('/node/', nodeController.getAllNodes);
router.post('/node', nodeController.createNode);
router.post('/node-query-full', nodeController.createNodeFromQueryfuLL);
router.post('/node-query', nodeController.createNodeFromQuery);
router.put('/node/:id', nodeController.updateNode);
router.delete('/node/delete/:id', nodeController.deleteNode);
router.delete('/node/delete-all', nodeController.deleteAllNode);

module.exports = router;
