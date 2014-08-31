describe("optional-sections", function () {
  describe("Constructor method", function () {
    var $control,
        $section;

    beforeEach(function () {
      $control = $('<input type="checkbox" />'),
      $section = $('<div id="section">');
    });

    it("Should have the correct interface", function () {
      var optionalSection = new GOVUK.OptionalSection($control, $section);

      expect(optionalSection.bindEvents).toBeDefined();
      expect(optionalSection.onOptionChange).toBeDefined();
      expect(optionalSection.showSection).toBeDefined();
      expect(optionalSection.hideSection).toBeDefined();
      expect(optionalSection.setInitialState).toBeDefined();
    });

    it("Should have the correct default classes for marking the section as open or closed", function () {
      var optionalSection = new GOVUK.OptionalSection($control, $section);
      
      expect(optionalSection.selectedClass).toEqual('selected');
      expect(optionalSection.deselectedClass).toEqual('deselected');
    });

    it("Should copy across any options to the instance produced", function () {
      var optionalSection = new GOVUK.OptionalSection($control, $section, {
            'selectedClass' : 'relevant',
            'deselectedClass' : 'not-relevant'
          });
      
      expect(optionalSection.selectedClass).toEqual('relevant');
      expect(optionalSection.deselectedClass).toEqual('not-relevant');
    });

    it("Should bind the option to the section with aria-controls", function () {
      var optionalSection = new GOVUK.OptionalSection($control, $section);
      expect($control.attr('aria-controls')).toEqual($section.attr('id'));
    });

    it("Should set the section to be closed if the option isn't checked", function () {
      var optionalSection = new GOVUK.OptionalSection($control, $section);

      expect($section.hasClass('deselected')).toBe(true);
    });

    it("Should set the section to be open if the option is checked", function () {
      var optionalSection;

      $control.attr('checked', true);
      optionalSection = new GOVUK.OptionalSection($control, $section);
      expect($section.hasClass('selected')).toBe(true);
    });
  });

  describe("BindEvents method", function () {
    var $form,
        $option2,
        $option3;

    beforeEach(function () {
      $option2 = ('<input type="radio" name="field1" value="option2" />');
      $option3 = ('<input type="radio" name="field1" value="option3" />');
      $form = $('<form />');
      $form.append($option2);
      $form.append($option3);
      $(document.body).append($form);
    });

    afterEach(function () {
      $form.remove();
    });

    it("Should bind a click event to the option if it is a checkbox", function () {
      var optionalSectionMock = {
            '$control' : $('<input type="checkbox" />'),
            'onOptionChange' : function () {}
          },
          clickEventBound = false;

      spyOn($.fn, "on").andCallFake(function (evt) {
        if ((evt === 'click') && (this[0] === optionalSectionMock.$control[0])) {
          clickEventBound = true;
        }
      });
      GOVUK.OptionalSection.prototype.bindEvents.call(optionalSectionMock);
      expect(clickEventBound).toBe(true);
    });

    it("Should bind a click event to all radios that share the name of the option if it is a radio button", function () {
      var optionalSectionMock = {
            '$control' : $('<input type="radio" name="field1" value="option1" />'),
            'onOptionChange' : function () {}
          },
          clickEventBound = false,
          $optionGroup,
          optionGroupHTML;

      $optionGroup = optionalSectionMock.$control
        .add($option2)
        .add($option3);
      optionGroupHTML = $('<div />').append($optionGroup.clone()).html();
      spyOn($.fn, "on").andCallFake(function (evt) {
        var thisHTML = $('<div />').append(this.clone()).html();

        if ((evt === 'click') && (thisHTML = optionGroupHTML)) {
          clickEventBound = true;
        }
      });
      GOVUK.OptionalSection.prototype.bindEvents.call(optionalSectionMock);
      expect(clickEventBound).toBe(true);
    });

    it("Should bind an event to checkboxes that calls the onOptionChange method", function () {
      var optionalSectionMock = {
            '$control' : $('<input type="checkbox" />'),
            'onOptionChange' : function () {}
          },
          clickEventBound = false,
          callback;

      spyOn($.fn, "on").andCallFake(function (evt, func) {
        if ((evt === 'click') && (this[0] = optionalSectionMock.$control[0])) {
          callback = func;
        }
      });
      spyOn(optionalSectionMock, 'onOptionChange');
      GOVUK.OptionalSection.prototype.bindEvents.call(optionalSectionMock);
      expect(optionalSectionMock.onOptionChange).not.toHaveBeenCalled();
      callback();
      expect(optionalSectionMock.onOptionChange).toHaveBeenCalled();
    });

    it("Should bind an event to radio buttons that calls the onOptionChange method", function () {
      var optionalSectionMock = {
            '$control' : $('<input type="radio" name="field1" value="option1" />'),
            'onOptionChange' : function () {}
          },
          clickEventBound = false,
          $optionGroup,
          optionGroupHTML;

      $optionGroup = optionalSectionMock.$control
        .add($option2)
        .add($option3);
      optionGroupHTML = $('<div />').append($optionGroup.clone()).html();
      spyOn($.fn, "on").andCallFake(function (evt, func) {
        if ((evt === 'click') && (thisHTML = optionGroupHTML)) {
          callback = func;
        }
      });
      spyOn(optionalSectionMock, 'onOptionChange');
      GOVUK.OptionalSection.prototype.bindEvents.call(optionalSectionMock);
      expect(optionalSectionMock.onOptionChange).not.toHaveBeenCalled();
      callback();
      expect(optionalSectionMock.onOptionChange).toHaveBeenCalled();
    });
  });

  describe("OnOptionChange method", function () {
    var optionalSectionMock;

    beforeEach(function () {
      optionalSectionMock = {
        '$control' : $('<input type="checkbox" />'),
        'showSection' : function () {},
        'hideSection' : function () {}
      };
    });

    it("Should call the correct method if the option isn't checked", function () {
      spyOn(optionalSectionMock, 'hideSection');
      spyOn(optionalSectionMock, 'showSection');
      GOVUK.OptionalSection.prototype.onOptionChange.call(optionalSectionMock);
      expect(optionalSectionMock.hideSection).toHaveBeenCalled();
      expect(optionalSectionMock.showSection).not.toHaveBeenCalled();
    });

    it("Should call the correct method if the option is checked", function () {
      optionalSectionMock.$control.attr('checked', true);
      spyOn(optionalSectionMock, 'hideSection');
      spyOn(optionalSectionMock, 'showSection');
      GOVUK.OptionalSection.prototype.onOptionChange.call(optionalSectionMock);
      expect(optionalSectionMock.hideSection).not.toHaveBeenCalled();
      expect(optionalSectionMock.showSection).toHaveBeenCalled();
    });
  });

  describe("ShowSection method", function () {
    var optionalSectionMock;

    beforeEach(function () {
      optionalSectionMock = {
        '$control' : $('<input type="checkbox" />'),
        '$section' : $('<div id="section" />'),
        'selectedClass' : 'selected',
        'deselectedClass' : 'deselected'
      }
    });

    it("Should swap the class used for closed for that for open", function () {
      GOVUK.OptionalSection.prototype.showSection.call(optionalSectionMock);
      expect(optionalSectionMock.$section.hasClass('selected')).toBe(true);
    });

    it("Should set the correct ARIA attributes", function () {
      GOVUK.OptionalSection.prototype.showSection.call(optionalSectionMock);
      expect(optionalSectionMock.$section.attr('aria-hidden')).toEqual('false');
      expect(optionalSectionMock.$control.attr('aria-expanded')).toEqual('true');
    });
  });

  describe("HideSection method", function () {
    var optionalSectionMock;

    beforeEach(function () {
      optionalSectionMock = {
        '$control' : $('<input type="checkbox" />'),
        '$section' : $('<div id="section" />'),
        'selectedClass' : 'selected',
        'deselectedClass' : 'deselected'
      }
    });

    it("Should swap the class used for open for that for closed", function () {
      GOVUK.OptionalSection.prototype.hideSection.call(optionalSectionMock);
      expect(optionalSectionMock.$section.hasClass('deselected')).toBe(true);
    });

    it("Should set the correct ARIA attributes", function () {
      GOVUK.OptionalSection.prototype.hideSection.call(optionalSectionMock);
      expect(optionalSectionMock.$section.attr('aria-hidden')).toEqual('true');
      expect(optionalSectionMock.$control.attr('aria-expanded')).toEqual('false');
    });
  });

  describe("SetInitialState method", function () {
    var $control,
        $section,
        optionalSectionMock;

    beforeEach(function () {
      $control = $('<input type="checkbox" />');
      $section = $('<div id="section" />');
      optionalSectionMock = {
        '$control' : $control,
        '$section' : $section,
        'selectedClass' : 'selected',
        'deselectedClass' : 'deselected'
      };
      $.extend(optionalSectionMock, GOVUK.OptionalSection.prototype);
    });

    it("Should show the section if the option isn't checked", function () {
      GOVUK.OptionalSection.prototype.setInitialState.call(optionalSectionMock);
      expect($section.hasClass('deselected')).toBe(true);
    });

    it("Should hide the section if the option is checked", function () {
      $control.attr('checked', true);
      GOVUK.OptionalSection.prototype.setInitialState.call(optionalSectionMock);
      expect($section.hasClass('selected')).toBe(true);
    });
  });
});
