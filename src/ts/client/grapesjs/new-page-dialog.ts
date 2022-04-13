import * as grapesjs from 'grapesjs/dist/grapes.min.js'
import {html, render} from 'lit-html'
import {live} from 'lit-html/directives/live.js'


const name = 'new-page-dialog'
const el = document.createElement('div')
let modal

export const cmdOpenNewPageDialog = 'new-page-dialog'

export const newPageDialog = grapesjs.plugins.add(name, (editor, opts) => {
  editor.Commands.add(cmdOpenNewPageDialog, {
    run: (_, sender, {page}) => {
      modal = editor.Modal.open({
        title: 'New Page',
        content: '',
        attributes: { class: 'new-page-dialog' },
      })
      .onceClose(() => {
        editor.stopCommand(cmdOpenNewPageDialog) // apparently this is needed to be able to run the command several times
      })
      displayDialog(editor, opts, page)
      modal.setContent(el)
      const form = el.querySelector('form')
      form.onsubmit = event => {
        event.preventDefault()
        saveDialog(editor, opts, page)
        editor.stopCommand(cmdOpenNewPageDialog)
      }
      form.querySelector('input')?.focus()
      return modal
    },
    stop: () => {
      modal.close()
      // el.innerHTML = ''
    },
  })
})

function displayDialog(editor, config, page) {
  render(html`
    <form class="silex-form">
      <div class="silex-form__group">
        <label class="silex-form__element">
          <h3>Name</h3>
          <p>Site name for you and your team.</p>
          <input type="text" name="name" .value=${live(page.getName() || '')}/>
        </label>
      </div>
      <footer>
        <input class="silex-button" type="button" @click=${e => editor.stopCommand(cmdOpenNewPageDialog)} value="Cancel">
        <input class="silex-button" type="submit" value="Ok">
      </footer>
    </form>
  `, el)
}

function saveDialog(editor, config, page) {
  const form = el.querySelector('form')
  const formData = new FormData(form)
  const data = Array.from(formData)
  .reduce((aggregate, [key, value]) => {
    aggregate[key] = value
    return aggregate
  }, {})
  page.set(data)
  // save if auto save is on
  editor.getModel().set('changesCount', editor.getDirtyCount() + 1)
}
