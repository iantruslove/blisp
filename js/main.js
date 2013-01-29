var blisp = window.blisp || {};

// Model
blisp.replModel = (function () {
  var model = _.extend({}, Backbone.Events),
      commands = [],
      buildCommand, handleNewCommand;

  buildCommand = function (commandType, commandText) {
    return { type: commandType, value: commandText };
  };

  handleNewCommand = function (commandType, commandText) {
    var command = buildCommand(commandType, commandText);
    commands.push(command);
    model.trigger("newCommand", command);
  };

  model.addCommand = function (commandText) {
    handleNewCommand("command", commandText);
  };

  model.addResponse = function (responseText) {
    handleNewCommand("response", responseText);
  };

  model.addComment = function (commentText) {
    handleNewCommand("comment", commentText);
  };

  return model;
}());

// Controller
blisp.replController = (function (model) {
  var controller = {}, executeBlisp, getHelpText;

  executeBlisp = function (blisp) {
    // TODO
    return "not yet implemented";
  };

  getHelpText = function () {
    var helpEl = document.getElementById('helpText');
    return (helpEl ? helpEl.innerHTML : "no help available");
  };

  controller.submitCode = function (blisp) {
    var response, code;
    code = blisp.trim();

    model.addCommand(code);

    if (code === ":help") {
      response = getHelpText();
      model.addComment(response);
    } else {
      response = executeBlisp(code);
      model.addResponse(response);
    }

  };

  return controller;
}(blisp.replModel));

// View
blisp.replView = (function (editorSelector, controller, model) {
  var view = {},
      $el = $(editorSelector),
      $repl = $el.find('.repl'),
      getNewCode, remoteLastTypedCommand, getReadyForInput,
      onNewCommand, showNewResponse, showNewInput, showNewComment,
      placeCaretAtEnd, setEndOfContenteditable;

  getNewCode = function() {
    return $repl.find('.currentInput').html();
  };

  remoteLastTypedCommand = function () {
    $repl.find('.currentInput').remove();
  };

  getReadyForInput = function () {
    $repl.append("<li class='currentInput' autocapitalize='off' spellcheck='false' autocorrect='off' contenteditable='true'></li>");
    var el = $repl.find('.currentInput').get(0);
    placeCaretAtEnd(el);
  };

  onNewCommand = function (command) {
    if (command.type === "command")  {
      showNewInput(command.value);
    } else if (command.type === "comment") {
      showNewComment(command.value);
    } else if (command.type === "response") {
      showNewResponse(command.value);
    }
  }

  showNewResponse = function (newResponse) {
    $repl.append("<li class='output'>" + newResponse + "</li>");
    getReadyForInput();
  };

  showNewInput = function (newCommand) {
    $repl.append("<li class='oldInput'>" + newCommand + "</li>");
  };

  showNewComment = function (newComment) {
    $repl.append("<li class='comment'>" + newComment + "</li>");
    getReadyForInput();
  };

  placeCaretAtEnd = function (el) {
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

  setEndOfContenteditable = function (contentEditableElement) {
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
    if (/*e.ctrlKey &&*/ e.keyCode == 13) {
      // Ctrl-Enter pressed
      var newCode;
      e.preventDefault();
      newCode = getNewCode();
      remoteLastTypedCommand();
      controller.submitCode(newCode);
    }
  });

  model.on("newCommand", onNewCommand, view);
  getReadyForInput();

  return view;
}('.blispInput', blisp.replController, blisp.replModel));




