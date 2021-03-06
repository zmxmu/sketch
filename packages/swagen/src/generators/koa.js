import path from "path";
import "../helpers";
import parse from "../parse";
import { generateFile, mkdir } from "../lib";

/**
 * Generate code for koa server api
 * @param {object} opts options
 * @param {string} opts.dist code dist
 * @param {string} opts.yamlFile openapi file path
 */
export default function genKoa({ dist, yamlFile, templatePath }) {
  parse(yamlFile)
    .then(function(swagger) {
      const { api } = swagger;
      const tplAPI = path.join(templatePath, "koa", "api.hbs");
      const tplDef = path.join(templatePath, "koa", "definitions.hbs");

      if (dist) {
        mkdir(dist);
      }
      const finalDist = dist || process.cwd();

      generateFile(tplDef, path.join(finalDist, "def.d.ts"), swagger, {
        parser: "typescript",
      });

      for (let name in api) {
        if (api[name])
          generateFile(tplAPI, path.join(finalDist, `${name}.js`), api[name]);
      }
    })
    .catch(err => console.error(err));
}
