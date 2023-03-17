import * as Sentry from '@sentry/react'
import { SmallButtonPrimary } from 'components/Button'
import { useIsMobile } from 'hooks/useIsMobile'
import { PropsWithChildren } from 'react'
import { Copy } from 'react-feather'
import styled from 'styled-components/macro'

import { CopyToClipboard, ThemedText } from '../../theme'
import { Column } from '../Column'

const FallbackWrapper = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
`

const BodyWrapper = styled.div<{ margin?: string }>`
  width: 100%;
  max-width: 500px;
  margin: auto;
  padding: 1rem;
`

const StretchedRow = styled.div`
  display: flex;
  gap: 24px;

  > * {
    display: flex;
    flex: 1;
  }
`

const CodeBlockWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.backgroundModule};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
  border-radius: 24px;
  padding: 24px;
  gap: 10px;
  color: ${({ theme }) => theme.textPrimary};
`

const CopyIcon = styled(Copy)`
  stroke: ${({ theme }) => theme.textSecondary};
`

const CodeTitle = styled.div`
  display: flex;
  gap: 14px;
  align-items: center;
  justify-content: space-between;
  word-break: break-word;
`

const Fallback = ({ error }: { error: Error; eventId: string | null }) => {
  const isMobile = useIsMobile()

  // @todo: ThemedText components should be responsive by default
  const [Title, Description] = isMobile
    ? [ThemedText.HeadlineSmall, ThemedText.BodySmall]
    : [ThemedText.HeadlineLarge, ThemedText.BodySecondary]

  const errorDetails = error.stack || error.message

  return (
    <FallbackWrapper>
      <BodyWrapper>
        <Column gap="xl">
          <>
            <Column gap="sm">
              <Title textAlign="center">Something went wrong</Title>
              <Description textAlign="center" color="textSecondary">
                Sorry, an error occured while processing your request. If you request support, be sure to copy the
                details of this error.
              </Description>
            </Column>
            <CodeBlockWrapper>
              <CodeTitle>
                <ThemedText.SubHeader fontWeight={500}>Error details</ThemedText.SubHeader>
                <CopyToClipboard toCopy={errorDetails}>
                  <CopyIcon />
                </CopyToClipboard>
              </CodeTitle>
            </CodeBlockWrapper>
          </>
          <StretchedRow>
            <SmallButtonPrimary onClick={() => window.location.reload()}>Reload the app</SmallButtonPrimary>
          </StretchedRow>
        </Column>
      </BodyWrapper>
    </FallbackWrapper>
  )
}

async function updateServiceWorker(): Promise<ServiceWorkerRegistration> {
  const ready = await navigator.serviceWorker.ready
  // the return type of update is incorrectly typed as Promise<void>. See
  // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/update
  return ready.update() as unknown as Promise<ServiceWorkerRegistration>
}

const updateServiceWorkerInBackground = async () => {
  try {
    const registration = await updateServiceWorker()

    // We want to refresh only if we detect a new service worker is waiting to be activated.
    // See details about it: https://web.dev/service-worker-lifecycle/
    if (registration?.waiting) {
      await registration.unregister()

      // Makes Workbox call skipWaiting().
      // For more info on skipWaiting see: https://web.dev/service-worker-lifecycle/#skip-the-waiting-phase
      registration.waiting.postMessage({ type: 'SKIP_WAITING' })
    }
  } catch (error) {
    console.error('Failed to update service worker', error)
  }
}

export default function ErrorBoundary({ children }: PropsWithChildren): JSX.Element {
  return (
    <Sentry.ErrorBoundary
      fallback={({ error, eventId }) => <Fallback error={error} eventId={eventId} />}
      beforeCapture={(scope) => {
        scope.setLevel('fatal')
      }}
      onError={() => {
        updateServiceWorkerInBackground()
      }}
    >
      {children}
    </Sentry.ErrorBoundary>
  )
}
