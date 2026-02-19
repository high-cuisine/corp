import { baseURL } from './api/api';

/**
 * Возвращает URL для отображения аватарки.
 * Если photoUrl — полный URL (http) или уже путь с / — возвращает как есть.
 * Иначе подставляет путь к статике бэкенда: {baseURL}/avatars/{filename}.
 */
export function getAvatarUrl(photoUrl: string | null): string {
  if (!photoUrl) return '';
  if (photoUrl.startsWith('http') || photoUrl.startsWith('/')) return photoUrl;
  const base = baseURL.replace(/\/$/, '');
  return `${base}/avatars/${photoUrl}`;
}
