---
title: Wiring AnimeFlow Pro to a real API in about an hour
date: 2026-01-24
author: Rin Kobayashi
category: Tutorial
cover: fullmetal-alchemist-brotherhood
excerpt: The template ships with a static JSON catalogue. Swapping it for a live backend touches exactly one file — here is the whole path.
---

Every list, filter, search box and detail page in this template reads from one place: `assets/data/anime.json`. That was deliberate. Replacing the demo data with a live API means changing a single module.

## Step 1 — look at the shape

Each record looks like this:

```json
{
  "slug": "frieren-beyond-journeys-end",
  "title": "Frieren: Beyond Journey's End",
  "year": 2023,
  "studio": "Madhouse",
  "genres": ["Adventure", "Fantasy", "Drama"],
  "episodes": 28,
  "duration": 24,
  "rating": 9.3,
  "status": "Finished",
  "type": "TV",
  "hue": 190,
  "tags": ["trending", "top"],
  "synopsis": "…"
}
```

`slug` is the identity — it drives URLs and the localStorage keys for watchlists and resume points. Everything else is display data.

## Step 2 — point the store at your endpoint

Open `src/js/modules/store.js` and change one constant:

```js
const DATA_URL = 'https://api.example.com/v1/catalogue';
```

If your response is not shaped like ours, map it in the same place rather than touching the components:

```js
.then((res) => res.json())
.then((data) => ({
  anime: data.items.map((item) => ({
    slug: item.id,
    title: item.attributes.canonicalTitle,
    year: Number(item.attributes.startDate.slice(0, 4)),
    studio: item.relationships.studio.name,
    genres: item.attributes.categories,
    episodes: item.attributes.episodeCount ?? 0,
    duration: item.attributes.episodeLength ?? 24,
    rating: item.attributes.averageRating / 10,
    status: item.attributes.status === 'current' ? 'Airing' : 'Finished',
    type: item.attributes.subtype === 'movie' ? 'Movie' : 'TV',
    tags: item.attributes.trending ? ['trending'] : [],
    synopsis: item.attributes.synopsis
  }))
}));
```

That is the whole integration for the rails, the browse page, search and the detail page.

## Step 3 — decide about posters

The demo art is generated SVG. Real posters are a URL on your side, so change the two places that build the path — `cardHTML()` in `src/js/modules/card.js` and `animeCard()` in `src/lib/components.js` — to read `item.posterUrl` instead.

Keep the `width`, `height`, `loading="lazy"` and `decoding="async"` attributes exactly as they are. They are what stops the grid from shifting while images arrive.

## Step 4 — move the watchlist server-side

`toggleWatchlist()` currently writes an array of slugs to localStorage. Make it optimistic instead:

```js
export async function toggleWatchlist(slug) {
  const added = applyLocally(slug);          // instant UI
  try {
    await fetch('/api/watchlist', {
      method: added ? 'POST' : 'DELETE',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ slug })
    });
  } catch {
    applyLocally(slug);                       // roll back
    toast('Could not save', 'Check your connection.', 'danger');
  }
  return added;
}
```

Keep the localStorage write as well — it is what makes the state survive a reload while the request is still in flight.

## Step 5 — server-render the first screen if you can

The home page rails are static HTML at build time, which is why the page paints instantly and search engines see real content. If you move to a framework, keep that property: render the first two rails on the server and let the client hydrate the rest.

That is it. Everything else in the template — theming, search, filters, the player page — keeps working untouched, because none of it knows where the data came from.
