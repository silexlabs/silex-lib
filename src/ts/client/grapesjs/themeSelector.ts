// Theme Selector for GrapesJS
/**
 * Theme selector plugin for GrapesJS
 * Adds support for managing styles for both, light, and dark themes using @media queries
 */
export function addThemeSelector(editor) {
  let currentTheme = 'both'
  let themeSelect = null
  const globalClassStyles = { both: {}, light: {}, dark: {} }

  // Add the theme selector besides the device Manager
  setTimeout(() => {
    const viewsBar = document.querySelector('.gjs-pn-panel.gjs-pn-devices-c')
    if (viewsBar && !document.getElementById('gjs-theme-select')) {
      const themeBtn = document.createElement('div')
      themeBtn.className = 'gjs-theme-select'
      themeBtn.style.display = 'inline-flex'
      themeBtn.style.alignItems = 'center'
      themeBtn.style.marginLeft = '10px'
      themeBtn.innerHTML = `
                <select id="gjs-theme-select" style="height:22px; background:#333; color:white;">
                    <option value="both">Both</option>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                </select>`
      viewsBar.appendChild(themeBtn)

      themeSelect = themeBtn.querySelector('select')
      themeSelect.addEventListener('change', (e) => {
        const value = e.target.value
        const selected = editor.getSelected()
        if (selected) {
          saveCurrentStylesToTheme(selected, currentTheme)
          currentTheme = value
          updateStyleManagerForTheme(selected, currentTheme)
          updateComponentThemeStyles(selected)
        }
      })
    }
  }, 10)

  // Update the theme when a component is selected
  editor.on('component:selected', (model) => {
    if (!model) return
    const theme = model.get('themeMode') || 'both'
    currentTheme = theme
    if (themeSelect) themeSelect.value = theme
    updateStyleManagerForTheme(model, theme)
    updateComponentThemeStyles(model)
  })

  // Save the styles when there is a changement of the Style Manager
  editor.on('style:property:change', () => {
    const selected = editor.getSelected()
    if (!selected) return
    saveCurrentStylesToTheme(selected, currentTheme)
    updateComponentThemeStyles(selected)
  })

  // Get all the properties of the Style Manager
  function getAllStyleProps() {
    let props = []
    editor.StyleManager.getSectors().forEach((sector) => {
      const sectorProps = sector.get('properties') || []
      props = props.concat(sectorProps.models || sectorProps)
    })
    return props
  }

  // Save the style for the current theme
  function saveCurrentStylesToTheme(model, theme) {
    const themeStyles = model.get('themeStyles') || { both: {}, light: {}, dark: {} }
    const classSelectors = model.get('classes') || []
    const classNames = classSelectors.map(cls => cls.getName())

    getAllStyleProps().forEach((prop) => {
      const val = prop.getValue()
      const propId = prop.getId()

      if (val !== undefined && val !== '') {
        if (classNames.length) {
          classNames.forEach((cls) => {
            globalClassStyles[theme][cls] = globalClassStyles[theme][cls] || {}
            globalClassStyles[theme][cls][propId] = val
          })
        } else {
          themeStyles[theme][propId] = val
        }
      } else {
        if (!classNames.length) {
          delete themeStyles[theme][propId]
        }
        classNames.forEach((cls) => {
          if (globalClassStyles[theme][cls]) {
            delete globalClassStyles[theme][cls][propId]
          }
        })
      }
    })
    model.set('themeStyles', themeStyles)
  }

  // Update the Style Manager with the property of the theme
  function updateStyleManagerForTheme(model, theme) {
    const themeStyles = model.get('themeStyles') || { both: {}, light: {}, dark: {} }
    const classSelectors = model.get('classes') || []
    const classNames = classSelectors.map(cls => cls.getName())

    getAllStyleProps().forEach((prop) => {
      const propId = prop.getId()
      let val

      if (classNames.length) {
        for (const cls of classNames) {
          const classStyles = globalClassStyles[theme][cls]
          if (classStyles && classStyles[propId] !== undefined) {
            val = classStyles[propId]
            break
          }
        }
      } else {
        val = themeStyles[theme][propId]
      }

      prop.setValue('')
      if (val !== undefined) {
        prop.setValue(val)
      }
    })
  }

  // Update the style of the component
  function updateComponentThemeStyles(model) {
    const themeStyles = model.get('themeStyles') || { both: {}, light: {}, dark: {} }
    const id = model.getId()
    const classSelectors = model.get('classes') || []
    const classNames = classSelectors.map(cls => cls.getName())

    // Delete already existing css rules
    editor.Css.getRules().forEach((rule) => {
      const ruleSelector = rule.getSelectors().toString()
      if (ruleSelector.includes(id) || classNames.some(cls => ruleSelector.includes(`.${cls}`))) {
        editor.Css.remove(rule)
      }
    })

    // Apply the style for classes or ID 
    const selectors = classNames.length ? classNames.map(cls => `.${cls}`) : [`#${id}`]
    selectors.forEach((selector) => {
      // Theme both
      let stylesToApply = classNames.length ? globalClassStyles.both[selector.slice(1)] : themeStyles.both
      if (stylesToApply && Object.keys(stylesToApply).length) {
        editor.Css.setRule(`theme-${id}-both`, selector, stylesToApply)
      }

      // Theme light
      stylesToApply = classNames.length ? globalClassStyles.light[selector.slice(1)] : themeStyles.light
      if (stylesToApply && Object.keys(stylesToApply).length) {
        const lightCss = Object.entries(stylesToApply)
          .map(([prop, value]) => `${prop}: ${value}`)
          .join('; ')
        editor.Css.addRules(`
                    @media (prefers-color-scheme: light) { ${selector} { ${lightCss} } }
                `)
      }

      // Theme dark
      stylesToApply = classNames.length ? globalClassStyles.dark[selector.slice(1)] : themeStyles.dark
      if (stylesToApply && Object.keys(stylesToApply).length) {
        const darkCss = Object.entries(stylesToApply)
          .map(([prop, value]) => `${prop}: ${value}`)
          .join('; ')
        editor.Css.addRules(`
                    @media (prefers-color-scheme: dark) { ${selector} { ${darkCss} } }
                `)
      }
    })
  }
}