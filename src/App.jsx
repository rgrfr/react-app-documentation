import React, { useState } from 'react';

// Placeholder for lucide-react icons if not available in this environment
const ChevronDown = ({ className = 'w-5 h-5' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m6 9 6 6 6-6"/>
  </svg>
);
const ChevronRight = ({ className = 'w-5 h-5' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m9 18 6-6-6-6"/>
  </svg>
);

// Reusable Section Component
const DocSection = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-200 rounded-lg mb-4 bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl">
      <button
        className="flex justify-between items-center w-full p-4 text-lg font-semibold text-gray-800 bg-blue-100 hover:bg-blue-200 rounded-t-lg focus:outline-none transition-colors duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        {isOpen ? <ChevronDown /> : <ChevronRight />}
      </button>
      {isOpen && (
        <div className="p-4 border-t border-gray-200 text-gray-700 leading-relaxed space-y-3">
          {children}
        </div>
      )}
    </div>
  );
};

// Reusable CodeBlock Component with Copy Button
const CodeBlock = ({ language, children, title = "Code Snippet" }) => {
  const [copyStatus, setCopyStatus] = useState('Copy');
  const codeRef = React.useRef(null);

  const copyToClipboard = () => {
    if (codeRef.current) {
      const textToCopy = codeRef.current.innerText;
      // Using document.execCommand('copy') for better iframe compatibility
      const textarea = document.createElement('textarea');
      textarea.value = textToCopy;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        setCopyStatus('Copied!');
      } catch (err) {
        console.error('Failed to copy text: ', err);
        setCopyStatus('Failed');
      }
      document.body.removeChild(textarea);
      setTimeout(() => setCopyStatus('Copy'), 2000); // Reset status after 2 seconds
    }
  };

  return (
    <div className="bg-gray-800 text-white rounded-md overflow-hidden mb-4 border border-gray-700 shadow-md">
      <div className="bg-gray-700 px-4 py-2 text-sm font-mono flex justify-between items-center">
        <span className="text-gray-200">{title}</span>
        <div className="flex items-center space-x-2">
          <span className="text-gray-400 text-xs">{language}</span>
          <button
            onClick={copyToClipboard}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            {copyStatus}
          </button>
        </div>
      </div>
      <pre className="p-4 text-sm overflow-x-auto">
        <code ref={codeRef} className={`language-${language}`}>
          {children}
        </code>
      </pre>
    </div>
  );
};

// Component for highlighting text snippets with a tooltip (used for prose, not code blocks)
const Highlight = ({ children, comment }) => (
  <span
    className="bg-yellow-200 text-yellow-900 px-1 rounded-sm cursor-help font-semibold"
    title={comment}
  >
    {children}
  </span>
);

// Main App Component
const App = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8 font-inter text-gray-800">
      <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-2xl">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-blue-800 mb-8 pb-4 border-b-2 border-blue-200">
          A guide to deploy a React App to GitHub pages v1.3
        </h1>

        <DocSection title="Introduction: What We'll Cover" defaultOpen={true}>
          <p className="mb-4">
            This documentation guides you through the entire process of taking a React application from your local machine to a publicly hosted website on GitHub Pages. We'll cover everything from initial setup to troubleshooting common issues.
          </p>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Prerequisites:</h3>
          <ul className="list-disc list-inside space-y-1 pl-4">
            <li>A computer with a command-line interface (Terminal on macOS/Linux, PowerShell/CMD on Windows).</li>
            <li><strong>VS Code:</strong> Your primary code editor.</li>
            <li><strong>Git:</strong> Version control system (usually pre-installed on macOS/Linux, install for Windows).</li>
            <li><strong>GitHub Account:</strong> For hosting your code and the website.</li>
            <li><strong>Homebrew (macOS/Linux optional but recommended):</strong> A package manager.</li>
            <li><strong>Node.js & npm:</strong> JavaScript runtime and package manager.</li>
          </ul>
        </DocSection>

        <DocSection title="Phase 1: Local Environment Setup (Git, Node.js, Homebrew)">
          <p className="mb-2">Before we touch any React code, let's ensure your development environment is ready.</p>

          <h3 className="text-xl font-semibold text-gray-800 mb-2">1. Git Installation</h3>
          <p className="mb-2">Git is essential for version control and interacting with GitHub.</p>
          <ul className="list-disc list-inside mb-4 pl-4">
            <li><strong>macOS:</strong> Git is usually pre-installed. You can verify by opening your Terminal (<code>Cmd + Space</code>, type "Terminal", hit Enter) and typing:
              <CodeBlock language="bash" title="Terminal: Check Git Version">
                {`git --version`}
              </CodeBlock>
              If it's not installed, macOS will prompt you to install Xcode Command Line Tools, which includes Git.
            </li>
            <li><strong>Windows:</strong> Download and install Git from the official website: <a href="https://git-scm.com/download/win" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">git-scm.com/download/win</a>. Follow the default installation options.</li>
            <li><strong>Linux:</strong> Use your distribution's package manager (e.g., <code>sudo apt-get install git</code> on Debian/Ubuntu).</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-2">2. Homebrew Installation (macOS & Linux)</h3>
          <p className="mb-2">Homebrew simplifies installing software on macOS and Linux.</p>
          <ul className="list-disc list-inside mb-4 pl-4">
            <li>Open Terminal and paste the command from <a href="https://brew.sh/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">brew.sh</a>:
              <CodeBlock language="bash" title="Terminal: Install Homebrew">
                {`/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`}
              </CodeBlock>
              Follow the on-screen instructions.
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-2">3. Node.js & npm Installation</h3>
          <p className="mb-2">Node.js is the JavaScript runtime, and npm is its package manager. React development relies on them.</p>
          <ul className="list-disc list-inside mb-4 pl-4">
            <li><strong>Recommended (macOS/Linux with Homebrew):</strong>
              <CodeBlock language="bash" title="Terminal: Install Node.js via Homebrew">
                {`brew install node`}
              </CodeBlock>
            </li>
            <li><strong>Alternative (All OS):</strong> Download the LTS (Long Term Support) version from <a href="https://nodejs.org/en/download" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">nodejs.org/en/download</a>.</li>
            <li>Verify installation in your terminal:
              <CodeBlock language="bash" title="Terminal: Verify Node.js and npm Versions">
                {`node -v
npm -v`}
              </CodeBlock>
            </li>
          </ul>
        </DocSection>

        <DocSection title="Phase 2: Creating Your React Project">
          <p className="mb-2">We'll create a new React project using Vite, a fast and modern build tool.</p>

          <h3 className="text-xl font-semibold text-gray-800 mb-2">1. Create Project Folder & Initialize Vite App</h3>
          <ul className="list-disc list-inside mb-4 pl-4">
            <li>Open <strong>VS Code</strong>.</li>
            <li>Open a new integrated terminal: Go to <span className="font-mono text-sm bg-gray-200 px-1 rounded">Terminal &gt; New Terminal</span> or press <span className="font-mono text-sm bg-gray-200 px-1 rounded">Ctrl+`` `</span>.</li>
            <li>Navigate to your desired parent directory (e.g., where you keep your Git projects):
              <CodeBlock language="bash" title="Terminal: Navigate to Project Directory">
                {`cd /Users/your-username/git-projects/ # macOS/Linux
# OR
cd C:\\Users\\your-username\\git-projects\\ # Windows`}
              </CodeBlock>
            </li>
            <li>Create the project folder and initialize the Vite React app inside it. Choose a descriptive name for your project folder, such as <Highlight comment="This name will also be part of your GitHub Pages URL, so choose it carefully. It's harder to change later.">`my-react-documentation`</Highlight>:
              <CodeBlock language="bash" title="Terminal: Create Vite React App">
                {`npm create vite@latest my-react-documentation -- --template react`}
              </CodeBlock>
              When prompted, select <span className="font-semibold">`React`</span> for the framework and <span className="font-semibold">`JavaScript`</span> (or `TypeScript`).
            </li>
            <li>Navigate into your new project directory:
              <CodeBlock language="bash" title="Terminal: Enter Project Folder">
                {`cd my-react-documentation`}
              </CodeBlock>
            </li>
            <li>Install project dependencies:
              <CodeBlock language="bash" title="Terminal: Install Dependencies">
                {`npm install`}
              </CodeBlock>
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-2">2. Insert Your Documentation Code</h3>
          <ul className="list-disc list-inside mb-4 pl-4">
            <li>Open your new project folder in VS Code: Go to <span className="font-mono text-sm bg-gray-200 px-1 rounded">File &gt; Open Folder...</span> and select <span className="font-mono text-sm bg-gray-200 px-1 rounded">`my-react-documentation`</span>.</li>
            <li>In the VS Code Explorer (left sidebar), navigate to <span className="font-mono text-sm bg-gray-200 px-1 rounded">`src/App.jsx`</span>.</li>
            <li><strong>Delete all existing code</strong> in <span className="font-mono text-sm bg-gray-200 px-1 rounded">`App.jsx`</span>.</li>
            <li><strong>Paste the entire code for *this* documentation application</strong> (the code you're currently reading!) into <span className="font-mono text-sm bg-gray-200 px-1 rounded">`App.jsx`</span>.</li>
            <li><span className="font-semibold">Save</span> the file (<span className="font-mono text-sm bg-gray-200 px-1 rounded">Ctrl+S</span> or <span className="font-mono text-sm bg-gray-200 px-1 rounded">Cmd+S</span>).</li>
          </ul>
        </DocSection>

        <DocSection title="Phase 3: Configure Tailwind CSS for Styling">
          <p className="mb-2">Your documentation app uses Tailwind CSS for its attractive styling. We need to configure it.</p>

          <h3 className="text-xl font-semibold text-gray-800 mb-2">1. Install Tailwind CSS & Dependencies</h3>
          <ul className="list-disc list-inside mb-4 pl-4">
            <li>In your VS Code terminal (ensure you are in the <span className="font-mono text-sm bg-gray-200 px-1 rounded">`my-react-documentation`</span> directory):
              <CodeBlock language="bash" title="Terminal: Install Tailwind CSS">
                {`npm install -D tailwindcss@^3.4.0 postcss autoprefixer`}
              </CodeBlock>
              This installs Tailwind CSS (version 3.x), PostCSS, and Autoprefixer as development dependencies.
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-2">2. Initialize Tailwind CSS Configuration</h3>
          <ul className="list-disc list-inside mb-4 pl-4">
            <li>Still in your VS Code terminal:
              <CodeBlock language="bash" title="Terminal: Initialize Tailwind Config">
                {`npx tailwindcss init -p`}
              </CodeBlock>
              This command creates two files in your project root: <span className="font-mono text-sm bg-gray-200 px-1 rounded">`tailwind.config.js`</span> and <span className="font-mono text-sm bg-gray-200 px-1 rounded">`postcss.config.js`</span>.
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-2">3. Configure `tailwind.config.js`</h3>
          <ul className="list-disc list-inside mb-4 pl-4">
            <li>Open <span className="font-mono text-sm bg-gray-200 px-1 rounded">`tailwind.config.js`</span>.</li>
            <li>Modify the <span className="font-mono text-sm bg-gray-200 px-1 rounded">`content`</span> array to tell Tailwind which files to scan for its classes:
              <CodeBlock language="javascript" title="VS Code: tailwind.config.js">
                {`/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    // This line tells Tailwind to scan all JavaScript, TypeScript, JSX, and TSX files in your src/ directory for Tailwind classes.
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`}
              </CodeBlock>
            </li>
            <li><span className="font-semibold">Save</span> <span className="font-mono text-sm bg-gray-200 px-1 rounded">`tailwind.config.js`</span>.</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-2">4. Add Tailwind Directives to `src/index.css`</h3>
          <ul className="list-disc list-inside mb-4 pl-4">
            <li>Open <span className="font-mono text-sm bg-gray-200 px-1 rounded">`src/index.css`</span>.</li>
            <li><strong>Delete all existing content</strong> in this file.</li>
            <li>Add these three lines:
              <CodeBlock language="css" title="VS Code: src/index.css">
                {`@tailwind base;
@tailwind components;
@tailwind utilities;`}
              </CodeBlock>
            </li>
            <li><span className="font-semibold">Save</span> <span className="font-mono text-sm bg-gray-200 px-1 rounded">`src/index.css`</span>.</li>
          </ul>
        </DocSection>

        <DocSection title="Phase 4: Running Your App Locally">
          <p className="mb-2">Time to see your documentation in action on your local machine!</p>

          <h3 className="text-xl font-semibold text-gray-800 mb-2">1. Start the Development Server</h3>
          <ul className="list-disc list-inside mb-4 pl-4">
            <li>In your VS Code terminal (still in <span className="font-mono text-sm bg-gray-200 px-1 rounded">`my-react-documentation`</span>):
              <CodeBlock language="bash" title="Terminal: Start Dev Server">
                {`npm run dev`}
              </CodeBlock>
              This command compiles your React app and starts a local development server.
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-2">2. View in Browser</h3>
          <ul className="list-disc list-inside mb-4 pl-4">
            <li>The terminal will output a URL, usually <span className="font-mono text-sm bg-gray-200 px-1 rounded">`http://localhost:5173/`</span>.</li>
            <li>Open your web browser and navigate to this URL.</li>
            <li>You should now see your fully styled "Ramblers Walks Scraper & API Project Documentation" with interactive sections!</li>
            <li>To stop the server, go back to the terminal and press <span className="font-mono text-sm bg-gray-200 px-1 rounded">Ctrl+C</span>.</li>
          </ul>
        </DocSection>

        <DocSection title="Phase 5: Connecting to GitHub & Initial Commit">
          <p className="mb-2">Now that your app is working locally, let's get it onto GitHub.</p>

          <h3 className="text-xl font-semibold text-gray-800 mb-2">1. Initialize Git Repository (Local)</h3>
          <ul className="list-disc list-inside mb-4 pl-4">
            <li>In your VS Code terminal (in <span className="font-mono text-sm bg-gray-200 px-1 rounded">`my-react-documentation`</span>):
              <CodeBlock language="bash" title="Terminal: Initialize Git">
                {`git init`}
              </CodeBlock>
              This creates a hidden <span className="font-mono text-sm bg-gray-200 px-1 rounded">`.git`</span> folder, marking your project as a Git repository.
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-2">2. Stage & Commit Your Code</h3>
          <ul className="list-disc list-inside mb-4 pl-4">
            <li>Add all project files to the staging area (prepares them for commit):
              <CodeBlock language="bash" title="Terminal: Stage All Files">
                {`git add .`}
              </CodeBlock>
            </li>
            <li>Commit your initial changes with a descriptive message:
              <CodeBlock language="bash" title="Terminal: Commit Changes">
                {`git commit -m "Initial commit: Set up React documentation app"`}
              </CodeBlock>
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-2">3. Create a New Repository on GitHub.com</h3>
          <ul className="list-disc list-inside mb-4 pl-4">
            <li>Go to <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">github.com</a> and log in.</li>
            <li>Click the <span className="font-mono text-sm bg-gray-200 px-1 rounded">`+`</span> sign in the top right corner and select <span className="font-mono text-sm bg-gray-200 px-1 rounded">`New repository`</span>.</li>
            <li>For <span className="font-semibold">`Repository name`</span>, enter <Highlight comment="This is the name of your GitHub repository. It's crucial to choose a good name now, as changing it later can break links and require re-configuration.">`my-react-documentation`</Highlight>.</li>
            <li>Choose <span className="font-semibold">`Public`</span>.</li>
            <li><strong>Do NOT</strong> initialize with a README, .gitignore, or license (your Vite project already has these).</li>
            <li>Click <span className="font-mono text-sm bg-gray-200 px-1 rounded">`Create repository`</span>.</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-2">4. Link Local to Remote & Push</h3>
          <ul className="list-disc list-inside mb-4 pl-4">
            <li>After creating the repo on GitHub, copy the commands for "push an existing local repository from the command line." It will look like this:
              <CodeBlock language="bash" title="Terminal: Link Local to Remote GitHub">
                {`git remote add origin https://github.com/your-github-username/my-react-documentation.git
git branch -M main
git push -u origin main`}
              </CodeBlock>
            </li>
            <li>Paste these commands one by one into your VS Code terminal and press Enter after each.</li>
            <li><strong>Verify:</strong> Refresh your GitHub repository page. Your code should now be visible.</li>
          </ul>
        </DocSection>

        <DocSection title="Phase 6: Deploying to GitHub Pages">
          <p className="mb-2">This makes your documentation publicly accessible.</p>

          <h3 className="text-xl font-semibold text-gray-800 mb-2">1. Install `gh-pages`</h3>
          <ul className="list-disc list-inside mb-4 pl-4">
            <li>In your VS Code terminal (in <span className="font-mono text-sm bg-gray-200 px-1 rounded">`my-react-documentation`</span>):
              <CodeBlock language="bash" title="Terminal: Install gh-pages">
                {`npm install gh-pages --save-dev`}
              </CodeBlock>
              This package helps automate the deployment to GitHub Pages.
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-2">2. Configure `package.json` for Deployment</h3>
          <ul className="list-disc list-inside mb-4 pl-4">
            <li>Open <span className="font-mono text-sm bg-gray-200 px-1 rounded">`package.json`</span> in your project root.</li>
            <li>Add a <span className="font-mono text-sm bg-gray-200 px-1 rounded">`homepage`</span> property and the deployment <span className="font-mono text-sm bg-gray-200 px-1 rounded">`scripts`</span>. The final file should look similar to this:
              <CodeBlock language="json" title="VS Code: package.json Configuration">
                {`{
  "name": "my-react-documentation",
  // IMPORTANT: Replace 'your-github-username' and 'my-react-documentation' with your actual GitHub username and repository name.
  "homepage": "https://your-github-username.github.io/my-react-documentation",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview",
    // This script runs before 'deploy' to build your optimized production files.
    "predeploy": "npm run build",
    // This script uses 'gh-pages' to push your built files from the 'dist' folder to the 'gh-pages' branch on GitHub.
    "deploy": "gh-pages -d dist"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "@vitejs/plugin-react": "^4.0.3",
    "eslint": "^8.45.0",
    "eslint-plugin-react": "^7.32.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.3",
    "vite": "^4.4.5",
    "gh-pages": "^6.0.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  }
}`}
              </CodeBlock>
            </li>
            <li><span className="font-semibold">Save</span> <span className="font-mono text-sm bg-gray-200 px-1 rounded">`package.json`</span>.</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-2">3. Configure `vite.config.js` for Subdirectory Deployment</h3>
          <p className="mb-2">This is crucial for ensuring your assets (JS, CSS, images) load correctly when hosted in a subdirectory on GitHub Pages.</p>
          <ul className="list-disc list-inside mb-4 pl-4">
            <li>Open <span className="font-mono text-sm bg-gray-200 px-1 rounded">`vite.config.js`</span> in your project root.</li>
            <li>Add the <span className="font-mono text-sm bg-gray-200 px-1 rounded">`base`</span> property to your configuration:
              <CodeBlock language="javascript" title="VS Code: vite.config.js Configuration">
                {`import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // IMPORTANT: This tells Vite the base public path when serving in production.
  // It must match your GitHub repository name with leading and trailing slashes.
  base: '/my-react-documentation/',
  plugins: [react()],
})`}
              </CodeBlock>
            </li>
            <li><span className="font-semibold">Save</span> <span className="font-mono text-sm bg-gray-200 px-1 rounded">`vite.config.js`</span>.</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-2">4. Deploy Your Application!</h3>
          <ul className="list-disc list-inside mb-4 pl-4">
            <li>First, commit your configuration changes to GitHub:
              <CodeBlock language="bash" title="Terminal: Commit & Push Config Changes">
                {`git add .
git commit -m "Configure deployment for GitHub Pages"
git push origin main`}
              </CodeBlock>
            </li>
            <li>Now, run the deploy script:
              <CodeBlock language="bash" title="Terminal: Run Deployment">
                {`npm run deploy`}
              </CodeBlock>
              This command will build your app and push the optimized files to the `gh-pages` branch of your GitHub repository.
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-2">5. Verify Deployment on GitHub Pages</h3>
          <ul className="list-disc list-inside mb-4 pl-4">
            <li>Go to your GitHub repository (<a href="https://github.com/your-github-username/my-react-documentation" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">github.com/your-github-username/my-react-documentation</a>).</li>
            <li>Click on the <span className="font-mono text-sm bg-gray-200 px-1 rounded">`Settings`</span> tab.</li>
            <li>In the left sidebar, click on <span className="font-mono text-sm bg-gray-200 px-1 rounded">`Pages`</span>.</li>
            <li>Under "Build and deployment" &gt; "Source", ensure it's set to <span className="font-semibold">`Deploy from a branch`</span> and the branch is <span className="font-semibold">`gh-pages`</span> with folder <span className="font-semibold">`/ (root)`</span>.</li>
            <li>You should see a link to your deployed site: <Highlight comment="This is your live documentation URL! It will take a few minutes to become active after deployment.">`https://your-github-username.github.io/my-react-documentation/`</Highlight></li>
            <li>Click the link and wait a few minutes for the site to become live.</li>
          </ul>
        </DocSection>

        <DocSection title="Phase 7: Troubleshooting Tips">
          <p className="mb-2">Common issues and how to fix them.</p>

          <h3 className="text-xl font-semibold text-gray-800 mb-2">1. Blank White Page on Live Site</h3>
          <ul className="list-disc list-inside mb-4 pl-4">
            <li><strong>Incorrect `homepage` in `package.json`:</strong> Double-check the URL. It must be `https://your-github-username.github.io/your-repo-name`.</li>
            <li><strong>Incorrect `base` in `vite.config.js`:</strong> Ensure it's `/your-repo-name/`. This is the most common cause for Vite apps.</li>
            <li><strong>Browser Console Errors:</strong> Open Developer Tools (<span className="font-mono text-sm bg-gray-200 px-1 rounded">F12</span> or right-click &gt; <span className="font-mono text-sm bg-gray-200 px-1 rounded">Inspect</span>, then go to the <span className="font-mono text-sm bg-gray-200 px-1 rounded">Console</span> tab). Look for red error messages, especially `404 Not Found` for `.js` or `.css` files.</li>
            <li><strong>Network Tab Issues:</strong> In Developer Tools, go to the <span className="font-mono text-sm bg-gray-200 px-1 rounded">Network</span> tab and refresh the page. Look for failed requests (red text, `404` status).</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-2">2. `npm error could not determine executable to run` for Tailwind</h3>
          <ul className="list-disc list-inside mb-4 pl-4">
            <li>This usually means you accidentally installed a pre-release (v4) of Tailwind CSS.</li>
            <li><strong>Solution:</strong> Perform a clean reinstall of Tailwind CSS v3:
              <CodeBlock language="bash" title="Terminal: Clean Reinstall Tailwind CSS v3">
                {`rm -rf node_modules
rm -f package-lock.json
npm cache clean --force
npm install -D tailwindcss@^3.4.0 postcss autoprefixer
npx tailwindcss init -p`}
              </CodeBlock>
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-2">3. GitHub Pages "1 hour ago" or not updating</h3>
          <ul className="list-disc list-inside mb-4 pl-4">
            <li>After `npm run deploy`, it can take a few minutes for GitHub Pages to process the new deployment. Be patient and refresh your live site.</li>
            <li>Ensure your `npm run deploy` command completed without errors in the terminal.</li>
            <li>Check your GitHub repository's `gh-pages` branch (on GitHub.com, go to <span className="font-mono text-sm bg-gray-200 px-1 rounded">`Code`</span> tab, then use the branch dropdown to select <span className="font-mono text-sm bg-gray-200 px-1 rounded">`gh-pages`</span>) to see if the latest files are there.</li>
          </ul>
        </DocSection>

        <footer className="text-center text-gray-500 mt-10 text-sm">
          &copy; {new Date().getFullYear()} Your Name/Organization. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default App;
