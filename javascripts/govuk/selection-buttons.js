(function () {
  "use strict"
  var root = this,
      $ = root.jQuery;

  if (typeof GOVUK === 'undefined') { root.GOVUK = {}; }

  var BaseButtons = function ($elms, opts) {
    this.selectedClass = 'selected';
    this.focusedClass = 'focused';
    if (opts !== undefined) {
      $.each(opts, function (optionName, optionObj) {
        this[optionName] = optionObj;
      }.bind(this));
    }
    this.setEventNames();
    this.setInitialState($elms);
    this.bindEvents($elms);
  };
  BaseButtons.prototype.setEventNames = function () {
    this.selectionEvents = 'click';
    this.focusEvents = 'focus blur';
  };
  BaseButtons.prototype.markFocused = function ($elm, state) {
    if (state === 'focused') {
      $elm.parent('label').addClass(this.focusedClass);
    } else {
      $elm.parent('label').removeClass(this.focusedClass);
    }
  };
  BaseButtons.prototype.setInitialState = function ($elms) {
    $.each($elms, function (index, elm) {
      var $elm = $(elm);

      if ($elm.is(':checked')) {
        this.markSelected($elm);
      }
    }.bind(this));
  };
  BaseButtons.prototype.bindEvents = function ($elms) {
    var selectionEventHandler = function (e) {
          this.markSelected($(e.target));
        }.bind(this),
        focusEventHandler = function (e) {
          var state = (e.type === 'focus') ? 'focused' : 'blurred';

          this.markFocused($(e.target), state);
        }.bind(this);

    if (typeof this.selector !== 'undefined') {
      $(document)
        .on(this.selectionEvents, this.selector, selectionEventHandler)
        .on(this.focusEvents, this.selector, focusEventHandler);
    } else {
      $elms
        .on(this.selectionEvents, selectionEventHandler)
        .on(this.focusEvents, focusEventHandler);
    }
  };

  var RadioButtons = function ($elms, opts) {
    BaseButtons.apply(this, arguments);
  };
  RadioButtons.prototype.setEventNames = function () {
    // some browsers fire the 'click' when the selected radio changes by keyboard
    this.selectionEvents = 'click change';
    this.focusEvents = 'focus blur';
  };
  RadioButtons.prototype.setInitialState = function () {
    BaseButtons.prototype.setInitialState.apply(this, arguments);
  };
  RadioButtons.prototype.bindEvents = function () {
    BaseButtons.prototype.bindEvents.apply(this, arguments);
  };
  RadioButtons.prototype.markSelected = function ($elm) {
    var radioName = $elm.attr('name'),
        $radiosInGroup = $($elm[0].form).find('input[name="' + radioName + '"]');

    $radiosInGroup
      .parent('label')
      .removeClass(this.selectedClass);
    $elm.parent('label').addClass(this.selectedClass);
  };
  RadioButtons.prototype.markFocused = function ($elm) {
    BaseButtons.prototype.markFocused.apply(this, arguments);
  };

  var CheckboxButtons = function ($elms, opts) {
    BaseButtons.apply(this, arguments);
  };
  CheckboxButtons.prototype.setEventNames = function () {
    BaseButtons.prototype.setEventNames.call(this);
  };
  CheckboxButtons.prototype.setInitialState = function ($elms) {
    BaseButtons.prototype.setInitialState.apply(this, arguments);
  };
  CheckboxButtons.prototype.bindEvents = function ($elms) {
    BaseButtons.prototype.bindEvents.apply(this, arguments);
  };
  CheckboxButtons.prototype.markSelected = function ($elm) {
    if ($elm.is(':checked')) {
      $elm.parent('label').addClass(this.selectedClass);
    } else {
      $elm.parent('label').removeClass(this.selectedClass);
    }
  };
  CheckboxButtons.prototype.markFocused = function ($elm) {
    BaseButtons.prototype.markFocused.apply(this, arguments);
  };

  root.GOVUK.RadioButtons = RadioButtons;
  root.GOVUK.CheckboxButtons = CheckboxButtons;

  var selectionButtons = function (elms, opts) {
    var $elms,
        $radios,
        $checkboxes;

    if (typeof elms === 'string') {
      $elms = $(elms);
      if (opts !== undefined) {
        opts.selector = elms;
      }
    } else {
      $elms = elms;
    }
    $radios = $elms.filter('[type=radio]'),
    $checkboxes = $elms.filter('[type=checkbox]');

    if ($radios) {
      new GOVUK.RadioButtons($radios, opts);
    }
    if ($checkboxes) {
      new GOVUK.CheckboxButtons($checkboxes, opts);
    }
  };

  root.GOVUK.selectionButtons = selectionButtons;
}).call(this);
