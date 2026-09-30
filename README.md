# Fat Bear Week Analysis

Turnout and vote-integrity analysis for Fat Bear Week (2022–2026), using
official Results tables archived on the Wayback Machine and the live
[explore.org](https://explore.org/fat-bear-week) page for 2026.

**Site:** https://garrypolley.github.io/fat-bear-week-analysis/

## What’s here

| Path | Contents |
| --- | --- |
| `index.html` | GitHub Pages charts + write-up |
| `data/*_matchups.csv` | Per-year matchup tallies with Wayback `source_url` |
| `data/matchups_all_years.csv` | Combined |
| `data/daily_integrity.csv` | Same-day pair gaps |
| `SOURCES.md` | Citations and verification links |
| `data/external/reed_quest/` | Mirror of [Data@Reed Quest](https://github.com/data-at-reed-college/quest/tree/main/fat_bear_week) year-level CSVs |

## Method (short)

- **Unit of analysis:** pair total (votes for bear A + bear B in one matchup).
- **Same-day missing votes:** max pair − min pair that day.
- **Vs opener index:** `100 × (day avg ÷ that year’s opening-day avg)`.
- **YoY index:** `100 × (this year stage avg ÷ prior year same stage)`.

Documented fraud: 2022 Holly semi (~9k spam votes discarded) — see
[Guardian](https://www.theguardian.com/us-news/2022/oct/11/alaska-fat-bear-week-voting-scandal).
Archived Results pages show **post-discard** totals.

## License

Analysis and compiled CSVs: CC0 / public domain intent for the numbers
(themselves published by explore.org / NPS). Site code: MIT if you need a
label — do what you want.
