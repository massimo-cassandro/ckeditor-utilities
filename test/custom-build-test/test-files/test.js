import cke_loader from '../../../src/ckeditor-loader.js';
import cke_form_check from '../../../src/ckeditor-form-check.js';

/* globals ckeditor_instances */


cke_loader({
  std_selectors: {
    // 'editor-std': '/libs/ckeditor-std.js',
    // 'editor-full': '/libs/ckeditor-full.js',
  },
  custom_editor_selector: 'editor-custom',
  custom_editor_url: '/ckeditor-dist/ckeditor-custom-min.js',
  upl_url: 'test-files/test-server-upload-response.php', // relative to html file
  img_viewer: '',
  link_auto_ext_target_blank: true,
  link_download: true,
  link_target_blank: true
});

cke_form_check({
  requiredErrorMes: requiredElement => {
    return `L'elemento ${requiredElement} è obbligatorio`;
  },

  alertUI: mes => {
    // document.querySelectorAll('[type=submit]').forEach(item => { item.disabled=false; });
    alert(mes);
  }
});


// UTILITÀ PER TEST
document.querySelectorAll('.get-data-btn').forEach(item => {
  item.addEventListener('click', () => {

    let textarea_id = item.closest('.demo_wrapper').querySelector('textarea').id,
      cke_data = ckeditor_instances[textarea_id].getData();
    item.nextElementSibling.innerHTML = cke_data
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    console.log(cke_data); // eslint-disable-line
  }, false);
});

document.getElementById('start-inspector').addEventListener('click', function () {
  // document.querySelectorAll('textarea.editor-custom').forEach(item => {
  //   CKEditorInspector.attach( ckeditor_instances[item.id] );
  // });
  // this.remove();
  alert('CKEditorInspector non abilitato');
}, false);

