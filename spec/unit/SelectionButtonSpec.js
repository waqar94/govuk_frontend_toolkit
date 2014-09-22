describe("selection-buttons", function () {
  var $radioButtons,
      $radioLabels,
      $checkboxButtons,
      $checkboxLabels;

  beforeEach(function () {
    $radioLabels = $(
        '<label class="selectable">' +
          'Small' +
          '<input type="radio" name="size" id="small" value="small" />' +
        '</label>' +
        '<label class="selectable">' +
          'Medium' +
          '<input type="radio" name="size" id="medium" value="medium" />' +
        '</label>' +
        '<label class="selectable">' +
          'Large' +
          '<input type="radio" name="size" id="large" value="large" />' +
        '</label>'
    );
    $checkboxLabels = $(
        '<label class="selectable">' +
          'Eggs' +
          '<input id="eggs" name="food" value="eggs" type="checkbox" />' +
        '</label>' +
        '<label class="selectable">' +
          'Bread' +
          '<input id="bread" name="food" value="bread" type="checkbox" />' +
        '</label>' +
        '<label class="selectable">' +
          'Fruit' +
          '<input id="fruit" name="food" value="fruit" type="checkbox" />' +
        '</label>'
    );
    $radioButtons = $radioLabels.find('input');
    $checkboxButtons = $checkboxLabels.find('input');
    $(document.body).append($radioLabels);
    $(document.body).append($checkboxLabels);
  });

  afterEach(function () {
    $radioLabels.remove();
    $checkboxLabels.remove();
  });

  describe("RadioButtons", function () {
    it("Should create a new instance with the correct interface when sent jQuery-wrapped input elements", function () {
      var buttons = new GOVUK.RadioButtons($radioButtons);

      expect(buttons.setInitialState).toBeDefined();
      expect(buttons.bindEvents).toBeDefined();
      expect(buttons.markSelected).toBeDefined();
      expect(buttons.markFocused).toBeDefined();
    });

    it("Should set the selectedClass property if sent in as an option", function () {
      var buttons = new GOVUK.RadioButtons($radioButtons, { 'selectedClass' : 'selectable-selected' });

      expect(buttons.selectedClass).toEqual('selectable-selected');
    });

    it("Should set the focusedClass property if sent in as an option", function () {
      var buttons = new GOVUK.RadioButtons($radioButtons, { 'focusedClass' : 'selectable-focused' });

      expect(buttons.focusedClass).toEqual('selectable-focused');
    });

    describe("setInitialState method", function () {
      it("Should mark the label of any checked radios as selected", function () {
        var radioButtonsMock = {
              'markSelected' : GOVUK.RadioButtons.prototype.markSelected,
              'selectedClass' : 'selected'
            };

        $radioButtons.eq(0).attr('checked', true);
        spyOn(radioButtonsMock, 'markSelected').andCallThrough();
        GOVUK.RadioButtons.prototype.setInitialState.call(radioButtonsMock, $radioButtons);
        expect(radioButtonsMock.markSelected).toHaveBeenCalled();
        expect($radioButtons.eq(0).parent('label').hasClass('selected')).toBe(true);
      });
    });

    describe("setEventNames method", function () {
      it("Should set the selectionEvents and focusEvents properties on the instance", function () {
        var radioButtonsMock = {};

        GOVUK.RadioButtons.prototype.setEventNames.call(radioButtonsMock);
        expect(typeof radioButtonsMock.focusEvents !== 'undefined').toBe(true);
        expect(typeof radioButtonsMock.selectionEvents !== 'undefined').toBe(true);
      });
    });

    describe("bindEvents method", function () {
      it("Should bind click and change events to each radio element sent into the constructor", function () {
        var radioButtonsMock = {
              'selectionEvents' : 'click change',
              'focusEvents' : 'focus blur',
              'markSelected' : function () {},
              'markFocused' : function () {}
            },
            eventsBound = false;

        spyOn($.fn, 'on').andCallFake(function (evt, func) {
          if (evt === 'click change') {
            eventsBound = true;
          }
          return this;
        });
        expect($.fn.on.calls.length).toEqual(0);
        GOVUK.RadioButtons.prototype.bindEvents.call(radioButtonsMock, $radioButtons);
        expect($.fn.on).toHaveBeenCalled();
        expect(eventsBound).toEqual(true);
      });

      it("Should bind click and change events to the document if an element selector is sent into the constructor", function () {
        var radioButtonsMock = {
              'selectionEvents' : 'click change',
              'focusEvents' : 'focus blur',
              'markSelected' : function () {},
              'markFocused' : function () {},
              'selector' : 'label.selectable input[type="radio"]'
            },
            eventsBound = false;

        spyOn($.fn, 'on').andCallFake(function (evt, selector, func) {
          if ((evt === 'click change') && (selector === radioButtonsMock.selector)) {
            eventsBound = true;
          }
          return this;
        });
        expect($.fn.on.calls.length).toEqual(0);
        GOVUK.RadioButtons.prototype.bindEvents.call(radioButtonsMock, $radioButtons);
        expect($.fn.on).toHaveBeenCalled();
        expect(eventsBound).toEqual(true);
      });

      it("Should bind focus and blur events to each radio element sent into the constructor", function () {
        var radioButtonsMock = {
              'selectionEvents' : 'click change',
              'focusEvents' : 'focus blur',
              'markSelected' : function () {},
              'markFocused' : function () {}
            },
            eventsBound = false;

        spyOn($.fn, 'on').andCallFake(function (evt, func) {
          if (evt === 'focus blur') {
            eventsBound = true;
          }
          return this;
        });
        expect($.fn.on.calls.length).toEqual(0);
        GOVUK.RadioButtons.prototype.bindEvents.call(radioButtonsMock, $radioButtons);
        expect($.fn.on).toHaveBeenCalled();
        expect(eventsBound).toEqual(true);
      });

      it("Should bind focus and blur events to the document if an element selector was sent into the constructor", function () {
        var radioButtonsMock = {
              'selectionEvents' : 'click change',
              'focusEvents' : 'focus blur',
              'markSelected' : function () {},
              'markFocused' : function () {},
              'selector' : 'label.selectable input[type="radio"]'
            },
            eventsBound = false;

        spyOn($.fn, 'on').andCallFake(function (evt, selector, func) {
          if ((evt === 'focus blur') && (selector === radioButtonsMock.selector)) {
            eventsBound = true;
          }
          return this;
        });
        expect($.fn.on.calls.length).toEqual(0);
        GOVUK.RadioButtons.prototype.bindEvents.call(radioButtonsMock, $radioButtons);
        expect($.fn.on).toHaveBeenCalled();
        expect(eventsBound).toEqual(true);
      });

      it("Should mark a radio element as selected if it's the target of a click or change event on itself", function () {
        var radioButtonsMock = {
              'selectionEvents' : 'click change',
              'focusEvents' : 'focus blur',
              'markSelected' : function () {},
              'markFocused' : function () {}
            },
            eventsBound = false;

        spyOn($.fn, 'on').andCallFake(function (evt, func) {
          if (evt === 'click change') {
            callback = func;
          }
          return this;
        });
        spyOn(radioButtonsMock, 'markSelected');
        $radioButtons.eq(0).attr('checked', true);
        GOVUK.RadioButtons.prototype.bindEvents.call(radioButtonsMock, $radioButtons);
        callback({ 'target' : $radioButtons[0] });
        expect(radioButtonsMock.markSelected).toHaveBeenCalled();
      });

      it("Should mark a radio element as selected if it's the target of a click or change event on the document with a selector that matches it", function () {
        var radioButtonsMock = {
              'selectionEvents' : 'click change',
              'focusEvents' : 'focus blur',
              'selector' : 'label.selectable input',
              'markSelected' : function () {},
              'markFocused' : function () {},
              'selector' : 'label.selectable input[type="radio"]'
              },
            eventsBound = false;

        spyOn($.fn, 'on').andCallFake(function (evt, selector, func) {
          if ((this[0] === document) && (evt === 'click change') && (selector === radioButtonsMock.selector)) {
            callback = func;
          }
          return this;
        });
        spyOn(radioButtonsMock, 'markSelected');
        $radioButtons.eq(0).attr('checked', true);
        GOVUK.RadioButtons.prototype.bindEvents.call(radioButtonsMock, $radioButtons);
        callback({ 'target' : $radioButtons[0] });
        expect(radioButtonsMock.markSelected).toHaveBeenCalled();
      });

      it("Should mark a radio element as focused or blurred if it's the target of a focus or blur event on itself", function () {
        var radioButtonsMock = {
              'selectionEvents' : 'click change',
              'focusEvents' : 'focus blur',
              'markSelected' : function () {},
              'markFocused' : function () {}
            },
            eventsBound = false;

        spyOn($.fn, 'on').andCallFake(function (evt, func) {
          if (evt === 'focus blur') {
            callback = func;
          }
          return this;
        });
        spyOn(radioButtonsMock, 'markFocused');
        $radioButtons.eq(0).attr('checked', true);
        GOVUK.RadioButtons.prototype.bindEvents.call(radioButtonsMock, $radioButtons);
        callback({ 'target' : $radioButtons[0] }, 'focused');
        expect(radioButtonsMock.markFocused).toHaveBeenCalled();
      });

      it("Should mark a radio element as focused or blurred if it's the target of a focus or blur event on the document with a selector that matches it", function () {
        var radioButtonsMock = {
              'selectionEvents' : 'click change',
              'focusEvents' : 'focus blur',
              'markSelected' : function () {},
              'markFocused' : function () {},
              'selector' : 'label.selectable input[type="radio"]'
              },
            eventsBound = false;

        spyOn($.fn, 'on').andCallFake(function (evt, selector, func) {
          if ((this[0] === document) && (evt === 'focus blur') && (selector === radioButtonsMock.selector)) {
            callback = func;
          }
          return this;
        });
        spyOn(radioButtonsMock, 'markFocused');
        $radioButtons.eq(0).attr('checked', true);
        GOVUK.RadioButtons.prototype.bindEvents.call(radioButtonsMock, $radioButtons);
        callback({ 'target' : $radioButtons[0] }, 'focused');
        expect(radioButtonsMock.markFocused).toHaveBeenCalled();
      });
    });

    describe("markSelected method", function () {
      it("Should add the selectedClass class to the label of the sent in radio", function () {
        var radioButtonsMock = {
              'selections' : {
                'size' : false
              },
              'selectedClass' : 'selected'
            },
            $clickedRadio = $radioButtons.eq(0);

        GOVUK.RadioButtons.prototype.markSelected.call(radioButtonsMock, $clickedRadio);
        expect($clickedRadio.parent('label').hasClass('selected')).toEqual(true);
      });

      it("Should remove the selectedClass class from the label of the previously selected radio", function () {
        var radioButtonsMock = {
              'selections' : {
                'size' : $radioButtons.eq(1)
              },
              'selectedClass' : 'selected'
            },
            $clickedRadio = $radioButtons.eq(0);

        $radioLabels.eq(1).addClass('selected');
        GOVUK.RadioButtons.prototype.markSelected.call(radioButtonsMock, $clickedRadio);
        expect($('#medium').parent('label').hasClass('selected')).toEqual(false);
      });
    });

    describe("markFocused method", function () {
      var radioButtonsMock = {
            'focused' : false,
            'focusedClass' : 'focused'
          };

      it("Should add the focusedClass class to the sent radio if it is focused", function () {
        GOVUK.RadioButtons.prototype.markFocused.apply(radioButtonsMock, [$radioButtons.eq(0), 'focused']);

        expect($radioLabels.eq(0).hasClass(radioButtonsMock.focusedClass)).toBe(true);
      });

      it("Should remove the focusedClass class from the sent radio if it is blurred", function () {
        $radioLabels.eq(0).addClass(radioButtonsMock.focusedClass);
        GOVUK.RadioButtons.prototype.markFocused.apply(radioButtonsMock, [$radioButtons.eq(0), 'blurred']);

        expect($radioLabels.eq(0).hasClass(radioButtonsMock.focusedClass)).toBe(false);
      });
    });
  });

  describe("CheckboxButtons", function () {
    it("Should create a new instance with the correct interface", function () {
      var buttons = new GOVUK.CheckboxButtons($checkboxButtons);

      expect(buttons.setInitialState).toBeDefined();
      expect(buttons.bindEvents).toBeDefined();
      expect(buttons.markSelected).toBeDefined();
      expect(buttons.markFocused).toBeDefined();
    });

    describe("setInitialState method", function () {
      it("Should mark the label of any checked checkboxes as selected", function () {
        var checkboxButtonsMock = {
              'markSelected' : GOVUK.CheckboxButtons.prototype.markSelected,
              'selectedClass' : 'selected'
            };

        $checkboxButtons.eq(0).attr('checked', true);
        spyOn(checkboxButtonsMock, 'markSelected').andCallThrough();
        GOVUK.CheckboxButtons.prototype.setInitialState.call(checkboxButtonsMock, $checkboxButtons);
        expect(checkboxButtonsMock.markSelected).toHaveBeenCalled();
        expect($checkboxButtons.eq(0).parent('label').hasClass('selected')).toBe(true);
        $checkboxButtons.eq(0).attr('checked', false);
      });
    });

    describe("setEventNames method", function () {
      it("Should set the selectionEvents and focusEvents properties on the instance", function () {
        var checkboxButtonsMock = {};

        GOVUK.CheckboxButtons.prototype.setEventNames.call(checkboxButtonsMock);
        expect(typeof checkboxButtonsMock.focusEvents !== 'undefined').toBe(true);
        expect(typeof checkboxButtonsMock.selectionEvents !== 'undefined').toBe(true);
      });
    });

    describe("bindEvents method", function () {
      var checkboxButtonsMock;

      beforeEach(function () {
        checkboxButtonsMock = {};
      });

      it("Should bind a click event to each checkbox sent into the constructor", function () {
        var eventCalled = false;

        checkboxButtonsMock.markSelected = function () {};
        checkboxButtonsMock.markFocused = function () {};
        checkboxButtonsMock.selectionEvents = 'click';
        checkboxButtonsMock.focusEvents = 'focus blur';
        spyOn(checkboxButtonsMock, 'markSelected');
        spyOn($.fn, 'on').andCallFake(function (evt, func) {
          if (evt === 'click') {
            eventCalled = true;
            callback = func;
          }
          return this;
        });
        $checkboxButtons.eq(0).attr('checked', true);
        GOVUK.CheckboxButtons.prototype.bindEvents.call(checkboxButtonsMock, $checkboxButtons);
        expect(eventCalled).toBe(true);
        callback({ 'target' : $checkboxButtons.eq(0) });
        expect(checkboxButtonsMock.markSelected).toHaveBeenCalled();
        $checkboxButtons.eq(0).attr('checked', false);
      });

      it("Should bind focus and blur events to each checkbox sent into the constructor", function () {
        var eventCalled = false;

        checkboxButtonsMock.markFocused = function () {};
        checkboxButtonsMock.markSelected = function () {};
        checkboxButtonsMock.selectionEvents = 'click';
        checkboxButtonsMock.focusEvents = 'focus blur';
        spyOn(checkboxButtonsMock, 'markFocused');
        spyOn($.fn, 'on').andCallFake(function (evt, func) {
          if (evt === 'focus blur') {
            eventCalled = true;
            callback = func;
          }
          return this;
        });
        GOVUK.CheckboxButtons.prototype.bindEvents.call(checkboxButtonsMock, $checkboxButtons);
        expect(eventCalled).toBe(true);
        callback({
          'target' : $checkboxButtons.eq(0),
          'type' : 'focus'
        });
        expect(checkboxButtonsMock.markFocused).toHaveBeenCalled();
      });

      it("Should bind a click event to the document if an element selector was sent into the constructor", function () {
        var eventCalled = false;

        checkboxButtonsMock.markSelected = function () {};
        checkboxButtonsMock.markFocused = function () {};
        checkboxButtonsMock.selectionEvents = 'click';
        checkboxButtonsMock.focusEvents = 'focus blur';
        checkboxButtonsMock.selector = 'label.selectable input[type="checkbox"]';
        spyOn(checkboxButtonsMock, 'markSelected');
        spyOn($.fn, 'on').andCallFake(function (evt, selector, func) {
          if ((this[0] === document) && (evt === 'focus blur') && (selector === checkboxButtonsMock.selector)) {
            eventCalled = true;
            callback = func;
          }
          return this;
        });
        $checkboxButtons.eq(0).attr('checked', true);
        GOVUK.CheckboxButtons.prototype.bindEvents.call(checkboxButtonsMock, $checkboxButtons);
        expect(eventCalled).toBe(true);
        callback({ 'target' : $checkboxButtons.eq(0) });
        expect(checkboxButtonsMock.markSelected).toHaveBeenCalled();
        $checkboxButtons.eq(0).attr('checked', false);
      });

      it("Should bind focus and blur events to the document if an element selector was sent into the constructor", function () {
        var eventCalled = false;

        checkboxButtonsMock.markFocused = function () {};
        checkboxButtonsMock.markSelected = function () {};
        checkboxButtonsMock.selectionEvents = 'click';
        checkboxButtonsMock.focusEvents = 'focus blur';
        checkboxButtonsMock.selector = 'label.selectable input[type="checkbox"]';
        spyOn(checkboxButtonsMock, 'markFocused');
        spyOn($.fn, 'on').andCallFake(function (evt, selector, func) {
          if ((this[0] === document) && (evt === 'focus blur') && (selector === checkboxButtonsMock.selector)) {
            eventCalled = true;
            callback = func;
          }
          return this;
        });
        GOVUK.CheckboxButtons.prototype.bindEvents.call(checkboxButtonsMock, $checkboxButtons);
        expect(eventCalled).toBe(true);
        callback({
          'target' : $checkboxButtons.eq(0),
          'type' : 'focus'
        });
        expect(checkboxButtonsMock.markFocused).toHaveBeenCalled();
      });

      it("Should mark a checkbox element as selected if it's the target of a focus or blur event on itself", function () {

      });

      it("Should mark a checkbox element as selected if it's the target of a click or change event on the document with a selector that matches it", function () {

      });

      it("Should mark a checkbox element as focused or blurred if it's the target of a focus or blur event on itself", function () {

      });

      it("Should mark a checkbox element as focused or blurred if it's the target of a click or change event on the document with a selector that matches it", function () {

      });
    });

    describe("markSelected method", function () {
      var checkboxButtonsMock = {
            'selectedClass' : 'selected'
          };

      it("Should add the selectedClass class to a checked checkbox", function () {
        $checkboxButtons.eq(0).attr('checked', true);
        GOVUK.CheckboxButtons.prototype.markSelected.call(checkboxButtonsMock, $checkboxButtons.eq(0));
        expect($checkboxLabels.eq(0).hasClass(checkboxButtonsMock.selectedClass)).toBe(true);
      });

      it("Should remove the selectedClass class from an unchecked checkbox", function () {
        $checkboxButtons.eq(0).addClass(checkboxButtonsMock.selectedClass);
        GOVUK.CheckboxButtons.prototype.markSelected.call(checkboxButtonsMock, $checkboxButtons.eq(0));
        expect($checkboxLabels.eq(0).hasClass(checkboxButtonsMock.selectedClass)).toBe(false);
      });
    });

    describe("markFocused method", function () {
      var checkboxButtonsMock = {
            'focused' : false,
            'focusedClass' : 'focused'
          };

      it("Should add the focusedClass class to the sent radio if it is focused", function () {
        GOVUK.CheckboxButtons.prototype.markFocused.apply(checkboxButtonsMock, [$checkboxButtons.eq(0), 'focused']);

        expect($checkboxLabels.eq(0).hasClass(checkboxButtonsMock.focusedClass)).toBe(true);
      });

      it("Should remove the focusedClass class from the sent radio if it is blurred", function () {
        $checkboxLabels.eq(0).addClass(checkboxButtonsMock.focusedClass);
        GOVUK.CheckboxButtons.prototype.markFocused.apply(checkboxButtonsMock, [$checkboxButtons.eq(0), 'blurred']);

        expect($checkboxLabels.eq(0).hasClass(checkboxButtonsMock.focusedClass)).toBe(false);
      });
    });
  });

  describe("selectionButtons", function () {
    it("Should create an instance of GOVUK.RadioButtons if sent a jQuery-wrapped radio button element", function () {
      spyOn(GOVUK, 'RadioButtons');
      GOVUK.selectionButtons($radioButtons);
      expect(GOVUK.RadioButtons).toHaveBeenCalled();
    }); 

    it("Should create an instance of GOVUK.CheckboxButtons if sent a jQuery-wrapped checkbox element", function () {
      spyOn(GOVUK, 'CheckboxButtons');
      GOVUK.selectionButtons($checkboxButtons);
      expect(GOVUK.CheckboxButtons).toHaveBeenCalled();
    }); 

    it("Should create instances of RadioButtons and CheckboxButtons for a set containing jQuery-wrapped radio and checkbox elements", function () {
      spyOn(GOVUK, 'RadioButtons');
      spyOn(GOVUK, 'CheckboxButtons');
      GOVUK.selectionButtons($checkboxButtons.add($radioButtons));
      expect(GOVUK.RadioButtons).toHaveBeenCalled();
      expect(GOVUK.CheckboxButtons).toHaveBeenCalled();
    }); 

    it("Should create an instance of GOVUK.RadioButtons if sent a selector for a radio button element", function () {
      spyOn(GOVUK, 'RadioButtons');
      GOVUK.selectionButtons('label.selectable input[type="radio"]');
      expect(GOVUK.RadioButtons).toHaveBeenCalled();
    }); 

    it("Should create an instance of GOVUK.CheckboxButtons if sent a selector for a checkbox element", function () {
      spyOn(GOVUK, 'CheckboxButtons');
      GOVUK.selectionButtons('label.selectable input[type="checkbox"]');
      expect(GOVUK.CheckboxButtons).toHaveBeenCalled();
    }); 

    it("Should create instances of RadioButtons and CheckboxButtons for a selector targeting radio and checkbox elements", function () {
      spyOn(GOVUK, 'RadioButtons');
      spyOn(GOVUK, 'CheckboxButtons');
      GOVUK.selectionButtons('label.selectable input');
      expect(GOVUK.RadioButtons).toHaveBeenCalled();
      expect(GOVUK.CheckboxButtons).toHaveBeenCalled();
    }); 
  });
});
