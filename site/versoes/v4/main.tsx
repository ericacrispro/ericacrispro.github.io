// GERADO por scripts/entries.mjs — não editar à mão.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../../src/assets/fonts/marcellus.css'
import '../../src/assets/fonts/epilogue.css'
import '../../src/shared/tokens.css'
import { applyLangToDocument } from '../../src/i18n'
import { App } from '../../src/versions/v4/App'

applyLangToDocument()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
