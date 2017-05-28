/* eslint-disable */
import nodeResolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";
import uglify from "rollup-plugin-uglify";

const prod = process.env.PRODUCTION;
const env = prod ? "production" : "development";

console.log(`Creating ${env} bundle...`);

const targets = prod
  ? [{ dest: "dist/hedron.min.js", format: "cjs" }]
  : [
      { dest: "dist/hedron.js", format: "cjs" },
      { dest: "dist/hedron.es.js", format: "es" }
    ];

const plugins = [
  nodeResolve(),
  commonjs(),
  babel({
    babelrc: false,
    presets: [
      [
        "env",
        {
          modules: false,
          targets: {
            browsers: ["last 2 versions", "> 5%"]
          }
        }
      ],
      "stage-0",
      "react"
    ],
    plugins: ["flow-react-proptypes", "styled-components"]
  })
];

if (prod) plugins.push(uglify());

export default {
  entry: "src/index.js",
  external: ["react", "prop-types", "styled-components"],
  plugins,
  targets
};
