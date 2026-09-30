# Fat Bear Week Analysis

Turnout and vote-integrity analysis for Fat Bear Week (2022–2026).

**Live site (mirrors the Cursor canvas):** https://garrypolley.github.io/fat-bear-week-analysis/

Interactive twin also lives in Cursor as
`canvas/fat-bear-week-voting.canvas.tsx` (same charts, year filter, sources).

## What’s here

| Path | Contents |
| --- | --- |
| `index.html` / `app.js` / `styles.css` | GitHub Pages — canvas twin |
| `canvas/fat-bear-week-voting.canvas.tsx` | Cursor canvas source |
| `data/*_matchups.csv` | Per-year matchup tallies + Wayback `source_url` |
| `SOURCES.md` | Full citations |

## Method

- **Unit:** pair total (A + B votes in one matchup)
- **Same-day gap:** max pair − min pair
- **Vs opener:** `100 × (day avg ÷ opening-day avg)`
- **YoY:** `100 × (this year stage ÷ prior year same stage)`
- Bar series chronological: **2022 left → 2026 right**

Documented fraud: 2022 Holly semi — [Guardian](https://www.theguardian.com/us-news/2022/oct/11/alaska-fat-bear-week-voting-scandal).
