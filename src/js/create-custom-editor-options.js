
const std_toolbar = [
    'heading',
    '|',
    'bold',
    'italic',
    'link',
    '|',
    'alignment:left', 'alignment:center', 'alignment:right', 'alignment:justify',
    '|',
    'outdent', 'indent',
    '|',
    'bulletedList',
    'numberedList',
    '|',
    'imageUpload',
    'blockQuote',
    'insertTable',
    'undo',
    'redo'
  ],

  lite_toolbar = [
    'heading',
    '|',
    'bold',
    'italic',
    'link',
    '|',
    'alignment:left', 'alignment:center', 'alignment:right', 'alignment:justify',
    '|',
    'outdent', 'indent',
    '|',
    'bulletedList',
    'numberedList',
    '|',
    //'imageUpload',
    'blockQuote',
    'insertTable',
    'undo',
    'redo'
  ],

  xlite_toolbar = [
    'heading',
    '|',
    'bold',
    'italic',
    'link',
    '|',
    'alignment:left', 'alignment:center', 'alignment:right', 'alignment:justify',
    '|',
    'outdent', 'indent',
    '|',
    'bulletedList',
    'numberedList',
    '|',
    //'imageUpload',
    'blockQuote',
    //'insertTable',
    'undo',
    'redo'
  ],

  xxlite_toolbar = [
    // 'heading',
    // '|',
    'bold',
    'italic',
    'link',
    '|',
    'alignment:left', 'alignment:center', 'alignment:right',
    // '|',
    // 'outdent', 'indent',
    // '|',
    // 'bulletedList',
    // 'numberedList',
    '|',
    // 'imageUpload',
    // 'blockQuote',
    // 'insertTable',
    'undo',
    'redo'
  ],

  xxxlite_toolbar = [
    'bold',
    'italic',
    'link'
  ],

  img_plugins = ['mUploadAdapter', 'ImageUpload', 'Image', 'ImageToolbar', 'ImageStyle', 'ImageUpload', 'ImageCaption', 'ImageResize'],
  table_plugins = ['insertTable', 'Table', 'TableToolbar', 'TableProperties', 'TableCellProperties'],
  headings_plugins = ['Heading'];


export function create_custom_editor_options(dom_element, loader_opts) {

  let options = {
    uploaderUrl    : loader_opts.upl_url,
    uploadMaxSize  : 4 * 1024 * 1024,
    imgViewer      : loader_opts.img_viewer,
    toolbar        : std_toolbar
  };

  // max size da attributo data
  if(dom_element.dataset.ckeUplMaxSize) { // in bytes
    options.uploadMaxSize = dom_element.dataset.ckeUplMaxSize;
  }

  // https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/configuration.html#removing-features
  if (dom_element.classList.contains('editor-lite')) {
    options = {
      toolbar: lite_toolbar,
      removePlugins: img_plugins,
    };
  } else if(dom_element.classList.contains('editor-xlite')) {
    options = {
      toolbar: xlite_toolbar,
      removePlugins: img_plugins.concat(table_plugins),
    };
  } else if(dom_element.classList.contains('editor-xxlite')) {
    options = {
      toolbar: xxlite_toolbar,
      removePlugins: img_plugins.concat(table_plugins, headings_plugins,
        ['BlockQuote', 'List', 'Indent', 'IndentBlock']),
    };
  } else if(dom_element.classList.contains('editor-xxxlite')) {
    options = {
      toolbar: xxxlite_toolbar,
      removePlugins: img_plugins.concat(table_plugins, headings_plugins,
        ['BlockQuote', 'List', 'Indent', 'IndentBlock']),
    };
  }

  if(dom_element.classList.contains('editor-no-headings')) {
    options.toolbar = options.toolbar.filter(item => item !== 'heading');
    options.removePlugins = (options.removePlugins??[]).concat(headings_plugins);
  }

  // rimozione eventuali separatori all'inizio e alla fine
  if(options.toolbar[0] === '|') {
    options.toolbar = options.toolbar.slice(1);
  }
  if(options.toolbar.slice(-1) === '|') {
    options.toolbar = options.toolbar.slice(0, -1);
  }

  // opzioni link
  // https://ckeditor.com/docs/ckeditor5/latest/features/link.html
  options.link = {

    addTargetToExternalLinks: loader_opts.link_auto_ext_target_blank, // target _blank automatico per url esterni
    decorators: {}
  };

  if(loader_opts.link_download) {
    options.link.decorators.toggleDownloadable = {
      mode: 'manual',
      label: 'Download',
      attributes: {
        download: 'download'
      }
    };
  }
  if(loader_opts.link_target_blank) {
    options.link.decorators.openInNewTab = {
      mode: 'manual',
      label: 'Apri in nuova finestra',
      defaultValue: false,
      attributes: {
        target: '_blank',
        rel: 'noopener noreferrer'
      }
    };
  }

  return options;

}
