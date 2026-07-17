import { useState } from "react";
import Editor from "@monaco-editor/react";

const LANGUAGE_TEMPLATES = {
  javascript: `console.log("Hello JavaScript");`,
  python: `print("Hello Python")`,
  java: `public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello Java");\n  }\n}`,
  cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n  cout << "Hello C++" << endl;\n  return 0;\n}`,
};

export default function CodeEditor() {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(LANGUAGE_TEMPLATES.javascript);
  const [theme, setTheme] = useState("vs-dark");
  const [output, setOutput] = useState("Click Run to see output here...");
  const [isRunning, setIsRunning] = useState(false);

  function handleLanguageChange(e) {
    const selectedLanguage = e.target.value;
    setLanguage(selectedLanguage);
    setCode(LANGUAGE_TEMPLATES[selectedLanguage]);
    setOutput("Click Run to see output here...");
  }

  async function handleRunCode() {
    setIsRunning(true);
    setOutput("Running code...");

    try {
      // Later, replace this fake output with backend/Judge0 API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      setOutput(
        `Language: ${language}\n\nCode received successfully.\n\n${code}`
      );

      /*
      Real version later:

      const response = await fetch("http://localhost:5000/api/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ language, code }),
      });

      const data = await response.json();

      setOutput(data.stdout || data.stderr || data.compile_output || "No output");
      */
    } catch (error) {
      setOutput("Error while running code.");
    } finally {
      setIsRunning(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.toolbar}>
        <select value={language} onChange={handleLanguageChange} style={styles.select}>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
        </select>

        <select value={theme} onChange={(e) => setTheme(e.target.value)} style={styles.select}>
          <option value="vs-dark">Dark</option>
          <option value="light">Light</option>
        </select>

        <button onClick={handleRunCode} disabled={isRunning} style={styles.button}>
          {isRunning ? "Running..." : "Run Code"}
        </button>
      </div>

      <div style={styles.editorWrapper}>
        <Editor
          height="65vh"
          language={language}
          value={code}
          theme={theme}
          onChange={(value) => setCode(value || "")}
          options={{
            fontSize: 15,
            minimap: { enabled: false },
            wordWrap: "on",
            automaticLayout: true,
            scrollBeyondLastLine: false,
          }}
        />

        <div style={styles.console}>
          <div style={styles.consoleHeader}>Console Output</div>
          <pre style={styles.output}>{output}</pre>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    height: "100vh",
    background: "#1e1e1e",
    color: "white",
  },
  toolbar: {
    height: "50px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "0 16px",
    background: "#111827",
  },
  select: {
    padding: "8px",
    borderRadius: "6px",
    border: "none",
  },
  button: {
    padding: "8px 14px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
  },
  editorWrapper: {
    display: "flex",
    flexDirection: "column",
  },
  console: {
    height: "25vh",
    background: "#0f172a",
    borderTop: "1px solid #334155",
  },
  consoleHeader: {
    padding: "8px 12px",
    background: "#020617",
    fontWeight: "bold",
    borderBottom: "1px solid #334155",
  },
  output: {
    margin: 0,
    padding: "12px",
    whiteSpace: "pre-wrap",
    fontFamily: "monospace",
    fontSize: "14px",
  },
};