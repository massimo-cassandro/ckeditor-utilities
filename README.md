# CKEditor utilities

Utilità per l'implementazione di CKEditor 5.

## breaking changes
* rispetto alla versione 2.x, nella versione 3 non esistono più i parametri `selector` e `cke_url`, sostituiti da `std_selectors`, `custom_editor_selector` e `custom_editor_url`
* la class di default `editor` è stata rinominata in `editor-custom`

## Loader

CKEditor loader semplifica e automatizza l'attivazione di CKEditor su un textarea.

Sono previste diverse tipologie di editor:
* `custom`: editor personalizzabile (con loader immagini personalizzato) compilata ad hoc (ed al momento è ferma alla versione 29 di CKEditor 5)
* uno più editor costruiti tramite il builder presente sul sito CKeditor (<https://ckeditor.com/ckeditor-5/online-builder/>), mentre la versione *custom* è .

Per implementare il loader, includere lo script e impostare le opzioni:

```js
import {ckeditor_loader} from '@massimo-cassandro/ckeditor-utilities';

 ckeditor_loader({
   std_selectors: {
    'selettore1': '/path/to/ckeditor1',
    'selettore2': '/path/to/ckeditor2',
    ...
  },

  // opzioni per custom editor:
  custom_editor_selector: 'editor-custom',
  custom_editor_url: '/ckeditor-dist/ckeditor-custom-min.js',

  upl_url   : '/path/to/server_script',
  img_viewer: '/viewer-url/',
  link_auto_ext_target_blank: true,
  link_download: true,
  link_target_blank: true
});
```

In cui:

* `std_selectors` è un oggetto che associa ad ogni selettore il rispettivo script. I nomi delle classi possono essere definiti a piacere (default: `{}`)
* solo per custom editor:
  * `custom_editor_selector`: selettore classe custom editor (default: `editor-custom`),
  * `custom_editor_url`: oath ckeditor custom (default: null),
  * `upl_url` è l'url dello script lato server per l'upload delle immagini (se richiesto)
  * `img_viewer` è l'url dell'applicazione per la visualizzazione delle immagini caricate (se richiesto)
  * `link_auto_ext_target_blank`: (default false) se true a tutti gli url esterni vengono automaticamente aggiunti gli attributi `target="_blank"` e `rel="noopener noreferrer"`
  * `link_download`: (default false) se true viene visualizzata l'opzione per forzare il download del link
  * `link_target_blank`: (default false) se true viene visualizzata l'opzione "Apri in nuova finestra" che imposta gli attributi `target="_blank"` e `rel="noopener noreferrer"`

Il loader attiva automaticamente CKEditor per tutti i textarea la cui classe corrisponda a `custom_editor_selector` o corrispopanda ad una delle chiavi di `std_selectors`.

Non è possibile utilizzare più script (ovvero editor con configurazioni diverse) nella stessa pagina. Il loader dà la precedenza al *custom editor* (se la classe corrispondente è presente nella pagina) e in alternativa imposta come editor quella corrispondente alla prima classe di `std_selectors` presente nella pagina.

Per disabilitare completamente il custom editor, impostare `custom_editor_selector` su `null`.

Se fosse necessario attivare editor con diverse configurazioni nella stessa pagina, usare il custom editor.

### Custom editor

Negli editor `custom` la toolbar viene modellata in base alla configurazione definita dalle classi assegnate al textarea:

* la classe definita in `custom_editor_selector` da sola attiva l'editor in forma standard (completa)

In **aggiunta** a questa: 
    * la classe `editor-lite` attivano l'editor senza possibilità di inserimento delle immagini
    * la classe `editor-xlite` attivano l'editor eliminando, oltre alle immagini, le tabelle
    * la classe `editor-xxlite` attivano l'editor eliminando tutto tranne `bold`, `italic`, `link` e l'allineamento del testo
    * la classe `editor-xxxlite` attivano l'editor eliminando tutto tranne `bold`, `italic`, `link`
    * la classe `editor-no-headings`, se aggiunta ad una qualsiasi delle impostazioni precedenti, elimina la gestione degli headings (se presenti).


### Abilitazione elementi al caricamento di ckeditor

Ad evitare che un textarea sia modificabile prima dell'attivazione di CKeditor (che su reti lente potrebbe avere un delay avvertibile), è sufficiente disabilitarlo e aggiungere l'attributo `data-enable="editor"`.

```html
<textarea class="editor-1" id="textarea1" data-enable="editor" disabled></textarea>
```

All'attivazione di CKEditor, il campo verrà automaticamente abilitato.

Oltre che sui textarea, questo metodo può essere applicato ad ogni elemento che necessiti di essere abilitato in questo modo.

In aggiunta, se l'elemento in esame è all'interno di un `div.form-group`, l'eventuale classe `disabled` presente, viene eliminata.

Per altre info, vedi gli esempi nella dir `test`.


## Altre funzionalità del loader

Oltre a caricare lo script ckeditor, il loader esegue anche alcune altre operazioni:

### Lista degli editor

All'attivazione, tutte le istanze di ckeditor attivate vengono aggiunte all'oggetto `window.ckeditor_instances`, identificabili dall'id del textarea associato.

In questo modo è possibile eseguire operazioni su ogni editor facendo riferimento a `window.ckeditor_instances.id`, dove `id` è l'id del textarea su cui è stato attivato ckeditor.

> NB: se l'id non è presente viene assegnato automaticamente

### Controllo massima dimensione (KB) immagini (solo custom editor)

Il caricamento delle immagini all'interno di un elemento CKEditor è limitato di default a 4MB. 

Per variare questo valore, è sufficiente aggiungere al textarea l'attributo `data-cke-upl-max-size` che deve riportare il valore in byte della massima dimensione dell'immagine.

Esempio, per limitare le immagini a 1 MB:

```html
<textarea class="editor-custom" id="textarea1" data-cke-upl-max-size="1048576"></textarea>
```


## Utilità

Oltre al loader, possono essere aggiunti al progetto:

* `ckeditor_form_check` che aggiunge dei controlli non presenti nativamente in CKEditor: campi required, pulizia del testo copiato (viene azzerata la maggior parte della formattazione ecentualmente presente) e trimming delle righe vuote
* `_ckeditor-bs5.scss` supporto per le classi aggiunte da CKEditor (per la gestione di tabelle e immagini) con l'estensione di alcune classi di Bootstrap 5.

Il file scss va incluso con `@import`:

```scss
@import '@massimo-cassandro/ckeditor-utilities/scss/ckeditor-bs5';
```


### `ckeditor_form_check`

`ckeditor_form_check` è un'utility che, quando richiamata, associa ai form presenti nella pagina un controllo sugli elementi textarea che contengano le classi utilizzate dal loade per l'attivazione del loader.

I controlli eseguiti sono:
* pulizia di righe vuote (comprese le stringhe `<p>&nsbp;</p>` poste all'inizio e alla fine del codice HTML prodotto da CKEditor) e altri potenziali errori di formattazione
* verifica di textarea required non compilati

```javascript
// i valori mostrati sono quelli di default
ckeditor_form_check({
  selectors: ['editor-std', 'editor-full', 'editor-custom'],
  requiredErrorMes: requiredElement => {
    return `L'elemento ${requiredElement} è obbligatorio`;
  },
  alertUI: mes => {
    alert(mes);
  }
});
```

In cui:
* `selectors`: array contenente i selettori da controllare 
* `requiredErrorMes` è la funzione che restituisce la stringa del messaggio d'errore per i campi required. L'argomento è una stringa che permetta all'autente l'identificazione del campo
* `alertUI` è la funzione che richiama l'interfaccia di visualizzazione dell'errore (default `window.alert`)


## Esempio di implementazione di ckeditor e delle utilità

In quest'esempio la configurazione del loader è anche utilizzata per condividere la lista dei selettori con `ckeditor_form_check`:


```javascript
import {ckeditor_loader, ckeditor_form_check} from '@massimo-cassandro/ckeditor-utilities';

const ckeditor_loader_config = {
  std_selectors: {
    'selettore1': '/path/to/ckeditor1',
    'selettore2': '/path/to/ckeditor2',
    // ...
  },

  custom_editor_selector: 'editor-custom',
  custom_editor_url: '/ckeditor-dist/ckeditor-custom-min.js',

  upl_url: 'path/to/uploader',
  img_viewer: 'path/to/viewer/',
  link_auto_ext_target_blank: true,
  link_download: true,
  link_target_blank: true
};

ckeditor_loader(ckeditor_loader_config);

const selectors_list = [
  ...Object.keys(ckeditor_loader_config.std_selectors), 
  ...(ckeditor_loader_config.custom_editor_selector? [ckeditor_loader_config.custom_editor_selector] : [])
];


ckeditor_form_check({
  selectors: selectors_list,
  requiredErrorMes: requiredElement => {
    return `L'elemento ${requiredElement} è obbligatorio`;
  },

  alertUI: mes => {
    alert(mes);
  }
});
```
