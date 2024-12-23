import { spawn } from "child_process";
import { existsSync, rmSync } from "fs";

existsSync("./dist") && rmSync("./dist", { recursive: true, force: true });
existsSync("./node_modules") &&
  rmSync("./node_modules", { recursive: true, force: true });
existsSync("./package-lock.json") &&
  rmSync("./package-lock.json", { recursive: true, force: true });

spawn("npm", ["i"], { stdio: "inherit" });
