# Sources

Vote-integrity analysis. Prefer Wayback snapshots of explore.org Results
tables so anyone can verify. Live page overwrites each year.

## Known voting scandal (context)

| What | URL |
| --- | --- |
| Guardian — 2022 ballot stuffing (~9,000 fake Holly votes discarded in semis) | https://www.theguardian.com/us-news/2022/oct/11/alaska-fat-bear-week-voting-scandal |

Archived Oct 9, 2022 semi totals on the Wayback results page are the **post-discard**
official numbers (747: 37,940; 435 Holly: 30,430), not the stuffed intermediate tally.

Scale check vs 2026 finals: Guardian ~9,000 spam > 2026 margin 5,081 absolute;
~11.6–13.2% of the 2022 semi pair vs 2.5% margin of the 2026 finals pair
(201,587). Same ~9k would be ~4.5% of that 2026 pair — enough to flip the race.

## Wayback Machine — matchup results (verify here)

| Year | Wayback snapshot | Local CSV | Sum of pairs | Published Total | Delta |
| --- | --- | --- | --- | --- | --- |
| 2026 | Live (not archived yet): https://explore.org/fat-bear-week | `data/2026_matchups.csv` | 2,503,731 | 2,503,731 | 0 |
| 2025 | https://web.archive.org/web/20251001014537/https://explore.org/fat-bear-week | `data/2025_matchups.csv` | 1,715,886 | 1,716,902 | −1,016 |
| 2024 | https://web.archive.org/web/20241031053258/https://explore.org/fat-bear-week | `data/2024_matchups.csv` | 1,041,124 | 1,041,124 | 0 |
| 2023 | https://web.archive.org/web/20231201135955/https://www.explore.org/fat-bear-week | `data/2023_matchups.csv` | 1,382,961 | 1,382,783 | +178 |
| 2022 | https://web.archive.org/web/20221201003358/https://www.explore.org/fat-bear-week | `data/2022_matchups.csv` | 1,031,376 | 1,031,376 | 0 |
| 2021 | https://web.archive.org/web/20220123185234mp_/https://explore.org/fat-bear-week | — | — | — | No raw matchup table; stop at 2022 |

Small 2025 (−1,016) and 2023 (+178) deltas: transcription/rounding vs published
footer Total. Re-scrape snapshot HTML later to reconcile. 2022 and 2024 exact match.

Combined file: `data/matchups_all_years.csv`  
Same-day gap metrics: `data/daily_integrity.csv`

## Parsing notes

- 2023 Jr: source text `6.279` treated as **6,279**.
- 2022 finals: source text `68.105` treated as **68,105**.
- 2022 Oct 9 semi: archived = cleaned totals after fraud discard (Guardian).

## Other references

| What | URL |
| --- | --- |
| Hall of Champions | https://explore.org/hall-of-champions |
| Reed Quest year-level CSVs (not matchup-level) | https://github.com/data-at-reed-college/quest/tree/main/fat_bear_week/data |
| Reed sources.csv | https://raw.githubusercontent.com/data-at-reed-college/quest/main/fat_bear_week/data/sources.csv |
| Reed article (no official CSV) | https://blogs.reed.edu/datalab/2026/09/25/whos-the-fattest-of-them-all/ |
| NPS 2021 recap | https://www.nps.gov/katm/blogs/fat-bear-week-2021.htm |

## Integrity signals used here

1. **Same-day pair gap** — max pair − min pair (incomplete multi-poll voting).
2. **Sudden mid-poll spike** — documented only for 2022 Holly semi (Guardian / NPS).
3. **Turnout shape** — avg pair total by day; midweek dips alone ≠ fraud.

CSV columns include `source_url` pointing at the Wayback (or live) page.
