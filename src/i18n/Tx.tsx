import { useEffect, useState } from 'react'
import { useLocale } from './index'
import { getCached, translateText, translatable } from './autoTranslate'

// Reactive auto-translation of a single English string. Paints instantly from
// cache (or the English source), then upgrades in place once the API resolves.
// Re-runs whenever the global locale changes.
export function useAutoTr(text: string): string {
  const { code } = useLocale()
  const [out, setOut] = useState<string>(() => getCached(text, code) ?? text)

  useEffect(() => {
    const cached = getCached(text, code)
    if (cached != null) {
      setOut(cached)
      return
    }
    setOut(text) // show English while the translation is in flight
    if (!translatable(text)) return
    let alive = true
    translateText(text, code).then((translated) => {
      if (alive) setOut(translated)
    })
    return () => {
      alive = false
    }
  }, [text, code])

  return out
}

/**
 * Drop-in wrapper for English editorial content:
 *   <Tx>{activity.description}</Tx>
 * Renders the (auto-translated) text as a plain string node.
 */
export function Tx({ children }: { children: string }) {
  return <>{useAutoTr(children)}</>
}

export default Tx
