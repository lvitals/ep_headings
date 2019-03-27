var _ = require('ep_etherpad-lite/static/js/underscore');

var tags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'code'];

exports.collectContentPre = function(hook, context){
  var heading = /(?:^| )heading:([A-Za-z0-9]*)/.exec(context.cls);
  if(heading && heading[1]){
    context.cc.doAttrib(context.state, "heading::" + heading[1]);
  }
};

// I don't even know when this is run..
exports.collectContentPost = function(hook, context){

};

