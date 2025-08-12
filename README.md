
# CodeAssist

CodeAssist is an AI-powered code generation assistant that helps you write code faster. It uses Google's Gemini model to generate code from natural language prompts.

## Features

- **Code Generation:** Generate code in React and HTML from natural language prompts.
- **Redesign from HTML:** Redesign existing HTML code into a modern layout.
- **Redesign from URL:** Redesign a web page from a URL.
- **AI Reasoning:** Get an explanation of the generated code from the AI.
- **Bring Your Own API Key:** Users can use their own Gemini API key.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js and npm installed on your machine.
- A Gemini API key. You can get one from [Google AI Studio](https://aistudio.google.com/apikey).

### Local Installation

1. Clone the repo
   ```sh
   git clone https://github.com/your_username/codeassist.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Create a `.env` file in the root of the project and add your Gemini API key:
    ```
    GEMINI_API_KEY=your_api_key
    ```
4. Start the development server
    ```sh
    npm run dev
    ```

## Usage

Once the application is running, you can:

1.  Enter a prompt describing the code you want to generate.
2.  Select a template (React or HTML).
3.  Click the "Generate Code" button.

If you don't have a `GEMINI_API_KEY` set in your environment, a modal will appear asking you to enter your API key. The key will be stored in your browser's local storage for future use.

## Environment Variables

- `GEMINI_API_KEY`: Your Gemini API key. This is required for the application to work.

