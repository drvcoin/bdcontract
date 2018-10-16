#! /usr/bin/env node

const TaskManager = require("../TaskManager.js");
const except = require("../Exception.js");

class AccountApi {
  constructor(request, response) {
  }


  async NewAccount() {
    return TaskManager.createTask("create_account");
  }


  async GetBalance(account) {
    if (!account || account === "") {
      throw new except.InvalidArgumentException("account");
    }

    return TaskManager.createTask("get_balance", { account: account });
  }


  async IssueTokens(account, amount) {
    if (!account || account === "") {
      throw new except.InvalidArgumentException("account");
    }

    if (!amount || amount <= 0) {
      throw new except.InvalidArgumentException("amount");
    }

    return TaskManager.createTask("issue_tokens", { account: account, amount: amount });
  }


  async TransferTokens(from, to, amount) {
    if (!from || from === "") {
      throw new except.InvalidArgumentException("from");
    }
    if (!to || to === "") {
      throw new except.InvalidArgumentException("to");
    }
    if (!amount || amount <= 0) {
      throw new except.InvalidArgumentException("amount");
    }

    return TaskManager.createTask("transfer_tokens", { from: from, to: to, amount: amount });
  }
}


module.exports = AccountApi;