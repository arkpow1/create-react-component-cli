const prompt = require("prompt-sync")();

module.exports = {
  makeMainFileContent: (title, hasTypesFile) => {
    if (!hasTypesFile) {
      return `import React from 'react';\nimport tw from 'twin.macro';\ninterface I${title} {}\n\nconst ${title} = React.memo<I${title}>(() => {\n\t\n\n\treturn <div>hello</div>;\n});\n\nexport default ${title};`;
    }
    return `import React from 'react';\nimport tw from 'twin.macro';\nimport { I${title} } from './${title}.types';\n\nconst ${title} = React.memo<I${title}>(() => {\n\t\n\n\treturn <div>hello</div>;\n});\n\nexport default ${title};`;
  },

  getUserPrompt: () => {
    const data = {
      lib: false,
      types: false,
      "local-components": false,
    };

    while (true) {
      const result = prompt("📚 Create lib file? (y/n) > ").replaceAll(" ", "");
      if (result === "y" || result === "n" || result === "") {
        data.lib = result === "y" || result === "";
        break;
      }
    }

    while (true) {
      const result = prompt("🤓 Create types file? (y/n) > ").replaceAll(
        " ",
        ""
      );
      if (result === "y" || result === "n" || result === "") {
        data.types = result === "y" || result === "";
        break;
      }
    }

    while (true) {
      const result = prompt(
        "🗂️  Create local-components directory? (y/n) > "
      ).replaceAll(" ", "");
      if (result === "y" || result === "n" || result === "") {
        data["local-components"] = result === "y" || result === "";
        break;
      }
    }
    return data;
  },
};
