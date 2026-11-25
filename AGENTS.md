# Session Rules

## Startup
1. Read MEMORY.md before any task.
2. Read DESIGN.md and ARCHITECTURE.md (if they exist) before UI or file-structure work.
3. Read BRIEF.md ONLY when told to or when starting a project from scratch.

## Execution
4. Work in small batches. Max 3 web pages fetched per turn.
5. Keep responses concise.

## Logging
6. After each task, append a short summary to TASK_LOG.md.
7. Update MEMORY.md with key facts, decisions, and unfinished steps.

## Architecture
8. Follow ARCHITECTURE.md. If it is missing, create it from the current repo first.
9. Update ARCHITECTURE.md whenever the structure changes.
10. Default stack: Next.js App Router, TypeScript, Tailwind, shadcn/ui.
11. Folders: components/ui (shadcn only), components/shared, components/features/<name>, lib, hooks, types.
12. One component per file, PascalCase, named exports, typed props. Pages in app/ stay thin.
13. Install shadcn components via `npx shadcn@latest add <name>`.

## Design
14. No hardcoded colors, fonts, or radii in components. Use semantic tokens from globals.css (bg-primary, text-foreground).
15. To change the look, edit tokens in globals.css and DESIGN.md, never individual components.
16. Read the skill in .claude/skills before building UI.
17. The shadcn preset in components.json is final. Never change the palette, fonts, or radius unless I explicitly ask. If a component is needed, add it with the shadcn CLI so it inherits the preset.

## Doctor Info (for reference when building)
- **Name**: Dr. Shafqat Batool
- **Specialty**: Consultant Gynecologist, Obstetrician, and Infertility Specialist
- **Experience**: 12+ years in women's health, obstetrics, and reproductive medicine
- **Qualifications**: MBBS, FCPS (Gynecology & Obstetrics)
- **Languages**: Urdu, English, Saraiki, and Punjabi
- **Clinic**: Medical & Surgical Complex, Dera Ghazi Khan
- **Serving areas**: Pul Daat, Model Town, Jampur Road, and Shadan Lound
- **Consultation hours**: Monday to Saturday, 5:00 PM – 9:00 PM
- **Services**: Obstetrics & Maternity, Fertility & Hormonal Care, Gynecology & Diagnostics
- **Patient prep**: Bring previous medical/lab reports, current medication list, menstrual history notes, and CNIC/ID

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
