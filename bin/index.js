#!/usr/bin/env node

const fs = require("node:fs");
const path = require("path");
const { program } = require("commander");
const { makeMainFileContent, getUserPrompt } = require("./cli.lib");

const folders = {
  "local-components": {
    files: ["index.js"],
  },
};

program.option("-y, --yes", "accept all");

program.arguments("<values...>").action((values, options) => {
  const defaultAccepted = Boolean(options.yes);

  const data = defaultAccepted
    ? {
        lib: true,
        types: true,
        "local-components": true,
      }
    : getUserPrompt();

  values.forEach((value) => {
    const currentFolder =
      value === "." ? process.cwd() : path.resolve(process.cwd(), value);

    const name = value === "." ? process.cwd().split("/").slice(-1)[0] : value;

    const mainComponent = [
      `${name}.tsx`,
      makeMainFileContent(name, data.types),
    ];

    const rootFiles = [
      mainComponent,
      ["index.ts", `export { default as ${name} } from "./${name}"`],
      data.lib && [`${name}.lib.tsx`, ``],
      data.types && [`${name}.types.ts`, `export interface I${name} {}`],
    ].filter((item) => item);

    if (value !== ".") {
      fs.mkdirSync(currentFolder);
    }

    rootFiles.forEach(([fileName, value]) => {
      const filePath = path.resolve(currentFolder, fileName);
      fs.writeFileSync(filePath, value);
    });

    data["local-components"] &&
      Object.entries(folders).forEach(([key, value]) => {
        const newPath = path.resolve(currentFolder, key);
        fs.mkdirSync(newPath);

        value.files.forEach((fileName) => {
          const filePath = path.resolve(newPath, fileName);
          fs.writeFileSync(
            filePath,
            '// export { default as Example } from "./Example"'
          );
        });
      });
  });
});

program.parse(process.argv);
