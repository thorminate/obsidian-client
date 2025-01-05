#!/usr/bin/env node

import { spawn } from "child_process";
import { rmSync, mkdirSync, writeFileSync, renameSync } from "fs";
import logger from "node-color-log";
import cleanup from "../scripts/build-cleanup-pre.js";
import configFile from "../package.json" with { type: "json" };

const debugMode = process.argv.includes("--debug");

const postBuild = function () {
  logger.info(
    "Structuring directories for build. Removing interfering builds, if present."
  );

  cleanup();
  rmSync(`releases/${configFile.version}`, { recursive: true, force: true });
  mkdirSync(`releases/${configFile.version}/linux`, { recursive: true });
  mkdirSync(`releases/${configFile.version}/mac`, { recursive: true });
  mkdirSync(`releases/${configFile.version}/win`, { recursive: true });
  writeFileSync(
    `releases/${configFile.version}/win/${configFile.build.productName}_${configFile.version}_win-x64.exe`,
    ""
  );

  buildNuxt();
};

const buildNuxt = function () {
  logger.info("Compiling Nuxt... [nuxt build]");
  const viteBuild = spawn("nuxt", ["build"], { shell: true });

  viteBuild.on("close", (code) => {
    if (code !== 0) {
      logger.error("Nuxt build failed.");
      process.exit(1);
    } else {
      logger.info("Nuxt build complete.");
      buildTypescript();
    }
  });
};

const buildTypescript = function () {
  logger.info("Compiling Typescript... [tsc]");
  const tsBuild = spawn("tsc", { shell: true });

  tsBuild.on("close", (code) => {
    if (code !== 0) {
      logger.error("Typescript build failed.");
      process.exit(1);
    } else {
      logger.info("Typescript build complete.");
      buildWindowsInstallerX64();
    }
  });
};

const buildWindowsInstallerX64 = function () {
  logger.info(
    "Building the windows installer... (x64, nsis, this will take a while...)"
  );

  const electronBuild = spawn("electron-builder", ["--win", "--x64"], {
    shell: true,
  });

  electronBuild.stdout.on("data", (data) => {
    if (!debugMode) {
      if (data.toString().includes(`electron-builder  version=`)) {
        logger.info("꜔ Electron builder initialized.");
      } else if (
        data.toString().includes(`loaded configuration  file=package.json`)
      ) {
        logger.info("꜔ Electron builder configuration loaded from package.json.");
      } else if (
        data.toString().includes(`completed installing native dependencies`)
      ) {
        logger.info("꜔ Electron builder native dependencies installed.");
      } else if (
        data
          .toString()
          .includes(
            `signing with signtool.exe  path=releases/win-unpacked/Obsidian Client.exe`
          )
      ) {
        logger.info(
          "꜔ Signing application executable with signtool.exe... (this can take a while...)"
        );
      } else if (
        data
          .toString()
          .includes(
            `signing with signtool.exe  path=releases/win-unpacked/resources/elevate.exe`
          )
      ) {
        logger.info("꜔ Application Packaged");
        logger.info(
          "꜔ Signing application elevator with signtool.exe... (this can take a while...)"
        );
      } else if (
        data
          .toString()
          .includes(
            `signing with signtool.exe  path=releases/__uninstaller-nsis-obsidian-client.exe`
          )
      ) {
        logger.info(
          "꜔ Signing application uninstaller with signtool.exe... (this can take a while...)"
        );
      } else if (
        data
          .toString()
          .includes(
            `signing with signtool.exe  path=releases/0.0.1-snapshot.0/win/Obsidian Client_0.0.1-snapshot.0_win-x64.exe`
          )
      ) {
        logger.info(
          "꜔ Signing application installer with signtool.exe... (this can take a while...)"
        );
      } else if (
        data
          .toString()
          .includes(
            `no signing info identified, signing is skipped  signHook=false cscInfo=null`
          )
      ) {
        logger.info("꜔ No signing info identified, signing is skipped.");
      } else if (data.toString().includes(`building block map`)) {
        logger.info(
          "꜔ Building application block map... (this can take a while...)"
        );
      }
    } else {
      logger.info(data.toString());
    }
  });

  electronBuild.on("close", (code) => {
    if (code !== 0) {
      logger.error("Windows installer build failed.");
      process.exit(1);
    } else {
      logger.info("Windows installer build complete.");

      buildLinuxInstallerX64();
    }
  });
};

const buildLinuxInstallerX64 = function () {
  logger.info(
    "Building the linux installer... (x64, AppImage, this will also take a while...)"
  );

  const electronBuild = spawn("electron-builder", ["--linux", "--x64"], {
    shell: true,
  });

  electronBuild.stdout.on("data", (data) => {
    if (!debugMode) {
      if (data.toString().includes(`electron-builder  version=`)) {
        logger.info("꜔ Electron builder initialized.");
      } else if (
        data.toString().includes(`loaded configuration  file=package.json`)
      ) {
        logger.info("꜔ Electron builder configuration loaded from package.json.");
      } else if (
        data.toString().includes(`completed installing native dependencies`)
      ) {
        logger.info("꜔ Electron builder native dependencies installed.");
      } else if (
        data.toString().includes(`packaging       platform=linux arch=x64`)
      ) {
        logger.info("꜔ Packaging application for linux x64...");
      } else if (
        data.toString().includes(`building        target=AppImage arch=x64`)
      ) {
        logger.info("꜔ Packaging complete.");
        logger.info("꜔ Building installer...");
      }
    } else {
      logger.info(data.toString());
    }
  });

  electronBuild.on("close", (code) => {
    if (code !== 0) {
      logger.error("x64 Linux installer build failed.");
      process.exit(1);
    } else {
      logger.info("x64 Linux installer build complete.");
      logger.info(
        "Hotswapping Linux installer to make way for arm64 Linux installer"
      );
      renameSync(
        `releases/${configFile.version}/linux/Obsidian Client_${configFile.version}_linux-arm64.AppImage`,
        `releases/${configFile.version}/linux/Obsidian Client_${configFile.version}_linux-x64.AppImage`
      );

      buildLinuxInstallerArm64();
    }
  });
};

const buildLinuxInstallerArm64 = function () {
  logger.info(
    "Building the linux installer... (arm64, AppImage, this will also also take a while...)"
  );
  const electronBuild = spawn("electron-builder", ["--linux", "--arm64"], {
    shell: true,
  });

  electronBuild.stdout.on("data", (data) => {
    if (!debugMode) {
      if (data.toString().includes(`electron-builder  version=`)) {
        logger.info("꜔ Electron builder initialized.");
      } else if (
        data.toString().includes(`loaded configuration  file=package.json`)
      ) {
        logger.info("꜔ Electron builder configuration loaded from package.json.");
      } else if (
        data.toString().includes(`completed installing native dependencies`)
      ) {
        logger.info("꜔ Electron builder native dependencies installed.");
      } else if (
        data.toString().includes(`packaging       platform=linux arch=arm64`)
      ) {
        logger.info("꜔ Packaging application for linux x64...");
      } else if (
        data.toString().includes(`building        target=AppImage arch=arm64`)
      ) {
        logger.info("꜔ Packaging complete.");
        logger.info("꜔ Building application...");
      }
  } else {
      logger.info(data.toString());
    }
  });

  electronBuild.on("close", (code) => {
    if (code !== 0) {
      logger.error("arm64 Linux installer build failed.");
      process.exit(1);
    } else {
      logger.info("arm64 Linux installer build complete.");
      if (process.platform === "darwin") {
        buildMacInstaller();
      } else {
        logger.info("All installers built. Cleaning up...");
        cleanup();
        logger.info("Done.");
      }
    }
  });
};

const buildMacInstaller = function () {
  logger.info(
    "Building the mac installer... (this will also also also take a while...)"
  );
  logger.warn(
    "This process is a beta feature and may not work as expected. Please report any issues."
  );

  const electronBuild = spawn("electron-builder", ["--mac", "--universal"], {
    shell: true,
  });

  electronBuild.stdout.on("data", (data) => {
    console.log(data.toString());
  });

  electronBuild.on("close", (code) => {
    if (code !== 0) {
      console.error("Universal Mac installer build failed.");
      process.exit(1);
    } else {
      console.log("All installers built. Cleaning up...");
      cleanup();
      console.log("Done.");
    }
  });
};
postBuild();
