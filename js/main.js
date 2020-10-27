/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, window, location, CSInterface, SystemPath, themeManager*/
;'use strict';

(function () {

  let csInterface = new CSInterface();
  CSInterface.prototype.loadJSX = function (fileName) {
    var extensionRoot = csInterface.getSystemPath(SystemPath.EXTENSION) + '/jsx/';
    csInterface.evalScript('$.evalFile("' + extensionRoot + fileName + '")');
  };

  init();

  function init() {
    csInterface.loadJSX('hostscript.jsx');
    csInterface.loadJSX('json2.js');

    jQuery.fn.extend({
                       disableSelection: function () {
                         this.each(function () {
                           this.onselectstart = function () {
                             return false;
                           };
                         });
                       }
                     });
    $('body').disableSelection();

    $('form').sisyphus({timeout: 5});

    $('#__btn_ok__').click(() => {
      let opts = makeOpts();
      try {
        csInterface.evalScript('main(' + JSON.stringify(opts) + ')', function (result) {
        });
      } catch (err) {
        //alert(err);
      }
    });

    $('#__btn_clear-form__').click(function () {
      localStorage.clear();
      location.reload();
    });

    $('#__btn_reload_panel__').click(function () {
      location.reload();
    });

    function makeOpts() {
      let opts = {};
      opts.color = _getInputs('__color__');
      opts.lineature = _getSelected('__lineature__');
      opts.raster_angle = _getSelected('__raster-angle__');
      opts.min_raster_percent = _getSelected('__min-raster-percent__');
      opts.rasterize_type = _getSelected('__rasterize-type__');
      opts.special_notes = _getSelected('__special-notes__');

      function _getInputs(divId) {

        let colors = [];
        let div_color_inputs = document.getElementById(divId).getElementsByTagName('input');
        for (let i = 0; i < div_color_inputs.length; i++) {
          let elem = div_color_inputs[i];
          colors.push(elem.value.replace('-', '—'));
        }
        return colors;
      }

      function _getSelected(divId) {
        let selectedValues = [];

        let lineature_selections = document.getElementById(divId).getElementsByTagName('select');

        for (let i = 0; i < lineature_selections.length; i++) {
          let sel = lineature_selections[i];
          selectedValues.push(sel.options[sel.selectedIndex].value.replace('-', '—'));
        }
        return selectedValues;
      }

      return opts;
    }
  }

}());