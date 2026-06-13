# YelpCamp

A full-stack campground review web application where users can discover, share, and review campgrounds. Built as a learning project to practice core full-stack web development — covering MVC architecture, RESTful routing, user authentication, cloud image storage and interactive maps.

**Live Demo:** [yelpcamp-kappa-ten.vercel.app](https://yelpcamp-kappa-ten.vercel.app/)

---

## Try It Out

You can log in with any of these demo accounts on the live site:

| Username | Password |
| -------- | -------- |
| Admin    | admin    |
| ckr      | ckr      |
| Tim      | Tim      |

---

## Features

- **Campground CRUD** — Create, view, edit, and delete campground listings with title, location, price, description, and images
- **Review System** — Authenticated users can post and delete reviews with star ratings on any campground
- **Authentication** — Register and log in securely with hashed, salted passwords via Passport.js
- **Authorization** — Users can only modify or delete their own campgrounds and reviews, other users' content is read-only
- **Persistent Sessions** — Users stay logged in across page visits using server-side sessions stored in MongoDB
- **Image Uploads** — Campground photos are uploaded via Multer and stored on Cloudinary
- **Interactive Maps** — Each campground detail page shows a pin on a Maptiler map and the index page shows a cluster map of all campgrounds
- **Input Validation** — Both client-side and server-side validation using Joi schemas
- **Security** — HTTP headers hardened with Helmet, MongoDB query sanitization and HTML sanitization to prevent XSS
- **Flash Messages** — Contextual success and error feedback messages throughout the app
- **Responsive UI** — Mobile-friendly layout built with Bootstrap 5 and EJS-Mate layouts

---

## Tech Stack

| Layer          | Technology                                           |
| -------------- | ---------------------------------------------------- |
| Frontend       | HTML, CSS, Bootstrap 5, JavaScript                   |
| Templating     | EJS, ejs-mate (layouts & partials)                   |
| Backend        | Node.js, Express.js 5                                |
| Database       | MongoDB, Mongoose                                    |
| Authentication | Passport.js, passport-local, passport-local-mongoose |
| Image Upload   | Multer, multer-storage-cloudinary, Cloudinary        |
| Maps           | Maptiler                                    |
| Sessions       | express-session, connect-mongo                       |
| Validation     | Joi, sanitize-html                                   |
| Security       | Helmet, express-mongo-sanitize                       |
| Utilities      | method-override, connect-flash, dotenv               |
| Deployment     | Vercel                                               |

---

## Project Structure

```
YelpCamp/
├── cloudinary/         # Cloudinary configuration (multer storage setup)
├── controllers/        # Route handler logic (campgrounds, reviews, users)
├── models/             # Mongoose schemas (Campground, Review, User)
├── public/             # Static assets (CSS, client-side JS)
├── routers/            # Express route definitions (campgrounds, reviews, users)
├── seeds/              # Database seeding script with sample data
├── utils/              # Helpers: ExpressError class, catchAsync wrapper
├── views/              # EJS templates
│   ├── campgrounds/    # Index, show, new, edit pages
│   ├── users/          # Register and login pages
│   └── partials/       # Navbar, flash messages, footer
├── index.js            # App entry point, middleware setup, DB connection
├── middleware.js        # Custom middleware (isLoggedIn, isAuthor, validateCampground, etc.)
├── schema.js           # Joi validation schemas
└── vercel.json         # Vercel deployment config
```

## RESTful Routes

| Method | Route                                | Description             |
| ------ | ------------------------------------ | ----------------------- |
| GET    | `/campgrounds`                       | List all campgrounds    |
| POST   | `/campgrounds`                       | Create a new campground |
| GET    | `/campgrounds/new`                   | New campground form     |
| GET    | `/campgrounds/:id`                   | Campground detail page  |
| PUT    | `/campgrounds/:id`                   | Update a campground     |
| DELETE | `/campgrounds/:id`                   | Delete a campground     |
| GET    | `/campgrounds/:id/edit`              | Edit campground form    |
| POST   | `/campgrounds/:id/reviews`           | Submit a review         |
| DELETE | `/campgrounds/:id/reviews/:reviewId` | Delete a review         |
| GET    | `/register`                          | Register form           |
| POST   | `/register`                          | Submit registration     |
| GET    | `/login`                             | Login form              |
| POST   | `/login`                             | Submit login            |
| GET    | `/logout`                            | Log out current user    |

---

## Local Setup

>  This project requires API keys from Cloudinary and Maptiler, plus a MongoDB connection string. Without a `.env` file the app will not function correctly.

### Prerequisites

- Node.js & npm
- MongoDB ([Atlas](https://www.mongodb.com/atlas) free tier works)
- [Cloudinary](https://cloudinary.com/) account (free tier)
- [Maptiler](https://www.maptiler.com/) account (free tier)
- nodemon(optional) — `npm install -g nodemon`

### Steps

```bash
# 1. Clone the repo
git clone https://github.com/ChongKangRui/YelpCamp.git
cd YelpCamp

# 2. Install dependencies
npm install

# 3. Create a .env file in the project root
```

Add the following to your `.env`:

```env
SECRET=any_random_session_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_CLOUD_KEY=your_api_key
CLOUDINARY_CLOUD_SECRET=your_api_secret
MAPTILER_API_KEY=your_maptiler_key
DB_URL=your_mongodb_connection_string
```

```bash
# 4. (Optional) Seed the database with sample campgrounds
node seeds/index.js

# 5. Start the server
node/nodemon index.js

```

Visit `http://localhost:3000` in your browser.

---

## What I Learned

- Building a full-stack MVC app from scratch with Express and MongoDB
- Designing and implementing RESTful routes
- Implementing secure user authentication and role-based authorization
- Managing file uploads with Multer and persisting them to Cloudinary
- Integrating third-party map APIs (Maptiler) for geocoding and map rendering
- Protecting against common web vulnerabilities (XSS, NoSQL injection, clickjacking)
- Using EJS partials and layouts for maintainable templating
- Deploying a Node.js app to Vercel

---

## 📄 License

MIT — built for personal educational purposes.
