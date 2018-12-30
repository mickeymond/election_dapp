pragma solidity >=0.4.21 <0.6.0;

contract Election {
    // Model a candidate
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    // voting EC
    address public ec;

    // Store candidates and fetch candidates
    mapping (uint => Candidate) public candidates;

    // Total candidates
    uint public candidatesCount;

    // store voted accounts
    mapping (address => bool) public voted;

    constructor () public {
        ec = msg.sender;
        addCandidate("Candidate 1");
        addCandidate("Candidate 2");
    }

    function addCandidate(string _name) private {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }

    function vote(uint _candidateId) public payable {
        // require voting payment
        require(msg.value == 7214600000000000);
        // require voter is not ec
        require(msg.sender != ec);
        // require that voter has not voted
        require(!voted[msg.sender]);
        // require valid candidate
        require(_candidateId > 0 && _candidateId <= candidatesCount);
        // record that voter has voted
        voted[msg.sender] = true;
        // update candidate vote count
        candidates[_candidateId].voteCount++;
    }

    function endElection() public {
        // require ec
        require(msg.sender == ec);
        // detroy contract and transfer tokens
        selfdestruct(msg.sender);
    }
}
