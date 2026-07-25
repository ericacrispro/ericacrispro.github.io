/**
 * Animação de entrada **segura**.
 *
 * A armadilha (já paga no projecto da Aline): condicionar a visibilidade do
 * conteúdo a uma animação deixa a secção invisível para sempre quando o Chrome
 * pausa animações (separador oculto, recarregamento, renderizador headless).
 *
 * Regra deste projecto: **o conteúdo está visível por omissão**. O hook só
 * acrescenta uma classe quando o elemento entra no ecrã, e a classe só
 * *enriquece*. Se o IntersectionObserver não existir ou nunca disparar, a
 * página fica exactamente na mesma — legível.
 *
 * O CSS de cada versão faz:
 *   .algo            { }                            <- estado final, visível
 *   .algo.is-entering{ transform: translateY(1rem); opacity: .001 }
 *   ...e retira a classe ao entrar. Nunca o contrário.
 */
import { useEffect, useRef, useState } from 'react'

type Options = {
  /** Percentagem do elemento visível para disparar. */
  threshold?: number
  /** Margem, como no IntersectionObserver. */
  rootMargin?: string
  /** Atraso, em ms, para escalonar itens de uma lista. */
  delay?: number
}

export function useReveal<T extends HTMLElement = HTMLDivElement>({
  threshold = 0.15,
  rootMargin = '0px 0px -10% 0px',
  delay = 0,
}: Options = {}) {
  const ref = useRef<T>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Sem observador, ou com movimento reduzido: já está revelado. Fim.
    if (typeof IntersectionObserver === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setRevealed(true)
      return
    }

    // Rede de segurança: aconteça o que acontecer, ao fim de 1,5s está visível.
    const failsafe = window.setTimeout(() => setRevealed(true), 1500)

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        window.setTimeout(() => setRevealed(true), delay)
        io.disconnect()
      },
      { threshold, rootMargin },
    )
    io.observe(el)

    return () => {
      window.clearTimeout(failsafe)
      io.disconnect()
    }
  }, [threshold, rootMargin, delay])

  return { ref, revealed }
}

/**
 * Devolve `true` quando o utilizador pediu menos movimento. Para as versões que
 * decidem em JS (parallax, marquee, vídeo) e não só em CSS.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const on = () => setReduced(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return reduced
}
