var blisp = window.blisp || {};

// Model
blisp.replModel = (function () {
  var model = _.extend({}, Backbone.Events),
      commands = [],
      responses = [];

  model.addCommand = function (command) {
    commands.push(command);
    model.trigger("newCommand", command);
  };

  model.addResponse = function (response) {
    responses.push(response);
    model.trigger("newResponse", response);
  }

  return model;
}());

// Controller
blisp.replController = (function (model) {
  var controller = {},
      executeBlisp = function (blisp) {
        // TODO
        return "not yet implemented";
      };

  controller.submitCode = function (code) {
    model.addCommand(code.trim());
    var response = executeBlisp(code);
    model.addResponse(response);
  };

  return controller;
}(blisp.replModel));

// View
blisp.replView = (function (editorSelector, controller, model) {
  var view = {},
      $el = $(editorSelector),
      $repl = $el.find('.repl');

  var getNewCode = function() {
    return $repl.find('.currentInput').html();
  };

  var remoteLastTypedCommand = function () {
    $repl.find('.currentInput').remove();
  };

  var getReadyForInput = function () {
    $repl.append("<li class='currentInput' autocapitalize='off' spellcheck='false' autocorrect='off' contenteditable='true'></li>");
    var el = $repl.find('.currentInput').get(0);
    placeCaretAtEnd(el);

  };

  var onNewResponse = function (newResponse) {
    $repl.append("<li class='output'>" + newResponse + "</li>");
    getReadyForInput();
  };

  var onNewCommand = function (newCommand) {
    $repl.append("<li class='oldInput'>" + newCommand + "</li>");
  };

  function placeCaretAtEnd(el) {
    // from http://stackoverflow.com/questions/4233265/contenteditable-set-caret-at-the-end-of-the-text-cross-browser
    el.focus();
    if (typeof window.getSelection != "undefined" && typeof document.createRange != "undefined") {
      var range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    } else if (typeof document.body.createTextRange != "undefined") {
      var textRange = document.body.createTextRange();
      textRange.moveToElementText(el);
      textRange.collapse(false);
      textRange.select();
    }
  }

  var setEndOfContenteditable = function (contentEditableElement) {
    // from http://stackoverflow.com/questions/1125292/how-to-move-cursor-to-end-of-contenteditable-entity/3866442#3866442
    var range,selection;
    if (document.createRange) { //Firefox, Chrome, Opera, Safari, IE 9+
      range = document.createRange();
      range.selectNodeContents(contentEditableElement);
      range.collapse(false);
      selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    } else if (document.selection) { //IE 8 and lower
      range = document.body.createTextRange();
      range.moveToElementText(contentEditableElement);
      range.collapse(false);
      range.select();
    }
  }

  $el.keydown(function (e) {
    if (e.ctrlKey && e.keyCode == 13) {
      // Ctrl-Enter pressed
      var newCode;
      e.preventDefault();
      newCode = getNewCode();
      remoteLastTypedCommand();
      controller.submitCode(newCode);
    }
  });

  model.on("newResponse", onNewResponse, view);
  model.on("newCommand", onNewCommand, view);
  getReadyForInput();

  return view;
}('.blispInput', blisp.replController, blisp.replModel));




