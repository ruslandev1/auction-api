import repl from "repl";

import config from "../src/utils/config.js";
import app from "../src/app.js";
import { User, AuctionModel } from "../src/models/init.js";
import UserService from "../src/services/user.js";
import AuctionModelService from "../src/services/auctionmodel.js";

const main = async () => {
  process.stdout.write("Database and Express app initialized.\n");
  process.stdout.write("Autoimported modules: config, app, models, services\n");

  const r = repl.start("> ");
  r.context.config = config;
  r.context.app = app;
  r.context.models = {
    User,
    AuctionModel,
  };
  r.context.services = {
    UserService,
    AuctionModelService,
  };

  r.on("exit", () => {
    process.exit();
  });

  r.setupHistory(".shell_history", () => {});
};

main();
