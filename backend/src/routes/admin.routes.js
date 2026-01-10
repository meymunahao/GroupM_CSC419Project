const router = require('express').Router();
const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');

router.get('/users', auth, role(['ADMIN']), (req, res) => {
  res.json({ message: 'Admin access granted' });
});

module.exports = router;
