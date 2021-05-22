import React, { useEffect, useState, useRef } from "react";

import * as esbuild from "esbuild-wasm";
import { unpkgPathPlugin } from "./plugins/unpkg-path-plugin";

function App() {
  const [input, setInput] = useState("");
  const [code, setCode] = useState("");

  const ref = useRef<any>();

  function handleChange(ev: React.ChangeEvent<HTMLTextAreaElement>) {
    ev.preventDefault();

    setInput(ev.target.value);
  }

  async function handleSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();

    if (!ref.current) {
      return;
    }

    const transformResult = await ref.current.build({
      entryPoints: ["index.js"],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin()],
    });

    console.log(transformResult);

    setCode(transformResult.outputFiles[0].text);
  }

  useEffect(() => {
    startService();
  }, []);

  async function startService() {
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: "/esbuild.wasm",
    });
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea
          name="code"
          id="code"
          value={input}
          onChange={handleChange}
          cols={80}
          rows={10}
        ></textarea>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
}

export default App;
