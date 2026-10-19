<template>
  <Head>
    <Title>Lepse | Your personal productivity made fun</Title>
    <Meta
      name="description"
      content="A personal organization/productivity tool that maps your daily tasks to meaningful goals. and is aesthetic as hell."
    />

    <!-- Favicon -->
    <Link rel="icon" type="image/png" href="/favicon-96x96.png?v=20260926" sizes="96x96" />
    <Link rel="icon" type="image/svg+xml" href="/favicon.svg?v=20260926" />
    <Link rel="shortcut icon" href="/favicon.ico?v=20260926" />
    <Link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=20260926" />
    <Meta name="apple-mobile-web-app-title" content="Lepse" />
    <Link rel="manifest" href="/site.webmanifest?v=20260926" />
  </Head>

  <UIProvider>
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UIProvider>
</template>
