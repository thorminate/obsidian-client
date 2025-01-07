const { spawn } = require("child_process");
const kill = require("tree-kill");
const logger = require("@clack/prompts");
const color = require("picocolors");

const configFile = require("../package.json");

const version = configFile.version;

logger.intro(
  `${color.blueBright("Dev script")} for ${color.magenta(
    configFile.build.productName
  )} ${color.greenBright(`v${version}`)}`
);

let viteProcess; // Track Vite process globally
let tscProcessWatch; // Track tsc -w process globally

function typescript() {
  const s = logger.spinner();
  s.start(`Compiling ${color.bgBlue(" TS ")}...`);
  const tscProcess = spawn("npx", ["tsc"], { shell: true });

  tscProcess.on("close", (code) => {
    if (code !== 0) {
      s.stop("Typescript build failed.");
      process.exit(1);
    } else {
      s.stop(`${color.bgBlue(" TS ")} files ${color.green("compiled")}.`);
      tscProcessWatch = spawn("npx", ["tsc", "-w"], { shell: true });
      vite();
    }
  });
}

function vite() {
  const s = logger.spinner();
  s.start(`Starting ${color.magentaBright("Vite")} dev server...`);

  viteProcess = spawn("npx", ["vite"], { shell: true });

  viteProcess.stdout.on("data", (data) => {
    if (data.toString().includes("ready in ")) {
      s.stop(
        `${color.magentaBright("Vite")} dev server ${color.green("ready")}.`
      );
      electron();
    }
  });
}

function electron() {
  const electronProcess = spawn("npx", ["electron", "."], { shell: true });

  logger.log.success(`${color.blueBright("Electron")} process started.`);

  electronProcess.on("close", (code) => {
    logger.outro(
      `${color.magentaBright(
        "Electron"
      )} process exited with code ${color.green(code)}. Cleaning up...`
    );

    // Ensure Vite is terminated when Electron exits
    if (viteProcess && tscProcessWatch) {
      kill(viteProcess.pid, "SIGTERM", (err) => {
        if (err) {
          logger.log.error(`Failed to kill Vite: ${err.message}`);
        }
      });

      kill(tscProcessWatch.pid, "SIGTERM", (err) => {
        if (err) {
          logger.log.error(`Failed to kill tsc -w: ${err.message}`);
        }
        process.exit(code);
      });
    } else {
      process.exit(code);
    }
  });
}

// Handle Ctrl+C or other termination signals
process.on("SIGINT", () => {
  if (viteProcess && tscProcessWatch) {
    kill(viteProcess.pid, "SIGTERM", (err) => {
      if (err) {
        logger.log.error(`Failed to kill Vite: ${err.message}`);
      }
    });

    kill(tscProcessWatch.pid, "SIGTERM", (err) => {
      if (err) {
        logger.log.error(`Failed to kill tsc -w: ${err.message}`);
      } else {
        logger.outro(`${color.red("Process terminated by user.")}`);
        process.exit();
      }
    });
  } else {
    logger.outro(`${color.red("Process terminated by user.")}`);
    process.exit();
  }
});

typescript();
