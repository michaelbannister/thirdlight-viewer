var rest = require('rest');
var mime = require('rest/interceptor/mime');
var client = rest.wrap(mime);

var thirdlight = {};

var sessionId;
var endpointUrl;

thirdlight.initialise = function (url, apiKey, username) {
  username = username || 'browse_api';
  endpointUrl = url + '/api.json.tlx';

  return callApi('Core.LoginWithKey', {
        apikey: apiKey,
        options: {
          persistent: true
        }
      }, true)
    .then(function(outParams) {
      sessionId = outParams.sessionId;
    })
    .then(function() {
      return callApi('Core.ImpersonateUser', {
        userRef: username,
        lookupType: 'username'
      });
    });
};

thirdlight.Folders = {};
thirdlight.Folders.GetTopLevelFolders = function() {
  return callApi('Folders.GetTopLevelFolders').then(function(data) {console.log(data); return data;});
};
thirdlight.Folders.GetContainersForParent = function(folderId) {
  return callApi('Folders.GetContainersForParent', {containerId: folderId}).then(function(data) {console.log(data); return data;});
};
thirdlight.Files = {};
thirdlight.Files.GetAssetsForParent = function(folderId) {
  return callApi('Files.GetAssetsForParent', {containerId: folderId})
}

function parseResponseOrFail(response) {
  if (response && response.entity && response.entity.result && response.entity.result.action === 'OK') {
    return response.entity.outParams || {};
  } else {
    throw new Error(response);
  }
}

function callApi(action, params, excludeSessionId) {
  var restParams = {
    path: endpointUrl,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    entity: {
      action: action,
      apiVersion: '1.0'
    }
  };
  if (!excludeSessionId) {
    restParams.entity.sessionId = sessionId;
  }
  if (params) {
    restParams.entity.inParams = params;
  }
  return client(restParams).then(parseResponseOrFail);
}

module.exports = thirdlight;
