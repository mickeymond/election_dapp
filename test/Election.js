var Election = artifacts.require("./Election.sol");

contract("Election", function(accounts) {
    it("Initializes 2 candidate", async function() {
        const electionInstance = await Election.deployed();

        const candidatesCount = await electionInstance.candidatesCount();
        assert.equal(candidatesCount, 2);
    });

    it("Allows successful voting", async function() {
        const electionInstance = await Election.deployed();

        const candidateId = 2;
        const voter = accounts[1];

        const reciept = await electionInstance.vote(candidateId, { from: voter });

        const hasVoted = await electionInstance.voted(voter);
        assert(hasVoted);

        const votedFor = await electionInstance.candidates(candidateId);
        assert.equal(votedFor[2].toNumber(), 1);
    });
});
