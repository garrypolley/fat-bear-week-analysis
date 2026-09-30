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
      <Stack gap={8}>
        <H1>Fat Bear Week — looking for vote fraud</H1>
        <Text>
          I started from a suspicion: looking at Fat Bear Week totals, something
          felt off — turnout swinging hard midweek, then snapping back for
          finals. That pattern made me wonder whether vote stuffing (or other
          ballot issues) might be hiding in the numbers.
        </Text>
        <Text>
          Digging in, I found organizers had already caught real fraud in 2022.
          The{" "}
          <Link href="https://www.theguardian.com/us-news/2022/oct/11/alaska-fat-bear-week-voting-scandal">
            Guardian
          </Link>{" "}
          reported ~9,000 spam votes for 435 Holly in a semi-final; Katmai
          discarded them (“our ballot box, too, has been stuffed”). The Wayback
          Results tables show the cleaned totals, not the stuffed intermediate.
        </Text>
        <Text>
          So this page is the follow-through: year-over-year and within-year
          pair totals (A+B per matchup), same-day missing votes, and turnout
          shape vs each year’s opener — to see what looks like normal attention
          cycles versus what looks anomalous.
        </Text>
      </Stack>

      <Callout tone="danger" title="Documented fraud: 2022 semi-final">
        Official cleaned totals after discard: 747 37,940 vs Holly 30,430.
        Source:{" "}
        <Link href="https://www.theguardian.com/us-news/2022/oct/11/alaska-fat-bear-week-voting-scandal">
          The Guardian, 11 Oct 2022
        </Link>
        .
      </Callout>

      <Grid columns={4} gap={12}>
        <Stat value="2022" label="Only confirmed stuffing year" tone="danger" />
        <Stat value="~9k" label="Fake Holly votes removed" tone="warning" />
        <Stat value="16.4%" label="Largest same-day gap (2026 open)" tone="info" />
        <Stat value="2021→" label="No raw table — start at 2022" />
      </Grid>

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
          <CardHeader>Fraud vs noise</CardHeader>
          <CardBody>
            <Stack gap={10}>
              <H3>Confirmed (2022)</H3>
              <Text>
                Short-window spam for Holly; discarded; 747 advanced. Public
                Wayback Results = official after cleanup.
              </Text>
              <H3>Not automatically fraud</H3>
              <Text>
                Midweek dips and finals bounce recur every year. Same-day gaps
                usually &lt;10% on two-poll days. 2026 open 16.4% fits four-poll
                abandonment.
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
