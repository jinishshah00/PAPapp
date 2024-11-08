```markdown
# Pet Adoption Platform with AI-Integrated Chatbot

This project is a platform to connect pet shelters with potential adopters, allowing users to find and adopt pets online. It includes features like user authentication, pet listings, search and filter options, an adoption process, and an integrated chatbot for communication.

## Project Structure

```
Project Papaap
├── backend
│   └── (contains backend code for user authentication and API endpoints)
├── pages (contains frontend pages powered by Next.js)
├── .gitignore (ignores sensitive files like `.env` and `node_modules`)
└── README.md
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (Make sure Node and npm are installed)
- [Git](https://git-scm.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/username/Project_Papaap.git
cd Project_Papaap
```

### 2. Install Dependencies

The `.gitignore` file ignores `node_modules`, so each team member needs to install dependencies locally.

```bash
npm install
```

### 3. Set Up Environment Variables

Since `.env` is ignored, each team member will need a copy of this file. Check whatsapp, download the file and place it in the root of the project directory.

```
Project Papaap
├── .env  (contains environment variables like JWT_SECRET, DB connection URI, etc.)
```

### 4. Running the Development Servers

The project includes both backend and frontend servers.

- To start both backend and frontend:
  ```bash
  npm run dev
  ```

- The backend server will run at `http://localhost:5000`, and the frontend will run at `http://localhost:3000`.

### Notes

- **Do not commit the `.env` file** to GitHub, as it contains sensitive information.
- **Collaborate on the `development` branch** and avoid directly pushing to `main` unless changes are reviewed and tested.
- Please follow the branching strategy discussed and ensure code is merged into `development` before moving to `main`.
