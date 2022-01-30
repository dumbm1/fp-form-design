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

    csInterface.evalScript('getPaths()', function (result) {
      let pathList = result;
      pathList = pathList.split(',');

      /**
       * rm doubles from array
       * from Grundy: https://ru.stackoverflow.com/questions/539941/Как-удалить-из-массива-повторяющиеся-элементы/539942
       * */
      pathList = Array.from(new Set(pathList));

      _insertPathList(pathList);

      function _insertPathList(pathList) {
        let docsSelectElem = document.getElementById('__docs-select__');

        // docsSelectElem.innerHTML = '';

        for (let i = 0; i < pathList.length; i++) {
          let optPath = document.createElement('option');
          optPath.innerHTML = pathList[i];
          optPath.selected = false;
          docsSelectElem.append(optPath);
        }

        docsSelectElem.selectedIndex = 0;

      }
    });

    $('#__btn_add-path__').click(()=>{
      let opts = makeOpts();
        csInterface.evalScript('getCustomFolder(' + JSON.stringify(opts) + ')', function (result) {
          let docsSelectElem = document.getElementById('__docs-select__');
          let customFolderPath = result;
          let optPath = document.createElement('option');
          optPath.innerHTML = customFolderPath;
          optPath.selected = true;
          docsSelectElem.append(optPath);
        });
    })

    $('#__color__ input').focus(function () {
      $(this).select();
    });

    $('.__lineature__').change(function () {
      let val = $(this).val();
      let indx = $(this).index();

      if (val == '-') {
        $('#__angle_' + indx + '__').val(val);
        $('#__min-percent_' + indx + '__').val(val);
        $('#__rasterization_' + indx + '__').val(val);
      }
      if (val == '') {
        $('#__angle_' + indx + '__').val(val);
        $('#__min-percent_' + indx + '__').val(val);
        $('#__rasterization_' + indx + '__').val(val);
        $('#__color_' + indx + '__').val(val);
        $('#__special-notes_' + indx + '__').val(val);
      }
    });

    $('#__btn_from-template__').click(() => {
      let opts = makeOpts();
      try {
        csInterface.evalScript('mkFormDesign(' + JSON.stringify(opts) + ')', function (result) {
        });

        setTimeout(function ff() {
          try {
            csInterface.evalScript('main(' + JSON.stringify(opts) + ')', function (result) {});
          } catch (err) {
            //alert(err);
          }
        }, 3000);
      } catch (err) {
        // alert(err);
      }
    });

    $('#__btn_ok__').click(() => {
      let opts = makeOpts();
      try {
        csInterface.evalScript('mkFormDesign(' + JSON.stringify(opts) + ')', function (result) {
        });

        setTimeout(function ff() {
          try {
            csInterface.evalScript('main(' + JSON.stringify(opts) + ')', function (result) {});
          } catch (err) {
            //alert(err);
          }
        }, 3000);
      } catch (err) {
        // alert(err);
      }
    });

    $('#__btn_clear-form__').click(function () {
      var isConfirm = confirm('!!! ВНИМАНИЕ !!!\n' + 'Операция НЕОБРАТИМА!\n' +
                                'Уверены, что хотите очистить все поля формы?');

      if (isConfirm === false) return;

      localStorage.clear();
      location.reload();
    });

    $('#__btn_reload_panel__').click(function () {
      location.reload();
    });

    function makeOpts() {
      let opts = {};
      opts.color = _getInputs('__color__', false);
      opts.lineature = _getSelected('__lineature__');
      opts.raster_angle = _getSelected('__raster-angle__');
      opts.min_raster_percent = _getSelected('__min-raster-percent__');
      opts.rasterize_type = _getSelected('__rasterize-type__');
      opts.special_notes = _getSelected('__special-notes__');

      opts.print_machine = _getSelected('__print-machine__');
      opts.designer = _getSelected('__designer__');
      opts.order_number = _getInputs('__order-number__');
      opts.order_title = _getInputs('__order-title__', false);
      opts.order_version = _getInputs('__order-version__');
      opts.filePath = document.getElementById('__docs-select__').options[document.getElementById('__docs-select__').selectedIndex].value;

      function _getInputs(divId, replaceVal) {

        let elems = [];
        let divElemInputs = document.getElementById(divId).getElementsByTagName('input');
        for (let i = 0; i < divElemInputs.length; i++) {
          let elem = divElemInputs[i];
          let val = elem.value;
          if (arguments[1] === false) {
            elems.push(val);
            continue;
          }
          elems.push(val.replace('-', '—'));
        }
        return elems;
      }

      function _getSelected(divId, replaceVal) {
        let selectedValues = [];

        let elemSelections = document.getElementById(divId).getElementsByTagName('select');

        for (let i = 0; i < elemSelections.length; i++) {
          let sel = elemSelections[i];
          let val = sel.options[sel.selectedIndex].value;

          if (arguments[1] === false) {
            selectedValues.push(val);
            continue;
          }

          selectedValues.push(val.replace('-', '—'));

        }
        return selectedValues;
      }

      return opts;
    }
  }

}());