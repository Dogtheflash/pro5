import { useEffect, useState } from 'react'

export type UiVersion = 'v1' | 'v2'

const STORAGE_KEY = 'uiVersion'

/** Read the persisted UI version (defaults to V2 — the redesign). */
export function readUiVersion(): UiVersion {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (v === 'v1' || v === 'v2') return v
  } catch {
    /* ignore */
  }
  return 'v2'
}

function persist(v: UiVersion) {
  try {
    localStorage.setItem(STORAGE_KEY, v)
  } catch {
    /* ignore */
  }
}

// A floating, frosted-glass segmented control that swaps the whole page between
// the old UI (V1) and the redesign (V2). Fixed top-right, compact by default,
// expands on hover. The active version persists to localStorage. Drops into any
// page — just pass the current `value` and handle `onVersionChange`.
export default function VersionSwitcher({
  value,
  onVersionChange,
}: {
  value: UiVersion
  onVersionChange: (v: UiVersion) => void
}) {
  const [pulse, setPulse] = useState(false)

  // Keep storage in sync whenever the value the host renders with changes.
  useEffect(() => {
    persist(value)
  }, [value])

  const pick = (v: UiVersion) => {
    if (v === value) return
    setPulse(true)
    window.setTimeout(() => setPulse(false), 240)
    onVersionChange(v)
  }

  return (
    <div className="vswitch" role="group" aria-label="Preview UI version">
      <span className="vswitch-label">Compare UI</span>
      <div className={`vswitch-track ${pulse ? 'vswitch-pulse' : ''}`} data-active={value}>
        {/* Sliding accent highlight */}
        <span className="vswitch-thumb" aria-hidden />
        {(['v1', 'v2'] as UiVersion[]).map((v) => (
          <button
            key={v}
            type="button"
            className="vswitch-opt"
            aria-pressed={value === v}
            aria-label={v === 'v1' ? 'Old UI, version 1' : 'New UI, version 2'}
            onClick={() => pick(v)}
          >
            {v.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  )
}
