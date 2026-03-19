import { Editor } from 'grapesjs'

/**
 * Adds a beginner-friendly "Basics" sector to the Style Manager.
 * Surfaces common properties while keeping the existing sectors intact.
 */
export default (editor: Editor) => {
  editor.on('load', () => {
    const sm = editor.StyleManager

    // Avoid adding twice
    if (sm.getSector('basics')) return

    sm.addSector(
      'basics',
      {
        name: 'Basics',
        open: true,
        properties: [
          {
            label: 'Background color',
            property: 'background-color',
            type: 'color',
            default: '',
          },
          {
            label: 'Text color',
            property: 'color',
            type: 'color',
            default: '',
          },
          {
            label: 'Font size',
            property: 'font-size',
            type: 'number',
            units: ['px', 'em', 'rem', '%'],
            default: '',
          },
          {
            label: 'Padding',
            type: 'composite',
            properties: [
              { property: 'padding-top' },
              { property: 'padding-right' },
              { property: 'padding-bottom' },
              { property: 'padding-left' },
            ],
          },
        ],
      },
      { at: 0 } // top of the panel
    )
  })
}