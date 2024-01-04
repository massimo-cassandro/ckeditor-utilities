# CKEditor utilities

Utilità per l'implementazione di CKEditor 5.

## breaking changes
* rispetto alla versione 2.x, nella versione 3 non esistono più i parametri `selector` e `cke_url`, sostituiti da `selectors`
* la class `editor` è stata rinominata in `editor-custom`

## Loader

CKEditor loader semplifica e automatizza l'attivazione di CKEditor su un textarea.

Sono previsti tre tipologie di editor:
* `std`: editor con impostazioni base
* `full`: editor con impostazioni complete
* `custom`: editor personalizzabile (con loader immagini personalizzato)

Gli editor *std* e *full* vanno costruiti tramite il builder presente sul sito CKeditor (<https://ckeditor.com/ckeditor-5/online-builder/>), mentre la versione *custom* è compilata ad hoc (ed al momento è ferma alla versione 29 di CKEditor 5).

L'utilizzo di più editor nella stessa pagina è consentito solo se si utilizza lo stesso tipo di editor. La versione custom permette la pesonalizzazione delle funzioni disponibili (vedi dopo).

Per implementare il loader, includere lo script e impostare le opzioni:

```js
import {ckeditor_loader} from '@massimo-cassandro/ckeditor-utilities';

 ckeditor_loader({
   selectors: {
    'editor-std': '/libs/ckeditor-std.js',
    'editor-full': '/libs/ckeditor-full.js',
    'editor-custom': '/libs/ckeditor-custom-min.js' 
  },
  upl_url   : '/path/to/server_script',
  img_viewer: '/viewer-url/',
  link_auto_ext_target_blank: true,
  link_download: true,
  link_target_blank: true
});
```

In cui:

* `selectors` è un oggetto che associa ad ogni selettore il rispettivo script. I nomi delle classi non devono essere cambiati
* solo per custom editor:
  * `upl_url` è l'url dello script lato server per l'upload delle immagini (se richiesto)
  * `img_viewer` è l'url dell'applicazione per la visualizzazione delle immagini caricate (se richiesto)
  * `link_auto_ext_target_blank`: (default false) se true a tutti gli url esterni vengono automaticamente aggiunti gli attributi `target="_blank"` e `rel="noopener noreferrer"`
  * `link_download`: (default false) se true viene visualizzata l'opzione per forzare il download del link
  * `link_target_blank`: (default false) se true viene visualizzata l'opzione "Apri in nuova finestra" che imposta gli attributi `target="_blank"` e `rel="noopener noreferrer"`

Il loader attiva automaticamente CKEditor per tutti i textarea con classe `editor-std`, `editor-full` o `editor-custom`.

### Custom editor

Negli editor `custom` la toolbar viene modellata in base alla configurazione definita dalle classi assegnate al textarea:

* la classe `editor-custom` da sola attiva l'editor in forma standard (completa)
* le classi `editor-custom editor-lite` attivano l'editor senza possibilità di inserimento delle immagini
* le classi `editor-custom editor-xlite` attivano l'editor eliminando, oltre alle immagini, le tabelle
* le classi `editor-custom editor-xxlite` attivano l'editor eliminando tutto tranne `bold`, `italic`, `link` e l'allineamento del testo
* le classi `editor-custom editor-xxxlite` attivano l'editor eliminando tutto tranne `bold`, `italic`, `link`
* la classe `editor-no-headings`, se aggiunta ad una qualsiasi delle impostazioni precedenti, elimina la gestione degli headings (se presenti).


### Abilitazione elementi al caricamento di ckeditor

Ad evitare che un textarea sia modificabile prima dell'attivazione di CKeditor (che su reti lente potrebbe avere un delay avvertibile), è sufficiente disabilitarlo e aggiungere l'attributo `data-enable="editor"`.

```html
<textarea class="editor-std" id="textarea1" data-enable="editor" disabled></textarea>
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

### Controllo massima dimensione (KB) immagini (solo custom editor)

Il caricamento delle immagini all'interno di un elemento CKEditor è limitato di default a 4MB. 

Per variare questo valore, è sufficiente aggiungere al textarea l'attributo `data-cke-upl-max-size` che deve riportare il valore in byte della massima dimensione dell'immagine.

Esempio, per limitare le immagini a 1 MB:

```html
<textarea class="editor-custom" id="textarea1" data-cke-upl-max-size="1048576"></textarea>
```


## Utilità

Oltre al loader, possono essere aggiunti al progetto:

* `ckeditor_form_check` che aggiunge dei controlli non presenti nativamente in CKEditor: campi required e trimming delle righe vuote
* `_ckeditor-bs5.scss` supporto per le classi aggiunte da CKEditor (per la gestione di tabelle e immagini) con l'estensione di alcune classi di Bootstrap 5.

In caso di textarea required non compilati, `ckeditor_form_check`, al submit del form, produce un messaggio d'errore.

Il messaggio è personalizzabile tramite i parametri `requiredErrorMes` e `alertUI`, sostituendo alle funzioni standard quelle più adatte al proprio progetto.

`ckeditor_form_check` inoltre, elimina le righe vuote (`<p>&nsbp;</p>`) all'inizio e alla fine del blocco HTML prodotto da CKEditor.


### Esempio di implementazione di ckeditor e delle utilità


```javascript
import {ckeditor_loader, ckeditor_form_check} from '@massimo-cassandro/ckeditor-utilities';

ckeditor_loader({
  selectors: {
    'editor-std': '/libs/ckeditor-std.js',
    'editor-full': '/libs/ckeditor-full.js',
    'editor-custom': '/libs/ckeditor-custom-min.js' 
  },
  upl_url: 'path/to/uploader',
  img_viewer: 'path/to/viewer/',
  link_auto_ext_target_blank: true,
  link_download: true,
  link_target_blank: true,
  extra_cleaning: true // abilita la pulizia del markup
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


File sass predefinto per integrazione con Bootstrap 5:

```scss
@import '@massimo-cassandro/ckeditor-utilities/scss/ckeditor-bs5';
```
