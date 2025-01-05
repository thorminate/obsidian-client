const logger = require("@clack/prompts");
const color = require("picocolors");
const { spawn } = require("child_process");
const {
  writeFileSync,
  promises: { rm, mkdir, rename },
} = require("fs");
const configFile = require("../package.json");

const cache = new Map();
const version = configFile.version;
const linuxFilename = `${configFile.build.productName} ${version} Linux`;
const macFilename = `${configFile.build.productName} ${version} Mac`;
const winFilename = `${configFile.build.productName} ${version} Windows`;

(async () => {
  logger.intro(
    `${color.blueBright("Build script")} for ${color.magenta(
      configFile.build.productName
    )} ${color.greenBright(`v${version}`)}`
  );

  const targets = await logger.multiselect({
    message: "Select targets:",
    options: [
      { label: "Windows", value: "win", hint: "builds for x64" },
      {
        label: "Linux",
        value: "linux",
        hint: "requires Linux to be the host platform, builds for x64 and arm64",
      },
      {
        label: "Mac",
        value: "mac",
        hint: "requires MacOS to be the host platform, builds for universal",
      },
    ],
    required: true,
  });

  cache.set("targets", targets);

  preBuild();
})();

const preBuild = async function () {
  const s = logger.spinner();
  await cleanupPre(s);

  buildVite();
};

const buildVite = function () {
  const s = logger.spinner();
  s.start(`Building ${color.magentaBright("vite")} app...`);

  const viteProcess = spawn(
    "npx",
    ["vue-tsc", "--noEmit", "&&", "npx", "vite", "build"],
    {
      shell: true,
      stdio: ["ignore", "ignore", "inherit"],
    }
  );

  viteProcess.on("close", (code) => {
    if (code !== 0) {
      logger.log.error("Vite build failed.");
      process.exit(1);
    } else {
      s.stop(`${color.magentaBright("Vite")} app ${color.green("built")}.`);
      buildTypescript();
    }
  });
};

const buildTypescript = function () {
  const s = logger.spinner();
  s.start(`Compiling ${color.bgBlue(" TS ")}...`);
  const tscProcess = spawn("npx", ["tsc"], {
    shell: true,
    stdio: ["ignore", "ignore", "inherit"],
  });
  tscProcess.on("close", (code) => {
    if (code !== 0) {
      logger.log.error("Typescript build failed.");
      process.exit(1);
    } else {
      s.stop(`${color.bgBlue(" TS ")} files ${color.green("compiled")}.`);
      buildWindowsInstaller();
    }
  });
};

const buildWindowsInstaller = function () {
  const isTarget = cache.get("targets").includes("win") ? true : false;

  if (!isTarget) {
    buildLinuxInstallers();
    return;
  }

  const s = logger.spinner();
  s.start(`Building ${color.blueBright("Windows")} installer...`);

  writeFileSync(`releases/${version}/win/${winFilename}.exe`, "", {
    recursive: true,
  });

  const ebProcess = spawn("npx", ["electron-builder", "--win", "--x64"], {
    shell: true,
    stdio: ["ignore", "ignore", "inherit"],
  });

  ebProcess.on("close", (code) => {
    if (code !== 0) {
      logger.log.error("Windows installer build failed.");
      process.exit(1);
    } else {
      s.stop(
        `${color.blueBright("Windows")} installer ${color.green("built")}.`
      );
      buildLinuxInstallers();
    }
  });
};

const buildLinuxInstallers = function () {
  const isTarget = cache.get("targets").includes("linux") ? true : false;

  if (!isTarget) {
    buildMacInstaller();
    return;
  } else if (process.platform !== "linux") {
    logger.log.error(
      "Linux builds can only be built on Linux. (see https://github.com/electron-userland/electron-build-service/issues/9) Try building on WSL."
    );
    buildMacInstaller();
    return;
  }

  const s = logger.spinner();
  s.start(`Building ${color.red("Linux")} installers...`);

  const ebProcess = spawn("npx", ["electron-builder", "--linux"], {
    shell: true,
    stdio: ["ignore", "ignore", "inherit"],
  });

  ebProcess.on("close", (code) => {
    if (code !== 0) {
      s.stop("Linux installers build failed.", 1);
      process.exit(1);
    } else {
      s.stop(`${color.red("Linux")} installers ${color.green("built")}.`);
      buildMacInstaller();
    }
  });
};

const buildMacInstaller = function () {
  const isTarget = cache.get("targets").includes("mac") ? true : false;

  if (!isTarget) {
    postBuild();
    return;
  } else if (process.platform !== "darwin") {
    logger.log.error("Mac builds can only be built on MacOS.");
    postBuild();
    return;
  }

  const s = logger.spinner();
  s.start(`Building Mac...`);

  const ebProcess = spawn("npx", ["electron-builder", "--mac", "--universal"], {
    shell: true,
    stdio: ["ignore", "ignore", "inherit"],
  });

  ebProcess.on("close", (code) => {
    if (code !== 0) {
      logger.log.error("Mac installer build failed.");
      process.exit(1);
    } else {
      s.stop(`Mac installer ${color.green("built")}.`);
    }
  });
};

const postBuild = function () {
  const s = logger.spinner();
  s.start("Build(s) complete, cleaning up...");
  cleanupPost();
  s.stop(`${color.cyanBright("Cleanup")} ${color.green("complete")}.`);
  logger.outro(
    `Build(s) ${color.green("complete")} and ${color.green(
      "ready"
    )} for ${color.magentaBright("distribution")}.`
  );
};

const cleanupPre = async function (s) {
  await s.start(
    `Removing interfering builds and structuring ${color.yellow(
      "directories"
    )}...`
  );

  await rm("dist", { recursive: true, force: true }).catch((err) => {
    if (err.code === "EBUSY") {
      logger.log.error(
        "A file in the releases/temp directory is in use. Restart your computer and try again."
      );
    } else if (err.code === "ENOENT") {
    } else {
      logger.log.error(err);
    }
  });
  await rm("releases/temp", { recursive: true, force: true }).catch((err) => {
    if (err.code === "EBUSY") {
      logger.log.error(
        "A file in the releases/temp directory is in use. Restart your computer and try again."
      );
    } else if (err.code === "ENOENT") {
    } else {
      logger.log.error(err);
    }
  });
  await rm(`releases/${version}`, { recursive: true, force: true }).catch(
    (err) => {
      if (err.code === "EBUSY") {
        logger.log.error(
          "A file in the releases/temp directory is in use. Restart your computer and try again."
        );
      } else if (err.code === "ENOENT") {
      } else {
        logger.log.error(err);
      }
    }
  );

  await mkdir(`releases/${version}/win`, { recursive: true });
  await mkdir(`releases/${version}/mac`, { recursive: true });
  await mkdir(`releases/${version}/linux`, { recursive: true });

  await s.stop(`Directories ${color.green("structured")}.`);
};

const cleanupPost = async function () {
  await rm("dist", { recursive: true, force: true }).catch((err) => {
    if (err.code === "EBUSY") {
      logger.log.error(
        "A file in the releases/temp directory is in use. Restart your computer and try again."
      );
    }
    if (err.code === "ENOENT") {
    } else {
      logger.log.error(err);
    }
  });
  await rm("releases/temp", { recursive: true, force: true }).catch((err) => {
    if (err.code === "EBUSY") {
      logger.log.error(
        "A file in the releases/temp directory is in use. Restart your computer and try again."
      );
    } else if (err.code === "ENOENT") {
    } else {
      logger.log.error(err);
    }
  });
  await rm(`releases/${version}/mac/${macFilename}.dmg.blockmap`, {
    recursive: true,
    force: true,
  }).catch((err) => {
    if (err.code === "ENOENT") {
    } else if (err.code === "EBUSY") {
    } else {
      logger.log.error(err);
    }
  });
  await rm(`releases/${version}/win/${winFilename}.exe.blockmap`, {
    recursive: true,
    force: true,
  }).catch((err) => {
    if (err.code === "ENOENT") {
    } else if (err.code === "EBUSY") {
    } else {
      logger.log.error(err);
    }
  });
};
