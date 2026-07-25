// GERADO por scripts/promote.mjs — não editar à mão.
// A versão publicada hoje na raiz do site é a V1 · Chama.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../src/assets/fonts/anton.css'
import '../src/assets/fonts/archivo.css'
import '../src/shared/tokens.css'
import { applyLangToDocument } from '../src/i18n'
import { App } from '../src/versions/v1/App'

applyLangToDocument()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
