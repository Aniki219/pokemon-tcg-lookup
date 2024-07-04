const webpack = require("webpack");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const srcDir = path.join(__dirname, "..", "src");

module.exports = {
    plugins: [
        new webpack.ProvidePlugin(
            {
                process: 'process/browser',
            }
        ),
    ],
    entry: {
        popup: path.join(srcDir, 'popup.tsx'),
        options: path.join(srcDir, 'pages/options.tsx'),
    },
    output: {
        path: path.join(__dirname, "../dist/js"),
        filename: "[name].js",
    },
    optimization: {
        splitChunks: {
            name: "vendor",
            chunks(chunk) {
                return chunk.name !== 'background';
            }
        },
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: [
                    "style-loader", // 3. Inject styles into DOM
                    "css-loader", // 2. Turns css into commonjs
                ],
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                type: "asset/resource",
                generator: {
                    filename: "assets/images/[name][ext]"
                }
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
        plugins: [new TsconfigPathsPlugin({
            configFile: 'tsconfig.json',
            extensions: ['.ts', '.js', '.tsx']
        })]
    },
    plugins: [
        new CopyPlugin({
            patterns: [{
                from: ".", to: "../", context: "public",
                globOptions: {
                    ignore: [
                        '**/screenshots',
                    ]
                }
            }],
            options: {},
        })
    ],

};
