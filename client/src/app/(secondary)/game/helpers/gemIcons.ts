/** Пути к иконкам из public/game-icons (используются по умолчанию в игре). */
export const GAME_ICON_PATHS: string[] = [
  '/game-icons/bitcoin.svg',
  '/game-icons/computer.svg',
  '/game-icons/explorer.svg',
  '/game-icons/trash-bucket.svg',
  '/game-icons/m-word.svg',
  '/game-icons/folder.svg',
];

/** Устаревшие SVG data URL — оставлены для совместимости. По умолчанию используются GAME_ICON_PATHS. */
const ICON_COLOR = '#374151';

function svgDataUrl(svg: string): string {
  const encoded = encodeURIComponent(svg)
    .replace(/'/g, '%27')
    .replace(/"/g, '%22');
  return `data:image/svg+xml,${encoded}`;
}

const shapes: string[] = [
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><circle cx="16" cy="16" r="12" fill="${ICON_COLOR}"/></svg>`,
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect x="4" y="4" width="24" height="24" rx="4" fill="${ICON_COLOR}"/></svg>`,
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M16 6 L28 26 L4 26 Z" fill="${ICON_COLOR}"/></svg>`,
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M16 4 L28 16 L16 28 L4 16 Z" fill="${ICON_COLOR}"/></svg>`,
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M16 2 L19 12 L30 12 L21 18 L25 28 L16 22 L7 28 L11 18 L2 12 L13 12 Z" fill="${ICON_COLOR}"/></svg>`,
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M16 2 L26 8 L26 22 L16 28 L6 22 L6 8 Z" fill="${ICON_COLOR}"/></svg>`,
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M16 28 C16 28 4 20 4 12 C4 8 7 6 10 6 C12 6 14 7 16 9 C18 7 20 6 22 6 C25 6 28 8 28 12 C28 20 16 28 16 28 Z" fill="${ICON_COLOR}"/></svg>`,
];

export const GEM_ICON_DATA_URLS: string[] = shapes.map(svgDataUrl);

export const GEM_ICON_COUNT = GEM_ICON_DATA_URLS.length;
