// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";

/// @notice Only owner can register voters, go to the next status and tally votes. Voters can add a proposal, vote, see information about voters and about proposals
/// @dev To run a vote, follow these steps: Owner addVoter(), startProposalRegistering(), Voter addProposal(), 
/// Owner endProposalRegistering(), Owner startVotingSession(), Voter setVote(), Owner endVotingSession(), Owner tallyVotes 
/// @author Alyra voting contract correction

contract Voting is Ownable {

    uint public winningProposalID;

    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedProposalId;
    }

    struct Proposal {
        string description;
        uint voteCount;
    }

    enum  WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }

    WorkflowStatus public workflowStatus;
    Proposal[] proposalsArray;
    mapping (address => Voter) voters;


    event VoterRegistered(address voterAddress);
    event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);
    event ProposalRegistered(uint proposalId);
    event Voted (address voter, uint proposalId);

    modifier onlyVoters() {
        require(voters[msg.sender].isRegistered, "You're not a voter");
        _;
    }

    // ::::::::::::: GETTERS ::::::::::::: //

    /// @notice Get a registered voter information
    /// @dev Restricted to voters
    /// @param _addr, Registered voter address
    /// @return a voter, which is a structure defined by 3 attributes: isRegistered, hasVoted & votedProposalId
    function getVoter(address _addr) external onlyVoters view returns (Voter memory) {
        return voters[_addr];
    }

    /// @notice Get a specific proposal
    /// @dev Restricted to voters
    /// @param _id of a proposal
    /// @return a proposal, which is a structure defined by 2 attributes: description & voteCount
    function getOneProposal(uint _id) external onlyVoters view returns (Proposal memory) {
        return proposalsArray[_id];
    }

    // ::::::::::::: REGISTRATION ::::::::::::: //

    /// @notice Register a new voter
    /// @dev Restricted to the contract owner
    /// @param _addr of a person
    function addVoter(address _addr) external onlyOwner {
        require(workflowStatus == WorkflowStatus.RegisteringVoters, 'Voters registration is not open yet');
        require(voters[_addr].isRegistered != true, 'Already registered');

        voters[_addr].isRegistered = true;
        emit VoterRegistered(_addr);
    }

    // ::::::::::::: PROPOSAL ::::::::::::: //

    /// @notice Add a proposal
    /// @dev Restricted to voters
    /// @param _desc of a the proposal
    function addProposal(string calldata _desc) external onlyVoters {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationStarted, 'Proposals are not allowed yet');
        require(keccak256(abi.encode(_desc)) != keccak256(abi.encode("")), 'Vous ne pouvez pas ne rien proposer');
        require(proposalsArray.length <= 1000, "You can't more proposals"); // fixing the potential DoS

        Proposal memory proposal;
        proposal.description = _desc;
        proposalsArray.push(proposal);
        emit ProposalRegistered(proposalsArray.length-1);
    }

    // ::::::::::::: VOTE ::::::::::::: //

    /// @notice Add a vote
    /// @dev Restricted to voters
    /// @param _id of the proposal
    function setVote( uint _id) external onlyVoters {
        require(workflowStatus == WorkflowStatus.VotingSessionStarted, 'Voting session havent started yet');
        require(voters[msg.sender].hasVoted != true, 'You have already voted');
        require(_id < proposalsArray.length, 'Proposal not found');

        voters[msg.sender].votedProposalId = _id;
        voters[msg.sender].hasVoted = true;
        proposalsArray[_id].voteCount++;

        emit Voted(msg.sender, _id);
    }

    // ::::::::::::: STATE ::::::::::::: //

    /// @notice Start the proposal registration session
    /// @dev Restricted to the contract owner
    function startProposalsRegistering() external onlyOwner {
        require(workflowStatus == WorkflowStatus.RegisteringVoters, 'Registering proposals cant be started now');
        workflowStatus = WorkflowStatus.ProposalsRegistrationStarted;

        Proposal memory proposal;
        proposal.description = "GENESIS";
        proposalsArray.push(proposal);

        emit WorkflowStatusChange(WorkflowStatus.RegisteringVoters, WorkflowStatus.ProposalsRegistrationStarted);
    }

    /// @notice End the proposal registration seesion
    /// @dev Restricted to the contract owner
    function endProposalsRegistering() external onlyOwner {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationStarted, 'Registering proposals havent started yet');
        workflowStatus = WorkflowStatus.ProposalsRegistrationEnded;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationStarted, WorkflowStatus.ProposalsRegistrationEnded);
    }

    /// @notice Start the voting seesion
    /// @dev Restricted to the contract owner
    function startVotingSession() external onlyOwner {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationEnded, 'Registering proposals phase is not finished');
        workflowStatus = WorkflowStatus.VotingSessionStarted;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationEnded, WorkflowStatus.VotingSessionStarted);
    }

    /// @notice End the voting seesion
    /// @dev Restricted to the contract owner
    function endVotingSession() external onlyOwner {
        require(workflowStatus == WorkflowStatus.VotingSessionStarted, 'Voting session havent started yet');
        workflowStatus = WorkflowStatus.VotingSessionEnded;
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionStarted, WorkflowStatus.VotingSessionEnded);
    }

    /// @notice Tally votes
    /// @dev Restricted to the contract owner
   function tallyVotes() external onlyOwner {
       require(workflowStatus == WorkflowStatus.VotingSessionEnded, "Current status is not voting session ended");
       uint _winningProposalId;
      for (uint256 p = 0; p < proposalsArray.length; p++) {
           if (proposalsArray[p].voteCount > proposalsArray[_winningProposalId].voteCount) {
               _winningProposalId = p;
          }
       }
       winningProposalID = _winningProposalId;

       workflowStatus = WorkflowStatus.VotesTallied;
       emit WorkflowStatusChange(WorkflowStatus.VotingSessionEnded, WorkflowStatus.VotesTallied);
    }
}