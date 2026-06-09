import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://sinty.dev',
  integrations: [
    starlight({
      title: 'Singularity OS',
      description: 'Singularity OS - A new operating system.',
      logo: { src: './src/assets/logo.svg', alt: 'Singularity OS', replacesTitle: true },
      customCss: ['@fontsource-variable/montserrat', './src/styles/tokens.css', './src/styles/starlight-skins.css'],
      sidebar: [
        {
          label: 'Start here',
          items: [
            { label: 'Getting Started', slug: 'docs/getting-started' },
            { label: 'Install', slug: 'docs/install' },
            { label: 'First boot', slug: 'docs/first-boot' },
          ],
        },
        {
          label: 'Using Singularity',
          items: [
            { label: 'Desktop tour', slug: 'docs/desktop-tour' },
            { label: 'The dock', slug: 'docs/dock' },
            { label: 'The global menu', slug: 'docs/global-menu' },
            { label: 'Control Center', slug: 'docs/control-center' },
            { label: 'App settings & permissions', slug: 'docs/app-settings' },
            { label: 'Spotlight', slug: 'docs/spotlight' },
            { label: 'Keyboard shortcuts', slug: 'docs/keyboard-shortcuts' },
            { label: 'Appearance', slug: 'docs/appearance' },
            { label: 'Theming third-party apps', slug: 'docs/app-theming' },
            { label: 'Notifications', slug: 'docs/notifications' },
            { label: 'Bubble navigation', slug: 'docs/bubbles' },
            { label: 'UX research', slug: 'docs/ux-research' },
            { label: 'Troubleshooting', slug: 'docs/troubleshooting' },
          ],
        },
        {
          label: 'Apps',
          items: [
            { label: 'Overview', slug: 'docs/apps' },
            { label: 'Files', slug: 'docs/apps/files' },
            { label: 'Edit', slug: 'docs/apps/edit' },
            { label: 'Write', slug: 'docs/apps/write' },
            { label: 'Store', slug: 'docs/apps/store' },
            { label: 'Monitor', slug: 'docs/apps/monitor' },
            { label: 'Git', slug: 'docs/apps/git' },
            { label: 'Music', slug: 'docs/apps/music' },
            { label: 'Photos', slug: 'docs/apps/photos' },
            { label: 'Videos', slug: 'docs/apps/videos' },
            { label: 'Calendar', slug: 'docs/apps/calendar' },
            { label: 'Calculator', slug: 'docs/apps/calculator' },
            { label: 'Leafs', slug: 'docs/apps/leafs' },
            { label: 'Keyring', slug: 'docs/apps/keyring' },
          ],
        },
        {
          label: 'Building on Singularity',
          items: [
            { label: 'Under the Hood', slug: 'docs/under-the-hood' },
            { label: 'Repositories', slug: 'docs/repositories' },
            { label: 'Build from source', slug: 'docs/build-from-source' },
            { label: 'vetro', slug: 'docs/vetro' },
            { label: 'Build an App', slug: 'docs/build-an-app' },
            { label: 'libsingularity primitives', slug: 'docs/libsingularity' },
            { label: 'Theming', slug: 'docs/theming' },
            { label: 'Plugins', slug: 'docs/plugins' },
            { label: 'Widgets', slug: 'docs/widgets' },
            { label: 'Search providers', slug: 'docs/search-providers' },
            { label: 'Contracts', slug: 'docs/contracts' },
            { label: 'Exposing app settings', slug: 'docs/exposing-settings' },
            { label: 'How the global menu works', slug: 'docs/global-menu-internals' },
            { label: 'The compositor', slug: 'docs/compositor' },
            { label: 'Server-side decorations', slug: 'docs/server-side-decorations' },
            { label: 'Developer mode', slug: 'docs/developer-mode' },
          ],
        },
        {
          label: 'The bigger picture',
          items: [
            { label: 'Singularity OS', slug: 'docs/singularity-os' },
            { label: 'Atom Loops', slug: 'docs/atom-loops' },
            { label: 'Contributing', slug: 'docs/contributing' },
          ],
        },
      ],
    }),
  ],
});
