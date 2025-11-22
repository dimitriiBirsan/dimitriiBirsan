# Dumitru Birsan - Portfolio & Blog

A modern, performant personal portfolio and blog built with Astro, 
## Features

-  **Dark/Light Mode** - Seamless theme toggling with persistent preferences
-  **Lightning Fast** - Built with Astro for optimal performance
-  **Fully Responsive** - Mobile-first design that works beautifully on all devices
-  **SEO Optimized** - Canonical URLs, OpenGraph data, and sitemap support
-  **Blog with MDX** - Write posts in Markdown/MDX with full component support
-  **Type-Safe** - Content collections with TypeScript validation
-  **Skills Showcase** - Visual representation of technical expertise
-  **Smooth Animations** - Polished interactions and transitions
-  **RSS Feed** - Automatic feed generation for blog posts

## Tech Stack

- **Framework**: [Astro](https://astro.build)
- **Styling**: Vanilla CSS with CSS Variables
- **Content**: MDX with Content Collections
- **TypeScript**: Full type safety
- **Analytics**: Umami integration

## Project Structure

```text
├── public/              # Static assets
├── src/
│   ├── assets/         # Images and media files
│   ├── components/     # Reusable Astro components
│   │   ├── Footer.astro
│   │   ├── Header.astro
│   │   ├── Navigation.astro
│   │   ├── NavLink.astro
│   │   └── ThemeSwitcher.astro
│   ├── content/        # Blog posts and content collections
│   │   └── blog/       # MDX blog posts
│   ├── data/           # Static data (e.g., skills)
│   ├── layouts/        # Page layouts
│   ├── pages/          # File-based routing
│   │   ├── index.astro      # Home page
│   │   ├── about.astro      # About page
│   │   ├── blog/            # Blog section
│   │   └── skills.astro     # Skills showcase
│   ├── styles/         # Global styles
│   │   ├── globals/    # Design system variables
│   │   └── elements/   # Page-specific styles
│   ├── types/          # TypeScript type definitions
│   └── utils/          # Helper functions
├── astro.config.mjs    # Astro configuration
├── package.json
└── tsconfig.json
```

## Commands

All commands are run from the root of the project:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Install dependencies                             |
| `npm run dev`             | Start local dev server at `localhost:4321`       |
| `npm run build`           | Build production site to `./dist/`               |
| `npm run preview`         | Preview build locally before deploying           |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## � Getting Started

1. **Clone the repository**
   ```bash
   git clone git@github.com:dimitriiBirsan/dimitriiBirsan.git
   cd blog
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:4321`

##  Customization

### Colors
Edit `src/styles/globals/index.css` to customize the color scheme. The design system uses CSS variables for easy theming:

```css
:root {
  --accent-primary: #7F00FF;    /* Vibrant Violet */
  --accent-secondary: #e040fb;  /* Bright pink/violet */
  --bg-primary: #0a090f;        /* Dark background */
  /* ... more variables */
}
```

### Content
- Add blog posts in `src/content/blog/` as `.md` or `.mdx` files
- Update personal information in page components
- Modify skills in `src/data/skills.ts`

## 📝 Blog Posts

Create new blog posts by adding MDX files to `src/content/blog/`:

```mdx
---
title: 'Post Title'
description: 'Brief description'
pubDate: 'Jan 01 2025'
heroImage: '/path/to/image.jpg'
---

Your content here...
```

## License

This project is open source and available under the MIT License.

## Author

**Dumitru Birsan**
- GitHub: [@dimitriiBirsan](https://github.com/dimitriiBirsan)
- LinkedIn: [Dumitru Birsan](https://www.linkedin.com/in/dumitru-birsan-6b58771bb/)
- StackOverflow: [Dumitru Birsan](https://stackoverflow.com/users/13526174/dumitru-birsan)

---

Built with ♥ using [Astro](https://astro.build)
