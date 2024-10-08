# Dev Today

[![Latest release](https://gitnote.s3.us-east-2.amazonaws.com/tsconfig.png)](https://dev-today.adam-gordon.info)


## 🌐 Demo

Here is a working live demo: https://adam-gordon.info/posts

## 📝 Description

DevToday is a content creation platform for developers. It offers a feed of dev news, podcasts, and events, keeping you up-to-date with the latest tech. It has interactive features like podcast audio playback, meetup maps, and more. You can think of it as the go-to developer community hub.

- Motivation: To test my skills and put together a user friendly, developer focused social media site.
- Why I Built This Project: Alot of "Developer" social media is scattered, I wanted to centralize it.
- Problem Solved: Developers can arrange to meetup, record podcasts/audio to share informaation across multiple modes of communication, or just post.
- What I Learned: With a business like attitude and a good team even of small size, when working together and being humble and open to feedback, as well as accountable to each other, it is possible to put together a comprehensive site with complex features such as the site-wide audio player that doesn't shut off when you navigate away from the page, having a seperate socket.io server to handle instant updates and enable live communication and notification.  Designing for mobile first is the best way to go in this era, and taking that approach makes designing for regular and larger screens easier.  Framer motion is best used to enhance an already crisp and functional layout, and things like color pallette, spacing, and other UX design "yes's" can make a good website great, or make a good website bad depending on whether you follow proven UX patterns.  I also learned how to use Prisma and PostgresQL with typescript and zod to easy type and validate incoming and outgoing data.  Using relative/absolute combos with flexboxes can help scale images while maintaining the desired look of the site.

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

## Components

1. Language - [Typescript](https://www.typescriptlang.org/)
2. **Framework -** [Next.js](https://nextjs.org/)
3. **Libraries:**
   - Authentication - [Clerk](https://clerk.com/) or [Next Auth](https://next-auth.js.org/)
   - Styling - [Tailwindcss](https://tailwindcss.com/) with [Shadcn](https://ui.shadcn.com/) _or your favorite UX library_
   - Media Management - [Uploadthing](https://uploadthing.com/) or [Next Cloudinary](https://next.cloudinary.dev/)
   - Rich text editor - WYSIWYG editor - TinyMCE
   - Rich text parser - [html-react-parser](https://www.npmjs.com/package/html-react-parser)
   - Date picker - [react-datepicker](https://reactdatepicker.com/)
   - Database - [Mongodb](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/docs/) or [Postgres](https://www.postgresql.org/) **+** [Prisma](https://www.prisma.io/)
   - Validation - [zod](https://zod.dev/)
   - Interactive map - [@vis.gl/react-google-maps](<[https://react-leaflet.js.org/](https://visgl.github.io/react-google-maps/)>) _or other libraries you wish to use_

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
- [ ] connecting a socket.io server to handle notifications and enable IMing.

## 📜 Credits
I'd like to acknowledge my collaborators, who contributed to the success of this project. Below are links to their GitHub profiles.
[@darshin](https://github.com/DDVVPP) - co-lead developer
https://github.com/brandonetter - Code Reviewer and Mentor
adrianhajdin Adrian Hajdin - JS Mastery - Mentor extraordinaire







## 📞 Contact Me

Adam Gordon <br />
Email : adam@adam-gordon.info
Github : @AdamGordonNY
LinkedIn : adam-gordon119
