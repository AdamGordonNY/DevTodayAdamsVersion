# Dev Today

[![Latest release](https://gitnote.s3.us-east-2.amazonaws.com/tsconfig.png)](https://dev-today.adam-gordon.info)

## 🌐 Demo

Here is a working live demo: <https://adam-gordon.dev/posts>

## 📝 Description

DevToday is a content creation platform for developers. It offers a feed of dev news, podcasts, and events, keeping you up-to-date with the latest tech. It has interactive features like podcast audio playback, meetup maps, and more. You can think of it as the go-to developer community hub.

- Motivation: To test my skills and put together a user friendly, developer focused social media site.
- Why I Built This Project: A lot of "developer" social media is scattered; I wanted to centralize it.
- Problem Solved: Developers can arrange to meetup, record podcasts/audio to share informaation across multiple modes of communication, or just post.
- What I Learned: With a business-like attitude and a good team (even a small one), when collaborating while staying humble, open to feedback, and accountable, it's possible to build a comprehensive site with complex features (e.g., a site-wide audio player that persists across navigation, a separate `socket.io` service for instant updates, live communication, and notifications). Designing mobile-first simplifies scaling to larger screens. Framer Motion works best as a progressive enhancement on a solid layout; fundamentals like color palette, spacing, and consistent UX patterns make or break quality. I also refined skills using a modern TypeScript-friendly ORM, PostgreSQL, TypeScript, and `zod` for typed validation. Thoughtful layout techniques (relative/absolute positioning plus modern flex utilities) help scale images while preserving intent.

## ✨ Features

- Content Creation Platform — DevToday provides users with tools and resources to create and share content easily, allowing knowledge sharing and expression within the community.
- Content Interaction Features — The app encourages engagement through likes, follows, and even communicating with other like-minded people through the content’s comment section.
- Community Building — DevToday allows users to create groups of like-minded individuals, professionals, and enthusiasts in the tech space.
- Authentication with Clerk (or Next Auth)
- Onboarding
- Sort & Filters
- Collection & Pagination
- Global Command K Search
- Image Uploads
- Profile Management
- Follows, Views, Likes
- Interactive map
- Audio Player
- Notification
- Social media share (Metatags)
- Top & popular lists
- Content preview
- Content Management CRUD (3 post types)
- Group Management (CRUD)
- Comment Threads
- Light & Dark mode

## ♿ Accessibility

This project includes an ongoing accessibility (a11y) initiative to meet WCAG 2.1 AA where practical.

Key Improvements Implemented:

- Landmarks: Single `<main id="main-content">`, semantic `<header>` / `<nav>` separation, skip link for keyboard users.
- Keyboard Navigation: All interactive icons converted to `<button>` or given proper roles; consistent focus styles via utilities.
- Forms: Inputs now have explicit `id`/`htmlFor` links; validation messages use `role="alert"` + `aria-describedby`.
- Dialogs & Menus: Radix primitives leveraged; added labeling (`aria-label`, listbox semantics for group selector, notification menu labeling).
- Live Regions: Toast notifications wrapped in `aria-live="polite" aria-atomic="true"` region.
- Media: Meaningful `alt` text for logos and content images; decorative icons marked `aria-hidden` by default.
- Tags & Status: Tags rendered as semantic lists; status indicators (icons) can expose text alternatives when `decorative={false}`.
- Color & Focus: Introduced reusable focus ring utilities; future contrast audits guided by design tokens.

Utilities (Tailwind layer):

- `.focus-ring` – Adds accessible focus outline (`ring-2` + offset) for keyboard users.
- `.focus-inset-ring` – Variant without offset for tighter components.
- `.sr-only` – Hides text visually while keeping it for assistive tech.
- `.icon-button` – Consistent styling (hover, focus) for small icon-only buttons.

Usage Examples:

```tsx
<button className="icon-button" aria-label="Open search">…</button>
<div className="focus-ring" role="button" tabIndex={0}>Custom Control</div>
<span className="sr-only">Online</span>
```

Authoring Guidelines:

1. Always provide an accessible name (visible text or `aria-label`).
2. Associate errors with fields using `aria-describedby`.
3. Prefer semantic HTML over ARIA; add ARIA only when semantics are insufficient.
4. Ensure newly added interactive elements include a visible or programmatic focus indicator.
5. Avoid relying solely on color to convey state (include text or icon shape changes).

Planned / Next Steps:

- Contrast token verification and adjustments.
- Add jest-axe for automated component accessibility regression tests.
- Reduced motion handling for animated transitions.
- Extend focus utilities to any newly added components.

If you spot an accessibility issue, please open an issue with the label `a11y`.

## Components

1. Language - [Typescript](https://www.typescriptlang.org/)
2. **Framework -** [Next.js](https://nextjs.org/)
3. **Libraries:**
   - Authentication - [Clerk](https://clerk.com/) or [Next Auth](https://next-auth.js.org/)
   - Styling - [Tailwind CSS](https://tailwindcss.com/) with [`shadcn/ui`](https://ui.shadcn.com/) _or your favorite UX library_
   - Media Management - [UploadThing](https://uploadthing.com/) or [Next Cloudinary](https://next.cloudinary.dev/)
   - Rich text editor - WYSIWYG editor - TinyMCE
   - Rich text parser - [html-react-parser](https://www.npmjs.com/package/html-react-parser)
   - Date picker - [`react-datepicker`](https://reactdatepicker.com/)
   - Database - [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/docs/) or [PostgreSQL](https://www.postgresql.org/) **+** [Prisma ORM](https://www.prisma.io/)
   - Validation - [`zod`](https://zod.dev/)
   - Interactive map - [`@vis.gl/react-google-maps`](https://visgl.github.io/react-google-maps/) _or other libraries you wish to use_

## 🛠️ Setup Project

To get this project up and running in your development environment, follow these step-by-step instructions.

### 🍴 Prerequisites

We need to install or make sure that these tools are pre-installed on your machine:

- [NodeJS](https://nodejs.org/en/download/): It is a JavaScript runtime build.
- [Git](https://git-scm.com/downloads): It is an open source version control system.
- [NPM](https://docs.npmjs.com/getting-started/installing-node): It is a package manager for JavaScript.
- ...

### 🚀 Install Project

1. Clone the Repository

   ```bash
   git clone https://github.com/adamgordonnny/devtodayadamsversion.git
   ```

2. Navigate into the project directory

   ```bash
   cd devtodayadamsversion
   ```

3. Install dependencies

   ```bash
   npm install
   ```

4. Set up environment variables (if necessary)
   - Create a .env file in the root directory.
   - Add environment-specific variables as needed.

5. Start the application

   ```bash
   npm start
   ```

6. Open your web browser and navigate to <a href="http://localhost:3000" target="_blank">http://localhost:3000</a> to see the project running.

7. Test the application

   Run the test suite to ensure everything is working as expected.

   ```bash
   npm test
   ```

### 🔒 ENV file

```ENV
DATABASE_URL=
DIRECT_URL=
UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_SIGN_UP_URL=
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_CLERK_WEBHOOK_SECRET=
NEXT_PUBLIC_GMAPS_KEY=
```

## ⚒️ How to Contribute

Want to contribute? Great!

To fix a bug or enhance an existing module, follow these steps:

- Fork the repo
- Create a new branch (`git checkout -b improve-feature`)
- Make the appropriate changes in the files
- Add changes to reflect the changes made
- Commit your changes (`git commit -am 'Improve feature'`)
- Push to the branch (`git push origin improve-feature`)
- Create a Pull Request

### 📩 Bug / Feature Request

If you find a bug (the website couldn't handle the query and / or gave undesired results), kindly open an issue [here](https://github.com/adamgordonny/devtodayadamsversion/issues/new) by including your search query and the expected result.

If you'd like to request a new function, feel free to do so by opening an issue [here](https://github.com/adamgordonny/devtodayadamsversion/issues/new). Please include sample queries and their corresponding results.

### ✅ To-do

- [ ] Enable Admins/Users to remove a user or assign a user the admin role in the Member's Tab.
- [ ] Sweep for bugs.
- [ ] A proper Case Study.
- [ ] Connect a `socket.io` server to handle notifications and enable instant messaging.

## 📜 Credits

I'd like to acknowledge my collaborators, who contributed to the success of this project. Below are links to their GitHub profiles.
[@darshin](https://github.com/DDVVPP) - Co-lead developer
https://github.com/brandonetter - Code Reviewer and Mentor
Adrian H. - JS Mastery - Mentor

## 📞 Contact Me

Adam Gordon <br />
Email : connect@adam-gordon.dev
Github : @AdamGordonNY
LinkedIn : adam-gordon119
