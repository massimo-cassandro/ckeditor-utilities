/* globals ClassicEditor */

import { create_custom_editor_options } from './js/create-custom-editor-options.js';
import { instance_setup } from './js/istance-setup.js';

export default function (loader_options) {

  const  default_options = {

    // selettori css e relativi file ckeditor da caricare. Gli script ckeditor sono esclusivi.
    // Se è necessario usare editor con diverse configurazioni nella stessa pagina, usare sempre il custom
    // selettore => path file ckeditor da caricare
    std_selectors: {},

    custom_editor_selector: 'editor-custom',
    custom_editor_url: null,

    upl_url: '/ckeditor/file-uploader',
    img_viewer: '/viewer/',  // (visualizzaione dei file da db, NB: con slash finale)

    link_auto_ext_target_blank: false,
    link_download: false,
    link_target_blank: false
  };

  let opts = Object.assign({}, default_options, loader_options || {});

  try {

    const std_selectors_list = Object.keys(opts.std_selectors)
      ,full_selector_list = [...std_selectors_list, ...(opts.custom_editor_selector? [opts.custom_editor_selector] : [])]
      ,editors_list = document.querySelectorAll(full_selector_list.map(i => `textarea.${i}`).join(','))
    ;



    if (editors_list.length) {


      // Istanza ckeditor.
      // L'istanza è raggiungibile tramite il suo id (se non esiste viene assegnato un id univoco)
      // es: ckeditor_instances.__textarea_id__
      window.ckeditor_instances = {};
      let editor_create_options = {};
      let isCustomEditor = false;
      let cke_url;


      if(opts.custom_editor_selector && !opts.custom_editor_url) {
        throw 'Missing `custom_editor_url`';
      }


      // selezione script
      if(document.querySelectorAll(`.${opts.custom_editor_selector}`).length) {
        cke_url = opts.custom_editor_url;
        isCustomEditor = true;
      }

      if(!isCustomEditor) {
        if(!std_selectors_list.length) {
          throw 'Missing selectors';

        } else {
          for(let selector in std_selectors_list) {
            if(document.querySelectorAll(`.${selector}`).length) {
              cke_url = opts.std_selectors[selector];
              break;
            }
          }
        }
      }

      const script = document.createElement('script');
      script.onload = function() {

        editors_list.forEach( dom_element => {

          if(isCustomEditor) {
            editor_create_options = create_custom_editor_options(dom_element, opts);
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

  } catch(e) {
    console.error( e ); // eslint-disable-line
  }

}
