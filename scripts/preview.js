const logger = require("@clack/prompts");
const color = require("picocolors");
const { spawn } = require("child_process");

const configFile = require("../package.json");

const version = configFile.version;

logger.intro(
  `${color.blueBright("Preview script")} for ${color.magenta(
    configFile.build.productName
  )} ${color.greenBright(`v${version}`)}`
);

function vueTypescript() {
  const s = logger.spinner();
  s.start(`Compiling ${color.bgGreen("Vue")}...`);
  const tscProcess = spawn("npx", ["vue-tsc", "--noEmit"], {
    shell: true,
  });

  tscProcess.on("close", (code) => {
    if (code !== 0) {
      logger.log.error("Typescript build failed.");
      process.exit(1);
    } else {
      s.stop(`${color.bgGreen("Vue")} files ${color.green("compiled")}.`);
      vite();
    }
  });
}

function vite() {
  const s = logger.spinner();
  s.start(`Starting ${color.magentaBright("vite")} dev server...`);
  const viteProcess = spawn("npx", ["vite"], {
    shell: true,
  });

  viteProcess.stdout.on("data", (data) => {
    if (data.toString().includes("ready in ")) {
      s.stop(
        `${color.magentaBright("Vite")} dev server ${color.green("ready")}.`
      );
      typescript();
    }
  });
}

function typescript() {
  const s = logger.spinner();
  s.start(`Compiling ${color.bgBlue(" TS ")}...`);
  const tscProcess = spawn("npx", ["tsc"], {
    shell: true,
  });
  tscProcess.on("close", (code) => {
    if (code !== 0) {
      logger.log.error("Typescript build failed.");
      process.exit(1);
    } else {
      s.stop(`${color.bgBlue(" TS ")} files ${color.green("compiled")}.`);
      electron();
    }
  });
}

function electron() {
  const electronProcess = spawn("npx", ["electron", "."], {
    shell: true,
  });

  logger.log.success(`${color.blueBright("Electron")} process started.`);

  electronProcess.on("close", (code) => {
    logger.outro(
      `${color.blueBright("Electron")} process exited with code ${code}.`
    );
    process.exit(0);
  });
}

vueTypescript();