import { requestInfo } from 'rwsdk/worker'
import styles from './styles.css?url'

export const Document: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html lang="en" data-theme={requestInfo.ctx.theme}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <title>Lepse</title>
        <meta
          name="description"
          content="A personal organization/productivity tool that maps your daily tasks to meaningful goals. and is aesthetic as hell."
        />

        {/* Favicon */}
        <link rel="icon" type="image/png" href="/favicon-96x96.png?v=20260926" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg?v=20260926" />
        <link rel="shortcut icon" href="/favicon.ico?v=20260926" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=20260926" />
        <meta name="apple-mobile-web-app-title" content="Lepse" />
        <link rel="manifest" href="/site.webmanifest?v=20260926" />

        <link rel="stylesheet" href={styles} />
        <link rel="modulepreload" href="/src/client.tsx" />
      </head>
      <body>
        {children}
        <script>import("/src/client.tsx")</script>
      </body>
    </html>
  )
}
