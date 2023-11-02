"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: 'FileServer-Project API Docs',
            version: "1.0.0",
        }
    },
    apis: ['./src/routes/*.ts', './src/controllers/*.ts']
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
const swaggerDocs = (app, port) => {
    // Swagger page
    app.use('/api_docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
    // Docs in JSON format
    app.get('/api_docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });
};
exports.default = swaggerDocs;
