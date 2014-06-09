(function() {
  "use strict";
  window.GOVUK = window.GOVUK || {};
  var $ = window.$;

  // A multivariate test framework
  //
  // Based loosely on https://github.com/jamesyu/cohorts
  //
  // Full documentation is in README.md.
  //
  function MultivariateTest(options) {
    this.$el = $(options.el);
    this._loadOption(options, 'name');
    this._loadOption(options, 'customVarIndex');
    this._loadOption(options, 'cohorts');
    this._loadOption(options, 'runImmediately', true);
    this._loadOption(options, 'defaultWeight', 1);
    this._loadOption(options, 'gaDomain', window.location.hostname);
    this._loadOption(options, 'gaExperimentId', null);

    if (this.runImmediately) {
      this.run();
    }
  }

  MultivariateTest.prototype._loadOption = function(options, key, defaultValue) {
    if (options[key] !== undefined) {
      this[key] = options[key];
    }
    if (this[key] === undefined) {
      if (defaultValue === undefined) {
        throw new Error(key+" option is required for a multivariate test");
      }
      else {
        this[key] = defaultValue;
      }
    }
  };

  MultivariateTest.prototype.run = function() {
    var cohort = this.getCohort();
    if (cohort) {
      if (this.gaExperimentId) {
        this.setGoogleExperiment();
        var cohortObj = this.cohorts[cohort];
        if (cohortObj.variationId) { this.setGoogleExperimentVariation(cohortObj.variationId) }
      }
      this.setCustomVar(cohort);
      this.executeCohort(cohort);
    }
  };

  MultivariateTest.prototype.executeCohort = function(cohort) {
    var cohortObj = this.cohorts[cohort];
    if (cohortObj.callback) {
      if (typeof cohortObj.callback === "string") {
        this[cohortObj.callback]();
      }
      else {
        cohortObj.callback();
      }
    }
    if (cohortObj.html) {
      this.$el.html(cohortObj.html);
      this.$el.show();
    }
  };

  // Get the current cohort or assign one if it has not been already
  MultivariateTest.prototype.getCohort = function() {
    var cohort = GOVUK.cookie(this.cookieName());
    if (!cohort || !this.cohorts[cohort]) {
      cohort = this.chooseRandomCohort();
      GOVUK.cookie(this.cookieName(), cohort, {days: 30});
    }
    return cohort;
  };

  MultivariateTest.prototype.setCustomVar = function(cohort) {
    window._gaq = window._gaq || [];
    window._gaq.push([
      '_setCustomVar',
      this.customVarIndex,
      this.cookieName(),
      cohort,
      2 // session level
    ]);
    // Fire off a dummy event to set the custom var on the page.
    // Ideally we'd be able to call setCustomVar before trackPageview,
    // but would need reordering the existing GA code.
    window._gaq.push(['_trackEvent', this.cookieName(), 'run', '-', 0, true]);
  };

  MultivariateTest.prototype.weightedCohortNames = function() {
    var names = [],
        defaultWeight = this.defaultWeight;

    $.each(this.cohorts, function(key, cohortSettings) {
      var numberForCohort, i;

      if (typeof cohortSettings.weight === 'undefined'){
        numberForCohort = defaultWeight;
      } else {
        numberForCohort = cohortSettings.weight;
      }

      for(i=0; i<numberForCohort; i++){
        names.push(key);
      }
    });

    return names;
  };

  MultivariateTest.prototype.chooseRandomCohort = function() {
    var names = this.weightedCohortNames();
    return names[Math.floor(Math.random() * names.length)];
  };

  MultivariateTest.prototype.cookieName = function() {
    return "multivariatetest_cohort_" + this.name;
  };

  MultivariateTest.prototype.generateHash = function(domainName) {
    var hash = 1;

    if(domainName !== null && domainName !== '') {
      hash = 0;

      for (var pos = domainName.length - 1; pos >= 0; pos--) {
        var current = domainName[pos].charCodeAt(0);
        hash = ((hash << 6) & 0xfffffff) + current + (current << 14);
        var leftMost7 = hash & 0xfe00000;
        if (leftMost7 != 0) {
          hash ^= leftMost7 >> 21;
        }
      }
    }
    return hash;
  };

  MultivariateTest.prototype.setGoogleExperimentVariation = function(variationId) {
    GOVUK.cookie("__utmx", this.buildUtmxString(this.gaDomain, variationId), {minutes: 60});
  }

  MultivariateTest.prototype.setGoogleExperiment = function() {
    GOVUK.cookie("__utmxx", this.buildUtmxxString(this.gaDomain), {minutes: 60});
  }

  MultivariateTest.prototype.buildUtmxString = function(domain, variationId) {
    // Example format of the "__utmx" cookie value:
    // 159991919.ft-5xaLPSturFXCPgoFrKg$0:1.ft-6uzLPSelrFQsPgouIkD$0:2
    // [DOMAIN_HASH].[EXPERIMENT_ID]$0:[VARIATION].[EXPERIMENT_ID]$0:[VARIATION]
    return (this.generateHash(domain) + "." + this.gaExperimentId + '$0:' + variationId);
  };

  MultivariateTest.prototype.buildUtmxxString = function(domain) {
    // Example format of the "__utmxx" cookie value:
    // 159991919.ft-5xaLPSturFXCPgoFrKg$0:1380888455:8035200.ft-6uzLPSelrFQsPgouIkD$0:1380888456:8035200
    // [DOMAIN_HASH].[EXPERIMENT_ID]$0:[TIMESTAMP]:8035200.[EXPERIMENT_ID]$0:[TIMESTAMP]:8035200
    var timestamp = Math.floor(new Date().getTime() / 1000);
    return (this.generateHash(domain) + "." + this.gaExperimentId + '$0:' + timestamp + ":8035200");
  };

  window.GOVUK.MultivariateTest = MultivariateTest;
}());
