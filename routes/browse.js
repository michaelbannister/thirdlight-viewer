var express = require('express');
var router = express.Router();
var thirdlight = require('../lib/thirdlight');

/* GET folder listing. */
router.get('/', function(req, res, next) {
  thirdlight.Folders.GetTopLevelFolders().then(function(folders) {
    addLinkPropertyToFolders(folders);
    res.render('folders', {folders: folders});
  })
});

router.get('/:folderId', function (req, res, next) {
  thirdlight.Folders.GetContainersForParent(req.params.folderId).then(function (folders) {
    addLinkPropertyToFolders(folders);
    res.render('folders', {folders: folders});
  })
});

router.get('/:folderId/assets', function (req, res, next) {
  thirdlight.Files.GetAssetsForParent(req.params.folderId).then(function(assets) {
    console.log(assets);
    res.render('assets', {assets:assets});
  });
});

function addLinkPropertyToFolders(folders) {
  for (var id in folders) {
    var f = folders[id];
    if (f.hasChildAssets) {
      f.link = '/f/' + f.id + '/assets';
    } else {
      f.link = '/f/' + f.id;
    }
  }
}

module.exports = router;
