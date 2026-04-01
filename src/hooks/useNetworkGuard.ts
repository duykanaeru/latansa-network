import { useEffect, useState } from 'react'

export function useNetworkGuard() {
  const [isAllowed, setIsAllowed] = useState<boolean | null>(null)

  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then(r => r.json())
      .then(data => {
        const allowed = data.ip === '103.76.109.243'
        setIsAllowed(allowed)
      })
      .catch(() => setIsAllowed(false))
  }, [])

  return isAllowed
}
