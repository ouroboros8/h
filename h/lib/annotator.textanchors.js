// Generated by CoffeeScript 1.6.3
/*
** Annotator 1.2.6-dev-3a4efdc
** https://github.com/okfn/annotator/
**
** Copyright 2012 Aron Carroll, Rufus Pollock, and Nick Stenning.
** Dual licensed under the MIT and GPLv3 licenses.
** https://github.com/okfn/annotator/blob/master/LICENSE
**
** Built at: 2014-01-21 02:38:15Z
*/



/*
//
*/

// Generated by CoffeeScript 1.6.3
(function() {
  var TextPositionAnchor, TextRangeAnchor, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  TextPositionAnchor = (function(_super) {
    __extends(TextPositionAnchor, _super);

    TextPositionAnchor.Annotator = Annotator;

    function TextPositionAnchor(annotator, annotation, target, start, end, startPage, endPage, quote, diffHTML, diffCaseOnly) {
      this.start = start;
      this.end = end;
      TextPositionAnchor.__super__.constructor.call(this, annotator, annotation, target, startPage, endPage, quote, diffHTML, diffCaseOnly);
      if (this.start == null) {
        throw new Error("start is required!");
      }
      if (this.end == null) {
        throw new Error("end is required!");
      }
      this.Annotator = TextPositionAnchor.Annotator;
      this.$ = this.Annotator.$;
    }

    TextPositionAnchor.prototype._createHighlight = function(page) {
      var dfd,
        _this = this;
      dfd = this.$.Deferred();
      this.annotator.domMapper.prepare("highlighting").then(function(s) {
        var browserRange, hl, mappings, normedRange, realRange;
        mappings = s.getMappingsForCharRange(_this.start, _this.end, [page]);
        realRange = mappings.sections[page].realRange;
        browserRange = new _this.Annotator.Range.BrowserRange(realRange);
        normedRange = browserRange.normalize(_this.annotator.wrapper[0]);
        hl = new _this.Annotator.TextHighlight(_this, page, normedRange);
        return dfd.resolve(hl);
      });
      return dfd.promise();
    };

    return TextPositionAnchor;

  })(Annotator.Anchor);

  TextRangeAnchor = (function(_super) {
    __extends(TextRangeAnchor, _super);

    TextRangeAnchor.Annotator = Annotator;

    function TextRangeAnchor(annotator, annotation, target, range, quote) {
      this.range = range;
      TextRangeAnchor.__super__.constructor.call(this, annotator, annotation, target, 0, 0, quote);
      if (this.range == null) {
        throw new Error("range is required!");
      }
      this.Annotator = TextRangeAnchor.Annotator;
      this.$ = this.Annotator.$;
    }

    TextRangeAnchor.prototype._createHighlight = function() {
      var dfd, hl;
      dfd = this.$.Deferred();
      hl = new this.Annotator.TextHighlight(this, 0, this.range);
      dfd.resolve(hl);
      return dfd.promise();
    };

    return TextRangeAnchor;

  })(Annotator.Anchor);

  Annotator.Plugin.TextAnchors = (function(_super) {
    __extends(TextAnchors, _super);

    function TextAnchors() {
      this.createFromPositionSelector = __bind(this.createFromPositionSelector, this);
      this.createFromRangeSelector = __bind(this.createFromRangeSelector, this);
      this.verifyTextAnchor = __bind(this.verifyTextAnchor, this);
      this.checkForEndSelection = __bind(this.checkForEndSelection, this);
      _ref = TextAnchors.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    TextAnchors.prototype.checkDTM = function() {
      var _ref1;
      return this.useDTM = (_ref1 = this.annotator.domMapper) != null ? _ref1.ready : void 0;
    };

    TextAnchors.prototype.pluginInit = function() {
      var _this = this;
      if (!this.annotator.plugins.TextHighlights) {
        throw new Error("The TextAnchors Annotator plugin requires the TextHighlights plugin.");
      }
      this.Annotator = Annotator;
      this.$ = Annotator.$;
      this.annotator.anchoringStrategies.push({
        name: "range",
        create: this.createFromRangeSelector,
        verify: this.verifyTextAnchor
      });
      this.annotator.anchoringStrategies.push({
        name: "position",
        create: this.createFromPositionSelector,
        verify: this.verifyTextAnchor
      });
      $(this.annotator.wrapper).bind({
        "mouseup": this.checkForEndSelection
      });
      this.Annotator.TextPositionAnchor = TextPositionAnchor;
      this.Annotator.TextRangeAnchor = TextRangeAnchor;
      this.annotator.subscribe("enableAnnotating", function(value) {
        if (value) {
          return setTimeout(_this.checkForEndSelection, 500);
        }
      });
      return null;
    };

    TextAnchors.prototype._getSelectedRanges = function() {
      var browserRange, i, normedRange, r, ranges, rangesToIgnore, selection, _i, _len;
      selection = this.Annotator.util.getGlobal().getSelection();
      ranges = [];
      rangesToIgnore = [];
      if (!selection.isCollapsed) {
        ranges = (function() {
          var _i, _ref1, _results;
          _results = [];
          for (i = _i = 0, _ref1 = selection.rangeCount; 0 <= _ref1 ? _i < _ref1 : _i > _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
            r = selection.getRangeAt(i);
            browserRange = new this.Annotator.Range.BrowserRange(r);
            normedRange = browserRange.normalize().limit(this.annotator.wrapper[0]);
            if (normedRange === null) {
              rangesToIgnore.push(r);
            }
            _results.push(normedRange);
          }
          return _results;
        }).call(this);
        selection.removeAllRanges();
      }
      for (_i = 0, _len = rangesToIgnore.length; _i < _len; _i++) {
        r = rangesToIgnore[_i];
        selection.addRange(r);
      }
      return this.$.grep(ranges, function(range) {
        if (range) {
          selection.addRange(range.toRange());
        }
        return range;
      });
    };

    TextAnchors.prototype.checkForEndSelection = function(event) {
      var container, range, selectedRanges, _i, _len,
        _this = this;
      if (event == null) {
        event = {};
      }
      this.annotator.mouseIsDown = false;
      if (this.annotator.inAdderClick) {
        return;
      }
      selectedRanges = this._getSelectedRanges();
      for (_i = 0, _len = selectedRanges.length; _i < _len; _i++) {
        range = selectedRanges[_i];
        container = range.commonAncestor;
        if (this.Annotator.TextHighlight.isInstance(container)) {
          container = this.Annotator.TextHighlight.getIndependentParent(container);
        }
        if (this.annotator.isAnnotator(container)) {
          return;
        }
      }
      this.checkDTM();
      if (selectedRanges.length) {
        if (this.useDTM) {
          return this.annotator.domMapper.prepare("creating selectors").then(function(state) {
            return _this._collectTargets(event, selectedRanges, state);
          });
        } else {
          return this._collectTargets(event, selectedRanges);
        }
      } else {
        return this.annotator.onFailedSelection(event);
      }
    };

    TextAnchors.prototype._collectTargets = function(event, selectedRanges, state) {
      var pos, r;
      event.targets = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = selectedRanges.length; _i < _len; _i++) {
          r = selectedRanges[_i];
          _results.push(this.getTargetFromRange(r, state));
        }
        return _results;
      }).call(this);
      if (!event.pageX) {
        pos = selectedRanges[0].getEndCoords();
        event.pageX = pos.x;
        event.pageY = pos.y;
      }
      return this.annotator.onSuccessfulSelection(event);
    };

    TextAnchors.prototype._getRangeSelector = function(range) {
      var sr;
      sr = range.serialize(this.annotator.wrapper[0]);
      return {
        type: "RangeSelector",
        startContainer: sr.startContainer,
        startOffset: sr.startOffset,
        endContainer: sr.endContainer,
        endOffset: sr.endOffset
      };
    };

    TextAnchors.prototype._getTextQuoteSelector = function(range, state) {
      var endOffset, prefix, quote, rangeEnd, rangeStart, startOffset, suffix, _ref1;
      if (range == null) {
        throw new Error("Called getTextQuoteSelector(range) with null range!");
      }
      rangeStart = range.start;
      if (rangeStart == null) {
        throw new Error("Called getTextQuoteSelector(range) on a range with no valid start.");
      }
      rangeEnd = range.end;
      if (rangeEnd == null) {
        throw new Error("Called getTextQuoteSelector(range) on a range with no valid end.");
      }
      if (this.useDTM) {
        startOffset = (state.getInfoForNode(rangeStart)).start;
        endOffset = (state.getInfoForNode(rangeEnd)).end;
        quote = state.getCorpus().slice(startOffset, +(endOffset - 1) + 1 || 9e9).trim();
        _ref1 = state.getContextForCharRange(startOffset, endOffset), prefix = _ref1[0], suffix = _ref1[1];
        return {
          type: "TextQuoteSelector",
          exact: quote,
          prefix: prefix,
          suffix: suffix
        };
      } else {
        return {
          type: "TextQuoteSelector",
          exact: range.text().trim()
        };
      }
    };

    TextAnchors.prototype._getTextPositionSelector = function(range, state) {
      var endOffset, startOffset;
      startOffset = (state.getInfoForNode(range.start)).start;
      endOffset = (state.getInfoForNode(range.end)).end;
      return {
        type: "TextPositionSelector",
        start: startOffset,
        end: endOffset
      };
    };

    TextAnchors.prototype.getTargetFromRange = function(range, state) {
      var result;
      result = {
        source: this.annotator.getHref(),
        selector: [this._getRangeSelector(range), this._getTextQuoteSelector(range, state)]
      };
      if (this.useDTM) {
        result.selector.push(this._getTextPositionSelector(range, state));
      }
      return result;
    };

    TextAnchors.prototype.getQuoteForTarget = function(target) {
      var selector;
      selector = this.annotator.findSelector(target.selector, "TextQuoteSelector");
      if (selector != null) {
        return this.annotator.normalizeString(selector.exact);
      } else {
        return null;
      }
    };

    TextAnchors.prototype.verifyTextAnchor = function(anchor, reason, data) {
      var dfd,
        _this = this;
      dfd = this.$.Deferred();
      if (anchor instanceof this.Annotator.TextRangeAnchor) {
        dfd.resolve(false);
        return dfd.promise();
      }
      if (!(anchor instanceof this.Annotator.TextPositionAnchor)) {
        console.log("Hey, how come that I don't know anything about", "this kind of anchor?", anchor);
        dfd.resolve(false);
        return dfd.promise();
      }
      if (reason !== "corpus change") {
        dfd.resolve(true);
        return dfd.promise();
      }
      this.annotator.domMapper.prepare("verifying an anchor").then(function(s) {
        var content, corpus, currentQuote;
        corpus = s.getCorpus();
        content = corpus.slice(anchor.start, anchor.end).trim();
        currentQuote = _this.annotator.normalizeString(content);
        return dfd.resolve(currentQuote === anchor.quote);
      });
      return dfd.promise();
    };

    TextAnchors.prototype.createFromRangeSelector = function(annotation, target) {
      var currentQuote, dfd, error, normedRange, range, savedQuote, selector,
        _this = this;
      dfd = this.$.Deferred();
      selector = this.annotator.findSelector(target.selector, "RangeSelector");
      if (selector == null) {
        dfd.reject("no RangeSelector found", true);
        return dfd.promise();
      }
      this.checkDTM();
      try {
        range = this.Annotator.Range.sniff(selector);
        normedRange = range.normalize(this.annotator.wrapper[0]);
      } catch (_error) {
        error = _error;
        dfd.reject("failed to normalize range: " + error.message);
        return dfd.promise();
      }
      savedQuote = this.getQuoteForTarget(target);
      if (this.useDTM) {
        this.annotator.domMapper.prepare("anchoring").then(function(s) {
          var currentQuote, endInfo, endOffset, q, startInfo, startOffset, _ref1, _ref2;
          startInfo = s.getInfoForNode(normedRange.start);
          startOffset = startInfo.start;
          if (startOffset == null) {
            dfd.reject("the saved quote doesn't match");
            return dfd.promise();
          }
          endInfo = s.getInfoForNode(normedRange.end);
          endOffset = endInfo.end;
          if (endOffset == null) {
            dfd.reject("the saved quote doesn't match");
            return dfd.promise();
          }
          q = s.getCorpus().slice(startOffset, endOffset).trim();
          currentQuote = _this.annotator.normalizeString(q);
          if ((savedQuote != null) && currentQuote !== savedQuote) {
            dfd.reject("the saved quote doesn't match");
            return dfd.promise();
          }
          return dfd.resolve(new TextPositionAnchor(_this.annotator, annotation, target, startInfo.start, endInfo.end, (_ref1 = startInfo.pageIndex) != null ? _ref1 : 0, (_ref2 = endInfo.pageIndex) != null ? _ref2 : 0, currentQuote));
        });
      } else {
        currentQuote = this.annotator.normalizeString(normedRange.text().trim());
        if ((savedQuote != null) && currentQuote !== savedQuote) {
          dfd.reject("the saved quote doesn't match");
          return dfd.promise();
        }
        dfd.resolve(new TextRangeAnchor(this.annotator, annotation, target, normedRange, currentQuote));
      }
      return dfd.promise();
    };

    TextAnchors.prototype.createFromPositionSelector = function(annotation, target) {
      var dfd, selector,
        _this = this;
      dfd = this.$.Deferred();
      this.checkDTM();
      if (!this.useDTM) {
        dfd.reject("DTM is not present");
        return dfd.promise();
      }
      selector = this.annotator.findSelector(target.selector, "TextPositionSelector");
      if (!selector) {
        dfd.reject("no TextPositionSelector found", true);
        return dfd.promise();
      }
      this.annotator.domMapper.prepare("anchoring").then(function(s) {
        var content, currentQuote, savedQuote;
        content = s.getCorpus().slice(selector.start, selector.end).trim();
        currentQuote = _this.annotator.normalizeString(content);
        savedQuote = _this.getQuoteForTarget(target);
        if ((savedQuote != null) && currentQuote !== savedQuote) {
          dfd.reject("the saved quote doesn't match");
          return dfd.promise();
        }
        return dfd.resolve(new TextPositionAnchor(_this.annotator, annotation, target, selector.start, selector.end, s.getPageIndexForPos(selector.start), s.getPageIndexForPos(selector.end), currentQuote));
      });
      return dfd.promise();
    };

    return TextAnchors;

  })(Annotator.Plugin);

}).call(this);

//
//@ sourceMappingURL=annotator.textanchors.map