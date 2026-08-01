/**
 * Feature 1 — catalogue store.
 *
 * Single place the front-end gets data from. Swap DATA_URL for your own API
 * endpoint and every rail, filter, search box and detail page follows, as long
 * as the JSON keeps the same field names.
 */

import { storage } from '../utils.js';

const DATA_URL = 'assets/data/anime.json';
const POSTS_URL = 'assets/data/posts.json';

let cache = null;
let inflight = null;

export async function getCatalogue() {
  if (cache) return cache;
  if (inflight) return inflight;
  inflight = fetch(DATA_URL, { headers: { accept: 'application/json' } })
    .then((res) => {
      if (!res.ok) throw new Error(`Catalogue request failed: ${res.status}`);
      return res.json();
    })
    .then((data) => {
      cache = data;
      inflight = null;
      return data;
    })
    .catch((err) => {
      inflight = null;
      console.warn('[animeflow] catalogue unavailable —', err.message);
      return { anime: [], genres: [], studios: [], schedule: [] };
    });
  return inflight;
}

export async function getPosts() {
  try {
    const res = await fetch(POSTS_URL);
    return res.ok ? res.json() : [];
  } catch { return []; }
}

export const findBySlug = (list, slug) => list.find((a) => a.slug === slug);

/** Feature 2 — "recently viewed", written on every detail-page visit. */
export function trackView(slug) {
  if (!slug) return;
  const seen = storage.get('af-recent', []).filter((s) => s !== slug);
  seen.unshift(slug);
  storage.set('af-recent', seen.slice(0, 12));
}

export const getRecent = () => storage.get('af-recent', []);

/** Feature 3 — resume points, updated by the player page. */
export function saveProgress(slug, episode, percent) {
  const all = storage.get('af-progress', {});
  all[slug] = { episode, percent, at: Date.now() };
  storage.set('af-progress', all);
}

export const getProgress = () => storage.get('af-progress', {});
