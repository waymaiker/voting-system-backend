# DApps Voting system

Alyra course project - phase 3

A small organization has decided, to use a new vote system.  
All voters are known to the organization and are whitelisted using their Ethereum address.   
They can submit new proposals during a proposal registration session and can vote on proposals only during the voting session.  
When the administrator has tallied the votes, the vote is closed.

Few rules:  
✔️ Voting is not secret for users added to the Whitelist.  
✔️ Each voter can see the votes of others.  
✔️ The winner is determined by simple majority.  
✔️ The proposal that gets the most votes wins.  

## Contents
- [Important](#important)
- [Tests](#tests)
  - [Methods](#methods)
- [How to use this project](#how-to-use-this-project)
- [Resources](#resources)

## Important

- [My App demo on loom](https://www.loom.com/share/2df1c07a70cd42c6abd4d19e9b214e01)
- [Client repository](https://github.com/waymaiker/nextjs-voting-system)
- [Vercel app](https://nextjs-voting-system-mdczrnyz7-wdevblockchain-gmailcom.vercel.app/)

## Tests
Here I focused on having at least 90% of branch tests coverage.  

![Ceci est un exemple d’image](https://github.com/waymaiker/voting-system/blob/master/test_coverage.png) 

***Currently having 52 tests.***  
Divided into 3 files

### METHODS

We add tests to make sure that **a DoS attack** was not possible <br/>
See the test here https://github.com/waymaiker/dapps-voting-system/blob/master/test/unit/votingsystem_methods.test.js#L145


## How to use this project
This project will require that you have already installed
* Yarn
* Node
* Git

If you are familiar with git and the terminal, here are few steps to follow

### Clone the project
```shell
git clone https://github.com/waymaiker/voting-system.git
```

### Install libraries
```shell
cd voting-system
yarn install
```
### hardhat commands
```shell
# Start the local Blockchain
yarn hardhat node
```

#### In an other terminal tab
```shell
# Deploy your smart contract on localhost hardhat
yarn hardhat deploy
```

#### If you want to deploy on an other network

1- Add the network name and Id into this [helper-hardhat-config.js](https://github.com/waymaiker/dapps-voting-system/blob/master/helper-hardhat-config.js) <br/>
2- Make sur your .env file is all set with you RPC nodes Api Key, Private Key and the Etherscan Api Key <br/>
3- Configure your [hardhat.config.js](https://github.com/waymaiker/dapps-voting-system/blob/master/hardhat.config.js) <br/>
4- Then execute this command

```shell
# Deploy your smart contract on testnet GOERLI
yarn hardhat deploy --network goerli
```

#### test commands
```shell
yarn hardhat test
yarn hardhat coverage
```

## Resources

* https://www.chaijs.com/api/bdd/
* https://hardhat.org/tutorial/testing-contracts
* https://hardhat.org/hardhat-chai-matchers/docs/overview
* https://www.alchemy.com/
* https://docs.ethers.org/v5/api/utils/bignumber/
