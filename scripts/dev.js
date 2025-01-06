const { spawn } = require("child_process");
const logger = require("@clack/prompts");
const color = require("picocolors");

const configFile = require("../package.json");

const version = configFile.version;

logger.intro(
  `${color.blueBright("Dev script")} for ${color.magenta(
    configFile.build.productName
  )} ${color.greenBright(`v${version}`)}`
);

const s = logger.spinner();
s.start(`Compiling ${color.bgBlue(" TS ")}...`);
const tscProcess = spawn("npx", ["tsc"], {
  shell: true,
});

tscProcess.on("close", (code) => {
  if (code !== 0) {
    s.stop("Typescript build failed.");
    process.exit(1);
  } else {
    s.stop(`${color.bgBlue(" TS ")} files ${color.green("compiled")}.`);
    var tscProcessWatch = spawn("npx", ["tsc", "-w"], {
      shell: true,
    });

    const e = logger.spinner();
    e.start(`Starting ${color.magentaBright("vite")} dev server...`);
    var viteProcess = spawn("npx", ["vite"], {
      shell: true,
    });

    viteProcess.stdout.on("data", (data) => {
      if (data.toString().includes("ready in ")) {
        e.stop(
          `${color.magentaBright("Vite")} dev server ${color.green("ready")}.`
        );
        var electronProcess = spawn("npx", ["electron", "."], {
          shell: true,
        });

        logger.log.success(`${color.blueBright("Electron")} process started.`);

        electronProcess.on("close", (code) => {
          logger.outro(
            `${color.magentaBright(
              "Electron"
            )} process exited with code ${color.green(code)}. Exiting...`
          );
          viteProcess.kill();
          tscProcessWatch.kill();
          process.exit(code);
        });
      } else if (data.toString().includes("hmr")) {
        logger.log.step(data.toString());
      }
    });
  }
});
