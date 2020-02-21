import { LitElement, html, css } from 'lit-element'
import AutocompleteCore from './AutocompleteCore.js'
import uniqueId from './util/uniqueId.js'

class Autocomplete extends LitElement {
  static get properties() {
    return {
      autoSelect: { type: Boolean },
      defaultValue: { type: String },
      results: { type: Array },
    }
  }

  constructor() {
    super()
    // Default prop values
    this.autoSelect = false
    this.getResultValue = result => result
    this.defaultValue = ''

    // Internal data
    this.value = ''
    this.resultListId = uniqueId('autocomplete-result-list-')
    this.resultListId = 'autocomplete-result-list-1'
    this.results = []
    this.selectedIndex = -1
    this.expanded = false
    this.loading = false
    this.position = 'below'
    this.resetPosition = true
    this.core = new AutocompleteCore({
      autoSelect: this.autoSelect,
      setValue: this.setValue,
      onUpdate: this.handleUpdate,
      onSubmit: this.handleSubmit,
      onShow: this.handleShow,
      onHide: this.handleHide,
      onLoading: this.handleLoading,
      onLoaded: this.handleLoaded,
    })
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
    `
  }

  set search(searchFn) {
    this.core.search = searchFn
  }

  setValue(result) {
    this.value = result ? this.getResultValue(result) : ''
  }

  handleUpdate = (results, selectedIndex) => {
    this.results = results
    this.selectedIndex = selectedIndex
    this.requestUpdate()
  }

  handleShow() {
    this.expanded = true
  }

  handleHide() {
    this.expanded = false
  }

  handleLoading() {
    this.loading = true
  }

  handleLoaded() {
    this.loading = false
  }

  handleInput(event) {
    this.value = event.target.value
    this.core.handleInput(event)
  }

  handleSubmit(selectedResult) {
    console.log('submit', selectedResult)
  }

  getResultValue(result) {
    console.log('getResultValue', result)
    return result
  }

  render() {
    return html`
      <link rel="stylesheet" href="./style.css" />
      <div class="autocomplete">
        <input
          class="autocomplete-input"
          .value="${this.value}"
          role="combobox"
          autocomplete="disable-autocomplete"
          autocapitalize="off"
          autocorrect="off"
          spellcheck="false"
          aria-autocomplete="list"
          aria-haspopup="listbox"
          aria-owns="${this.resultListId}"
          aria-expanded="true"
          @input="${this.handleInput}"
          @keydown="${this.core.handleKeyDown}"
          @focus="${this.core.handleFocus}"
          @blur="${this.core.handleBlur}"
        />
        <ul
          id="${this.resultListId}"
          class="autocomplete-result-list"
          role="listbox"
          @mousedown="${this.core.handleResultMouseDown}"
          @click="${this.core.handleResultClick}"
        >
          ${this.results.map(
            (result, index) => html`
              <li
                id="autocomplete-result-${index}"
                class="autocomplete-result"
                data-result-index="${index}"
                role="option"
                ?aria-selected="${this.selectedIndex === index}"
              >
                ${this.getResultValue(result)}
              </li>
            `
          )}
        </ul>
      </div>
    `
  }
}

customElements.define('te-autocomplete', Autocomplete)
