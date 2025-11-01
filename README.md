# Paylocity FE Challenge App

This is a **Healthcare Benefits** React app I built for the **Paylocity Front-End Challenge**.
You can try it live here: **[https://paylocity-fe-challenge.netlify.app/](https://paylocity-fe-challenge.netlify.app/)**

## Getting Started

### Run locally

```bash
npm install
npm run dev
```

The app will be available at **[http://localhost:5173](http://localhost:5173)** (default Vite port).

### Build for production

```bash
npm run build
```

### Run tests

```bash
npm run test
```

## How It Works

This is a **client-side React app** that simulates a simple employee benefits management tool.

- On first load, it checks if there’s any existing **employee data** in `localStorage`.
- If none exists, it uses **faker-js** to generate mock employees and dependents, then stores them locally.
- Any changes you make (adding, editing, or deleting employees) are automatically **persisted in `localStorage`**.
- To refresh with a brand new dataset, simply **delete the `employeeData` key in `localStorage`** and **reload the app**.

## Tech Stack

| Category              | Tools / Libraries                                                                                                                                                                        |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Framework & Build** | [React 19](https://react.dev/), [Vite 7](https://vitejs.dev/)                                                                                                                            |
| **Styling**           | [Tailwind CSS 4](https://tailwindcss.com/)                                                                                                                                               |
| **Icons**             | [Heroicons React](https://github.com/tailwindlabs/heroicons)                                                                                                                             |
| **Form Handling**     | [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/)                                                                                                                 |
| **Mock Data**         | [@faker-js/faker](https://github.com/faker-js/faker)                                                                                                                                     |
| **Testing**           | [Vitest](https://vitest.dev/), [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/), [jest-dom](https://testing-library.com/docs/ecosystem-jest-dom/) |
| **Code Quality**      | ESLint, Prettier                                                                                                                                                                         |
