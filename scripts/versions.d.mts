/** Tipos para `versions.mjs`, que é JS puro (os scripts do Node não passam pelo Vite). */
export type VersionSpec = {
  id: string
  name: string
  fonts: string[]
  resumo: string
}

export declare const VERSIONS: VersionSpec[]
export declare const IDS: string[]
