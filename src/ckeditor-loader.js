/* globals ClassicEditor */

import { create_custom_editor_options } from './js/create-custom-editor-options.js';
import { instance_setup } from './js/istance-setup.js';

export default function (loader_options) {

  const default_options = {

    // selettori css e relativi file ckeditor da caricare. Gli script ckeditor sono esclusivi.
    // Se è necessario usare editor con diverse configurazioni nella stessa pagina, usare sempre il custom
    // selettore => path file ckeditor da caricare
    selectors: {
      'editor-std': '/libs/ckeditor-std.js',
      'editor-full': '/libs/ckeditor-full.js',
      'editor-custom': '/libs/ckeditor-custom-min.js' // custom
    },

    upl_url: '/ckeditor/file-uploader',
    img_viewer: '/viewer/',  // (visualizzaione dei file da db, NB: con slash finale)

    link_auto_ext_target_blank: false,
    link_download: false,
    link_target_blank: false
  };

  let cke_opts = Object.assign({}, default_options, loader_options || {});

  const editors_list = document.querySelectorAll(Object.keys(cke_opts.selectors).map(i => `textarea.${i}`).join(', '));

  if (editors_list.length) {

    // Istanza ckeditor.
    // L'istanza è raggiungibile tramite il suo id (se non esiste viene assegnato un id univoco)
    // es: ckeditor_instances.__textarea_id__
    window.ckeditor_instances = {};
    let editor_create_options = {};
    let isCustomEditor = false;
    let cke_url;

    if(document.querySelectorAll('.editor-std').length) {
      cke_url = cke_opts.selectors['editor-std'];

    } else if(document.querySelectorAll('.editor-full').length) {
      cke_url = cke_opts.selectors['editor-full'];

    } else {
      cke_url = cke_opts.selectors['editor-custom'];
      isCustomEditor = true;
    }

    const script = document.createElement('script');
    script.onload = function() {

      editors_list.forEach( dom_element => {

        if(isCustomEditor) {
          editor_create_options = create_custom_editor_options(dom_element, cke_opts);
        }
        ClassicEditor.create( dom_element, editor_create_options)
          .then( editor => {
            instance_setup(dom_element, editor);
          })
          .catch( error => {
            /* eslint-disable */
            console.error(`textarea#${dom_element.id}`);
            console.error(error);
            /* eslint-enable */
          });
      }); // end foreach
    }; // end onload

    script.src = cke_url;
    document.head.appendChild(script);



  } // end if( editor_list.length

}
