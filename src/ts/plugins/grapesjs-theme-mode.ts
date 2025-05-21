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