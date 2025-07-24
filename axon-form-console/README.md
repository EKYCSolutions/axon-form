# Axon Form Console

This project is the console application for managing Axon Forms. It provides a command-line interface for various operations related to form creation, management, and data handling within the Axon ecosystem.

## Features

- **Form Definition Management**: Create, update, and delete form definitions.
- **Form Instance Management**: View and manage instances of submitted forms.
- **Data Export**: Export form data in various formats.
- **User and Role Management**: (Planned) Manage users and their permissions within the console.
- **Integration with Axon Core**: Seamlessly interacts with the core Axon Form services.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 14 or higher.
- **npm** or **yarn**: Package manager for Node.js.

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/axon-form-console.git
   cd axon-form-console
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

### Configuration

The console application requires configuration to connect to the Axon Form backend services. Create a `.env` file in the root directory of the project and add the following environment variables:

```
AXON_API_BASE_URL=http://localhost:3000/api
AXON_AUTH_TOKEN=your_secret_auth_token_if_required
```

Replace `http://localhost:3000/api` with the actual URL of your Axon Form API. The `AXON_AUTH_TOKEN` is optional and only required if your Axon API uses token-based authentication.

### Running the Console

To start the console application, run:

```bash
npm start
# or
yarn start
```
