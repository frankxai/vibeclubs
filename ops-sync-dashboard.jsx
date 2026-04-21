import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import _ from "lodash";

// === DATA: Today's execution (April 16, 2026) ===
const sessions = [
  {
    id: 1,
    name: "Machine Performance",
    duration: "~2h",
    items: [
      "WSL config 8GB→2GB",
      "SessionStart RAM hook",
      "Live RAM in statusline",
      "6-layer resource management",
    ],
    linearIssue: "ARC-137",
    linearStatus: "Done",
    repo: "Arcanea",
    category: "Infrastructure",
  },
  {
    id: 2,
    name: "OSS Pivot Strategy",
    duration: "~1.5h",
    items: [
      "Business model rewrite (free-first MIT)",
      "GitHub Projects V2 as mgmt tool",
      "Dashboard template = #1 gap",
      "LemonSqueezy over Gumroad",
    ],
    linearIssue: "ARC-141",
    linearStatus: "Done",
    repo: "Arcanea",
    category: "Strategy",
  },
  {
    id: 3,
    name: "Arcanea Mascot System",
    duration: "~2h",
    items: [
      "8-variant <ArcaneMascot> component",
      "Chat bubble, hero, CTA, 404 integration",
      "mascot-float keyframe animation",
      "Build verified, pushed to main",
    ],
    linearIssue: "ARC-136",
    linearStatus: "Done",
    repo: "Arcanea",
    category: "Design",
  },
  {
    id: 4,
    name: "GenCreator.ai Deploy",
    duration: "~3h",
    items: [
      "Whop webhook → Notion duplicate",
      "Middleware auth gate",
      "Health endpoint + scripts",
      "preflight / smoke / go-live / provision",
    ],
    linearIssue: "ARC-139",
    linearStatus: "In Progress",
    repo: "GenCreator",
    category: "Deployment",
  },
  {
    id: 5,
    name: "Author Studio v2",
    duration: "~2h",
    items: [
      "All 8 tasks shipped",
      "Workflow docs on dashboard",
      "Quality alignment verified",
      "Routes + API confirmed",
    ],
    linearIssue: "ARC-138",
    linearStatus: "Done",
    repo: "Arcanea",
    category: "Feature",
  },
  {
    id: 6,
    name: "/handover + Wisdom",
    duration: "~1.5h",
    items: [
      "5-phase handover skill",
      "Starlight Vault routing (6 vaults)",
      "wisdom.jsonl created",
      "session-end hook bridge",
    ],
    linearIssue: "ARC-140",
    linearStatus: "Done",
    repo: "Arcanea",
    category: "Tooling",
  },
];

const linearOverdue = [
  { id: "ARC-109", title: "BOIP Trademark Filing", due: "Apr 16", status: "Backlog", priority: "Urgent", action: "Manual — file at boip.int" },
  { id: "ARC-113", title: "Beehiiv Newsletter Setup", due: "Apr 16", status: "Backlog", priority: "High", action: "Manual — create account" },
  { id: "ARC-86", title: "Rename @frankxeth on X", due: "Apr 5", status: "In Progress", priority: "Urgent", action: "Manual — X settings" },
  { id: "ARC-88", title: "Post ACOS v10 thread", due: "Apr 5", status: "In Progress", priority: "Urgent", action: "Manual — post from queue" },
  { id: "ARC-110", title: "frankx.ai/tools affiliate", due: "Apr 15", status: "Backlog", priority: "Urgent", action: "Build page" },
  { id: "ARC-99", title: "Landing pages (3)", due: "Apr 15", status: "Backlog", priority: "Urgent", action: "Build pages" },
];

const gateConditions = [
  { condition: "GenCreator.ai live with Whop payment", status: "building", pct: 70 },
  { condition: "3+ templates on Vercel marketplace", status: "building", pct: 66 },
  { condition: "First €1 revenue", status: "blocked", pct: 0 },
  { condition: "arcanea-templates meta-repo", status: "not-started", pct: 0 },
  { condition: "LemonSqueezy OR Whop storefront", status: "building", pct: 40 },
];

const weekComparison = [
  { domain: "Goal #4", lastWeek: 3, thisWeek: 9 },
  { domain: "Revenue", lastWeek: 1, thisWeek: 5 },
  { domain: "Content", lastWeek: 2, thisWeek: 3 },
];

const COLORS = {
  bg: "#0a0a0f",
  card: "rgba(255,255,255,0.03)",
  border: "rgba(255,255,255,0.06)",
  text: "#e4e4e7",
  muted: "rgba(255,255,255,0.4)",
  teal: "#00bcd4",
  gold: "#ffd700",
  red: "#ef4444",
  green: "#22c55e",
  blue: "#3b82f6",
  purple: "#a855f7",
  orange: "#f97316",
};

const categoryColors = {
  Infrastructure: COLORS.blue,
  Strategy: COLORS.purple,
  Design: COLORS.gold,
  Deployment: COLORS.orange,
  Feature: COLORS.green,
  Tooling: COLORS.teal,
};

const statusBadge = (status) => {
  const colors = {
    Done: { bg: "rgba(34,197,94,0.15)", text: "#22c55e", border: "rgba(34,197,94,0.3)" },
    "In Progress": { bg: "rgba(59,130,246,0.15)", text: "#3b82f6", border: "rgba(59,130,246,0.3)" },
    Backlog: { bg: "rgba(255,255,255,0.05)", text: "rgba(255,255,255,0.4)", border: "rgba(255,255,255,0.1)" },
  };
  const c = colors[status] || colors.Backlog;
  return (
    <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 500, background: c.bg, color: c.text, border: `1px solid ${c.border}` }}>
      {status}
    </span>
  );
};

const GlassCard = ({ children, style = {} }) => (
  <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: 20, backdropFilter: "blur(8px)", ...style }}>
    {children}
  </div>
);

const StatBox = ({ label, value, sub, color = COLORS.teal }) => (
  <GlassCard style={{ textAlign: "center", flex: 1, minWidth: 140 }}>
    <div style={{ fontSize: 28, fontWeight: 700, color, lineHeight: 1.1 }}>{value}</div>
    <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 4 }}>{label}</div>
    {sub && <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 2, opacity: 0.7 }}>{sub}</div>}
  </GlassCard>
);

const ProgressBar = ({ pct, color = COLORS.teal }) => (
  <div style={{ width: "100%", height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 3, overflow: "hidden" }}>
    <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 3, transition: "width 0.5s ease" }} />
  </div>
);

export default function OpsSyncDashboard() {
  const [activeTab, setActiveTab] = useState("today");

  const tabs = [
    { id: "today", label: "Today's Execution" },
    { id: "linear", label: "Linear Health" },
    { id: "gate", label: "Gate 0" },
    { id: "week", label: "Week Trend" },
  ];

  const doneCount = sessions.filter((s) => s.linearStatus === "Done").length;
  const inProgressCount = sessions.filter((s) => s.linearStatus === "In Progress").length;
  const totalItems = sessions.reduce((sum, s) => sum + s.items.length, 0);

  const categoryData = useMemo(() => {
    const grouped = _.groupBy(sessions, "category");
    return Object.entries(grouped).map(([name, items]) => ({
      name,
      count: items.reduce((s, i) => s + i.items.length, 0),
      fill: categoryColors[name] || COLORS.teal,
    }));
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, color: COLORS.text, fontFamily: "'Inter', -apple-system, sans-serif", padding: "24px 20px" }}>
      {/* Header */}
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 4 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: COLORS.teal, margin: 0, fontFamily: "'Space Grotesk', sans-serif" }}>
            Arcanea Ops Sync
          </h1>
          <span style={{ fontSize: 12, color: COLORS.muted }}>April 16, 2026 — 23:45 CET</span>
        </div>
        <p style={{ fontSize: 13, color: COLORS.muted, margin: "0 0 20px" }}>
          Execution ↔ Tracking bridge. 6 Claude Code sessions → Linear + Notion.
        </p>

        {/* Stats Row */}
        <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
          <StatBox label="Sessions" value="6" sub="parallel execution" />
          <StatBox label="Items Shipped" value={totalItems} sub="across all sessions" color={COLORS.green} />
          <StatBox label="Linear Closed" value={doneCount} sub={`+${inProgressCount} in progress`} color={COLORS.gold} />
          <StatBox label="Overdue" value={linearOverdue.length} sub="need attention" color={COLORS.red} />
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 2, marginBottom: 20, background: "rgba(255,255,255,0.03)", borderRadius: 6, padding: 3 }}>
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                flex: 1, padding: "8px 12px", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 13, fontWeight: 500, transition: "all 0.2s",
                background: activeTab === t.id ? "rgba(0,188,212,0.15)" : "transparent",
                color: activeTab === t.id ? COLORS.teal : COLORS.muted,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab: Today's Execution */}
        {activeTab === "today" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
              {sessions.map((s) => (
                <GlassCard key={s.id} style={{ borderLeft: `3px solid ${categoryColors[s.category]}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>{s.name}</span>
                    {statusBadge(s.linearStatus)}
                  </div>
                  <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 11, color: COLORS.muted, padding: "1px 6px", background: "rgba(255,255,255,0.04)", borderRadius: 3 }}>{s.linearIssue}</span>
                    <span style={{ fontSize: 11, color: COLORS.muted, padding: "1px 6px", background: "rgba(255,255,255,0.04)", borderRadius: 3 }}>{s.repo}</span>
                    <span style={{ fontSize: 11, color: COLORS.muted, padding: "1px 6px", background: "rgba(255,255,255,0.04)", borderRadius: 3 }}>{s.duration}</span>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: 16, listStyle: "none" }}>
                    {s.items.map((item, i) => (
                      <li key={i} style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginBottom: 3, position: "relative", paddingLeft: 4 }}>
                        <span style={{ position: "absolute", left: -12, color: categoryColors[s.category], fontSize: 8 }}>●</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              ))}
            </div>

            {/* Category Distribution */}
            <GlassCard style={{ marginTop: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 12px", color: COLORS.muted }}>Work Distribution by Category</h3>
              <div style={{ height: 200 }}>
                <ResponsiveContainer>
                  <BarChart data={categoryData} layout="vertical" margin={{ left: 80, right: 20, top: 5, bottom: 5 }}>
                    <XAxis type="number" tick={{ fill: COLORS.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="name" tick={{ fill: COLORS.text, fontSize: 12 }} axisLine={false} tickLine={false} width={75} />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                      {categoryData.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} fillOpacity={0.7} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </div>
        )}

        {/* Tab: Linear Health */}
        {activeTab === "linear" && (
          <div>
            <GlassCard style={{ marginBottom: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 4px" }}>Tonight's Sync</h3>
              <p style={{ fontSize: 12, color: COLORS.muted, margin: "0 0 12px" }}>
                All 6 sessions now have corresponding Linear issues. ARC-101 rescoped for OSS pivot (deadline → Apr 30).
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 8 }}>
                {sessions.map((s) => (
                  <div key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 10px", background: "rgba(255,255,255,0.02)", borderRadius: 4 }}>
                    <span style={{ fontSize: 12, color: COLORS.teal }}>{s.linearIssue}</span>
                    {statusBadge(s.linearStatus)}
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard>
              <h3 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 4px", color: COLORS.red }}>Overdue Issues ({linearOverdue.length})</h3>
              <p style={{ fontSize: 12, color: COLORS.muted, margin: "0 0 12px" }}>
                These need human action — not automatable by Claude Code sessions.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {linearOverdue.map((issue) => (
                  <div key={issue.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.1)", borderRadius: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: COLORS.red, minWidth: 65 }}>{issue.id}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{issue.title}</div>
                      <div style={{ fontSize: 11, color: COLORS.muted }}>Due {issue.due} · {issue.action}</div>
                    </div>
                    {statusBadge(issue.status)}
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        )}

        {/* Tab: Gate 0 */}
        {activeTab === "gate" && (
          <div>
            <GlassCard style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: COLORS.gold }}>Gate 0: First Flame</h3>
                <span style={{ fontSize: 12, color: COLORS.muted }}>Deadline: April 30 (rescoped)</span>
              </div>
              <p style={{ fontSize: 13, color: COLORS.muted, margin: "0 0 16px" }}>
                Strategy pivot: OSS-first, free-first. Revenue deferred until quality is unambiguous.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {gateConditions.map((g, i) => {
                  const color = g.status === "blocked" ? COLORS.red : g.status === "building" ? COLORS.teal : COLORS.muted;
                  const icon = g.status === "blocked" ? "✗" : g.status === "building" ? "◐" : "○";
                  return (
                    <div key={i}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                        <span style={{ fontSize: 13 }}>
                          <span style={{ color, marginRight: 8 }}>{icon}</span>
                          {g.condition}
                        </span>
                        <span style={{ fontSize: 12, color, fontWeight: 600 }}>{g.pct}%</span>
                      </div>
                      <ProgressBar pct={g.pct} color={color} />
                    </div>
                  );
                })}
              </div>
              <div style={{ marginTop: 16, padding: 12, background: "rgba(255,215,0,0.05)", border: "1px solid rgba(255,215,0,0.1)", borderRadius: 6 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.gold, marginBottom: 4 }}>Overall Gate Progress</div>
                <ProgressBar pct={35} color={COLORS.gold} />
                <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 4 }}>35% — GenCreator go-live is the critical path</div>
              </div>
            </GlassCard>

            <GlassCard>
              <h3 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 12px" }}>Next Actions (Priority Order)</h3>
              {[
                { n: 1, text: "GenCreator go-live: create repo, link Vercel, set env vars, run go-live.ps1", urgency: "high" },
                { n: 2, text: "BOIP Trademark filing at boip.int (€514-757)", urgency: "high" },
                { n: 3, text: "Start arcanea-dashboard-template (biggest market gap)", urgency: "medium" },
                { n: 4, text: "Create arcanea-templates meta-repo with deploy buttons", urgency: "medium" },
                { n: 5, text: "Set up LemonSqueezy OR Whop storefront account", urgency: "medium" },
              ].map((a) => (
                <div key={a.n} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10, padding: "8px 10px", background: "rgba(255,255,255,0.02)", borderRadius: 4 }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: a.urgency === "high" ? COLORS.red : COLORS.teal, minWidth: 20 }}>{a.n}</span>
                  <span style={{ fontSize: 13 }}>{a.text}</span>
                </div>
              ))}
            </GlassCard>
          </div>
        )}

        {/* Tab: Week Trend */}
        {activeTab === "week" && (
          <div>
            <GlassCard style={{ marginBottom: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 4px" }}>Week-over-Week Recovery</h3>
              <p style={{ fontSize: 12, color: COLORS.muted, margin: "0 0 16px" }}>Last week collapsed to 6/30. This week (mid): 17/30. +11 point recovery.</p>
              <div style={{ height: 220 }}>
                <ResponsiveContainer>
                  <BarChart data={weekComparison} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
                    <XAxis dataKey="domain" tick={{ fill: COLORS.text, fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 10]} tick={{ fill: COLORS.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ background: "#1a1a2e", border: `1px solid ${COLORS.border}`, borderRadius: 6, fontSize: 12 }}
                      labelStyle={{ color: COLORS.text }}
                    />
                    <Bar dataKey="lastWeek" fill="rgba(255,255,255,0.1)" radius={[4, 4, 0, 0]} name="Last Week" />
                    <Bar dataKey="thisWeek" fill={COLORS.teal} fillOpacity={0.7} radius={[4, 4, 0, 0]} name="This Week" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            <GlassCard style={{ marginBottom: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 12px" }}>The Pattern</h3>
              <div style={{ fontSize: 13, lineHeight: 1.7, color: "rgba(255,255,255,0.7)" }}>
                <p style={{ margin: "0 0 12px" }}>
                  <strong style={{ color: COLORS.teal }}>Problem:</strong> Claude Code sessions produce massive output that never reaches tracking surfaces. Work is invisible in Linear and Notion while the codebase advances rapidly.
                </p>
                <p style={{ margin: "0 0 12px" }}>
                  <strong style={{ color: COLORS.gold }}>Root cause:</strong> No automated bridge between git commits and Linear/Notion. The /handover skill captures wisdom but is opt-in per session. Daily Pulse requires manual trigger.
                </p>
                <p style={{ margin: 0 }}>
                  <strong style={{ color: COLORS.green }}>Solution built tonight:</strong> This Cowork session synced all 6 sessions to Linear (7 issues created/updated) and Notion (Daily Pulse + Weekly Scorecard). The /handover skill now routes to Starlight Vaults automatically. Next: scheduled daily sync task.
                </p>
              </div>
            </GlassCard>

            <GlassCard>
              <h3 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 8px" }}>Execution vs Tracking (This Session)</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 8 }}>Before Sync</div>
                  {[
                    "0 of 6 sessions in Linear",
                    "No Daily Pulse since Apr 13",
                    "No Weekly Scorecard for this week",
                    "ARC-101 still showed old revenue plan",
                    "6 overdue issues unaddressed",
                  ].map((t, i) => (
                    <div key={i} style={{ fontSize: 12, color: COLORS.red, marginBottom: 4, paddingLeft: 12, position: "relative" }}>
                      <span style={{ position: "absolute", left: 0 }}>✗</span>{t}
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 8 }}>After Sync</div>
                  {[
                    "6/6 sessions have Linear issues",
                    "April 16 Daily Pulse created",
                    "Week of Apr 14-20 Scorecard live",
                    "ARC-101 rescoped for OSS pivot",
                    "Gate 0 conditions rewritten",
                  ].map((t, i) => (
                    <div key={i} style={{ fontSize: 12, color: COLORS.green, marginBottom: 4, paddingLeft: 12, position: "relative" }}>
                      <span style={{ position: "absolute", left: 0 }}>✓</span>{t}
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </div>
        )}

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 24, padding: "12px 0", borderTop: `1px solid ${COLORS.border}` }}>
          <span style={{ fontSize: 11, color: COLORS.muted }}>
            Arcanea Ops Sync Dashboard · Built by Cowork · {new Date().toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </span>
        </div>
      </div>
    </div>
  );
}