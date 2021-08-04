const router = require('express').Router();

router.use('/auth', require('./auth'));
router.use('/orders', require('./orders'));
router.use('/delivery', require('./delivery'));

  
module.exports = router;