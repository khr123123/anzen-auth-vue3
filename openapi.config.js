import { generateService } from "@umijs/openapi"
generateService({
    requestLibPath: "import request from '@/utils/http.ts'",
    schemaPath: "http://localhost:8080/api/v3/api-docs/default",
    serversPath: "./src",
});
