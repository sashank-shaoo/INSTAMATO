const express = require('express');
const foodController = require('../controllers/food.controller');
const authMiddlewares = require('../middlewares/auth.middlewares');
const likeController = require("../controllers/likes.controller");
const saveFoodController = require("../controllers/saveFood.controller");
const router = express.Router();
const multer = require('multer');

const upload = multer({ 
    storage: multer.memoryStorage()
 });


//Post /api/food  - create food item [protected route - food partner]
router.post('/', authMiddlewares.authenticateFoodPartner,upload.single("video"), foodController.createFoodItem);

// GET /api/food - get all food items [public route] for users
router.get('/', authMiddlewares.authenticateUser, foodController.getAllFoodItems);

// POST /api/food/like - like a food item [protected route - user]
router.post('/:foodId/like', authMiddlewares.authenticateUser, likeController.likeFoodItem);

//post /api/food/save - save a food item [protected route - user]
router.post('/:foodId/save', authMiddlewares.authenticateUser, saveFoodController.saveFoodItem);

module.exports = router;