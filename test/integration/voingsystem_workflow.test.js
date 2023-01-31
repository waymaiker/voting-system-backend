const { assert, expect } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Units tests WORKFLOW of Voting smart contract", function(){
      let accounts;
      let voting;

      before(async () => {
        accounts = await ethers.getSigners()
        deployer = accounts[0]
      })

      describe("Deployment", function() {
        it("should deploy the smart contract", async function() {
          await deployments.fixture(["voting"])
          voting = await ethers.getContract("Voting")
        })
      })

      describe("Tests: WORKFLOW", function() {
        it("The administrator registers a whitelist of voters identified by their Ethereum address", async () => {
          await expect(voting.addVoter(accounts[1].getAddress())).not.to.be.reverted
          await expect(voting.addVoter(accounts[2].getAddress())).not.to.be.reverted
          await expect(voting.addVoter(accounts[3].getAddress())).not.to.be.reverted
          await expect(voting.addVoter(accounts[4].getAddress())).not.to.be.reverted
          await expect(voting.addVoter(accounts[5].getAddress())).not.to.be.reverted
        })

        it("The administrator begins the proposal registration session.", async () => {
          await voting.startProposalsRegistering()
        })

        it("Registered voters are allowed to register their proposals while the registration session is active.", async () => {
          await expect(voting.connect(accounts[1]).addProposal("Proposal 1")).not.to.be.reverted
          await expect(voting.connect(accounts[2]).addProposal("Proposal 2")).not.to.be.reverted
          await expect(voting.connect(accounts[5]).addProposal("Proposal 5")).not.to.be.reverted
        })

        it("The administrator closes the proposal registration session.", async () => {
          await expect(voting.endProposalsRegistering()).not.to.be.reverted
        })

        it("The administrator begins the voting session.", async () => {
          await expect(voting.startVotingSession()).not.to.be.reverted
        })

        it("Registered voters vote for their preferred proposal.", async () => {
          await expect(voting.connect(accounts[1]).setVote(3)).not.to.be.reverted
          await expect(voting.connect(accounts[2]).setVote(3)).not.to.be.reverted
          await expect(voting.connect(accounts[3]).setVote(1)).not.to.be.reverted
          await expect(voting.connect(accounts[4]).setVote(2)).not.to.be.reverted
          await expect(voting.connect(accounts[5]).setVote(3)).not.to.be.reverted

          const voteCountProposal1 = await voting.connect(accounts[1]).getOneProposal(1)
          const voteCountProposal2 = await voting.connect(accounts[1]).getOneProposal(2)
          const voteCountProposal3 = await voting.connect(accounts[1]).getOneProposal(3)

          await assert(voteCountProposal1.voteCount.toString() === ethers.BigNumber.from(1).toString())
          await assert(voteCountProposal2.voteCount.toString() === ethers.BigNumber.from(1).toString())
          await assert(voteCountProposal3.voteCount.toString() === ethers.BigNumber.from(3).toString())
        })

        it("The administrator ends the voting session.", async () => {
          await expect(voting.endVotingSession()).not.to.be.reverted
        })

        it("The administrator counts the votes.", async () => {
          await expect(voting.tallyVotes()).not.to.be.reverted
        })

        it("Everyone can check the final details of the winning proposal, which should be Proposal 5.", async () => {
          const winningProposalID = await voting.winningProposalID.call()

          const winningProposal = await voting.connect(accounts[1]).getOneProposal(ethers.BigNumber.from(winningProposalID))
          await expect(winningProposal.description).to.eq("Proposal 5")
          await expect(ethers.BigNumber.from(winningProposal.voteCount)).to.eq(ethers.BigNumber.from(3))
        })
      })
    })
