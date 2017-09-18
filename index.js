var path = require('path')
  , fs = require('fs')

var mMapHandler;

var MapHandler = function () {
  var self = this;

  var mAppMap = {}
    , mTestMap = {};

  self.handleMap = function(map, callback){
    switch (map){
      case 'app' :
        if (mAppMap==null) {
          self.appMap(function(mMap){
            mAppMap = mMap;
            callback(mAppMap);
          });
        }
        else {
          callback(mAppMap);
        }        
        break;
      case 'test' :
        if (mTestMap==null) {
          self.testMap(function(mMap){
            mTestMap = mMap;
            callback(mTestMap);
          });
        }
        else {
          callback(mTestMap);
        }        
        break;
      default:
        return null;      
    }
  }

  self.appMap = function(callback){
    var mMap = {};
    var root = path.dirname(require.main.filename);
    createMap(path.join(root, 'app'), function(map){
      mMap['app'] = map;
    })
    createMap(path.join(root, 'config'), function(map){
      mMap['config'] = map;
    })
    mMap['log']=path.join(root, 'log');
    mMap['map']=path.join(root, 'map');
    callback(mMap);
  }

  self.testMap = function(callback){
    callback('ey');
  }

}

var createMap = function(directory, callback){
  var schema = {};
  var dirMap = fs.readdirSync(directory);
  dirMap.forEach(function(dir,i,a) {
    var dirPath = path.join(directory, dir);
    var stats = fs.lstatSync(dirPath);
    if (stats.isDirectory()) {
      createMap(dirPath, function(structure){
        schema[dir]=structure;
      });
    } else {
      var splits = dir.split('.');
      var extension = splits[splits.length - 1];
      if(extension=='js'){
        var name = dir.split('.')[0];
        schema[name]=dirPath;
      }
    }
  });
  callback(schema);
}

/*var appMap = function(){
  var mMap = {};
  var root = path.dirname(require.main.filename);
  createMap(path.join(root, 'app'), function(map){
    mMap['app'] = map;
  })
  createMap(path.join(root, 'config'), function(map){
    mMap['config'] = map;
  })
  mMap['log']=path.join(root, 'log');
  mMap['map']=path.join(root, 'map');
  myAppMap = mMap;
  return mMap;
}*/

var dirMap = function(root){
  var mMap = {};
  if(!root || root==null || !root.trim().length>0) {
    return false
  }
  else {
    createMap(root, function(map){
      mMap = map;
    })
  }
  return mMap;
}



//module.exports.dirMap = function(root) { return dirMap(root); }

//module.exports.appMap = function() { return appMap(); }

module.exports = {

  dirMap : function(root) { 
    return dirMap(root); 
  },

  appMap : function() {
    if (mMapHandler==null) {
      mMapHandler = new MapHandler();
    }
    mMapHandler.handleMap('app', function(map){
      return map;
    }); 
  },

  testMap : function() { 
    if (mMapHandler==null) {
      mMapHandler = new MapHandler();
    }
    return mMapHandler.handleMap('test', function(map){
      return map;
    }); 
  }

}