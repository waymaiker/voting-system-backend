# DApps Voting system

Alyra course project - phase 3

## Contents
- [Important](#important)
- [Tests](#tests)
  - [Methods](#methods)
- [How to use this project](#how-to-use-this-project)
- [Need to deploy the contract on Goerli](#need-to-deploy-the-contract-on-goerli)
- [Resources](#resources)

## Important
- [Client repository](https://github.com/waymaiker/nextjs-voting-system)

## Tests
### DOS Attack
We added tests to make sure that **a DoS attack** was not possible <br/>
Added code into [VotingSytem.sol](https://github.com/waymaiker/dapps-voting-system/blob/master/contracts/VotingSystem.sol#L89) <br />
The Javascript test [here](https://github.com/waymaiker/dapps-voting-system/blob/master/test/unit/votingsystem_methods.test.js#L145)

***Currently having 50 tests.***  
Divided into 3 files: 

### WORKFLOW
[file - votingsystem_workflow.test.js](https://github.com/waymaiker/voting-system/blob/master/test/integration/voingsystem_workflow.test.js)

![Ceci est un exemple d’image](https://github.com/waymaiker/voting-system/blob/master/tests_description_workflows.png)

### METHODS
[file - votingsystem_methods.test.js](https://github.com/waymaiker/voting-system/blob/master/test/unit/votingsystem_methods.test.js)
#### What are required to them to work well, what kind of event they should emit while working well and what could make them not working
![Ceci est un exemple d’image](https://github.com/waymaiker/voting-system/blob/master/tests_description_methods.png)

### STATES
[file - votingsystem_state.test.js](https://github.com/waymaiker/voting-system/blob/master/test/unit/votingsytem_state.test.js)
#### What are required to them to work well, what kind of event they should emit while working well and what could make them not working
![Ceci est un exemple d’image](https://github.com/waymaiker/voting-system/blob/master/tests_description_state.png)

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
4- Then execute the next command

#### Need to deploy the contract on Goerli
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
