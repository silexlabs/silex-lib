// //plugin for the Theme Mode
// export default grapesjs => {
//   console.log('[gjs-theme-mode] Plugin loaded');
//   grapesjs.plugins.add('gjs-theme-mode', (editor, opts = {}) => {
//     //Initialisation of the the Mode by default to both
//     editor.ThemeMode = { current: 'both' };

//     //Theme mode added to the Style Manager
//     const sm = editor.StyleManager;
//     sm.addSector('theme', {
//       name: 'Theme Mode',
//       open: true,
//       buildProps: [],
//       properties: [{
//         property: 'themeMode',
//         type: 'select',
//         defaults: 'both',
//         list: [
//           { value: 'both', name: 'Both modes' },
//           { value: 'light', name: 'Light only' },
//           { value: 'dark', name: 'Dark only' },
//         ],
//       }],
//     });

//     //Listening to the change of the Theme
//     editor.on('style:property:update:themeMode', (prop, value) => {
//       editor.ThemeMode.current = value;
//       // Mettre à jour l’attribut du body du canvas pour la preview
//       const canvas = editor.Canvas.getFrameEl().contentDocument;
//       canvas.documentElement.setAttribute('data-theme', value === 'both' ? '' : value);
//     });

//     // 4. Intercepter chaque style modifié
//     editor.on('style:property:update', (property, value, oldValue, selector, component) => {
//       // Ne pas toucher les changements du dropdown lui-même
//       if (property.get('property') === 'themeMode') return;

//       const mode = editor.ThemeMode.current;
//       const css = editor.Css; // CssComposer
//       const rule = selector.getRule() || css.addRule(selector.getFullName());

//       // Si dark uniquement
//       if (mode === 'dark') {
//         rule.set('mediaText', '(prefers-color-scheme: dark)');
//       }
//       // Si light uniquement
//       else if (mode === 'light') {
//         // ici pas de media query, ou on peut utiliser (prefers-color-scheme: light)
//         rule.set('mediaText', '(prefers-color-scheme: light)');
//       }




      
//       // both => on retire toute media query
//       else {
//         rule.set('mediaText', '');
//       }
//       // Appliquer la nouvelle valeur CSS
//       rule.setStyle(property.get('property'), value);
//     });
//   });
// };




//TEST 2
// export default (editor, opts = {}) => {
//   console.log('[gjs-theme-mode] loaded'); // pour debug

//   // Initialisation
//   editor.ThemeMode = { current: 'both' };

//   // 1. Injecte le select à côté des pseudo-classes
//   editor.on('load', () => {
//     // 1) Récupère le conteneur ASM
//     const asm = document.getElementById('asm-container');
//     if (!asm) {
//       console.warn('gjs-theme-mode: #asm-container introuvable');
//       return;
//     }

//     // 2) Si tu veux le mettre à côté du dropdown pseudo-classes, on cherche juste ce dropdown
//     const pseudo = asm.querySelector('.asm-compound__selectors');
//     if (!pseudo) {
//       console.warn('gjs-theme-mode: dropdown pseudo-class introuvable dans #asm-container');
//       // En fallback on peut ajouter tout en haut de asm
//       // asm.prepend(modeSelect);
//       return;
//     }
//     else {
//       console.log("found");
//     }

//     // 3) Crée ton <select>
//     const modeSelect = document.createElement('select');
//     modeSelect.className = 'gjs-sm-mode';
//     modeSelect.style.marginLeft = '6px';
//     modeSelect.innerHTML = `
//       <option value="both">Both</option>
//       <option value="light">Light only</option>
//       <option value="dark">Dark only</option>
//     `;
//     modeSelect.value = editor.ThemeMode.current || 'both';

//     // 4) Insert juste après le pseudo dropdown
//     pseudo.parentNode.insertBefore(modeSelect, pseudo.nextSibling);

//     // 5) Écoute les changements
//     modeSelect.addEventListener('change', e => {
//       const mode = e.target.value;
//       editor.ThemeMode.current = mode;
//       const htmlEl = editor.Canvas.getFrameEl()
//                       .contentDocument.documentElement;
//       htmlEl.setAttribute('data-theme', mode === 'both' ? '' : mode);
//     });
//   });


//   // 2. Intercepte les styles pour ajouter la media-query
//   editor.on('style:property:update', (propArg, value, _, selector) => {
//     // 1) Récupère simplement le nom de la propriété
//     const propName = propArg.property || propArg.prop;
//     if (!propName || propName === 'themeMode') return;

//     // 2) Trouve ou crée la règle CSS pour ce selector
//     const cssc = editor.CssComposer || editor.Css;
//     const rule = selector.getRule() || cssc.addRule(selector.getFullName());

//     // 3) Selon le mode, on ajoute la media-query ou pas
//     switch (editor.ThemeMode.current) {
//       case 'dark':
//         rule.set('mediaText', '(prefers-color-scheme: dark)');
//         break;
//       case 'light':
//         rule.set('mediaText', '(prefers-color-scheme: light)');
//         break;
//       default:
//         rule.set('mediaText', '');
//     }

//     // 4) On applique la nouvelle valeur
//     rule.setStyle(propName, value);
//   });

 

// };


//TEST 3
// export default (editor, opts = {}) => {
//   // 1) Initialise l’état
//   editor.ThemeMode = { current: 'both' };

//   // 2) Fonction d’injection, qui ne fait son boulot qu’une seule fois
//   const injectOnce = () => {
//     const asm = document.getElementById('asm-container');
//     if (!asm || asm._themeModeInjected) return;
//     asm._themeModeInjected = true;

//     // Crée le <select>
//     const select = document.createElement('select');
//     select.className = 'gjs-sm-mode';
//     select.style.margin = '0 4px';
//     select.innerHTML = `
//       <option value="both">Both</option>
//       <option value="light">Light only</option>
//       <option value="dark">Dark only</option>
//     `;
//     select.value = editor.ThemeMode.current;

//     // Au changement, on met à jour le mode et la preview
//     select.addEventListener('change', e => {
//       const mode = e.target.value;
//       editor.ThemeMode.current = mode;
//       const htmlEl = editor
//         .Canvas.getFrameEl()
//         .contentDocument.documentElement;
//       htmlEl.setAttribute('data-theme', mode === 'both' ? '' : mode);
//     });

//     // On place le select tout en haut du panneau
//     asm.prepend(select);
//   };

//   // 3) On tente l’injection quand on sélectionne un composant
//   editor.on('component:selected', injectOnce);
//   // et aussi quand on ouvre le panneau de styles
//   editor.on('styleManager:open', injectOnce);

//   // 4) Handler minimaliste pour ajouter la media-query
//   editor.on('style:property:update', (prop, value, _, selector) => {
//     // Récupère le nom de propriété
//     const propName = prop.property || prop.prop;
//     if (!propName || propName === 'themeMode') return;
//     if (!selector || !selector.getRule) return;

//     // Règle CSS du selector
//     const cssc = editor.CssComposer || editor.Css;
//     const rule = selector.getRule() || cssc.addRule(selector.getFullName());

//     // Définit le mediaText selon le mode actuel
//     const mode = editor.ThemeMode.current;
//     if (mode === 'dark') rule.set('mediaText', '(prefers-color-scheme: dark)');
//     else if (mode === 'light') rule.set('mediaText', '(prefers-color-scheme: light)');
//     else rule.set('mediaText', '');

//     // Applique la nouvelle valeur
//     rule.setStyle(propName, value);
//   });
// };


//TEST 4
// export default (editor, opts = {}) => {
//   // Theme by default = both
//   editor.ThemeMode = { current: 'both' };

//   // Put the themeMode onec in the asm-container 
//   const injectOnce = () => {
//     const asm = document.getElementById('asm-container');
//     if (!asm || asm._themeModeInjected) return;
//     asm._themeModeInjected = true;

//     // Create the selector
//     const select = document.createElement('select');
//     select.className = 'gjs-sm-mode';
//     select.style.margin = '0 4px';
//     select.innerHTML = `
//       <option value="both">Both</option>
//       <option value="light">Light only</option>
//       <option value="dark">Dark only</option>
//     `;
//     select.value = editor.ThemeMode.current;

//     // If a change is detected we update the data-theme attribute 
//     select.addEventListener('change', e => {
//       const mode = e.target.value;
//       editor.ThemeMode.current = mode;
//       const htmlEl = editor
//         .Canvas.getFrameEl()
//         .contentDocument.documentElement;
//       htmlEl.setAttribute('data-theme', mode === 'both' ? '' : mode);
//     });

//     asm.prepend(select);
//   };

//   //Inject once everytime a component is selected or the styleManager is open
//   editor.on('component:selected', injectOnce);
//   editor.on('styleManager:open', injectOnce);

//   //EveryTime a style is changed 
//   editor.on('style:property:update', (propArg, value, _, selector) => {
//     console.group('[gjs-theme-mode] style:update');
//     console.log('propArg:', propArg);
//     console.log('value:', value);
//     console.log('selector:', selector);
//     console.log('selector.getFullName():', selector && selector.getFullName && selector.getFullName());
//     console.log('Current ThemeMode:', editor.ThemeMode.current);

//     const propName = propArg.property || propArg.prop;
//     console.log('Derived propName:', propName);

//     if (!propName) {
//       console.warn('→ pas de propName, on sort');
//       console.groupEnd();
//       return;
//     }
//     if (propName === 'themeMode') {
//       console.log('→ dropdown themeMode, on ignore');
//       console.groupEnd();
//       return;
//     }
//     if (!selector || !selector.getFullName) {
//       console.warn('→ pas de selector valide, on sort');
//       console.groupEnd();
//       return;
//     }

//     // get of add the rule
//     const cssc = editor.CssComposer || editor.Css;
//     const rule = selector.getRule() || cssc.addRule(selector.getFullName());
//     console.log('Rule before:', rule);

//     // apply the rule only to the theme that is chosen
//     const baseSel = selector.getFullName();
//     let scopedSel = baseSel;
//     if (editor.ThemeMode.current === 'dark') scopedSel = `html[data-theme="dark"] ${baseSel}`;
//     else if (editor.ThemeMode.current === 'light') scopedSel = `html[data-theme="light"] ${baseSel}`;
//     console.log('Scoped selector:', scopedSel);

//     rule.setSelectors([{ name: scopedSel }]);
//     rule.set('mediaText', '');
//     rule.setStyle(propName, value);

//     console.log('Rule after:', rule);
//     console.groupEnd();
//   });

// };




//TEST 5
// export default (editor, opts = {}) => {
//   // Orignal state = both
//   editor.ThemeMode = { current: 'both' };

//   //Add a Theme Mode sector to the Style Manager 
//   editor.on('load', () => {
//     const sm = editor.StyleManager;
//     sm.addSector('theme', {
//       name: 'Theme Mode',
//       open: true,
//       buildProps: [],
//       properties: [{
//         property: 'themeMode',
//         type: 'select',
//         defaults: 'both',
//         list: [
//           { value: 'both', name: 'Both modes' },
//           { value: 'light', name: 'Light only' },
//           { value: 'dark', name: 'Dark only' },
//         ],
//       }],
//     });

//     //on every css component that was modified we apply a mediaText on it
//     editor.on('style:property:update:themeMode', (prop, value) => {
//       editor.ThemeMode.current = value;
//       const cssc = editor.CssComposer || editor.Css;
//       cssc.getAll().forEach(rule => {
//         if (value === 'both') rule.set('mediaText', '');
//         else rule.set('mediaText', `(prefers-color-scheme: ${value})`);
//       });
//     });
//   });
// };




//TEST 6
// src/ts/plugins/grapesjs-theme-mode-state.ts
// import type { Editor } from 'grapesjs';

// export default function ThemeModePlugin(editor: Editor, opts = {}) {
//   // Valeurs disponibles : both, light, dark
//   const defaultMode = 'both';
//   editor.setState(defaultMode);

//   // Crée le <select> pour changer de mode
//   const injectSelect = () => {
//     // On le greffe dans le panneau de droite, GrapesJS a déjà rendu l'UI
//     const smPanel = document.querySelector('.gjs-pn-views');
//     if (!smPanel || smPanel.querySelector('.gjs-select-mode')) return;

//     const select = document.createElement('select');
//     select.className = 'gjs-select-mode';
//     select.style.margin = '0 8px';
//     select.innerHTML = `
//       <option value="both">Both</option>
//       <option value="light">Light</option>
//       <option value="dark">Dark</option>
//     `;
//     select.value = defaultMode;

//     select.addEventListener('change', (e) => {
//       const mode = (e.target as HTMLSelectElement).value;
//       editor.setState(mode);
//       // Met à jour l’attribut data-theme dans le canvas
//       const htmlEl = editor.Canvas.getFrameEl()
//                          .contentDocument!
//                          .documentElement;
//       htmlEl.setAttribute('data-theme', mode === 'both' ? '' : mode);
//     });

//     // On insère le select à côté des vues (tu peux ajuster le parent)
//     smPanel.prepend(select);
//   };

//   // Injecte dès que l’UI est chargée
//   editor.on('load', injectSelect);
//   editor.on('styleManager:open', injectSelect);

//   // À chaque changement de style, on “scope” la règle
//   editor.on('style:property:update', (propArg, value, _, selector) => {
//     const state = editor.getState(); // 'dark' | 'light' | 'both'
//     const propName = propArg.property || propArg.prop;
//     if (!propName || !selector || !selector.getFullName) return;

//     const cssc = editor.CssComposer;
//     const baseSel = selector.getFullName();
//     let scopedSel = baseSel;
//     if (state === 'dark') scopedSel = `html[data-theme="dark"] ${baseSel}`;
//     else if (state === 'light') scopedSel = `html[data-theme="light"] ${baseSel}`;

//     const rule = selector.getRule() || cssc.addRule(scopedSel);
//     rule.setSelectors([{ name: scopedSel }]);
//     rule.set('mediaText', '');
//     rule.setStyle(propName, value as string);
//   });
// }




//TEST 7
// import grapesjs, { Editor, EditorConfig } from 'grapesjs'

// grapesjs.plugins.add('gjs-theme-switcher', (editor) => {
//   // 1. Crée ton mini "état" (state)
//   const state = {
//     mode: 'both',
//     setMode(newMode) {
//       this.mode = newMode;
//       console.log('Mode changé :', this.mode);
//     },
//     getMode() {
//       return this.mode;
//     },
//   };

//   (editor as any).themeModeState = state;

//   // 2. Ajoute un <select> dans le panneau de style
//   const injectSelect = () => {
//     const asm = document.getElementById('asm-container');
//     if (!asm || (asm as any)._themeModeInjected) return;
//     (asm as any)._themeModeInjected = true;


//     const select = document.createElement('select');
//     select.className = 'gjs-sm-mode';
//     select.style.margin = '0 4px';
//     select.innerHTML = `
//       <option value="both">Both</option>
//       <option value="light">Light only</option>
//       <option value="dark">Dark only</option>
//     `;

//     select.value = state.getMode();

//     select.addEventListener('change', (e) => {
//       const mode = (e.target as HTMLSelectElement).value;
//       state.setMode(mode);

//       // Change aussi le data-theme du document HTML
//       const htmlEl = editor.Canvas.getFrameEl().contentDocument.documentElement;
//       htmlEl.setAttribute('data-theme', mode === 'both' ? '' : mode);
//     });

//     asm.prepend(select);
//   };

//   // Injecte le select à l'ouverture
//   editor.on('component:selected', injectSelect);
//   editor.on('styleManager:open', injectSelect);

//   // 3. Quand un style est modifié, scoper la règle au mode actuel
//   editor.on('style:property:update', (propArg, value, _, selector) => {
//     const mode = state.getMode();

//     // Nom de la propriété CSS modifiée
//     const propName = propArg.property || propArg.prop;
//     if (!propName || !selector || !selector.getFullName) return;

//     // Sélecteur de base
//     const baseSel = selector.getFullName();
//     let scopedSel = baseSel;

//     // Ajout d'un préfixe selon le mode
//     if (mode === 'dark') scopedSel = `html[data-theme="dark"] ${baseSel}`;
//     else if (mode === 'light') scopedSel = `html[data-theme="light"] ${baseSel}`;

//     const cssc = editor.CssComposer || editor.Css;
//     const rule = selector.getRule() || cssc.addRules(scopedSel);

//     rule.setSelectors([{ name: scopedSel }]);
//     rule.setStyle(propName, value);
//   });
// });




// TEST 8
// src/ts/plugins/grapesjs-theme-mode.ts
// import grapesjs, { Editor, PluginOptions } from 'grapesjs';

// //To add the theme mode to the editor
// declare module 'grapesjs' {
//   interface Editor {
//     ThemeMode: { current: string };
//   }
// }

// export default (editor: Editor, opts: PluginOptions = {}) => {
//   //Current state is both
//   editor.ThemeMode = { current: 'both' };

//   //When the editor is load, it injects the sector
//   editor.on('load', () => {
//     const sm = editor.StyleManager;

//     // Adding of the sector
//     sm.addSector('theme-mode', {
//       name: 'Theme Mode',
//       open: true,
//       buildProps: [],
//       properties: [{
//         property: 'themeMode',
//         type: 'select',
//         defaults: 'both',
//         list: [
//           { id: 'both', value: 'both', name: 'Both modes' },
//           { id: 'light', value: 'light', name: 'Light only' },
//           { id:'dark', value: 'dark',  name: 'Dark only' },
//         ],
//       }],
//     });

//     //When we change the select, we update the rules
//     editor.on('style:property:update:themeMode', (_, value) => {
//       editor.ThemeMode.current = value as string;
//       const cssc = editor.CssComposer || editor.Css;

//       // Parcours de toutes les règles pour réajuster leur mediaText
//       cssc.getAll().forEach(rule => {
//         if (value === 'both') {
//           rule.set('mediaText', '');
//         } else {
//           rule.set('mediaText', `(prefers-color-scheme: ${value})`);
//         }
//       });
//     });
//   });

//   //At every update we apply the mediaText
//   editor.on('style:property:update', (prop, value, _, selector) => {
//     const propName = prop.get('property') || prop.get('prop');
//     if (!propName || propName === 'themeMode' || !selector?.getFullName) return;

//     const mode = (editor as any).ThemeMode.current as 'both'|'light'|'dark';
//     const baseSel = selector.getFullName();
//     // Si mode ≠ both, on préfixe le sélecteur
//     const scopedSel = mode === 'both'
//       ? baseSel
//       : `html[data-theme="${mode}"] ${baseSel}`;

//     const cssc = editor.CssComposer || editor.Css;
//     // Cherche une règle déjà créée pour ce scopedSel
//     let rule = cssc.getAll().find(r =>
//       r.selectors.some(s => s.name === scopedSel)
//     );
//     // Si pas trouvée, on la crée
//     if (!rule) {
//       rule = cssc.addRule({ selectors: [{ name: scopedSel }], style: {} });
//     }

//     // Enfin on met à jour LE style sur CETTE règle-là
//     rule.setStyle(propName, value as string);
//   });

//   editor.on('style:property:update:themeMode', (_, mode) => {
//     (editor as any).ThemeMode.current = mode as string;
//     // Preview dans le canvas
//     const htmlEl = editor.Canvas.getFrameEl().contentDocument!.documentElement;
//     htmlEl.setAttribute('data-theme', mode === 'both' ? '' : (mode as string));
//   });

// };


//TEST 9
// import grapesjs, { Editor, PluginOptions, CssRule } from 'grapesjs';

// export default (editor: Editor, opts: PluginOptions = {}) => {
//   (editor as any).ThemeMode = { current: 'both' };

//   // Fonction qui ajoute le secteur si besoin
//   const injectThemeSector = () => {
//     const sm = editor.StyleManager;
//     // Si le secteur est déjà là, on skip
//     if (sm.getSectors().some(sec => sec.getId() === 'theme-mode')) {
//       return;
//     }

//     sm.addSector('theme-mode', {
//       name: 'Theme Mode',
//       open: true,
//       buildProps: [],
//       properties: [{
//         property: 'themeMode',
//         type: 'select',
//         defaults: 'both',
//         list: [
//           { id: 'both',  value: 'both',  name: 'Both modes' },
//           { id: 'light', value: 'light', name: 'Light only' },
//           { id: 'dark',  value: 'dark',  name: 'Dark only' },
//         ],
//       }],
//     });
//   };

//   // 1) Injection au load du canvas
//   editor.on('load', () => {
//     injectThemeSector();

//     // Ecoute le changement du select
//     editor.on('style:property:update:themeMode', (_, value) => {
//       (editor as any).ThemeMode.current = value as string;
//       const htmlEl = editor.Canvas.getFrameEl().contentDocument!
//                          .documentElement;
//       // Preview
//       htmlEl.setAttribute('data-theme', value === 'both' ? '' : (value as string));
//     });
//   });

//   // 2) Ré-injection à chaque ouverture du panneau Styles
//   editor.on('styleManager:open', injectThemeSector);

//   // ... Ton code de style:update pour appliquer les règles scoped ...
//   // editor.on('style:property:update:themeMode', (_, value) => {
//   //   // Mise à jour du mode et preview
//   //   (editor as any).ThemeMode.current = value as string;
//   //   const htmlEl = editor
//   //     .Canvas.getFrameEl()
//   //     .contentDocument!.documentElement;
//   //   htmlEl.setAttribute('data-theme', value === 'both' ? '' : (value as string));
//   // });

//   // 2) À chaque modification de style on scope par mode

//   editor.on('style:property:update', (prop, value, opts, selector) => {
//   // Récupère le nom de la propriété
//     const propName = typeof prop === 'string' ? prop : prop?.get?.('property');
//     if (propName === 'themeMode' || !selector?.getFullName) return;

//     const mode = (editor as any).ThemeMode.current || 'both';
//     const baseSel = selector.getFullName();
//     const scopedSel = mode === 'both' ? baseSel : `html[data-theme="${mode}"] ${baseSel}`;
//     const cssc = editor.CssComposer;

//     // Vérifie si une règle avec ce sélecteur scoped existe
//     let rule = cssc.getAll().find(r =>
//       r.getSelectors().some(s => s.getLabel() === scopedSel)
//     );

//     // Sinon on la crée
//     if (!rule) {
//       rule = cssc.add([
//         {
//           selectors: [scopedSel],
//           style: {},
//         },
//       ])[0];
//     }

//     // Applique uniquement sur la règle scoped
//     rule.setStyle({ [propName!]: value as string });
//   });

// };


//TEST 10
import grapesjs, { Editor, PluginOptions, CssRule } from 'grapesjs'

export default (editor: Editor, opts: PluginOptions = {}) => {
  //console.log('Plugin grapesjs-theme-mode chargé !');

  //define the current mode to both
  (editor as any).ThemeMode = { current: 'both' }

  //add the sector to the StyleManager
  const injectThemeSector = () => {
    const sm = editor.StyleManager
    if (sm.getSectors().some((sec) => sec.getId() === 'theme-mode')) { //to avoid the duplication
      return
    }

    sm.addSector('theme-mode', {
      name: 'Theme Mode',
      open: true,
      buildProps: [],
      properties: [
        {
          property: 'themeMode',
          type: 'select',
          default: 'both',
          options: [
            { id: 'both', value: 'both', name: 'Both modes' },
            { id: 'light', value: 'light', name: 'Light only' },
            { id: 'dark', value: 'dark', name: 'Dark only' },
          ],
        },
      ],
    })
    //console.log('Secteur theme-mode ajouté');
  }

  //To add the the Sector to the StyleManager
  editor.on('load', () => {
    injectThemeSector()
    //console.log('Éditeur chargé, secteur theme-mode vérifié');

    //When the theme is updated we put the data-theme attribute to the html of the canvas
    editor.on('style:property:update:themeMode', (_, value) => {
      (editor as any).ThemeMode.current = value as string
      const htmlEl = editor.Canvas.getFrameEl().contentDocument!.documentElement
      htmlEl.setAttribute('data-theme', value === 'both' ? '' : value)
      //console.log(`Mode changé vers: ${value}`);
    })
  })

  //Everytime the styleManager is open we inject the Theme Sector
  editor.on('styleManager:open', injectThemeSector)

  //everytime a property in the styleManager is updated
  // !!! This part doesn't really work !!! (I used IA to help me for this part)
  // Explanation of the part that doesn't work: everytime I change a mode and change a html property, it doesn't change in function of the mode
  editor.on('style:property:update', (prop, value, opts, selector) => {
    //console.log('Événement style:property:update déclenché', { prop, value, selector });
    const propName = typeof prop === 'string' ? prop : prop?.get?.('property') //get the property that we extract
    if (propName === 'themeMode' || !selector?.getFullName) return  //stop the exec if the property is themeMode or selector is undefined

    const mode = (editor as any).ThemeMode.current || 'both' 
    const selectorName = selector.getFullName() 
    const cssc = editor.CssComposer

    const mediaText = mode === 'both' ? '' : `[data-theme="${mode}"]`

    //console.log(`Mise à jour de la propriété ${propName} pour le sélecteur ${selectorName} en mode ${mode}`);

    //go throught all the CSS rules to know if there are conflictionnal rules
    cssc.getAll().forEach((r) => {
      //verify the sector, the rules is not both
      if (r.getSelectorsString() === selectorName && r.get('mediaText') !== mediaText && r.get('mediaText') !== '') {
        cssc.remove(r) //remove the rules
        //console.log(`Règle supprimée pour ${selectorName} dans un autre mode:`, r.toCSS());
      }
    })

    //find a rule with the same selectorName and mediaText
    let rule = cssc.getAll().find((r) =>
      r.getSelectorsString() === selectorName &&
          r.get('mediaText') === mediaText
    )

    //if the rule doesn't exist it add a new one
    if (!rule) {
      rule = cssc.add(
        [
          {
            selectors: [selectorName], //for example my-text
            mediaText, //light
          },
        ],
        mode === 'both' ? '' : 'media' 
      )[0]
      console.log(`Nouvelle règle créée pour ${selectorName} en mode ${mode}:`, rule.toCSS())
    }

    //update the rule
    const currentStyle = rule.getStyle() || {}
    rule.setStyle({...currentStyle, [propName]: value as string,}) //update the rules by adding or replacing 

    //console.log(`Règle mise à jour pour ${selectorName} en mode ${mode}:`, rule.toCSS());
  })
}



//Test 11
// import grapesjs, { Editor, PluginOptions } from 'grapesjs';

// export default (editor: Editor, opts: PluginOptions = {}) => {
//   console.log('Plugin grapesjs-theme-mode chargé !');

//   (editor as any).ThemeMode = { current: 'both' };

//   const injectThemeSector = () => {
//     const sm = editor.StyleManager;
//     console.log('StyleManager:', sm);
//     if (!sm || sm.getSectors().some((sec) => sec.getId() === 'theme-mode')) {
//       return;
//     }

//     sm.addSector('theme-mode', {
//       name: 'Theme Mode',
//       open: true,
//       buildProps: [],
//       properties: [
//         {
//           property: 'themeMode',
//           type: 'select',
//           default: 'both',
//           options: [
//             { id: 'both', value: 'both', name: 'Both modes' },
//             { id: 'light', value: 'light', name: 'Light only' },
//             { id: 'dark', value: 'dark', name: 'Dark only' },
//           ],
//         },
//       ],
//     });
//     console.log('Secteur theme-mode ajouté');
//   };

//   editor.on('load', () => {
//     injectThemeSector();
//     console.log('Éditeur chargé, secteur theme-mode vérifié');

//     editor.on('style:property:update:themeMode', (_, value) => {
//       (editor as any).ThemeMode.current = value as string;
//       const htmlEl = editor.Canvas.getFrameEl().contentDocument!.documentElement;
//       htmlEl.setAttribute('data-theme', value === 'both' ? '' : value);
//       console.log('data-theme appliqué:', htmlEl.getAttribute('data-theme'));
//     });
//   });

//   editor.on('styleManager:open', injectThemeSector);

//   // Capturer tous les événements style pour déboguer
//   editor.on('style:', (eventName, ...args) => {
//     console.log('Événement style détecté:', eventName, args);
//   });

//   editor.on('style:property:update', (prop, value, opts, selector) => {
//     console.log('Événement style:property:update déclenché', { prop, value, opts, selector });

//     // Extraire propName de manière robuste
//     let propName: string | undefined;
//     if (typeof prop === 'string') {
//       propName = prop;
//     } else if (prop?.get?.('property')) {
//       propName = prop.get('property');
//     } else if (prop?.property?.property) {
//       propName = prop.property.property; // Cas observé dans le log
//     }
//     console.log('propName:', propName);

//     // Ignorer les événements invalides ou internes
//     if (
//       !propName ||
//       propName === 'themeMode' ||
//       propName === 'visible' ||
//       propName === 'content' ||
//       value === undefined ||
//       value === ''
//     ) {
//       console.log('Événement ignoré:', { propName, value });
//       return;
//     }

//     // Vérifier si un composant est sélectionné
//     const selected = editor.getSelected();
//     if (!selected) {
//       console.log('Aucun composant sélectionné');
//       return;
//     }

//     // Générer un sélecteur robuste
//     const selectorName =
//       selector?.getFullName() ||
//       selected.getEl()?.className?.split(' ')[0] ||
//       selected.get('id') ||
//       `.gjs-selected-${selected.cid}`;
//     if (!selectorName) {
//       console.log('Aucun sélecteur valide trouvé');
//       return;
//     }

//     const mode = (editor as any).ThemeMode.current || 'both';
//     const cssc = editor.CssComposer;
//     const mediaText = mode === 'both' ? '' : `[data-theme="${mode}"]`;

//     console.log(`Mise à jour de la propriété ${propName} pour le sélecteur ${selectorName} en mode ${mode}`);

//     // Nettoyer les règles conflictuelles
//     cssc.getAll().forEach((r) => {
//       if (
//         r.getSelectorsString() === selectorName &&
//         r.get('mediaText') !== mediaText &&
//         r.get('mediaText') !== ''
//       ) {
//         cssc.remove(r);
//         console.log(`Règle supprimée pour ${selectorName} dans un autre mode:`, r.toCSS());
//       }
//     });

//     let rule = cssc
//       .getAll()
//       .find(
//         (r) =>
//           r.getSelectorsString() === selectorName &&
//           r.get('mediaText') === mediaText
//       );

//     if (!rule) {
//       rule = cssc.add(
//         [
//           {
//             selectors: [selectorName],
//             mediaText,
//           },
//         ],
//         mode === 'both' ? '' : 'media'
//       )[0];
//       console.log(`Nouvelle règle créée pour ${selectorName} en mode ${mode}:`, rule.toCSS());
//     }

//     const currentStyle = rule.getStyle() || {};
//     rule.setStyle({
//       ...currentStyle,
//       [propName]: value as string,
//     });

//     console.log(`Règle mise à jour pour ${selectorName} en mode ${mode}:`, rule.toCSS());
//   });
// };