#! /usr/bin/env node

const config = require("../TaskConfig.js");
const Util = require("../Util.js");


function parseArgs() {
  const ArgumentParser = require("argparse").ArgumentParser;
  let parser = new ArgumentParser({
    version: "0.0.1",
    addHelp: true,
    description: "DRV Get Balance Task"
  });

  parser.addArgument(
    [ "--account" ],
    {
      help: "Account name"
    }
  );

  return parser.parseArgs();
}


async function getBalance(account) {
  let result = await Util.execEOS([ "get", "currency", "balance", config.token_contract, account, config.symbol ]);
  if (result.code !== 0) {
    throw result;
  }

  if (result.stdout === "") {
    return 0;
  }

  return parseFloat(result.stdout.split(" ", 1)[0]);
}


async function run() {
  let args = parseArgs();
  return await getBalance(Util.parseArg(args.account));
}


run().then(balance => {
  console.log(JSON.stringify(balance));
}).catch(ex => {
  console.error(Util.toErrorJSON(ex));
  process.exit(1);
});
