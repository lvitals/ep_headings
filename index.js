var eejs = require('ep_etherpad-lite/node/eejs/');
var _ = require('ep_etherpad-lite/static/js/underscore');

// var Changeset = require("ep_etherpad-lite/static/js/Changeset");
// var Security = require('ep_etherpad-lite/static/js/security');

exports.eejsBlock_editbarMenuLeft = function (hook_name, args, cb) {
  args.content = args.content + eejs.require("ep_headings/templates/editbarButtons.ejs");
  return cb();
}

// Add the props to be supported in export
exports.exportHtmlAdditionalTagsWithData = function(hook, pad, cb){
  var headings_used = findAllHeadingUsedOn(pad);
  var tags = transformHeadingsIntoTags(headings_used);

  cb(tags);
};

// Iterate over pad attributes to find only the color ones
function findAllHeadingUsedOn(pad) {
  var headings_used = [];

  pad.pool.eachAttrib(function(key, value){
    if (key === "heading") {
      headings_used.push(value);
    }
  });

  return headings_used;
}

// Transforms an array of heading names into heading tags like ["heading", "h1"]
function transformHeadingsIntoTags(heading_names) {
  return _.map(heading_names, function(heading_name) {
    return ["heading", heading_name];
  });
}

// Include CSS for HTML export
exports.stylesForExport = function(hook, padId, cb){
  var style = eejs.require("ep_headings/static/css/editor.css");
  cb(style);
};


// TODO: when "asyncLineHTMLForExport" hook is available on Etherpad, use it instead of "getLineHTMLForExport"
// exports.asyncLineHTMLForExport = function (hook, context, cb) {
//   cb(rewriteLine);
// }

exports.getLineHTMLForExport = function (hook, context) {
  rewriteLine(context);
}

function rewriteLine(context){
  var lineContent = context.lineContent;
  lineContent = replaceDataByClass(lineContent);
  // TODO: when "asyncLineHTMLForExport" hook is available on Etherpad, return "lineContent" instead of re-setting it
  context.lineContent = lineContent;
}

// Change from <span data-heading:x  to <span class:heading:x
function replaceDataByClass(text) {
  return text.replace(/data-heading=["|']([0-9a-zA-Z]+)["|']/gi, "class='heading:$1'");
}



// // Define the styles so they are consistant between client and server
// var style = "h1{font-size: 2.0em;line-height: 120%;} \
//   h2{font-size: 1.5em;line-height: 120%;} \
//   h3{font-size: 1.17em;line-height: 120%;} \
//   h4{line-height: 120%;} \
//   h5{font-size: 0.83em;line-height: 120%;} \
//   h6{font-size: 0.75em;line-height: 120%;} \
//   code{font-family: monospace;}";

// // Include CSS for HTML export
// exports.stylesForExport = function(hook, padId, cb){
//   cb(style);
// };

// // line, apool,attribLine,text
// exports.getLineHTMLForExport = function (hook, context) {
//   console.log(context);
//   var header = _analyzeLine(context.attribLine, context.apool);
//   if (header) {
//     return "<" + header + ">" + Security.escapeHTML(context.text.substring(1)) + "</" + header + ">";
//   }
// }

// function _analyzeLine(alineAttrs, apool) {
//   var header = null;
//   if (alineAttrs) {
//     var opIter = Changeset.opIterator(alineAttrs);
//     if (opIter.hasNext()) {
//       var op = opIter.next();
//       header = Changeset.opAttributeValue(op, 'heading', apool);
//     }
//   }
//   return header;
// }
