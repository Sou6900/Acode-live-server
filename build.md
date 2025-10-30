# Build & Development Guide

This document explains how to build and package the **Acode Live Server plugin** from source.

---

## Project Structure

```

liveserver/
├── .devServer/           # Development utilities
├── src/                  # Source code (main plugin files)
│   ├── LiveServer.js
│   ├── main.js
│   ├── server.js
│   ├── styles.js
│   ├── ui.js
│   └── utils.js
├── typings/              # Type definitions
├── icon.png
├── package.json
├── plugin.json
├── readme.md
├── tsconfig.json
└── webpack.config.js

````

---

## Build Instructions


1. Open terminal & clone plugin template
   ```bash
    git clone https://github.com/Acode-Foundation/acode-plugin
    ````
   or
   
   ```bash
   git clone https://github.com/Sou6900/Acode_Template
   ````

2. change plugin template name

   ```bash
    mv Acode_Template liveserver
   ````

4. navigate to the plugin directory:
   ```bash
   cd liveserver
    ````

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start development build:

   ```bash
   npm run dev
   ```

   or 

   ```bash
   npm run start-dev
   ```

4. When finished, a `dist.zip` file will be generated.
   Install this `.zip` file inside **Acode → Plugins → Install from liveserver dir**.

---

## ✅ Notes

* All source files are located inside the `src/` directory.
* Webpack handles bundling and plugin packaging automatically.
* No manual editing of bundled files is required.

---

**Maintainer:** [Sou6900](https://github.com/Sou6900)
**Forked from:** [hackesofice/Acode-live-server](https://github.com/hackesofice/Acode-live-server)
