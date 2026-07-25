/**
 * Scroll-spy da V11 — a barra acende sozinha a secção que está a ser lida.
 *
 * O padrão vem do portfólio do Silas (`main.js`): as secções não são separadores,
 * vivem todas na mesma coluna e rolam juntas; a barra só reflecte onde a leitura
 * está. Duas diferenças de implementação, ambas deliberadas:
 *
 *  1. **IntersectionObserver** em vez de medir rectângulos a cada scroll — o
 *     browser faz a conta fora da thread principal. A "linha de leitura" é o
 *     `rootMargin`: só conta a faixa de cima (38%) da área de leitura, portanto
 *     acende a última secção cujo topo já cruzou essa linha.
 *  2. **Quem rola muda com o layout**: no telemóvel é a janela; no computador é
 *     o contentor dos painéis (o resto do ecrã está fixo). O `root` do
 *     observador segue essa mudança, e é reconstruído quando o breakpoint vira.
 *
 * A armadilha herdada (e resolvida): no fim da rolagem a última secção pode ser
 * curta demais para chegar à linha — sem o teste de `atEnd`, "Contacto" nunca
 * acendia.
 */
import { useCallback, useEffect, useState, type RefObject } from 'react'

const DESKTOP = '(min-width: 1024px)'

export function useSectionSpy(ids: readonly string[], scroller: RefObject<HTMLElement | null>) {
  const [current, setCurrent] = useState<string>(ids[0] ?? '')
  const key = ids.join('|')

  useEffect(() => {
    const list = key.split('|').filter(Boolean)
    if (!list.length || typeof IntersectionObserver === 'undefined') return

    const mq = window.matchMedia(DESKTOP)
    const lit = new Set<string>()
    let io: IntersectionObserver | null = null

    const scrollerEl = () => (mq.matches ? scroller.current : null)

    const pick = () => {
      // Ordem do documento: a última que cruzou a linha é a que está a ser lida.
      const found = list.filter((id) => lit.has(id))
      if (found.length) setCurrent(found[found.length - 1])
    }

    const atEnd = () => {
      const sc = scrollerEl()
      if (sc) return sc.scrollTop + sc.clientHeight >= sc.scrollHeight - 4
      return window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4
    }

    /**
     * No fim da rolagem já não há para onde ir e a última secção pode ser curta
     * demais para chegar à linha de leitura — sem isto, "Contacto" nunca
     * acenderia. Chegar ao fim é chegar ao contacto: é a acção que a página
     * pede, e é o que a barra deve mostrar.
     */
    const sync = () => {
      if (atEnd()) setCurrent(list[list.length - 1])
      else pick()
    }

    const build = () => {
      io?.disconnect()
      lit.clear()
      const root = scrollerEl()
      /**
       * A linha de leitura: uma faixa a partir do topo da área de leitura, no
       * máximo 200px. **Não pode ser uma percentagem**: num monitor de 1440px
       * de altura, 35% são 500px e uma secção curta (o "Como funciona", em
       * quatro colunas) acendia já a secção seguinte. Com tecto em px, a barra
       * acompanha a leitura em qualquer ecrã.
       */
      const altura = root ? root.clientHeight : window.innerHeight
      const linha = Math.min(altura * 0.35, 200)
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            const id = (e.target as HTMLElement).id
            if (e.isIntersecting) lit.add(id)
            else lit.delete(id)
          }
          sync()
        },
        { root, rootMargin: `0px 0px ${Math.round(linha - altura)}px 0px`, threshold: 0 },
      )
      for (const id of list) {
        const el = document.getElementById(id)
        if (el) io.observe(el)
      }
    }

    build()

    const onScroll = () => sync()
    const onLayout = () => {
      build()
      sync()
    }

    const sc = scroller.current
    window.addEventListener('scroll', onScroll, { passive: true })
    sc?.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onLayout)
    mq.addEventListener('change', onLayout)

    return () => {
      io?.disconnect()
      window.removeEventListener('scroll', onScroll)
      sc?.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onLayout)
      mq.removeEventListener('change', onLayout)
    }
  }, [key, scroller])

  /** Clicar na barra rola até à secção (e acende-a já, sem esperar pelo scroll). */
  const goTo = useCallback(
    (id: string) => {
      const el = document.getElementById(id)
      if (!el) return
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
      setCurrent(id)
    },
    [setCurrent],
  )

  return { current, goTo }
}

/**
 * A tira de secções rola na horizontal no telemóvel (e ainda a 1024px, onde as
 * sete não cabem). Duas consequências que é preciso resolver, senão a barra
 * mente: a secção acesa pode estar fora de vista, e não se percebe que há mais
 * para o lado.
 */
export function useTabStrip(tabs: RefObject<HTMLElement | null>, current: string) {
  // 1. A secção acesa vem para o meio da tira — sem mexer na página.
  useEffect(() => {
    const strip = tabs.current
    if (!strip) return
    const el = strip.querySelector<HTMLElement>('[aria-current="true"]')
    const max = strip.scrollWidth - strip.clientWidth
    if (!el || max <= 4) return
    const alvo = el.offsetLeft - (strip.clientWidth - el.offsetWidth) / 2
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    strip.scrollTo({ left: Math.max(0, Math.min(alvo, max)), behavior: reduced ? 'auto' : 'smooth' })
  }, [tabs, current])

  // 2. O rasto esbatido diz de que lado há mais — e desaparece quando não há.
  useEffect(() => {
    const strip = tabs.current
    if (!strip) return
    const sync = () => {
      const max = strip.scrollWidth - strip.clientWidth
      const esquerda = strip.scrollLeft > 4
      const direita = strip.scrollLeft < max - 4
      strip.dataset.fade = max <= 4 ? 'nao' : esquerda && direita ? 'ambos' : esquerda ? 'esquerda' : 'direita'
    }
    sync()
    // As fontes ainda podem mudar a largura das abas depois do primeiro pintar.
    const atraso = window.setTimeout(sync, 500)
    strip.addEventListener('scroll', sync, { passive: true })
    window.addEventListener('resize', sync)
    return () => {
      window.clearTimeout(atraso)
      strip.removeEventListener('scroll', sync)
      window.removeEventListener('resize', sync)
    }
  }, [tabs, current])
}

/**
 * O snap da fotografia só vale enquanto o herói ainda está em jogo: serve para
 * "cair" do retrato para o conteúdo. Passado isso a coluna é longa e o snap só
 * brigaria com a rolagem — por isso a classe sai (é o que o `main.js` do Silas
 * faz, e sem isto a leitura fica presa a saltar).
 */
export function useHeroSnap(content: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP)
    const root = document.documentElement

    const sync = () => {
      const boundary = content.current?.offsetTop ?? 0
      root.classList.toggle('v11-snap', !mq.matches && window.scrollY <= boundary + 2)
    }

    sync()
    window.addEventListener('scroll', sync, { passive: true })
    window.addEventListener('resize', sync)
    mq.addEventListener('change', sync)

    return () => {
      root.classList.remove('v11-snap')
      window.removeEventListener('scroll', sync)
      window.removeEventListener('resize', sync)
      mq.removeEventListener('change', sync)
    }
  }, [content])
}
