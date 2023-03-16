import { useWeb3React } from '@web3-react/core'
import { SupportedChainId } from 'constants/chains'
import { useEffect } from 'react'

const initialStyles = {
  width: '200vw',
  height: '200vh',
  transform: 'translate(-50vw, -100vh)',
}
const backgroundResetStyles = {
  width: '100vw',
  height: '100vh',
  transform: 'unset',
}

type TargetBackgroundStyles = typeof initialStyles | typeof backgroundResetStyles

const backgroundRadialGradientElement = document.getElementById('background-radial-gradient')
const setBackground = (newValues: TargetBackgroundStyles) =>
  Object.entries(newValues).forEach(([key, value]) => {
    if (backgroundRadialGradientElement) {
      backgroundRadialGradientElement.style[key as keyof typeof backgroundResetStyles] = value
    }
  })

export default function RadialGradientByChainUpdater(): null {
  const { chainId } = useWeb3React()

  // manage background color
  useEffect(() => {
    if (!backgroundRadialGradientElement) {
      return
    }

    switch (chainId) {
      case SupportedChainId.BNB: {
        setBackground(backgroundResetStyles)
        const bscDarkGradient =
          'radial-gradient(100% 100% at 50% 0%, rgba(169, 132, 17, 0.1) 0%, rgba(128, 100, 14, 0.08) 50%, rgba(140, 185, 11, 0) 100%), #0D0E0E'
        backgroundRadialGradientElement.style.background = bscDarkGradient
        break
      }
      default: {
        setBackground(initialStyles)
        const defaultDarkGradient = 'linear-gradient(180deg, #202738 0%, #070816 100%)'
        backgroundRadialGradientElement.style.background = defaultDarkGradient
      }
    }
  }, [chainId])
  return null
}
