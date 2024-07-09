const { spawn } = require("child_process");

const installPackageInStorybook = (answers) => {
  const kebabize = (str) =>
    str.replace(
      /[A-Z]+(?![a-z])|[A-Z]/g,
      ($, ofs) => (ofs ? "-" : "") + $.toLowerCase(),
    );
  const packageName = `@fiscozen/${kebabize(answers.component)}`;
  return new Promise((resolve, reject) => {
    const process = spawn("pnpm", [
      "--filter",
      "@fiscozen/storybook",
      "install",
      packageName,
      "--workspace",
    ]);
    process.on("close", (code) => {
      if (code === 0) resolve();
      else reject(`exited with ${code}`);
    });
  });
};

module.exports = function (plop) {
  basePath = "./packages/{{kebabCase component}}/";
  plop.setActionType("installPackageInStorybook", installPackageInStorybook);
  plop.setGenerator("component", {
    description: "create a new component for the Design System",
    prompts: [
      {
        type: "input",
        name: "component",
        message: "Insert component name",
      },
      {
        type: "input",
        name: "author",
        message: "Insert author name",
      },
    ],
    actions: [
      {
        type: "add",
        path: basePath + "package.json",
        templateFile: "templates/component/package.json",
      },
      {
        type: "add",
        path: basePath + "vite.config.ts",
        templateFile: "templates/component/vite.config.ts",
      },
      {
        type: "add",
        path: basePath + "vitest.config.ts",
        templateFile: "templates/component/vitest.config.ts",
      },
      {
        type: "add",
        path: basePath + "prettierrc.js",
        templateFile: "templates/component/.prettierrc.js",
      },
      {
        type: "add",
        path: basePath + "eslintrc.cjs",
        templateFile: "templates/component/.eslintrc.cjs",
      },
      {
        type: "add",
        path: basePath + "README.md",
        templateFile: "templates/component/README.md",
      },
      {
        type: "add",
        path: basePath + "src/index.ts",
        templateFile: "templates/component/src/index.ts",
      },
      {
        type: "add",
        path: basePath + "src/types.ts",
        templateFile: "templates/component/src/types.ts",
      },
      {
        type: "add",
        path: basePath + "src/Fz{{pascalCase component}}.vue",
        templateFile: "templates/component/src/FzComponent.vue",
      },
      {
        type: "add",
        path: basePath + "src/__tests__/Fz{{pascalCase component}}.spec.ts",
        templateFile: "templates/component/src/__tests__/FzComponent.spec.ts",
      },
      {
        type: "add",
        path: "./apps/storybook/src/stories/{{pascalCase component}}.stories.ts",
        templateFile: "templates/component/src/story.ts",
      },
      {
        type: "installPackageInStorybook",
      },
    ],
  });
};
