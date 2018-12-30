import React, { Component } from 'react';

class Election extends Component {

    state = { for: '', candidates: [], message: '', hasVoted: false, ec: '' };

    async vote(e) {
        e.preventDefault();
        this.setState({ message: "Waiting for transaction!!!" });

        const Election = this.props.drizzle.contracts.Election;
        try {
            await Election.methods.vote(this.state.for).send({ value: 7214600000000000 });

            window.location.reload();
        } catch (e) {
            this.setState({ message: e.message });
        }
    }

    async endElection(e) {
        e.preventDefault();
        this.setState({ message: "Waiting for transaction!!!" });

        const Election = this.props.drizzle.contracts.Election;
        try {
            await Election.methods.endElection().send();

            window.location.reload();
        } catch (e) {
            this.setState({ message: e.message });
        }
    }

    async componentDidMount() {
        // window.ethereum.on('accountsChanged', function (accounts) {
        //     window.location.reload();
        // });

        const Election = this.props.drizzle.contracts.Election;

        const candidatesCount = await Election.methods.candidatesCount().call();

        const candidates = [];
        for(let i = 1; i <= candidatesCount; i++) {
            const candidate = await Election.methods.candidates(i).call();
            candidates.push(candidate);
        }

        const ec = await Election.methods.ec().call();

        const hasVoted = await Election.methods.voted(this.props.drizzleState.accounts[0]).call();

        this.setState({ candidates, hasVoted, ec });
    }

    renderCandidates() {
        return this.state.candidates.map(each => {
            return (
                <tr key={each.id}>
                    <th scope="row">{each.id}</th>
                    <td>{each.name}</td>
                    <td>{each.voteCount}</td>
                </tr>
            );
        });
    }

    renderOptions() {
        return this.state.candidates.map(each => <option key={each.id} value={each.id}>{each.name}</option>);
    }

    renderForm() {
        if(this.state.hasVoted) {
            return <p className="text-success"><strong>You have already casted your vote!!!</strong></p>
        }

        return (
            <form onSubmit={this.vote.bind(this)}>
                <div className="input-group">
                    <select
                        required
                        className="custom-select"
                        value={this.state.for}
                        onChange={(e) => this.setState({ for: e.target.value })}
                    >
                        <option value="" disabled>Please Choose A Candidate...</option>
                        {this.renderOptions()}
                    </select>
                    <div className="input-group-append">
                        <button className="btn btn-success" type="submit">Cast Vote</button>
                    </div>
                </div>
            </form>
        );
    }
    
    render() {
        return (
            <div>
                <h1 className="mb-3"><strong>BLOCKCHAIN VOTING APPLICATION</strong></h1>
                <h5 className="mb-3 text-info">This is a prototype voting app running on the ethereum network.</h5>
                <h5 className="mb-3">Election is managed by: <strong>{this.state.ec}</strong></h5>
                {this.props.drizzleState.accounts[0] === this.state.ec ? <button onClick={this.endElection.bind(this)} className="mb-3 btn btn-danger">End Election</button> : ''}
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Name</th>
                            <th scope="col">Vote Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderCandidates()}
                    </tbody>
                </table>
                <hr />
                    {this.props.drizzleState.accounts[0] === this.state.ec ? <p>EC cannot vote!!!</p> : this.renderForm()}
                <hr />
                <p>Your Account is: <strong>{this.props.drizzleState.accounts[0]}</strong></p>
                <hr />
                <p>{this.state.message}</p>
            </div>
        );
    }
}

export default Election;
