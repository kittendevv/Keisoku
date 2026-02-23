export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Keisoku API",
    version: "0.1.0",
    description: "Self-hosted API for tracking stats from anywhere.",
  },
  servers: [{ url: "/" }],
  paths: {
    "/api/providers": {
      get: {
        summary: "List providers",
        responses: {
          200: {
            description: "Providers list",
            content: {
              "application/json": {
                schema: { "$ref": "#/components/schemas/ProvidersResponse" },
              },
            },
          },
        },
      },
    },
    "/api/all": {
      get: {
        summary: "Get all stats",
        parameters: [
          {
            name: "file",
            in: "query",
            required: false,
            schema: { type: "string" },
            description: "Config file suffix for keisoku-{name}.yaml",
          },
        ],
        responses: {
          200: {
            description: "All stats results",
            content: {
              "application/json": {
                schema: { "$ref": "#/components/schemas/AllStatsResponse" },
              },
            },
          },
        },
      },
    },
    "/api/{stat}": {
      get: {
        summary: "Get stat",
        parameters: [
          {
            name: "stat",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
          {
            name: "file",
            in: "query",
            required: false,
            schema: { type: "string" },
            description: "Config file suffix for keisoku-{name}.yaml",
          },
        ],
        responses: {
          200: {
            description: "Stat result",
            content: {
              "application/json": {
                schema: { "$ref": "#/components/schemas/StatResult" },
              },
            },
          },
          400: {
            description: "Bad request",
            content: {
              "application/json": {
                schema: { "$ref": "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Provider: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          description: { type: "string" },
          version: { type: "string" },
          author: { type: "string" },
        },
        required: ["id", "name"],
      },
      ProvidersResponse: {
        type: "object",
        properties: {
          count: { type: "number" },
          providers: {
            type: "array",
            items: { "$ref": "#/components/schemas/Provider" },
          },
        },
        required: ["count", "providers"],
      },
      StatResult: {
        type: "object",
        properties: {
          id: { type: "string" },
          value: { oneOf: [{ type: "number" }, { type: "string" }] },
          formatted: { type: "string" },
          format: { type: "string" },
          updated_at: { type: "number" },
        },
        required: ["id", "value", "formatted", "format", "updated_at"],
      },
      StatError: {
        type: "object",
        properties: {
          error: { type: "string" },
        },
        required: ["error"],
      },
      AllStatsResponse: {
        type: "object",
        additionalProperties: {
          oneOf: [
            { "$ref": "#/components/schemas/StatResult" },
            { "$ref": "#/components/schemas/StatError" },
          ],
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          error: { type: "string" },
        },
        required: ["error"],
      },
    },
  },
} as const;
