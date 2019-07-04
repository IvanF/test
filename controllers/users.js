const https = require('https');
const url = require('url');

const common = {
    getRemote: function (req, res, remoteURL, remotePath, encoding, callback) {
        var client_options = {
            host: remoteURL,
            path: remotePath,
            method: 'GET'
        };
        var request = https.request(client_options, function (response) {
            res.status(response.statusCode);
            response.setEncoding(encoding);
            response.on('data', function (chunk) {
                callback(chunk);
            });
        });
        request.on('error', function(err) {
            res.status(500);
            res.send({remote:err});
        });
        request.end();
    }
};

module.exports = {
    getOne: function (req, res) {
        var id = req.params.id;
        var remoteURL = "reqres.in";
        var remotePath = '/api/users/' + id;
        common.getRemote(req, res, remoteURL, remotePath, 'utf8', function (data) {
            res.send(data);
        });
    },
    getAvatar: function (req, res) {
        var id = req.params.id;
        var remoteURL = "reqres.in";
        var remotePath = '/api/users/' + id;
        common.getRemote(req, res, remoteURL, remotePath, 'utf8', function (data) {
            var userData = JSON.parse(data);
            var avatarURL = url.parse(userData.data.avatar);
            var remoteURL = avatarURL.host;
            var remotePath = avatarURL.path;
            common.getRemote(req, res, remoteURL, remotePath, 'binary', function (data) {

                var fs = require('fs');
                fs.writeFile("./public/avatar/avatar.jpg", data, 'binary', function (err) {
                    if (err) {
                        res.send({remote:err});
                    }
                    var base64data = new Buffer(data).toString('base64');
                    res.send(base64data);
                });
            });
        });
    },
    deleteAvatar: function (req, res) {
        var fs = require('fs');
        fs.unlink("./public/avatar/avatar.jpg", function (err) {
            if (err){
                res.send({remote:err});
            }
            res.send({status:"file has been removed"});
        });
    }
};