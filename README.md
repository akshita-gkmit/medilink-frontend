# MediLink – Frontend

MediLink Frontend is a modern, scalable web application built using React and Vite. It provides the user-facing interface for MediLink’s healthcare management ecosystem, designed for patients, doctors, and administrators.

```

medilink-frontend/
│── public/
│── src/
│   ├── assets/
│   ├── components/
│   ├── hooks/
│   ├── layouts/
│   ├── pages/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── App.jsx
│   ├── main.jsx
│── .gitignore
│── index.html
│── package.json
│── README.md
│── vite.config.js

````

## Setup and Installation

### 1. Clone the repository
```bash
git clone <repo-url>
cd medilink-frontend
````

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

Application will run at:
[http://localhost:5173/](http://localhost:5173/)

## Available Scripts

| Command           | Description                    |
| ----------------- | ------------------------------ |
| `npm run dev`     | Start local development server |
| `npm run build`   | Create production build        |
| `npm run preview` | Preview production build       |

## API Integration

The frontend communicates with the MediLink backend through REST APIs.

Update the API base URL inside:

```
src/services/api.js
```

Example:

```js
export const API_BASE_URL = "http://localhost:8000";
```

## Features

### Patient

* Registration and login
* View medical records
* Book appointments
* View prescriptions and reports

### Doctor

* Manage appointments
* Update patient records
* Dashboard overview

### Admin

* Manage doctors
* Manage hospital and system data
* Role-based access control

## Authentication and Authorization

* JWT token-based authentication
* Role-based protected routing
* Private/protected routes implemented using hooks or higher-order components

## Testing (Optional for Future)

* Vitest for unit tests
* React Testing Library for component tests

## Build for Production

```bash
npm run build
```

Build output will be generated in the `dist/` folder.

## Contributing

1. Create a new branch:

```bash
git checkout -b feature/<feature-name>
```

2. Commit your changes:

```bash
git commit -m "Add <feature-name>"
```

3. Push the branch and create a pull request:

```bash
git push origin feature/<feature-name>
```

## License

This project is licensed under the MIT License.

