SystemJS.config({
  baseURL: ".",
  production: true,
  paths: {
    "github:*": "jspm_packages/github/*",
    "npm:*": "jspm_packages/npm/*",
    "jspm-react-component/": "src/js/components",
    "npm:react@0.14.6": "https://cdnjs.cloudflare.com/ajax/libs/react/0.14.6/react.min.js",
    "npm:react-dom@0.14.6": "https://cdnjs.cloudflare.com/ajax/libs/react/0.14.6/react-dom.min.js"
  }
});
