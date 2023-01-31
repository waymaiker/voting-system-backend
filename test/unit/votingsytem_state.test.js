const { expect, assert } = require("chai");
const { network, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Units tests STATE of Voting smart contract", function(){
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

      describe("Tests: STATES", function() {
        beforeEach(async() => {
          await deployments.fixture(["voting"])
          voting = await ethers.getContract("Voting")
        })

        describe("Validations", function(){
          describe("startProposalsRegistering", async function(){
            it("should start a proposal registering session", async function(){
              await expect(voting.startProposalsRegistering()).not.to.be.reverted
            })
          })

          describe("endProposalsRegistering", async function(){
            it("should end a proposal registering session", async function(){
              await voting.startProposalsRegistering()
              await expect(await voting.endProposalsRegistering()).not.to.be.reverted
            })
          })

          describe("startVotingSession", async function(){
            it("should start a voting registering session", async function(){
              // Starting the Proposal Registering session, also create a genesis proposal
              await voting.startProposalsRegistering()
              await voting.endProposalsRegistering()
              await expect(await voting.startVotingSession()).not.to.be.reverted
            })
          })

          describe("endVotingSession", async function(){
            it("should end a voting registering session", async function(){
              await voting.startProposalsRegistering()
              await voting.endProposalsRegistering()
              await voting.startVotingSession()
              await expect(await voting.endVotingSession()).not.to.be.reverted
            })
          })

          describe("tallyVotes", async function(){
            it("should set the winning proposal id", async function(){
              await voting.startProposalsRegistering()
              await voting.endProposalsRegistering()
              await voting.startVotingSession()
              await voting.endVotingSession()

              await expect(voting.tallyVotes()).not.to.be.reverted
              const winningProposalID = await voting.winningProposalID.call()

              // No vote has been made, proposal genesis is by default the winning proposal
              await assert(ethers.BigNumber.from(winningProposalID).toString() === ethers.BigNumber.from(0).toString())
            })
          })
        })

        describe("Events", function(){
          let currentStatus
          const RegisteringVoters = ethers.BigNumber.from(0);
          const ProposalsRegistrationStarted = ethers.BigNumber.from(1);
          const ProposalsRegistrationEnded = ethers.BigNumber.from(2);
          const VotingSessionStarted = ethers.BigNumber.from(3);
          const VotingSessionEnded = ethers.BigNumber.from(4);
          const VotesTallied = ethers.BigNumber.from(5);

          describe("startProposalsRegistering", async function(){
            it("should EMITS WorkflowStatusChange from ResgisteredVoters to ProposalsRegistrationStarted", async function(){
              currentStatus = await voting.workflowStatus.call();
              assert(ethers.BigNumber.from(currentStatus).toString() === RegisteringVoters.toString())

              await expect(voting.startProposalsRegistering())
                .to.emit(voting, "WorkflowStatusChange")
                .withArgs(0, 1)

              currentStatus = await voting.workflowStatus.call();
              assert(ethers.BigNumber.from(currentStatus).toString() === ProposalsRegistrationStarted.toString())
            })
          })

          describe("endProposalsRegistering", async function(){
            it("should EMITS WorkflowStatusChange from ProposalsRegistrationStarted to ProposalsRegistrationEnded", async function(){
              await voting.startProposalsRegistering()
              currentStatus = await voting.workflowStatus.call();
              assert(ethers.BigNumber.from(currentStatus).toString() === ProposalsRegistrationStarted.toString())

              await expect(await voting.endProposalsRegistering())
                .to.emit(voting, "WorkflowStatusChange")
                .withArgs(1, 2)

              currentStatus = await voting.workflowStatus.call();
              assert(ethers.BigNumber.from(currentStatus).toString() === ProposalsRegistrationEnded.toString())
            })
          })

          describe("startVotingSession", async function(){
            it("should EMITS WorkflowStatusChange from ProposalsRegistrationEnded to VotingSessionStarted", async function(){
              await voting.startProposalsRegistering()
              await voting.endProposalsRegistering()
              currentStatus = await voting.workflowStatus.call();
              assert(ethers.BigNumber.from(currentStatus).toString() === ProposalsRegistrationEnded.toString())

              await expect(await voting.startVotingSession())
                .to.emit(voting, "WorkflowStatusChange")
                .withArgs(2, 3)

              currentStatus = await voting.workflowStatus.call();
              assert(ethers.BigNumber.from(currentStatus).toString() === VotingSessionStarted.toString())
            })
          })

          describe("endVotingSession", async function(){
            it("should EMITS WorkflowStatusChange from VotingSessionStarted to VotingSessionEnded", async function(){
              await voting.startProposalsRegistering()
              await voting.endProposalsRegistering()
              await voting.startVotingSession()
              currentStatus = await voting.workflowStatus.call();
              assert(ethers.BigNumber.from(currentStatus).toString() === VotingSessionStarted.toString())

              await expect(await voting.endVotingSession())
                .to.emit(voting, "WorkflowStatusChange")
                .withArgs(3, 4)

              currentStatus = await voting.workflowStatus.call();
              assert(ethers.BigNumber.from(currentStatus).toString() === VotingSessionEnded.toString())
            })
          })

          describe("tallyVotes", async function(){
            it("should EMITS WorkflowStatusChange from VotingSessionEnded to VotesTallied", async function(){
              await voting.startProposalsRegistering()
              await voting.endProposalsRegistering()
              await voting.startVotingSession()
              await voting.endVotingSession()
              currentStatus = await voting.workflowStatus.call();
              assert(ethers.BigNumber.from(currentStatus).toString() === VotingSessionEnded.toString())

              await expect(await voting.tallyVotes())
                .to.emit(voting, "WorkflowStatusChange")
                .withArgs(4, 5)

              currentStatus = await voting.workflowStatus.call();
              assert(ethers.BigNumber.from(currentStatus).toString() === VotesTallied.toString())
            })
          })
        })

        describe("Requires", function(){
          describe("startProposalsRegistering", async function(){
            it("REVERT, when it is not the contract owner, who try to start a proposal registering session", async function(){
              await expect(voting.connect(accounts[1]).startProposalsRegistering()).to.be.revertedWith("Ownable: caller is not the owner")
            })
          })

          describe("endProposalsRegistering", async function(){
            it("REVERT, when it is not the contract owner, who try to end a proposal registering session", async function(){
              await expect(voting.connect(accounts[1]).endProposalsRegistering()).to.be.revertedWith("Ownable: caller is not the owner")
            })

            it("REVERT, when owner try to process and the current status is not equals to ProposalsRegistrationStarted", async function(){
              await expect(voting.endProposalsRegistering()).to.be.revertedWith("Registering proposals havent started yet")
            })
          })

          describe("startVotingSession", async function(){
            it("REVERT, when it is not the contract owner, who try to start a voting session", async function(){
              await expect(voting.connect(accounts[1]).startVotingSession()).to.be.revertedWith("Ownable: caller is not the owner")
            })

            it("REVERT, when owner try to process and the current status is not equals to ProposalsRegistrationEnded", async function(){
              await expect(voting.startVotingSession()).to.be.revertedWith("Registering proposals phase is not finished")
            })
          })

          describe("endVotingSession", async function(){
            it("REVERT, when it is not the contract owner, who try to end a voting session", async function(){
              await expect(voting.connect(accounts[1]).endVotingSession()).to.be.revertedWith("Ownable: caller is not the owner")
            })

            it("REVERT, when owner try to process and the current status is not equals to VotingSessionStarted", async function(){
              await expect(voting.endVotingSession()).to.be.revertedWith("Voting session havent started yet")
            })
          })

          describe("tallyVotes", async function(){
            it("REVERT, when it is not the contract owner, who try to tally the votes", async function(){
              await expect(voting.connect(accounts[1]).tallyVotes()).to.be.revertedWith("Ownable: caller is not the owner")
            })

            it("REVERT, when owner try to process and the current status is not equals to VotingSessionEnded", async function(){
              await expect(voting.tallyVotes()).to.be.revertedWith("Current status is not voting session ended")
            })
          })
      })
    })
  })