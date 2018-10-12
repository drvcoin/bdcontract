#! /usr/bin/env node

const config = require("../TaskConfig.js");


class Util {
  constructor() {
  }


  static async exec(name, args, cwd, env) {
    const { spawn } = require("child_process");

    let options = {};
    if (cwd) {
      options.cwd = cwd;
    }

    if (env) {
      options.env = Object.assign({}, process.env, env);
    }

    const child = spawn(name, args, options);

    return new Promise((resolve, reject) => {
      let result = {
        stdout : "",
        stderr : "",
        code : 0
      };

      child.stdout.on("data", (data) => {
        result.stdout += data;
      });

      child.stderr.on("data", (data) => {
        result.stderr += data;
      });

      child.on("close", (code) => {
        result.code = code;
        if (resolve) {
          resolve(result);
        }
      });
    });
  }


  static createAddress() {
    const addrLen = 12; // EOS requires regular account name to be exactly 12 characters
    let allowed = "12345abcdefghijklmnopqrstuvwxyz";
    let address = "";

    for (let i = 0; i < addrLen; ++i) {
      address += allowed.charAt(Math.floor(Math.random() * allowed.length));
    }

    return address;
  }


  static getError(result) {
    let input = [ result.stdout, result.stderr ];
    for (let i = 0; i < input.length; ++i) {
      if (!input[i]) {
        continue;
      }

      let line = input[i].split("\n", 1)[0];
      let match = line.match(/Error \d+:/g);
      if (match && match.length > 0) {
        return parseInt(match[0].substr("Error ".length, match[0].length - "Error ".length - 1));
      }
    }

    return null;
  }


  static hasWalletLockedError(result) {
    let error = Util.getError(result);
    return error === 3120003;
  }


  static async unlockWallet() {
    let result = await Util.exec(config.cleos, [ "wallet", "unlock", "-n", config.wallet, "--password", config.wallet_password ]);
    return result.code === 0;
  }


  static async tryExecUnlock(name, args, cwd, env) {
    let result = await Util.exec(name, args, cwd, env);
    if (result.code !== 0) {
      if (Util.hasWalletLockedError(result)) {
        let unlocked = await Util.unlockWallet();
        if (unlocked) {
          result = await Util.exec(name, args, cwd, env);
        }
      }
    }

    return result;
  }
}


module.exports = Util;