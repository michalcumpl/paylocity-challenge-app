# Paylocity FE Challenge App

This is a Healthcare Benefits React app I built for the Paylocity Front-End Challenge.
You can try it live here: [https://paylocity-fe-challenge.netlify.app/](https://paylocity-fe-challenge.netlify.app/)

## Getting Started

### Run locally

```bash
npm install
npm run dev
```

### Build for production

```bash
npm run build
```

### Run tests

```bash
npm run test
```

## How It Works

This is a client-side React app that simulates a simple employee healthcare benefits management tool.

- On first load, it checks if there’s any existing employee data in `localStorage`.
- If none exists, it uses `faker-js` to generate mock employees and dependents, then stores them in `localStorage`.
- Any changes you make are automatically persisted in `localStorage`.
- To refresh with a new dataset, simply delete the `employeeData` key in `localStorage` and reload the app.

## Tech Stack

| Category              | Tools / Libraries                                                                                                                                                                       |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Framework & Build** | [React 19](https://react.dev/), [Vite 7](https://vitejs.dev/)                                                                                                                           |
| **Styling**           | [Tailwind CSS 4](https://tailwindcss.com/)                                                                                                                                              |
| **Icons**             | [Heroicons React](https://github.com/tailwindlabs/heroicons)                                                                                                                            |
| **Form Handling**     | [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/)                                                                                                                |
| **Mock Data**         | [faker-js](https://github.com/faker-js/faker)                                                                                                                                           |
| **Testing**           | [Vitest](https://vitest.dev/), [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/), [jest-dom](https://testing-library.com/docs/ecosystem-jest-dom/) |
| **Code Quality**      | ESLint, Prettier                                                                                                                                                                        |
