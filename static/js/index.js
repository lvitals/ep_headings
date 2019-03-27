var _, $, jQuery;

var $ = require('ep_etherpad-lite/static/js/rjquery').$;
var _ = require('ep_etherpad-lite/static/js/underscore');
var cssFiles = ['ep_headings/static/css/editor.css'];

// All our tags are block elements, so we just return them.
var tags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'code'];
exports.aceRegisterBlockElements = function(){
  return tags;
}

// Bind the event handler to the toolbar buttons
exports.postAceInit = function(hook, context){
  var hs = $('#heading-selection');
  hs.on('change', function(){
    var value = $(this).val();
    var intValue = parseInt(value,10);
    if(!_.isNaN(intValue)){
      context.ace.callWithAce(function(ace){
        ace.ace_doInsertHeading(intValue);
      },'insertheading' , true);
      hs.val("dummy");
    }
  })
};

// Our heading attribute will result in a heaading:h1... :h6 class
exports.aceAttribsToClasses = function(hook, context){
  console.log(context);
  if(context.key == 'heading'){
    return ['heading:' + context.value ];
  }
}

// Here we convert the class heading:h1 into a tag
exports.aceCreateDomLine = function(name, context){
  var cls = context.cls;
  var domline = context.domline;
  var headingType = /(?:^| )heading:([A-Za-z0-9]*)/.exec(cls);
  
  var tagIndex;
  if (headingType) tagIndex = _.indexOf(tags, headingType[1]);

  if (tagIndex !== undefined && tagIndex >= 0){
    var tag = tags[tagIndex];
    var modifier = {
      extraOpenTags: '<' + tag + '>',
      extraCloseTags: '</' + tag + '>',
      cls: cls
    };
    return [modifier];
  }
  return [];
};

// Find out which lines are selected and assign them the heading attribute.
// Passing a level >= 0 will set a heading on the selected lines, level < 0 
// will remove it
function doInsertHeading(level){
  var rep = this.rep,
    documentAttributeManager = this.documentAttributeManager;
  if (!(rep.selStart && rep.selEnd) || (level >= 0 && tags[level] === undefined)){
    return;
  }

  var new_heading = ["heading", ""];
  if(level >= 0) {
    new_heading = ["heading", tags[level]];
  }

  documentAttributeManager.setAttributesOnRange(rep.selStart, rep.selEnd, [new_heading]);

}

// Once ace is initialized, we set ace_doInsertHeading and bind it to the context
exports.aceInitialized = function(hook, context){
  var editorInfo = context.editorInfo;
  editorInfo.ace_doInsertHeading = _(doInsertHeading).bind(context);
}

exports.aceEditorCSS = function(){
  return cssFiles;
};

