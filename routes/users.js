var express = require('express');
var router = express.Router();
var users = require('../controllers/users');

router.get('/api/user/:id', function(req, res) {
    users.getOne(req, res);
});

router.get('/api/user/:id/avatar', function(req, res) {
    users.getAvatar(req, res);
});

router.delete('/api/user/:id/avatar', function(req, res) {
    users.deleteAvatar(req, res);
});

module.exports = router;
