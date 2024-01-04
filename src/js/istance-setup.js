import { better_text, text_cleaner, unique_id } from '@massimo-cassandro/js-utilities';

export function instance_setup(dom_element, editor) { // editor = istanza ckeditor

  // https://ckeditor.com/docs/ckeditor5/latest/framework/deep-dive/clipboard.html
  editor.editing.view.document.on( 'clipboardInput', ( evt, data ) => {

    let text = data.dataTransfer.getData( 'text/html' );

    text = text
      .trim()
      // pulizia spazi non divisibili
      .replace(/(&nbsp;)/g, ' ')
      .replace(/(&#160;)/g, ' ')
      .replaceAll(String.fromCharCode(160), ' ')
      // .replace(/\u00A0/g, ' ')
      .replace(/ +/g, ' ')
      .replace(/(<h\d>)<strong>(.*?)<\/strong>(<\/h\d>) /igm, '$1$2$3'); // strong dentro gli header

    text = better_text(text_cleaner(text));

    data.content = editor.data.htmlProcessor.toView( text );

  }); // end on clipboardInput

  if(dom_element.disabled) {
    editor.isReadOnly = true;
  }
  if( !dom_element.id ) {
    dom_element.id = unique_id();
  }
  window.ckeditor_instances??= {};
  window.ckeditor_instances[dom_element.id] = editor;

  // abilita eventuali elementi disabilitati con attributo `data-enable="editor"`
  document.querySelectorAll('[data-enable="editor"]:disabled').forEach( el => {
    el.disabled = false;
    el.closest('.form-group').classList.remove('disabled');
  });

}
