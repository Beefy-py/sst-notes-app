import { StorageStack } from "./StorageStack";
import { AuthApiStack } from "./AuthApiStack";
import { FrontendStack } from "./FrontendStack";

export default function main(app) {
  app.setDefaultFunctionProps({
    runtime: "nodejs16.x",
    srcPath: "backend",
    bundle: {
      format: "esm",
    },
  });

  if (app.stage === "dev") {
    app.setDefaultRemovalPolicy("destroy");
  }

  app.stack(StorageStack).stack(AuthApiStack).stack(FrontendStack);
}
