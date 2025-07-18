const express = require('express');
const router = express.Router();

const { upload, signup, login, verifyToken, getUserInfo, getAllUsers, logout, updateUserRole, resetPassword, forgotPassword, verifyCode, updateProfile } = require('../controller/UserController');

const { addToCart, removeFromCart, getUserCart, clearCart } = require('../controller/CartController');

router.post('/signup', upload.single('image'), signup);
router.post('/login', login);

router.put('/updateUserRole', verifyToken, updateUserRole);
router.get('/user', verifyToken, getUserInfo);
router.get('/allUsers', verifyToken, getAllUsers);

router.post('/logout', verifyToken, logout);
// router.post('/logout',  logout);

router.post('/addCart', verifyToken, addToCart); 
router.get('/getUserCart', verifyToken, getUserCart);
router.delete('/deleteCart/:id', verifyToken, removeFromCart);
router.delete('/clearCart', verifyToken, clearCart); 


router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/verify-code', verifyCode);


router.post('/verify-code', );

router.put("/update-profile", verifyToken, upload.single("image"), updateProfile
);



module.exports = router;
