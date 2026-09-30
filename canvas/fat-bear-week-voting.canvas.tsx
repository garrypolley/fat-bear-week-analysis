import {
  BarChart,
  Callout,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Grid,
  H1,
  H2,
  H3,
  Link,
  Row,
  Select,
  Stack,
  Stat,
  Table,
  Text,
  useCanvasState,
} from "cursor/canvas";

const REPO = "https://github.com/garrypolley/fat-bear-week-analysis";
const RAW = `${REPO}/blob/main`;

function fmt(n: number): string {
  return n.toLocaleString("en-US");
}

type YearKey = "2022" | "2023" | "2024" | "2025" | "2026";
type ViewKey = "all" | YearKey;

const STAGES = ["Open", "Day2", "Mid", "Late/Semi", "Finals"] as const;

/** Chronological: 2022 leftmost → 2026 rightmost */
const VS_OPENER: Record<YearKey, number[]> = {
  "2022": [100, 102.7, 59.4, 70.2, 114.2],
  "2023": [100, 97.3, 51.6, 70.5, 90.3],
  "2024": [100, 88.7, 44.0, 69.5, 89.4],
  "2025": [100, 112.0, 81.0, 73.8, 101.6],
  "2026": [100, 80.4, 64.0, 74.0, 98.6],
};

const VS_OPENER_TONE: Record<YearKey, "danger" | "neutral" | "warning" | "success" | "info"> = {
  "2022": "danger",
  "2023": "neutral",
  "2024": "warning",
  "2025": "success",
  "2026": "info",
};

/** YoY steps chronological left → right */
const YOY_SERIES = [
  { name: "2023 vs 2022", data: [133.0, 126.0, 115.5, 133.5, 105.1], tone: "neutral" as const },
  { name: "2024 vs 2023", data: [78.1, 71.2, 66.6, 77.0, 77.4], tone: "warning" as const },
  { name: "2025 vs 2024", data: [138.6, 175.0, 255.2, 147.2, 157.5], tone: "success" as const },
  { name: "2026 vs 2025", data: [129.7, 93.1, 102.5, 130.1, 125.9], tone: "info" as const },
];

const GAPS_BY_YEAR: Record<YearKey, { labels: string[]; data: number[] }> = {
  "2022": {
    labels: ["2022-10-05", "2022-10-06", "2022-10-07", "2022-10-08"],
    data: [1.6, 6.1, 2.4, 0.6],
  },
  "2023": {
    labels: ["2023-10-04", "2023-10-05", "2023-10-06", "2023-10-07", "2023-10-09"],
    data: [7.8, 9.6, 2.7, 3.9, 1.3],
  },
  "2024": {
    labels: ["2024-10-02", "2024-10-03", "2024-10-04", "2024-10-05", "2024-10-07"],
    data: [4.3, 2.7, 3.7, 2.4, 1.2],
  },
  "2025": {
    labels: ["2025-09-23", "2025-09-24", "2025-09-25", "2025-09-26", "2025-09-29"],
    data: [1.6, 1.7, 2.5, 2.9, 4.8],
  },
  "2026": {
    labels: ["2026-09-23", "2026-09-24", "2026-09-25", "2026-09-28"],
    data: [16.4, 3.7, 2.3, 5.7],
  },
};

const ALL_GAP_LABELS = [
  ...GAPS_BY_YEAR["2022"].labels,
  ...GAPS_BY_YEAR["2023"].labels,
  ...GAPS_BY_YEAR["2024"].labels,
  ...GAPS_BY_YEAR["2025"].labels,
  ...GAPS_BY_YEAR["2026"].labels,
];
const ALL_GAP_DATA = [
  ...GAPS_BY_YEAR["2022"].data,
  ...GAPS_BY_YEAR["2023"].data,
  ...GAPS_BY_YEAR["2024"].data,
  ...GAPS_BY_YEAR["2025"].data,
  ...GAPS_BY_YEAR["2026"].data,
];

const WAYBACK_ROWS: Array<{
  year: string;
  label: string;
  href: string;
  csv: string;
  delta: string;
}> = [
  {
    year: "2022",
    label: "20221201003358",
    href: "https://web.archive.org/web/20221201003358/https://www.explore.org/fat-bear-week",
    csv: "data/2022_matchups.csv",
    delta: "exact (post-discard)",
  },
  {
    year: "2023",
    label: "20231201135955",
    href: "https://web.archive.org/web/20231201135955/https://www.explore.org/fat-bear-week",
    csv: "data/2023_matchups.csv",
    delta: "+178",
  },
  {
    year: "2024",
    label: "20241031053258",
    href: "https://web.archive.org/web/20241031053258/https://explore.org/fat-bear-week",
    csv: "data/2024_matchups.csv",
    delta: "exact",
  },
  {
    year: "2025",
    label: "20251001014537",
    href: "https://web.archive.org/web/20251001014537/https://explore.org/fat-bear-week",
    csv: "data/2025_matchups.csv",
    delta: "−1,016",
  },
  {
    year: "2026",
    label: "live explore.org",
    href: "https://explore.org/fat-bear-week",
    csv: "data/2026_matchups.csv",
    delta: "exact",
  },
];

const FBW = "https://explore.org/fat-bear-week";
const BACKPACK_IMG =
  "https://media.explore.org/documents/89-1789765144853.png";

/** Finals winner−loser margins, chronological */
const FINALS_YEARS = ["2022", "2023", "2024", "2025", "2026"] as const;
const FINALS_MARGINS = [11229, 85187, 40780, 32625, 5081];
const FINALS_MARGIN_PCT = [9.0, 64.8, 40.1, 20.4, 2.5];
const FINALS_META = [
  { year: "2022", winner: "747", loser: "901", w: 68105, l: 56876 },
  { year: "2023", winner: "128 Grazer", loser: "32 Chunk", w: 108321, l: 23134 },
  { year: "2024", winner: "128 Grazer", loser: "32 Chunk", w: 71248, l: 30468 },
  { year: "2025", winner: "32 Chunk", loser: "856", w: 96350, l: 63725 },
  { year: "2026", winner: "89 Backpack", loser: "910", w: 103334, l: 98253 },
] as const;

/** 2022 Holly spam (Guardian ~9k) vs 2026 finals margin — validated from CSVs */
const SPAM_2022 = 9000;
const SEMI_2022_POST_PAIR = 37940 + 30430; // 68,370 cleaned
const SEMI_2022_PRE_PAIR = SEMI_2022_POST_PAIR + SPAM_2022; // 77,370 implied
const FINALS_2026_PAIR = 103334 + 98253; // 201,587
const FINALS_2026_MARGIN = 5081;

export default function FatBearWeekVoting() {
  const [view, setView] = useCanvasState<ViewKey>("yearView", "all");
  const isAll = view === "all";
  const year = isAll ? null : (view as YearKey);

  const openerSeries = isAll
    ? (Object.keys(VS_OPENER) as YearKey[]).map((y) => ({
        name: y,
        data: VS_OPENER[y],
        tone: VS_OPENER_TONE[y],
      }))
    : [
        {
          name: year!,
          data: VS_OPENER[year!],
          tone: VS_OPENER_TONE[year!],
        },
      ];

  const gapLabels = isAll ? ALL_GAP_LABELS : GAPS_BY_YEAR[year!].labels;
  const gapData = isAll ? ALL_GAP_DATA : GAPS_BY_YEAR[year!].data;

  const yoySeries = isAll
    ? YOY_SERIES
    : year === "2022"
      ? []
      : YOY_SERIES.filter((s) => s.name.startsWith(year!));

  return (
    <Stack gap={24} style={{ padding: 24, maxWidth: 1100 }}>
      <Stack gap={10}>
        <img
          src={BACKPACK_IMG}
          alt="89 Backpack, Fat Bear Week 2026 champion"
          style={{
            width: "100%",
            maxHeight: 360,
            objectFit: "cover",
            objectPosition: "center",
            display: "block",
          }}
        />
        <Text tone="secondary" style={{ fontSize: 12 }}>
          89 Backpack — Fat Bear Week 2026 champion. Photo:{" "}
          <Link href={BACKPACK_IMG}>explore.org media</Link>
          {" · "}
          <Link href={FBW}>Fat Bear Week on explore.org</Link>
        </Text>
        <H1>Was Backpack’s win too close to trust?</H1>
        <Text>
          Fat Bear Week 2026 finals came down to{" "}
          <Text weight="semibold">910</Text> vs{" "}
          <Text weight="semibold">89 Backpack</Text>: Backpack 103,334 —
          910 98,253. Margin only{" "}
          <Text weight="semibold">5,081 votes</Text> (~2.5% of the pair). That
          razor-thin finish made me suspicious — specifically that something
          might have been off in the voting to push Backpack over the line.
          Official bracket and results:{" "}
          <Link href={FBW}>explore.org/fat-bear-week</Link>.
        </Text>
        <Text>
          I pulled multi-year pair totals (Wayback + live Results tables),
          looked at same-day gaps, turnout vs each year’s opener, and
          year-over-year shapes. Organizers{" "}
          <Link href="https://www.theguardian.com/us-news/2022/oct/11/alaska-fat-bear-week-voting-scandal">
            did catch real stuffing in 2022
          </Link>{" "}
          (~9k spam votes for Holly, discarded). On the public 2022–2026 numbers
          alone, though, I <Text weight="semibold">cannot prove</Text> fraud in
          the 2026 final — close races and midweek turnout dips also show up in
          clean-looking years.
        </Text>
        <Callout tone="warning" title="Bottom line">
          Suspicion stands; proof does not — at least not from these published
          tallies. But 2022’s ~9k discarded spam already exceeds the 2026
          margin in votes and as a share of its matchup. Given that precedent
          and this year’s razor-thin final, Fat Bear Week / Katmai /
          explore.org should recount and analyze the 2026 finals votes and
          publish what they find — the way they did in 2022.
        </Callout>
      </Stack>

      <Grid columns={4} gap={12}>
        <Stat value={fmt(103334)} label="Backpack (finals)" tone="success" />
        <Stat value={fmt(98253)} label="910 (finals)" tone="info" />
        <Stat value={fmt(5081)} label="Margin" tone="warning" />
        <Stat value="2022" label="Only confirmed stuffing year" tone="danger" />
      </Grid>

      <Callout tone="danger" title="Documented fraud: 2022 semi-final (context)">
        Official cleaned totals after discard: 747 37,940 vs Holly 30,430
        (pair {fmt(SEMI_2022_POST_PAIR)}). Guardian: ~{fmt(SPAM_2022)} fake
        Holly votes discarded — larger than the entire 2026 finals margin (
        {fmt(FINALS_2026_MARGIN)} / 2.5% of pair). Source:{" "}
        <Link href="https://www.theguardian.com/us-news/2022/oct/11/alaska-fat-bear-week-voting-scandal">
          The Guardian, 11 Oct 2022
        </Link>
        . Organizers can detect stuffing and publish corrections. No such
        report yet for 2026 — and this year’s final is thin enough that spam
        of that size would have flipped it.
      </Callout>

      <Row gap={12} align="center">
        <Text weight="semibold">Chart view</Text>
        <Select
          value={view}
          onChange={(v) => setView(v as ViewKey)}
          options={[
            { value: "all", label: "All years (2022–2026)" },
            { value: "2022", label: "2022 only" },
            { value: "2023", label: "2023 only" },
            { value: "2024", label: "2024 only" },
            { value: "2025", label: "2025 only" },
            { value: "2026", label: "2026 only" },
          ]}
        />
      </Row>

      <Divider />

      <Stack gap={8}>
        <H2>Finals margins by year — winner vs loser</H2>
        <Callout tone="info" title="What this shows">
          Absolute vote gap (winner − loser) and that gap as % of the finals
          pair total. Chronological: 2022 left → 2026 right.
        </Callout>
        <Grid columns={2} gap={16}>
          <BarChart
            categories={[...FINALS_YEARS]}
            series={[
              {
                name: "Margin (votes)",
                data: [...FINALS_MARGINS],
                tone: "warning",
              },
            ]}
            height={260}
            showValues
          />
          <BarChart
            categories={[...FINALS_YEARS]}
            series={[
              {
                name: "Margin (% of pair)",
                data: [...FINALS_MARGIN_PCT],
                tone: "info",
              },
            ]}
            height={260}
            valueSuffix="%"
            showValues
          />
        </Grid>
        <Table
          headers={[
            "Year",
            "Winner",
            "Winner votes",
            "Loser",
            "Loser votes",
            "Margin",
            "% of pair",
          ]}
          columnAlign={[
            "left",
            "left",
            "right",
            "left",
            "right",
            "right",
            "right",
          ]}
          rows={FINALS_META.map((r, i) => [
            r.year,
            r.winner,
            fmt(r.w),
            r.loser,
            fmt(r.l),
            fmt(FINALS_MARGINS[i]),
            `${FINALS_MARGIN_PCT[i]}%`,
          ])}
          striped
        />
        <Callout tone="warning" title="What’s anomalous">
          <Text>
            <Text weight="semibold">2026 / Backpack</Text> is the clear
            outlier on closeness: margin only 5,081 votes (2.5% of the
            pair) — by far the thinnest final in this set. Next-closest is
            2022 / 747 at ~9%.
          </Text>
          <Text>
            <Text weight="semibold">2023 / Grazer</Text> is the opposite
            outlier: a blowout (85,187 votes, ~65% of the pair) over Chunk.
            2024 Grazer also wide (~40%). 2025 Chunk mid-pack (~20%).
          </Text>
          <Text>
            A thin margin is suspicious-looking but not proof of fraud — it
            can just mean a competitive final. Still, 2026 sits alone at the
            bottom of the closeness scale.
          </Text>
        </Callout>
        <Callout tone="danger" title="2022 spam vs 2026 margin — why a recount is warranted">
          <Text>
            Documented 2022 Holly stuffing was ~{fmt(SPAM_2022)} fake votes
            (Guardian). 2026 finals margin is only {fmt(FINALS_2026_MARGIN)} on
            a pair of {fmt(FINALS_2026_PAIR)} (~2.5%). Absolute: ~
            {fmt(SPAM_2022)} &gt; {fmt(FINALS_2026_MARGIN)} by ~
            {fmt(SPAM_2022 - FINALS_2026_MARGIN)} votes (~1.8× the margin).
          </Text>
          <Text>
            As a share of the matchup: ~9k was ~
            {((100 * SPAM_2022) / SEMI_2022_POST_PAIR).toFixed(1)}% of the
            cleaned 2022 semi pair ({fmt(SEMI_2022_POST_PAIR)}) / ~
            {((100 * SPAM_2022) / SEMI_2022_PRE_PAIR).toFixed(1)}% of the
            implied pre-discard pair ({fmt(SEMI_2022_PRE_PAIR)}). Drop that
            same ~9k onto the 2026 finals pair and it is still ~
            {((100 * SPAM_2022) / FINALS_2026_PAIR).toFixed(1)}% — larger than
            the 2.5% winning margin. Spam of that size would have flipped
            Backpack vs 910.
          </Text>
          <Text>
            Given how close 2026 was, and that organizers already found and
            discarded stuffing once, Fat Bear Week / Katmai / explore.org
            should re-check and analyze the 2026 finals ballots — same
            integrity pass they ran in 2022 — and publish what they find.
            Public tallies alone still do not prove 2026 fraud; they do show
            the race is thin enough that known past spam would have decided it.
          </Text>
          <Table
            headers={["Compare", "Votes", "% of pair"]}
            columnAlign={["left", "right", "left"]}
            rows={[
              [
                "2022 Holly spam (Guardian ~9k)",
                `~${fmt(SPAM_2022)}`,
                `~${((100 * SPAM_2022) / SEMI_2022_PRE_PAIR).toFixed(1)}–${((100 * SPAM_2022) / SEMI_2022_POST_PAIR).toFixed(1)}% of 2022 semi`,
              ],
              [
                "2026 finals margin (Backpack − 910)",
                fmt(FINALS_2026_MARGIN),
                `${((100 * FINALS_2026_MARGIN) / FINALS_2026_PAIR).toFixed(1)}% of ${fmt(FINALS_2026_PAIR)}`,
              ],
              [
                "~9k spam as % of 2026 finals pair",
                `~${fmt(SPAM_2022)}`,
                `~${((100 * SPAM_2022) / FINALS_2026_PAIR).toFixed(1)}% of ${fmt(FINALS_2026_PAIR)}`,
              ],
            ]}
            striped
          />
        </Callout>
      </Stack>

      <Stack gap={8}>
        <H2>
          How busy vs opener
          {isAll ? " (all years)" : ` (${year})`}
        </H2>
        <Callout tone="info" title="How to read">
          Not raw counts. Each year scaled so its own opening-day average pair
          total = 100. Later stages = % of that opener. Guide line at 100 =
          same as opener. Grouped bars are chronological: 2022 left → 2026
          right.
        </Callout>
        <BarChart
          categories={[...STAGES]}
          series={openerSeries}
          height={320}
          showValues
          referenceLines={[
            { value: 100, label: "Same as opener", tone: "neutral" },
          ]}
        />
        <Text tone="secondary" style={{ fontSize: 12 }}>
          index = 100 × (day avg ÷ opening-day avg)
        </Text>
      </Stack>

      {yoySeries.length > 0 ? (
        <Stack gap={8}>
          <H2>
            Year-over-year vs prior year
            {isAll ? "" : ` (${year})`}
          </H2>
          <Callout tone="info" title="How to read">
            At each stage: this year ÷ prior year same stage. 100 = flat YoY.
            Bars left→right chronological (2023 vs 2022 first).
          </Callout>
          <BarChart
            categories={[...STAGES]}
            series={yoySeries}
            height={320}
            showValues
            referenceLines={[
              { value: 100, label: "Same as prior year", tone: "neutral" },
            ]}
          />
          <Text tone="secondary" style={{ fontSize: 12 }}>
            2025 Mid vs 2024 Mid (~255) is huge mainly because 2024 Mid was a
            deep trough (~50k), not because 2025 Mid was absurd (~128k).
          </Text>
        </Stack>
      ) : (
        <Callout tone="info" title="No YoY for 2022">
          2022 is the first year with raw matchup tables here — nothing prior to
          compare against. Switch to All years or 2023+ for YoY bars.
        </Callout>
      )}

      <Stack gap={8}>
        <H2>
          Same-day missing votes
          {isAll ? " (all dates, oldest → newest)" : ` (${year}, by date)`}
        </H2>
        <Text tone="secondary">
          Gap = max pair − min pair that day, as % of max. Dates run left →
          right chronologically. High gap can mean poll abandonment; alone ≠
          stuffing.
        </Text>
        <BarChart
          categories={gapLabels}
          series={[
            {
              name: "Gap as % of day's max pair",
              data: gapData,
              tone: "warning",
            },
          ]}
          height={280}
          valueSuffix="%"
          referenceLines={[{ value: 10, label: "10% flag", tone: "danger" }]}
        />
      </Stack>

      <Grid columns={2} gap={16}>
        <Card>
          <CardHeader>What the data can and can’t say</CardHeader>
          <CardBody>
            <Stack gap={10}>
              <H3>2026 finals suspicion</H3>
              <Text>
                Backpack beat 910 by 5,081 votes. Close enough to raise an
                eyebrow — not close enough, by itself, to prove stuffing.
              </Text>
              <H3>What historical patterns show</H3>
              <Text>
                Midweek dips and finals rebounds recur. Same-day gaps usually
                stay modest on two-poll days. 2022 proves fraud is possible —
                and that cleaned Results pages won’t show the attack spike.
              </Text>
              <H3>Waiting on organizers</H3>
              <Text>
                Without a Fat Bear Week / Katmai / explore.org report (like
                2022), public tallies alone don’t confirm 2026 fraud.
              </Text>
            </Stack>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>2022 Oct 9 math check</CardHeader>
          <CardBody>
            <Stack gap={8}>
              <Table
                headers={["Version", "747", "Holly"]}
                columnAlign={["left", "right", "right"]}
                rows={[
                  ["Archived official", fmt(37940), fmt(30430)],
                  ["Implied pre-discard (~+9k Holly)", fmt(37940), "~39,430"],
                ]}
                striped
              />
              <Text tone="secondary">
                Implication only — Guardian states ~9,000; pre-discard dump not
                on Results page.
              </Text>
            </Stack>
          </CardBody>
        </Card>
      </Grid>

      <Divider />

      <Stack gap={10}>
        <H2>Sources &amp; files</H2>
        <Text tone="secondary">
          Secondary detail for verification. Primary story is above; links and
          file paths live here.
        </Text>
        <Table
          headers={["Year", "Results snapshot", "Repo CSV", "Sum vs Total"]}
          rows={WAYBACK_ROWS.map((r) => [
            r.year,
            <Link href={r.href}>{r.label}</Link>,
            <Link href={`${RAW}/${r.csv}`}>{r.csv}</Link>,
            r.delta,
          ])}
          striped
        />
        <Table
          headers={["File / page", "Link"]}
          rows={[
            [
              "Repository",
              <Link href={REPO}>{REPO}</Link>,
            ],
            [
              "SOURCES.md",
              <Link href={`${RAW}/SOURCES.md`}>SOURCES.md</Link>,
            ],
            [
              "All matchups",
              <Link href={`${RAW}/data/matchups_all_years.csv`}>
                data/matchups_all_years.csv
              </Link>,
            ],
            [
              "Daily integrity gaps",
              <Link href={`${RAW}/data/daily_integrity.csv`}>
                data/daily_integrity.csv
              </Link>,
            ],
            [
              "Guardian 2022 scandal",
              <Link href="https://www.theguardian.com/us-news/2022/oct/11/alaska-fat-bear-week-voting-scandal">
                theguardian.com/…/alaska-fat-bear-week-voting-scandal
              </Link>,
            ],
            [
              "Hall of Champions",
              <Link href="https://explore.org/hall-of-champions">
                explore.org/hall-of-champions
              </Link>,
            ],
            [
              "Reed Quest CSVs (year-level)",
              <Link href="https://github.com/data-at-reed-college/quest/tree/main/fat_bear_week/data">
                data-at-reed-college/quest/…/fat_bear_week/data
              </Link>,
            ],
            [
              "GitHub Pages site",
              <Link href="https://garrypolley.github.io/fat-bear-week-analysis/">
                garrypolley.github.io/fat-bear-week-analysis
              </Link>,
            ],
          ]}
          striped
        />
        <Text tone="secondary" style={{ fontSize: 12 }}>
          Unit of analysis = pair total (votes A + votes B). explore.org does
          not publish a matchup CSV; tables transcribed from live / Wayback
          Results HTML. 2021 Wayback snapshot has no raw matchup table.
        </Text>
      </Stack>
    </Stack>
  );
}
