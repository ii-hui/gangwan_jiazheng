# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 14 (Pages Router) website for "秦皇岛港湾家政" (Qinhuangdao Gangwan Home Services), a local home services company in Qinhuangdao, China. The site provides information about domestic services including nannies (保姆), childcare workers (育儿嫂), elderly care (老年护理), and hospital caregivers (医院护工).

**Tech Stack:**
- Next.js 14.0.4 (Pages Router)
- React 18.2.0
- Supabase (for backend database)
- next-sitemap (for SEO sitemap generation)

## Development Commands

```bash
# Install dependencies
npm install

# Run development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Generate sitemap (runs automatically after build via postbuild script)
npm run postbuild
```

## Architecture & File Structure

### Pages Architecture (Pages Router)

The project uses Next.js Pages Router (not App Router). Key pages:

- `pages/index.js` - Home page with service categories and dynamic content from Supabase
- `pages/baomu.js` - Nanny services page
- `pages/yuerso.js` - Childcare services page
- `pages/laorenghuli.js` - Elderly care services page
- `pages/yiyuanhugong.js` - Hospital caregiver services page
- `pages/about.js` - About the company
- `pages/contact.js` - Contact information and form
- `pages/_app.js` - Application wrapper that includes Layout component
- `pages/_document.js` - Custom HTML document structure

### Components (`/components`)

All components are functional React components:

- `Layout.js` - Main layout wrapper containing Navbar
- `Navbar.js` - Navigation bar component
- `SEOHead.js` - Head component for SEO meta tags and structured data
- `Hero.js` - Hero section component with title, subtitle, and optional logo
- `ServiceCard.js` - Card component for displaying service content
- `AdvantageGrid.js` - Grid component displaying company advantages
- `ContactForm.js` - Contact form with Supabase integration for submissions

### Data Layer

**Supabase Client (`lib/supabaseClient.js`)**
- Centralized Supabase client initialization
- Reads credentials from environment variables in `.env.local`

**Database Tables:**
- `posts` - Content posts for services (columns: id, title, content, category, image_url, image_alt, created_at)
- `submissions` - Contact form submissions (columns: name, phone, category, message)

**SEO Configuration (`utils/seoData.js`)**
- Contains all SEO metadata for each page (PAGE_SEO object)
- Service content details (SERVICE_CONTENT object)
- Site information constants (SITE_INFO object)
- Schema.org structured data generators:
  - `generateOrganizationSchema()` - LocalBusiness schema
  - `generateServiceSchema()` - Service schema
  - `generateBreadcrumbSchema()` - Breadcrumb navigation schema

### Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
NEXT_PUBLIC_SITE_URL=<your-site-url>
```

### Styling

- Global styles in `styles/globals.css`
- No CSS modules or styled-components used
- Inline styles used sparingly for dynamic styling

## Key Implementation Patterns

### SEO Optimization

This site is heavily optimized for SEO:

1. **Every page** must use the `SEOHead` component with appropriate metadata from `utils/seoData.js`
2. **Structured data** (Schema.org JSON-LD) should be included on relevant pages using the schema generators
3. **Sitemap** is auto-generated on build via `next-sitemap` with custom priority settings in `next-sitemap.config.js`
4. **Image optimization** - Images should always include `alt` attributes with SEO-friendly descriptions
5. **Keywords** - All page metadata includes location-specific keywords (秦皇岛 = Qinhuangdao)

### Service Categories

Four main service categories (defined consistently across the codebase):
- 保姆 (Nanny)
- 育儿嫂 (Childcare Worker)
- 老年护理 (Elderly Care)
- 医院护工 (Hospital Caregiver)

When adding features, maintain consistency with these categories.

### Data Fetching Pattern

Home page (`pages/index.js`) fetches posts from Supabase:
```javascript
const { data, error } = await supabase
  .from('posts')
  .select('*')
  .order('created_at', { ascending: false })
```

Posts are filtered by category on the client side. This pattern should be maintained for consistency.

### Form Submission Pattern

ContactForm component shows the standard pattern for form submissions:
1. Local state management with `useState`
2. Async submission to Supabase `submissions` table
3. Loading states and error handling
4. Success message with auto-dismiss timeout
5. Form reset after successful submission

## Important Notes

- **TypeScript**: Project has `tsconfig.json` but all files are currently JavaScript (`.js`). When adding new files, follow the existing pattern or migrate incrementally.
- **Image hosting**: Images are hosted on Supabase storage. Domain is whitelisted in `next.config.js` under `images.domains`.
- **No API routes**: Currently no `/pages/api` directory. All backend interactions go directly to Supabase client-side.
- **Chinese content**: All user-facing content is in Chinese. Maintain this language consistency.
- **Contact phone**: Primary contact number is `18533552006` (hardcoded in multiple places).

## Testing Considerations

- No test files currently exist in the project
- When adding tests, consider testing:
  - Form validation and submission logic
  - Supabase data fetching error handling
  - SEO metadata generation functions
  - Component rendering with various props

## Common Gotchas

1. **Next.js version**: This is Next.js 14 but using **Pages Router**, not the newer App Router. Don't use `app/` directory patterns.
2. **Path aliases**: `@/*` alias points to project root (configured in `tsconfig.json`)
3. **Build requirement**: Sitemap generation happens in `postbuild`, so always run the full build cycle to test SEO features
4. **Environment variables**: All public env vars must be prefixed with `NEXT_PUBLIC_` to be accessible in browser code
