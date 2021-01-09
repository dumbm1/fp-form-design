//@include mkFormDesign.jsx

function main(opts) {

  var d = activeDocument;
  var lays = d.layers;
  var SECTION_NUM = 9;
  var testArr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];

  if (!d.name.match('fp-form-designer')) {
    // throw new Error('Make template and go to the template document/tab');
    alert('Make template and go to the template document/tab');
    return;
  }

  try {
    var colorTextItems = lays.getByName('__color__').groupItems[0].textFrames;
    var lineatureTextItems = lays.getByName('__lineature__').groupItems[0].textFrames;
    var rasterAngleTextItems = lays.getByName('__raster-angle__').groupItems[0].textFrames;
    var minRasterPercentTextItems = lays.getByName('__min-raster-percent__').groupItems[0].textFrames;
    var rasterizeTypeTextItems = lays.getByName('__rasterize-type__').groupItems[0].textFrames;
    var specialNotesTextItems = lays.getByName('__special-notes__').groupItems[0].textFrames;
  } catch (e) {
    // throw new Error('Incorrect template layers structure');
    alert('Incorrect template layers structure');
    return;
  }

  try {
    for (var i = SECTION_NUM - 1, j = 0; i >= 0; i--, j++) {
      colorTextItems[i].contents = opts.color[j];
      lineatureTextItems[i].contents = opts.lineature[j];
      rasterAngleTextItems[i].contents = opts.raster_angle[j];
      minRasterPercentTextItems[i].contents = opts.min_raster_percent[j];
      rasterizeTypeTextItems[i].contents = opts.rasterize_type[j];
      specialNotesTextItems[i].contents = opts.special_notes[j].replace(/(\d)/, '($1)');
    }
  } catch (e) {
    // throw new Error('Error2');
    alert('Error2');
    return;
  }

  try {
    var fromBaseFrames = lays.getByName('__var-from-base__').groupItems[0].textFrames;
    var orderTitle = fromBaseFrames.getByName('__order-title__');
    var orderNumber = fromBaseFrames.getByName('__order-number__');
    var orderVersion = fromBaseFrames.getByName('__order-version__');
    var printMachine = fromBaseFrames.getByName('__print-machine__');
    var designer = fromBaseFrames.getByName('__designer__');

    orderTitle.contents = opts.order_title[0];
    orderNumber.contents = opts.order_number[0];
    orderVersion.contents = opts.order_version[0];
    printMachine.contents = opts.print_machine[0];
    designer.contents = opts.designer[0];
  } catch (e) {
    // throw new Error('Error3');
    alert('Error3');
    return;
  }
}
