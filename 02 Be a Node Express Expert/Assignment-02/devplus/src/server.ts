import app from "./app";
import { config } from "./config";
import { initDB } from "./db";

const main = async () => {
  try {
    await initDB();
    app.listen(config.port, () => {
      console.log(`app listening on port ${config.port}`);
    });
  } catch (err) {
    console.error("Server failed to start", err);
    process.exit(1);
  }
};

main();
