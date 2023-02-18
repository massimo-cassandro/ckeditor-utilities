# CKEditor utilities

Utilità per l'implementazione di CKEditor

## Loader

CKEditor loader semplifica e automatizza l'attivazione di CKEditor su un textarea.

Includere lo script e impostare le opzioni:

```js
import {ckeditor_loader} from '@massimo-cassandro/ckeditor-utilities';

 ckeditor_loader({
  cke_url   : '/path/to/ckeditor-custom-min.js',
  upl_url   : '/path/to/server_script',
  img_viewer: '/viewer-url/',
  link_auto_ext_target_blank: true,
  link_download: true,
  link_target_blank: true
});
```

In cui:

* `cke_url` è l'url dello script CKEditor
* `upl_url` è l'url dello script lato server per l'upload delle immagini (se richiesto)
* `img_viewer` è l'url dell'applicazione per la visualizzazione delle immagini caricate (se richiesto)
* `link_auto_ext_target_blank`: (default false) se true a tutti gli url esterni vengono automaticamente aggiunti gli attributi `target="_blank"` e `rel="noopener noreferrer"`
* `link_download`: (default false) se true viene visualizzata l'opzione per forzare il download del link
* `link_target_blank`: (default false) se true viene visualizzata l'opzione "Apri in nuova finestra" che imposta gli attributi `target="_blank"` e `rel="noopener noreferrer"`

Il loader attiva automaticamente CKEditor a tutti i textarea con classe `editor`, applicando la toolbar definita nello script loader.

È inoltre possibile attivare l'editor in forma ridotta, eliminando alcune opzioni non richieste, semplicemente aggiungendo altre classi al textarea:

* la classe `editor` da sola attiva l'editor in forma standard (completa)
* le classi `editor editor-lite` attivano l'editor senza possibilità di inserimento delle immagini
* le classi `editor editor-xlite` attivano l'editor eliminando, oltre alle immagini, le tabelle
* le classi `editor editor-xxlite` attivano l'editor eliminando tutto tranne `bold`, `italic`, `link` e l'allineamento del testo
* le classi `editor editor-xxxlite` attivano l'editor eliminando tutto tranne `bold`, `italic`, `link`
* la classe `editor-no-headings`, se aggiunta ad una qualsiasi delle impostazioni precedenti, elimina la gestione degli headings (se presenti).


### Abilitazione elementi al caricamento di ckeditor

Ad evitare che un textarea sia modificabile prima dell'attivazione di CKeditor (che su reti lente potrebbe avere un delay avvertibile), è sufficiente disabilitarlo e aggiungere l'attributo `data-enable="editor"`.

```html
<textarea class="editor" id="textarea1" data-enable="editor" disabled></textarea>
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

### Controllo massima dimensione (KB) immagini

Il caricamento delle immagini all'interno di un elemento CKEditor è limitato di default a 4MB. 

Per variare questo valore, è sufficiente aggiungere al textarea l'attributo `data-cke-upl-max-size` che deve riportare il valore in byte della massima dimensione dell'immagine.

Esempio, per limitare le immagini a 1 MB:

```html
<textarea class="editor" id="textarea1" data-cke-upl-max-size="1048576"></textarea>
```


## Utilità

Oltre al loader, possono essere aggiunti al progetto:

* `ckeditor_form_check` che aggiunge dei controlli non presenti nativamente in CKEditor: campi required e trimming delle righe vuote
* `_ckeditor-bs5.scss` supporto per le classi aggiunte da CKEditor (per la gestione di tabelle e immagini) con l'estensione di alcune classi di Bootstrap 5.

In caso di textarea required non compilati, `ckeditor_form_check`, al submit del form, produce un messaggio d'errore.

Il messaggio è personalizzabile tramite i parametri `requiredErrorMes` e `alertUI`, sostituendo alle funzioni standard quelle più adatte al proprio progetto.

`ckeditor_form_check` inoltre, elimina le righe vuote (`<p>&nsbp;</p>`) all'inizio e alla fine del blocco HTML prodotto da CKEditor.


### Esempio di implementazione di ckeditor e delle utilità

#### JS

```javascript

import {ckeditor_loader, ckeditor_form_check} from '@massimo-cassandro/ckeditor-utilities';


(() => {

  ckeditor_loader({
    cke_url: 'path/to/m-ckeditor-min.js',
    upl_url: 'path/to/uploader',
    img_viewer: 'path/to/viewer/',
    link_auto_ext_target_blank: true,
    link_download: true,
    link_target_blank: true
  });

  ckeditor_form_check({
    requiredErrorMes: requiredElement => {
      return `L'elemento ${requiredElement} è obbligatorio`;
    },

    alertUI: mes => {
      alert(mes);
    }
  });
```
In cui: 

* `requiredErrorMes` è la funzione che restituisce la stringa del messaggio d'errore per i campi required. L'argomento è una stringa che permetta all'autente l'identificazione del campo (il contenuto del tag `label`, ad esempio)
* `alertUI` è la funzione che richiama l'interfaccia di visualizzazione dell'errore (default `window.alert`)

#### Sass

```scss
@import '@massimo-cassandro/ckeditor-utilities/sass/ckeditor-bs5';
```



## TODO
* https://ckeditor.com/docs/ckeditor5/26.0.0/features/font.html
