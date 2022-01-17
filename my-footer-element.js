export class MyFooterElement extends HTMLElement {
  // template = document.createElement('template')
  github = 'https://github.com/vdegenne'
  bitcoinAddress = ''

  constructor() {
    super()
    this.attachShadow({ mode: 'open' });

    fetch('https://ipfs.io/ipns/bitcoin.vdegenne.com/address').then(async res => {
      this.bitcoinAddress = await res.text()
      this.render()
    })

    this.addEventListener('click', (e) => {
      const target = e.composedPath()[0]
      if (target.id === 'bitcoinAddress') {
        this.copyBitcoinAddress(target.innerText)
      }
    })
  }

  render () {
    // this.updateTemplate()
    this.shadowRoot.innerHTML = this.template
  }

  static get observedAttributes () {
    return ['github', 'bitcoinAddress']
  }

  get template () {
    return `
    <style>
    :host {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 4px 8px;
      box-sizing: border-box;
    }
    a {
      display: inline-flex;
      /* background-color: black;
      color: white; */
    }
    a.classic {
      background-color: blue;
      color: white;
      padding: 3px 6px;
      border-radius: 3px;
      text-decoration: none;
    }
    </style>
    <span id="bitcoinAddress" style="cursor:pointer" onclick="function test (e) { console.log(e) }">${this.bitcoinAddress}</span>
    <div><a class="classic" href="https://github.com/vdegenne" target="_blank">vdegenne</a> <span>&copy; ${(new Date()).getFullYear()}</div>
    <a href="${this.github}" target="_blank">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
    </a>
    `
  }

  attributeChangedCallback (name, oldValue, newValue) {
    this[name] = newValue;
    this.render()
  }

  copyBitcoinAddress(text) {
    copyToClipboard(text)
    this.dispatchEvent(new Event('copied', { bubbles: true, composed: true }))
  }
}

window.customElements.define('my-footer-element', MyFooterElement)


function copyToClipboard (text) {
  // Use the Async Clipboard API when available. Requires a secure browsing
  // context (i.e. HTTPS)
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text).catch(function (err) {
      throw (err !== undefined ? err : new DOMException('The request is not allowed', 'NotAllowedError'))
    })
  }

  // ...Otherwise, use document.execCommand() fallback

  // Put the text to copy into a <span>
  const span = document.createElement('span')
  span.textContent = text

  // Preserve consecutive spaces and newlines
  span.style.whiteSpace = 'pre'

  // Add the <span> to the page
  document.body.appendChild(span)

  // Make a selection object representing the range of text selected by the user
  const selection = window.getSelection()
  const range = window.document.createRange()
  selection.removeAllRanges()
  range.selectNode(span)
  selection.addRange(range)

  // Copy text to the clipboard
  let success = false
  try {
    success = window.document.execCommand('copy')
  } catch (err) {
    console.log('error', err)
  }

  // Cleanup
  selection.removeAllRanges()
  window.document.body.removeChild(span)

  return success
    ? Promise.resolve()
    : Promise.reject(new DOMException('The request is not allowed', 'NotAllowedError'))
}