# Lovable Prompt — JobFit UI

Copy everything below the line and paste it into Lovable.

---

## Prompt

Build a complete frontend for an AI-powered resume analysis platform called **JobFit**. The app connects to an existing backend API at `http://localhost:8000`. Use React + Vite + React Router. The design must follow the exact visual language described below — no shortcuts, no generic templates.

---

### DESIGN SYSTEM (follow this precisely)

The entire visual identity is inspired by [this Behance reference](https://www.behance.net/gallery/238300811/Meeting-Assistant-Web). Here is every detail you must replicate:

**Color Palette**

| Token | Value | Usage |
|---|---|---|
| `--bg-primary` | `#020107` | Page background — absolute space black, not grey, not #111 |
| `--bg-card` | `rgba(255, 255, 255, 0.03)` | Glassmorphic card surfaces |
| `--bg-card-hover` | `rgba(255, 255, 255, 0.06)` | Card hover state |
| `--accent-primary` | `#6C3AFF` | Primary buttons, active tab indicators, links |
| `--accent-primary-hover` | `#7D4FFF` | Button hover |
| `--accent-glow` | `rgba(108, 58, 255, 0.25)` | Box-shadow glow on interactive elements |
| `--accent-success` | `#34D399` | Matched skills, positive scores (above 75) |
| `--accent-warning` | `#FBBF24` | Medium priority, moderate scores (50-74) |
| `--accent-danger` | `#F87171` | Missing skills, high priority gaps, low scores |
| `--text-primary` | `#F1F0F5` | Headings, primary body text |
| `--text-secondary` | `#A09BB0` | Descriptions, secondary labels |
| `--text-muted` | `#5C5775` | Placeholders, disabled states |
| `--border-subtle` | `rgba(255, 255, 255, 0.06)` | Card borders, dividers |
| `--border-glow` | `rgba(108, 58, 255, 0.3)` | Glowing hover borders |

**Background Effects**

The page background is NOT a flat color. Behind the content, render two large, soft radial gradients (aurora blobs) that sit fixed behind everything:
- Top-left blob: radial-gradient centered at 20% 15%, color `rgba(108, 58, 255, 0.08)`, fading to transparent at about 50% radius.
- Bottom-right blob: radial-gradient centered at 80% 85%, color `rgba(59, 130, 246, 0.06)`, fading to transparent at about 50% radius.
These are fixed-position, behind all content, and give the page a subtle living depth. They should gently pulse (scale 1 to 1.15 and back) over an 8-second CSS animation loop.

**Typography**

- Font family: `"Plus Jakarta Sans"` from Google Fonts (import weights 400, 500, 600, 700, 800).
- Hero headline: 800 weight, 56px (desktop) / 36px (mobile), letter-spacing: -0.03em, line-height: 1.1. Color: `--text-primary`.
- Section headings (h2): 700 weight, 32px, letter-spacing: -0.02em.
- Card titles (h3): 600 weight, 18px.
- Body text: 400 weight, 15px, line-height: 1.65, color: `--text-secondary`.
- Labels, badges, tab text: 500 weight, 13px, uppercase, letter-spacing: 0.05em, color: `--text-muted`.

**Card / Surface Styling**

Every card and container must use this glassmorphic treatment:
- `background`: `var(--bg-card)`.
- `backdrop-filter: blur(24px)`.
- `border`: 1px solid `var(--border-subtle)`.
- `border-radius`: 20px (large cards), 14px (small pills/badges), 12px (buttons).
- `box-shadow`: none by default; on hover, add `0 0 30px var(--accent-glow)` and change border to `var(--border-glow)`.
- Transition: `all 0.3s cubic-bezier(0.4, 0, 0.2, 1)`.

**Buttons**

- Primary buttons: solid `var(--accent-primary)` background, white text, 600 weight, 14px, padding 14px 32px, border-radius 12px. On hover: lighten background to `--accent-primary-hover`, add `box-shadow: 0 0 20px var(--accent-glow)`, translate Y -2px. Transition 0.25s ease.
- Ghost / secondary buttons: transparent background, 1px solid `var(--border-subtle)`, color `--text-secondary`. On hover: border `var(--border-glow)`, subtle glow shadow.

**No Emojis Anywhere**

Do NOT use emoji characters anywhere in the UI. Instead, use Lucide React icons (`lucide-react` package) for all iconography. For example: `<FileText />` for documents, `<Target />` for skill gaps, `<Rocket />` for career roadmap, `<BarChart3 />` for analysis, `<Upload />` for file upload, `<CheckCircle2 />` for success states, `<AlertTriangle />` for warnings, `<BookOpen />` for resources, `<Copy />` for copy buttons, `<ArrowRight />` for CTAs. Icons should be stroked, 20px default, color inherits from parent text.

---

### PAGE 1: LANDING PAGE (route: `/`)

**Navbar** — Fixed at top, transparent by default. On scroll past 50px, apply glassmorphic background (`var(--bg-card)` + backdrop-blur 20px) and a bottom border `var(--border-subtle)`. Contains:
- Left: "JobFit" logotype (700 weight, 20px, letter-spacing -0.02em). The "Fit" portion is colored `var(--accent-primary)`.
- Right: Navigation links ("Features", "How It Works") and a ghost-style "Get Started" button (border only, on hover glows).

**Hero Section** — Full viewport height minus navbar, centered content with generous padding:
- A small pill-shaped badge above the headline: glassmorphic surface, text reads "AI-Powered Career Intelligence" in uppercase 12px 500 weight with a small sparkle Lucide icon. The pill has a subtle purple border-glow.
- Main headline: two lines — "Find Your Perfect" on line one, "Career Fit" on line two. "Career Fit" uses a CSS gradient text effect (`background: linear-gradient(135deg, #6C3AFF, #3B82F6); -webkit-background-clip: text; color: transparent`).
- Subtitle paragraph below: 18px, `--text-secondary`, max-width 540px, centered. Text: "Upload your resume, match it against any job description, and get an AI-generated skill gap analysis with a personalized learning roadmap."
- Two CTA buttons side by side: "Analyze Resume" (primary solid, with ArrowRight icon after text) and "See How It Works" (ghost button). Space them 16px apart, centered.
- Below the CTAs (about 80px down), render a large dashboard mockup preview. This is a decorative glassmorphic card (max-width 900px, centered) with a subtle 3D perspective tilt (`perspective: 1200px; transform: rotateX(8deg)`). Inside it, show three placeholder widget cells in a 3-column grid: "Match Score" (a ring/donut), "Skill Gaps" (a bar chart icon), "Learning Path" (a timeline icon). Each cell is a mini glassmorphic card. This entire mockup fades in and floats up on page load (`opacity 0→1, translateY 40px→0px, duration 1s, ease-out, delay 0.4s`).

**"How It Works" Section** — Below the hero, padded 120px top:
- Section heading: "How It Works" centered, with a short `--text-secondary` subtitle: "Three steps to bridge the gap between where you are and where you want to be."
- Three feature cards in a horizontal row (responsive → stacked on mobile). Each card is glassmorphic (full treatment from above). Inside each card:
  - A 48x48 rounded-square icon container with a very faint purple background (`rgba(108, 58, 255, 0.1)`), containing a Lucide icon (Upload for step 1, Target for step 2, Rocket for step 3) in `var(--accent-primary)`.
  - Card title (h3): "Upload Resume", "AI Skill Analysis", "Career Roadmap".
  - Description paragraph in `--text-secondary`.
  - A small step number badge in the top-right corner of the card: "01", "02", "03" in `--text-muted`, 12px, 600 weight.
- Cards should fade-up into view when they scroll into the viewport (IntersectionObserver, staggered 150ms delay between each card).

**Stats Bar** — A horizontal strip below features, glassmorphic surface spanning full width, with three stats side by side separated by subtle vertical dividers (`1px solid var(--border-subtle)`):
- "10,000+" Resumes Analyzed
- "95%" Accuracy Rate
- "200+" Job Roles Supported
- Numbers are 36px, 700 weight, gradient text (same purple-to-blue gradient). Labels are 13px, uppercase, `--text-muted`.
- Numbers should animate from 0 to target value using an ease-out-cubic counter when the section scrolls into view.

**Footer** — Simple: "Built with AI. Made for ambition." centered, `--text-muted`, 14px, padding 60px.

---

### PAGE 2: ANALYZE PAGE (route: `/analyze`)

Full-page centered layout (max-width 720px). This is the core input form.

**Page Header** — "Analyze Your Resume" (h1, 36px, 700 weight). Subtitle: "Upload your resume and provide a target job description to get started." in `--text-secondary`.

**Step Indicator** — A horizontal 3-step progress indicator below the header:
- Three circles (36px) connected by lines. Each circle contains a number (or a CheckCircle2 Lucide icon when completed).
- Labels below each circle: "Upload Resume", "Job Description", "Analyze".
- Active step's circle has `var(--accent-primary)` background with white number. Completed steps have `var(--accent-success)` background with a check icon. Upcoming steps have `var(--bg-card)` surface with `--text-muted` number.
- The connecting line fills with `var(--accent-primary)` as steps are completed (animated width transition).

**Step 1: File Upload Zone** — A large glassmorphic drop zone (dashed 2px border using `var(--border-subtle)`, border-radius 20px, min-height 200px):
- Center content: Upload Lucide icon (40px, `--text-muted`), text "Drag and drop your resume here", and a smaller line "or click to browse" with the word "browse" colored `var(--accent-primary)` and underlined.
- Below that: "Accepted format: PDF" in 12px `--text-muted`.
- On dragover: border becomes solid `var(--accent-primary)`, background shifts to `rgba(108, 58, 255, 0.05)`.
- After file is selected: replace the drop zone interior with a file info row — FileText icon, filename (bold), file size, and a green CheckCircle2 icon. Include a "Change file" ghost button below.

**Step 2: Job Description Input** — A glassmorphic card below the upload zone:
- A toggle bar at top with two segmented buttons: "Paste Description" and "Select Preset". Active segment has `var(--accent-primary)` background, inactive is transparent.
- If "Paste": show a textarea (glassmorphic styling: `var(--bg-card)` background, `var(--border-subtle)` border, 16px padding, 15px font, `--text-primary` color, placeholder in `--text-muted`). Character counter bottom-right in `--text-muted`.
- If "Select Preset": show a styled `<select>` dropdown (same glassmorphic style) that fetches presets from `/presets` endpoint. When selected, populate the textarea below it.

**Analyze Button** — Full-width primary button at the bottom: "Run Analysis" with BarChart3 icon. Disabled state: opacity 0.4, no pointer events. Loading state: replace text with a pulsing "Analyzing" text and three bouncing dots animation.

**Loading Overlay** — When analysis is in progress, overlay the entire page with a centered glassmorphic modal (backdrop: `rgba(2, 1, 7, 0.85)` + blur). Inside:
- A spinner: a 48px ring with a rotating arc in `var(--accent-primary)` (CSS animation, 1s linear infinite).
- Below the spinner, four processing steps listed vertically, each with a Lucide icon:
  1. FileText — "Parsing resume..."
  2. Brain (from lucide) — "Extracting skills with AI..."
  3. Target — "Matching against job requirements..."
  4. BarChart3 — "Generating skill gap report..."
- Steps activate sequentially every 3 seconds. Active step has `--text-primary` color and a pulsing dot animation. Completed steps show CheckCircle2 in `--accent-success`. Upcoming steps are `--text-muted`.

---

### PAGE 3: RESULTS PAGE (route: `/results`)

Two-column layout: a fixed sidebar (320px) on the left and scrollable main content on the right.

**Left Sidebar** — Glassmorphic card, sticky (top: 100px), containing:
- **Score Ring**: An SVG donut chart (160px diameter, 8px stroke). The track is `var(--border-subtle)`. The fill arc animates from 0 to the score percentage on mount (1s ease-out). Arc color: green if score >= 75, amber if >= 50, red otherwise. Inside the ring, show the numeric score (48px, 700 weight, same color as arc) and "Match Score" label below (13px, uppercase, `--text-muted`).
- **Category Breakdown**: Below the ring, four horizontal progress bars for Technical Skills, Experience, Education, Certifications. Each bar has a label, a percentage, and an animated fill (glassmorphic track, colored fill matching the score color logic). Bars animate in with staggered 300ms delays.
- **Quick Actions**: Two ghost buttons at the bottom — "New Analysis" (with RefreshCw icon) and "Copy Summary" (with Copy icon). On copy, button text temporarily changes to "Copied" with a check icon.

**Main Content Area** — Contains a tab navigation and tab content panels:

**Tab Navigation** — A horizontal row of four tabs, glassmorphic surface. Each tab is a button with a Lucide icon + label:
- "Skills Match" (Target icon)
- "Skill Gaps" (AlertTriangle icon)
- "Recommendations" (BookOpen icon)
- "Full Report" (FileText icon)
- Active tab: `var(--accent-primary)` text color, a 2px bottom border in `--accent-primary`, and a very subtle glow. Inactive tabs: `--text-muted`. Hover: `--text-secondary`. The active indicator bar should slide to the active tab position (animated left/width transition).

**Tab: Skills Match** — A comparison table with three columns: "Your Skills", match indicator, "Required Skills".
- Table header: uppercase, 12px, `--text-muted`, glassmorphic row.
- Matched rows: both columns filled, green CheckCircle2 between them, row has a very faint green left border.
- Missing rows: left column shows "—" in `--text-muted`, amber AlertTriangle icon between, right column shows the required skill, row has faint amber left border.
- Bonus rows: left column shows the skill with a small "Bonus" pill badge (`rgba(108, 58, 255, 0.15)` bg, `--accent-primary` text, 11px), right column shows "—", sparkle icon between.
- Category filter pills above the table (glassmorphic pills: "All", "Programming", "Frameworks", "Databases", "DevOps", "Cloud", "Tools"). Active pill: `var(--accent-primary)` bg, white text. Others: `var(--bg-card)`.
- Rows animate in with staggered fade-slide (80ms delay per row).

**Tab: Skill Gaps** — A responsive grid (2 columns desktop, 1 column mobile) of gap cards:
- Each card is glassmorphic with a colored left border (4px): red for High priority, amber for Medium, green for Low.
- Card header: Priority badge pill (e.g., "High Priority" with a small filled circle icon matching the color).
- Skill name: 18px, 600 weight.
- "Why Important" quote in italic `--text-secondary`.
- Two mini progress bars: "Current Level" (fill in `--text-muted`) and "Required Level" (fill in `--accent-primary`). Labels on left, level names on right.
- Resource recommendation box at bottom: glassmorphic sub-card with BookOpen icon, resource title (bold), platform name, and estimated hours.
- Cards fade in with staggered 150ms delay.

**Tab: Recommendations** — A vertical timeline:
- Title: "Personalized Learning Path" (h3, 20px, 600 weight, with a CalendarDays Lucide icon).
- Each timeline item: a vertical line (2px, `var(--border-subtle)`) on the left, with a small circle node at each item (8px, `var(--accent-primary)` fill). Content card to the right of the line.
- Card content: Week range as a label, focus area as the title, resource and goal as body text.
- Below the timeline, render a data table with columns: Week, Focus Area, Resource, Goal. Glassmorphic table with alternating row backgrounds (`var(--bg-card)` and transparent).

**Tab: Full Report** — Vertically stacked report sections:
- Each section is a glassmorphic card. Header row contains a section title (h3, 18px, 600 weight) and a "Copy" ghost button (Copy icon). On click, copy that section's text to clipboard and briefly change button to "Copied" with CheckCircle2 icon.
- Sections: "Executive Summary", "Strengths Analysis", "Gap Analysis", "Market Positioning", "Action Plan".
- Body text: 15px, `--text-secondary`, line-height 1.7, white-space: pre-wrap.

---

### API INTEGRATION

The backend runs at `http://localhost:8000`. Use Axios with a 120-second timeout. Endpoints:
- `GET /presets` → returns `{ presets: [{ id, title, description }] }`
- `POST /analyze` → FormData with fields [resume](file:///d:/kevin%20stuff/Brave_Downloads/AI-Powered-Resume-Analyzer/backend/app/api/routes.py#15-29) (File), `job_description` (string), `job_preset` (string). Returns `{ candidate_skills, job_requirements, analysis }` where `analysis` contains: `overall_match_score`, `category_scores` (object with `technical_skills`, `experience`, `education`, `certifications`), `matched_skills` (array), `skill_gaps` (array), `bonus_skills` (array), `learning_path` (array of `{ week_range, focus, resource, goal }`), `executive_summary`, `strengths_narrative`, `gaps_narrative`, `market_positioning`, `action_plan`.
- Store the analysis result in `sessionStorage` under key `analysisResults` and navigate to `/results`. If no stored data exists on `/results`, redirect to `/analyze`.

---

### TOAST NOTIFICATIONS

Use a global toast system (bottom-right corner). Toasts are glassmorphic pills that slide in from the right. Types: success (green left accent), error (red), warning (amber), info (purple). Each toast has an icon (CheckCircle2, XCircle, AlertTriangle, Info), message text, and a 4-second auto-dismiss with a shrinking progress bar at the bottom matching the type color.

---

### ANIMATIONS CHECKLIST

- Hero content: fade-in + slide up from 30px, staggered children (badge → heading → subtitle → buttons → mockup) with 200ms delays.
- Feature cards: fade-up on scroll, 150ms stagger.
- Stats counter: animate from 0 to value on scroll, ease-out-cubic, 2 seconds.
- Score ring arc: draws from 0 to score, 1s ease-out.
- Category bars: width animates from 0, staggered 300ms.
- Table/card rows: fade-in + slide from right (translateX 20px → 0), 80ms stagger.
- Tab switch: content cross-fades (opacity 0→1, 200ms).
- Background aurora blobs: infinite gentle scale pulse (1 → 1.15, 8s ease-in-out).
- Button hover: translateY -2px, glow shadow appears, 0.25s ease.
- Card hover: border changes to glow border, shadow appears, 0.3s ease.
- Loading spinner: rotating arc, 1s linear infinite.
- Toast: slide in from right (translateX 100% → 0, 0.3s ease-out), slide out on dismiss.

---

### RESPONSIVE BEHAVIOR

- Desktop: full two-column results layout, 3-column feature grid, side-by-side CTA buttons.
- Tablet (below 1024px): results sidebar collapses to a horizontal summary bar above the main content. Feature grid goes to 2 columns.
- Mobile (below 640px): everything stacks single-column. Hero text shrinks to 36px. Buttons stack vertically. Tab nav becomes horizontally scrollable. Gap grid is single column.

---

### CRITICAL RULES

1. No emojis anywhere. Lucide icons only.
2. Plus Jakarta Sans is the only font. No system fonts, no serif.
3. Background is #020107, never #000, never #111, never any grey.
4. Every container, card, modal, dropdown, input, and table must have the glassmorphic treatment (semi-transparent bg, backdrop-blur, subtle border, rounded corners).
5. The overall aesthetic must feel like a premium AI startup SaaS product — think Linear, Raycast, or Vercel's marketing sites. Not a Bootstrap template. Not Material UI defaults. Bespoke.
