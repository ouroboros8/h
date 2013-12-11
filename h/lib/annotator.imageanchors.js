// Generated by CoffeeScript 1.6.3
/*
** Annotator 1.2.6-dev-1f93fa4
** https://github.com/okfn/annotator/
**
** Copyright 2012 Aron Carroll, Rufus Pollock, and Nick Stenning.
** Dual licensed under the MIT and GPLv3 licenses.
** https://github.com/okfn/annotator/blob/master/LICENSE
**
** Built at: 2013-12-11 15:11:26Z
*/



/*
//
*/

// Generated by CoffeeScript 1.6.3
(function() {
  var ImageAnchor, ImageHighlight, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  ImageHighlight = (function(_super) {
    __extends(ImageHighlight, _super);

    ImageHighlight.prototype.invisibleStyle = {
      outline: void 0,
      hi_outline: void 0,
      stroke: void 0,
      hi_stroke: void 0,
      fill: void 0,
      hi_fill: void 0
    };

    ImageHighlight.prototype.defaultStyle = {
      outline: '#000000',
      hi_outline: '#000000',
      stroke: '#ffffff',
      hi_stroke: '#fff000',
      fill: void 0,
      hi_fill: void 0
    };

    ImageHighlight.prototype.highlightStyle = {
      outline: '#000000',
      hi_outline: '#000000',
      stroke: '#fff000',
      hi_stroke: '#ff7f00',
      fill: void 0,
      hi_fill: void 0
    };

    ImageHighlight.Annotator = Annotator;

    ImageHighlight.$ = Annotator.$;

    function ImageHighlight(anchor, pageIndex, image, shape, geometry, annotorious) {
      this.annotorious = annotorious;
      ImageHighlight.__super__.constructor.call(this, anchor, pageIndex);
      this.$ = ImageHighlight.$;
      this.Annotator = ImageHighlight.Annotator;
      this.visibleHighlight = false;
      this.active = false;
      this.annotoriousAnnotation = {
        text: this.annotation.text,
        id: this.annotation.id,
        temporaryID: this.annotation.temporaryImageID,
        source: image.src.trim(),
        highlight: this
      };
      if (this.annotation.temporaryImageID) {
        this.annotoriousAnnotation = this.annotorious.updateAnnotationAfterCreatingAnnotatorHighlight(this.annotoriousAnnotation);
      } else {
        this.annotorious.addAnnotationFromHighlight(this.annotoriousAnnotation, image, shape, geometry, this.defaultStyle);
      }
      this.oldID = this.annotation.id;
      this._image = image;
    }

    ImageHighlight.prototype.annotationUpdated = function() {
      this.annotoriousAnnotation.text = this.annotation.text;
      this.annotoriousAnnotation.id = this.annotation.id;
      if (this.oldID !== this.annotation.id) {
        delete this.annotoriousAnnotation.temporaryID;
      }
      return delete this.annotation.temporaryImageID;
    };

    ImageHighlight.prototype.removeFromDocument = function() {
      return this.annotorious.deleteAnnotation(this.annotoriousAnnotation);
    };

    ImageHighlight.prototype.isTemporary = function() {
      return this._temporary;
    };

    ImageHighlight.prototype.setTemporary = function(value) {
      return this._temporary = value;
    };

    ImageHighlight.prototype.setActive = function(value, batch) {
      if (batch == null) {
        batch = false;
      }
      this.active = value;
      if (!batch) {
        return this.annotorious.drawAnnotationHighlights(this.annotoriousAnnotation.source, this.visibleHighlight);
      }
    };

    ImageHighlight.prototype._getDOMElements = function() {
      return this._image;
    };

    ImageHighlight.prototype.getTop = function() {
      return this.$(this._getDOMElements()).offset().top + this.annotoriousAnnotation.heatmapGeometry.y;
    };

    ImageHighlight.prototype.getHeight = function() {
      return this.annotoriousAnnotation.heatmapGeometry.h;
    };

    ImageHighlight.prototype.scrollTo = function() {
      return this.$(this._getDOMElements()).scrollintoview();
    };

    ImageHighlight.prototype.paddedScrollTo = function(direction) {
      return this.scrollTo();
    };

    ImageHighlight.prototype.setVisibleHighlight = function(state, batch) {
      if (batch == null) {
        batch = false;
      }
      this.visibleHighlight = state;
      if (state) {
        this.annotorious.updateShapeStyle(this.annotoriousAnnotation, this.highlightStyle);
      } else {
        this.annotorious.updateShapeStyle(this.annotoriousAnnotation, this.defaultStyle);
      }
      if (!batch) {
        return this.annotorious.drawAnnotationHighlights(this.annotoriousAnnotation.source, this.visibleHighlight);
      }
    };

    return ImageHighlight;

  })(Annotator.Highlight);

  ImageAnchor = (function(_super) {
    __extends(ImageAnchor, _super);

    function ImageAnchor(annotator, annotation, target, startPage, endPage, quote, image, shape, geometry, annotorious) {
      this.image = image;
      this.shape = shape;
      this.geometry = geometry;
      this.annotorious = annotorious;
      ImageAnchor.__super__.constructor.call(this, annotator, annotation, target, startPage, endPage, quote);
    }

    ImageAnchor.prototype._createHighlight = function(page) {
      return new ImageHighlight(this, page, this.image, this.shape, this.geometry, this.annotorious);
    };

    return ImageAnchor;

  })(Annotator.Anchor);

  Annotator.Plugin.ImageAnchors = (function(_super) {
    __extends(ImageAnchors, _super);

    function ImageAnchors() {
      this.mouseOutAnnotations = __bind(this.mouseOutAnnotations, this);
      this.mouseOverAnnotations = __bind(this.mouseOverAnnotations, this);
      this.showAnnotations = __bind(this.showAnnotations, this);
      this.createImageAnchor = __bind(this.createImageAnchor, this);
      this.setHighlightsVisible = __bind(this.setHighlightsVisible, this);
      this._onMutation = __bind(this._onMutation, this);
      _ref = ImageAnchors.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    ImageAnchors.prototype.pluginInit = function() {
      var image, imagelist, wrapper, _i, _len,
        _this = this;
      this.highlightType = 'ImageHighlight';
      this.Annotator = Annotator;
      this.$ = Annotator.$;
      this.images = {};
      this.visibleHighlights = false;
      wrapper = this.annotator.wrapper[0];
      imagelist = $(wrapper).find('img:visible');
      for (_i = 0, _len = imagelist.length; _i < _len; _i++) {
        image = imagelist[_i];
        this.images[image.src] = image;
      }
      this.annotorious = new Annotorious.ImagePlugin(wrapper, {}, this, imagelist);
      this.annotator.anchoringStrategies.push({
        name: "image",
        code: this.createImageAnchor
      });
      this.annotator.subscribe("setVisibleHighlights", function(state) {
        _this.visibleHighlights = state;
        return _this.setHighlightsVisible(state);
      });
      this.annotator.subscribe("finalizeHighlights", function() {
        var error, src, _, _ref1, _results;
        _ref1 = _this.images;
        _results = [];
        for (src in _ref1) {
          _ = _ref1[src];
          try {
            _results.push(_this.annotorious.drawAnnotationHighlights(src, _this.visibleHighlights));
          } catch (_error) {
            error = _error;
            console.log("Error: failed to draw image highlights for", src);
            _results.push(console.log(error.stack));
          }
        }
        return _results;
      });
      this.annotator.subscribe("annotationsLoaded", function() {
        if (_this.visibleHighlights) {
          return _this.setHighlightsVisible(true);
        }
      });
      return this.observer = new MutationSummary({
        callback: this._onMutation,
        rootNode: wrapper,
        queries: [
          {
            element: 'img'
          }
        ]
      });
    };

    ImageAnchors.prototype._onMutation = function(summaries) {
      var summary, _i, _len, _results,
        _this = this;
      _results = [];
      for (_i = 0, _len = summaries.length; _i < _len; _i++) {
        summary = summaries[_i];
        summary.added.forEach(function(newImage) {
          var isImageAnchor;
          _this.images[newImage.src] = newImage;
          _this.annotorious.addImage(newImage);
          isImageAnchor = function(anchor) {
            var img_selector, t, _j, _len1, _ref1;
            _ref1 = anchor.annotation.target;
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
              t = _ref1[_j];
              img_selector = this.annotator.findSelector(t, 'ShapeSelector');
              if ((img_selector != null ? img_selector.source : void 0) === newImage.src) {
                return true;
              }
            }
            return false;
          };
          return _this.annotator._reanchorAnnotations(isImageAnchor);
        });
        _results.push(summary.removed.forEach(function(oldImage) {
          var highlights, hl, _j, _len1;
          highlights = _this.annotorious.getHighlightsForImage(oldImage);
          for (_j = 0, _len1 = highlights.length; _j < _len1; _j++) {
            hl = highlights[_j];
            hl.anchor.remove();
          }
          delete _this.images[oldImage.src];
          return _this.annotorious.removeImage(oldImage);
        }));
      }
      return _results;
    };

    ImageAnchors.prototype.setHighlightsVisible = function(state) {
      var hl, imageHighlights, src, _, _i, _len, _ref1, _results;
      imageHighlights = this.annotator.getHighlights().filter(function(hl) {
        return hl instanceof ImageHighlight;
      });
      for (_i = 0, _len = imageHighlights.length; _i < _len; _i++) {
        hl = imageHighlights[_i];
        hl.setVisibleHighlight(state, true);
      }
      _ref1 = this.images;
      _results = [];
      for (src in _ref1) {
        _ = _ref1[src];
        _results.push(this.annotorious.drawAnnotationHighlights(src, this.visibleHighlights));
      }
      return _results;
    };

    ImageAnchors.prototype.createImageAnchor = function(annotation, target) {
      var dfd, image, selector;
      dfd = this.$.Deferred();
      selector = this.annotator.findSelector(target.selector, "ShapeSelector");
      if (selector == null) {
        dfd.reject("no ImageSelector found");
        return dfd.promise();
      }
      image = this.images[selector.source];
      if (!image) {
        dfd.reject("No such image exists as " + selector.source);
        return dfd.promise();
      }
      dfd.resolve(new ImageAnchor(this.annotator, annotation, target, 0, 0, '', image, selector.shapeType, selector.geometry, this.annotorious));
      return dfd.promise();
    };

    ImageAnchors.prototype.annotate = function(source, shape, geometry, tempID, annotoriousAnnotation) {
      var event, result;
      event = {
        targets: [
          {
            source: this.annotator.getHref(),
            selector: [
              {
                type: "ShapeSelector",
                source: source,
                shapeType: shape,
                geometry: geometry
              }
            ]
          }
        ],
        annotationData: {
          temporaryImageID: tempID
        }
      };
      result = this.annotator.onSuccessfulSelection(event, true);
      if (!result) {
        return this.annotorious.deleteAnnotation(annotoriousAnnotation);
      }
    };

    ImageAnchors.prototype.showAnnotations = function(annotations) {
      if (!annotations.length) {
        return;
      }
      this.annotator.onAnchorMousedown(annotations, this.highlightType);
      return this.annotator.onAnchorClick(annotations, this.highlightType);
    };

    ImageAnchors.prototype.mouseOverAnnotations = function(annotations) {
      return this.annotator.onAnchorMouseover(annotations, this.highlightType);
    };

    ImageAnchors.prototype.mouseOutAnnotations = function(annotations) {
      return this.annotator.onAnchorMouseout(annotations, this.highlightType);
    };

    return ImageAnchors;

  })(Annotator.Plugin);

}).call(this);

//
//@ sourceMappingURL=annotator.imageanchors.map