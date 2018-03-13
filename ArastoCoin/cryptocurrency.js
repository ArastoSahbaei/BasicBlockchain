const SHA256 = require('crypto-js/SHA256');

class Transaction {
  constructor(fromAddres, toAddress, amount) {
    this.fromAdress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
    this.pendingTransactions = [];
    this.miningReward = 12.5;
  }
}

class Block {
  constructor(timestamp, transactions, previousHash = '') {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
  }

  mineBlock(difficulty) {
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log("Mined Block" + this.hash);
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock];
    this.difficulty = 2;
  }
  /* THE FIRST BLOCK ON A BLOCKCHAIN IS CALLED A 'GENESIS BLOCK' AND SHOULD BE HARDCODED. */
  createGenesisBlock() {
    return new Block("10/3/2018", "Satoshi:200BTC > Vitalik", "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  minePendingTransactions(miningRewardAddress) {
    let block = new Block(Date.now(), this.pendingTransactions);
    block.mineBlock(this.difficulty);

    console.log('Block successfully mined!');
    this.chain.push(block);

    this.pendingTransactions = [
      new Transaction(null, miningRewardAddress, this.miningReward)
    ];
  }

  createTransaction(transaction) {
    this.pendingTransactions.push(transaction);
  }

  getBalanceOfAddress(address) {
    let balance = 0;
    for (const block of this.chain) {
      for (const trans of block.transactions) {
        if (trans.fromAddres === address) {
          balance -= trans.amount;
        }
        if (trans.toAddress === address) {
          balance += trans.amount;
        }
      }
    }
    return balance;
  }

  ChainValidation() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }
}



<!-- This is just a demostration of the functionality -->
/*

let ArastoCoin = new Blockchain();

console.log('Mining Block 1');
ArastoCoin.addBlock(new Block(1, "10/10/2018 12:30" {
  amount: 434
}));
console.log('Mining Block 2');
ArastoCoin.addBlock(new Block(2, "21/12/2018 12:40" {
  amount: 534
}));
