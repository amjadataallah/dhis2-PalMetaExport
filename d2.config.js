const config = {
  type: "app",

  name: "Program-Metadata-Exporter",
  title: "Program Metadata Exporter",
  short_name: "PalMetaExport",
  description:
    "Export DHIS2 metadata by program stage, including data elements, rules, variables, and indicators",
  version: "1.0.0",
  minDHIS2Version: "2.41.1",
  author: {
    name: "Amjad M. Ataallah",
    email: "ataallah.amjad@gmail.com",
    organisation: "Palestine",
  },
  icons: {
    48: "dhis2-app-icon.png", // place this file in /public
  },

  entryPoints: {
    app: "./src/App.jsx",
  },

  esbuild: {
    loader: {
      ".js": "jsx",
    },
  },
};

module.exports = config;
