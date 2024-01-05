/* global ckeditor_instances */


export default function (options) {

  const default_options = {
    selectors: ['editor-std', 'editor-full', 'editor-custom'],
    requiredErrorMes: requiredElement => {
      return `L'elemento ${requiredElement} è obbligatorio`;
    },
    alertUI: mes => {
      alert(mes);
    }
  };

  let cke_opts = Object.assign({}, default_options, options || {}),

    editor_textareas = document.querySelectorAll(cke_opts.selectors.map(i => `textarea.${i}`).join(',')),
    editors_required = document.querySelectorAll(cke_opts.selectors.map(i => `textarea.${i}[required]`).join(','));


  // CAMPI REQUIRED
  //=========================
  /*
    metodo per il controllo dei textarea required.
    Il controllo va eseguito in due step:
    - censimento dei campi required ed eliminazione dell'attributo
      relativo per evitare errori al submit del form
    - Al momento del submit, i campi required sono controllati
      perché non siano vuoti (necessario farlo dopo il trim)

    È necessario che ogni textarea abbia un id
  */
  editors_required.forEach(item => {
    item.required = false;
    item.parentNode.querySelector('label').classList.add('required');
  });

  document.querySelectorAll('form').forEach(_form => {

    _form.onsubmit = (e) => {

      // pulizia
      editor_textareas.forEach(item => {

        let editor = ckeditor_instances[item.id],
          cke_data = editor.getData();

        const empty_lines_regexp = '((<p[^>]*>(?:(?:&nbsp;)|(?:<br data-cke-filler="true" ?/?>))</p>)+)';

        cke_data = cke_data
          .trim()
          // strong dentro gli header
          .replace(/(<h\d>)<strong>(.*?)<\/strong>(<\/h\d>) /igm, '$1$2$3')
          // paragrafi vuoti all'inizio
          .replace(new RegExp(`^${empty_lines_regexp}`, 'i'), '')
          // paragrafi vuoti alla fine
          .replace(new RegExp(`${empty_lines_regexp}$`, 'i'), '')
        ;
        // https://ckeditor.com/docs/ckeditor5/latest/api/module_editor-classic_classiceditor-ClassicEditor.html#function-setData

        if(cke_data.toLowerCase() === '<p>&nbsp;</p>') {
          cke_data = '';
        }

        editor.setData( cke_data );
        // editor.updateSourceElement(cke_data);
        item.value = cke_data;
      });

      // required
      editors_required.forEach(item => {
        if(!item.value) {
          cke_opts.alertUI(cke_opts.requiredErrorMes(item.id));
          e.preventDefault();
          return false;
        }
      });
    };

  });

}
