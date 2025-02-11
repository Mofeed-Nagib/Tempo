# Tempo (Formerly Clockwork)

## About

Students are overloaded with information from all angles, but current tools push the mental burden on students to organize and prioritize their tasks. This leads to burnout, disengagement, and poor time management. According to our survey of 500+ Yale students, 80% of students are looking for a change.

Introducing Tempo

- Tempo streamlines the task creation and schedule planning process, reducing mental burden and increasing productivity.
- Tempo is a task-tracking app specifically designed to help students develop and maintain a healthy work-life balance.
- Tempo optimizes Task Ingestion, Task Comprehension, Task Delivery
  - Task Ingestion: Reading unstructured documents and creating structured tasks with metadata
  - Task Comprehension: Converting a list of tasks into an optimized schedule that respects the user's preferences and constraints.
  - Task Delivery: Automatically delivering the schedule in a user's Google Calendar and through the Tempo website.

Tempo is primarily a Next.js application using Supabase DB, styled with Tailwind CSS, and deployed to Vercel. We make use of Supabase Row Level Security (RLS) to connect the database to the frontend directly, making use of serverless Vercel Edge functions to handle secrets. We integrate with Google Calendar API and ChatGPT API to deliver our three features.

## Code Structure

- In the `algo` folder, we have a Jupyter Notebook environment where we experimented with the scheduling algorithm. You can preview the Jupyter Notebook files on GitHub or run the server locally (`jupyter notebook`).
- In the `chrome` folder, we have a minimal Chrome extension that displays a specific page of the frontend whenever you open a new tab. After user surveys, we have not pursued this idea aggressively.
- In the `frontend` folder, we have the Next.js application for the main website.
  - The `__tests__` folder contains unit tests written with Jest for both the frontend and backend (Supabase database). Since we don't have a dedicated backend, we include the tests here to leverage the Yarn package manager.
  - The `cypress` folder contains end-to-end tests written with Cypress. Refer to the testing section for more details.
  - Within the `src` folder, we have the majority of the application. The `src/app/(site)` folder contains TypeScript code for all the pages in the application, where the file path describes the website URL as well.
    - Specifically, `src/app/(site)/dashboard` contains the majority of the code related to the main user dashboard. This is further subdivided into a task list, labels list, calendar, scratch pad, and settings page.
    - `src/components` contains some reused components, including UI elements and a Supabase authentication provider.
    - `src/db` includes all code to handle making SELECT, INSERT, UPDATE, and DELETE queries to the Supabase database. We are able to connect the frontend to database directly using Supabase Row Level Security.
    - `src/pages/api` contains our serverless functions. We have one for running the proprietary scheduling algorithm, one for authenticating with Google Calendar, and one for using ChatGPT API when creating a task.

## Local Development

### Secrets

Ensure you have a `frontend/.env.local` with the appropriate secrets. A template is provided in `frontend/dev.env.local`. You will need to replace the OpenAI key to enable ChatGPT, replace the Supabase password to run backend unit tests, and replace the Google Client ID and Secret to integrate with the Google Calendar API.

If this is a concern, the frontend is accessible at [s23-clockwork.vercel.app](s23-clockwork.vercel.app), and a GitHub Action uses GitHub Secrets to inject the Supabase password and run backend unit tests. You can use email/password authentication locally instead of Google OAuth, but Google Calendar will only work on the production URL due to secrets.

### Prerequisites

1. Install [Node.js](https://nodejs.org/en/download/).
2. Install [Yarn](https://classic.yarnpkg.com/en/docs/install/).
3. In the `frontend` folder, install dependencies with `yarn install`.

### Run Frontend

1. Run the development server with `yarn dev`.
2. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Alternatively, build the TypeScript project and then run in production mode for a faster user experience.

1. Build the production server with `yarn build`.
2. Run the production server with `yarn start`.
3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Run Tests

Tempo employs two types of testing, unit testing and end-to-end testing.

For unit testing, we use the Jest testing framework. Once you have relocated to the frontend folder (`cd ./frontend`), you can run frontend unit tests with the terminal command `yarn test-frontend`, which test basic properties of the navbar, landing page, and auth page components. Due to Supabase issues, we use end-to-end testing to test features that requrie authentication.

You can run the backend (database) unit tests with the terminal command `yarn test-backend`, which simply tests that all tables and columns in those tables are reachable.

Finally, for frontend end-to-end testing, we use the Cypress testing framework. Once you have relocated to the frontend folder (`cd ./frontend`), you can start the website (`yarn dev`) and run end-to-end testing with `yarn cypress open`. This opens a Cypress window in which you can run and view end-to-end tests interacting with the running frontend.

Remember, you require some sensitive secrets to run our tests fully. Without all the environment variables, some or all tests will fail. You can validate the unit tests are working by viewing the GitHub Actions. Due to time constraints and some library bugs, we were unable to integrate Cypress end-to-end tests with GitHub Actions.

### Metrics Milestone

We implemented the metrics milestone with the Multi-Armed Bandit algorithm. We decided to change the text of the ChatGPT switch with three options: Enable ChatGPT to automatically parse your task (Experimental), Automatically parse your task, AI-powered task creation.

The algorithm shows a random choice 30% of the time and shows the option with the best reward 70% of the time. The code is in /frontend/src/app/(site)/dashboard/dashboard/createInline.tsx
