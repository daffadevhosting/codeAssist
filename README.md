
# CodeAssist (CoDa)

CodeAssist **[CoDa]** is an AI-powered code generation assistant that helps you write code faster. It uses Google's Gemini model to generate code from natural language prompts.

Launch VS Code Quick Open (Ctrl+P), paste the following command, and press enter.
```sh
ext install DaffaDev.coda-vscode
```
[vscode ext](https://marketplace.visualstudio.com/items?itemName=DaffaDev.coda-vscode)

## Features

- **Code Generation:** Generate code in `REACT` and `HTML` from `NLP` (natural language prompts).
- **Redesign from HTML:** Redesign existing `HTML` code into a modern layout.
- **Redesign from URL:** Redesign a web page from a `URL`. Paste the URL of the website that you want to redesign. Use Gemini-2.5-pro for best results.
- **AI Reasoning:** Get an explanation of the generated code from the AI.
- **Bring Your Own API Key:** Users can use their own Gemini API key.
   * ### New Features:
   * **Added Models**: Users can select a model via the 'Bot' icon dropdown. These range from Gemma 3 to Gemini 2.5 Pro.
   * **Added General Chat**: The AI can receive conversations like a typical chatbot and discuss technology by selecting 'Obrolan Umum' from the dropdown.
   * **AI fixer / co-code**: At `Obrolan Umum`, AI can fix errors in problematic script code, and provide suggestions for improvements with new scripts. Simply submit the error-prone script snippet in the input form and submit.
   * **Chat History**: The AI always has the full context of previous conversations, allowing it to provide coherent and relevant answers, as if it `"remembers"` everything you've discussed. Cool, right? ✨

## Screen

| Desktop | Mobile |
|-----------------|------------|
| ![screenshot](/localhost_8500.png) | ![screenshot](/GalaxyS8+.png) |



## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js and npm installed on your machine.
- A Gemini API key. You can get one from [Google AI](https://aistudio.google.com/apikey).

### Local Installation

1. Clone the repo
   ```sh
   git clone https://github.com/daffadevhosting/codeAssist.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Start the development server
    ```sh
    npm run dev
    ```

## Usage

Once the application is running, a modal will appear asking you to enter your API key. The key will be stored in your browser's local storage for future use. you can:

1.  Enter a prompt describing the code you want to generate.
2.  Select a template (React or HTML).
3.  Click the "Generate Code" button.


