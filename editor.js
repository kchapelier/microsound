// TODO code highlighting
// TODO auto-completion ? might be more annoying than anything in this context
// TODO display errors in the interface

//var langTools = ace.require("ace/ext/language_tools");
var Range = ace.require('ace/range').Range;

var Editor = function Editor(content) {
  this.element = document.createElement('div');
  this.element.clasName = 'editor';
  this.element.innerText = content;

  this.editor = ace.edit(this.element);
  this.session = this.editor.getSession();

  this.editor.$blockScrolling = Infinity;
  //langTools.setCompleters([glslCompleter, preProcessorCompleter]);
  this.editor.setOptions({
      theme: 'ace/theme/tomorrow_night_bright',
      newLineMode: 'unix',
      fixedWidthGutter: true,
      scrollPastEnd: true,
      tabSize: 2,
      useSoftTabs: true,
      displayIndentGuides: false,
      showInvisibles: false,
      showPrintMargin: false,
      enableSnippets: false,
      enableBasicAutocompletion: false,
      enableLiveAutocompletion: false
  });

  //this.session.setMode("ace/mode/glsl");
};

Editor.prototype.appendTo = function (element) {
    element.appendChild(this.element);
    this.editor.resize();
};

Editor.prototype.show = function () {
    this.element.classList.add('active');
    this.editor.resize();
};

Editor.prototype.hide = function () {
    this.element.classList.remove('active');
};

Editor.prototype.setContent = function (content) {
    this.session.setValue(content)
};

Editor.prototype.getContent = function () {
    return this.session.getValue()
};
