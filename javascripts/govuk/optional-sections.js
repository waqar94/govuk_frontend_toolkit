(function () {
  "use strict"
  var root = this,
      $ = root.jQuery;

  if (typeof GOVUK === 'undefined') { root.GOVUK = {}; }

  var OptionalSection = function ($control, $section, opts) {
    this.$control = $control;
    this.$section = $section;
    this.selectedClass = 'selected';
    this.deselectedClass = 'deselected';
    if (opts !== undefined) {
      $.each(opts, function (optionName, optionObj) {
        this[optionName] = optionObj;
      }.bind(this));
    }
    this.$control.attr('aria-controls', this.$section.attr('id'));
    this.bindEvents();
    this.setInitialState();
  };
  OptionalSection.prototype.bindEvents = function () {
    var controlType = this.$control.attr('type'),
        clickHandler = function (e) {
          this.onOptionChange();
        }.bind(this),
        $radioGroup;

    if (controlType === 'radio') {
      $radioGroup = $(this.$control[0].form).find('input[name="' + this.$control.attr('name') + '"]'); 
      $radioGroup.on('click', clickHandler);
    } else {
      this.$control.on('click', clickHandler);
    }
  };
  OptionalSection.prototype.onOptionChange = function () {
    if (this.$control.is(':checked')) {
      this.showSection();
    } else {
      this.hideSection();
    }
  };
  OptionalSection.prototype.showSection = function () {
    this.$section.removeClass(this.deselectedClass);
    this.$section.addClass(this.selectedClass);
    this.$section.attr('aria-hidden', false);
    this.$control.attr('aria-expanded', true);
  };
  OptionalSection.prototype.hideSection = function () {
    this.$section.removeClass(this.selectedClass);
    this.$section.addClass(this.deselectedClass);
    this.$section.attr('aria-hidden', true);
    this.$control.attr('aria-expanded', false);
  };
  OptionalSection.prototype.setInitialState = function () {
    this.onOptionChange();
  };

  GOVUK.OptionalSection = OptionalSection;
}).call(this);
