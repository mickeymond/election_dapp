import React, { Component } from 'react';
import { Divider, Container, Button, Header, Segment, Message , Dropdown, Table, Label } from 'semantic-ui-react';
import toastr from 'toastr/build/toastr.min.js';

class Election extends Component {

    state = { for: '', candidates: [], message: '', hasVoted: false, ec: '' };

    async vote(e) {
        e.preventDefault();
        this.props.showLoader();

        const Election = this.props.drizzle.contracts.Election;
        try {
            await Election.methods.vote(this.state.for).send({ value: 7214600000000000 });

            window.location.reload();
        } catch (e) {
            this.props.hideLoader();
            toastr.error(e.message);
        }
    }

    async endElection(e) {
        e.preventDefault();
        this.props.showLoader();

        const Election = this.props.drizzle.contracts.Election;
        try {
            await Election.methods.endElection().send();

            window.location.reload();
        } catch (e) {
            this.props.hideLoader();
            toastr.error(e.message);
        }
    }

    async componentDidMount() {
        if(window.ethereum) {
            window.ethereum.on('accountsChanged', function (accounts) {
                window.location.reload();
            });
        }

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
        return this.state.candidates.map(({ id, name, voteCount }) => {
            return (
                <Table.Row key={id}>
                    <Table.Cell>
                    <Label ribbon>{id}</Label>
                    </Table.Cell>
                    <Table.Cell>{name}</Table.Cell>
                    <Table.Cell>{voteCount}</Table.Cell>
                </Table.Row>
            );
        });
    }

    candidateOptions() {
        return this.state.candidates.map(({ id, name }) => ({ key: id, value: id, flag: 'id', text: name }));
    }

    renderForm() {
        if(this.props.drizzleState.accounts[0] === this.state.ec) {
            return <strong>EC cannot vote!!!</strong>;
        } else if(this.state.hasVoted) {
            return <strong>You have already casted your vote!!!</strong>;
        }
        return (
            <Container>
                <Segment>
                    <Dropdown
                        placeholder='Select A Candidate'
                        onChange={(e, data) => this.setState({ for: data.value })}
                        selection
                        options={this.candidateOptions()}
                    />
                </Segment>
                <Button
                    disabled={this.state.for === '' ? true : false}
                    primary
                    onClick={this.vote.bind(this)}
                >
                    Cast Vote
                </Button>
            </Container>
        );
    }
    
    render() {
        return (
            <Container textAlign="center">
                <Segment>
                    <Header as="h1">BLOCKCHAIN VOTING APPLICATION</Header>
                </Segment>
                <Divider />
                <Message>
                    <Message.Header>Election Manager</Message.Header>
                    <p><strong>{this.state.ec}</strong></p>
                </Message>
                <Divider />
                <Message>
                    <Message.Header>Election Information</Message.Header>
                    <p>This is a prototype voting app running on the <strong>ropsten</strong> ethereum network.</p>
                </Message>
                <Divider />
                <Message>
                    <Message.Header>Election Results</Message.Header>
                    <Table celled>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>ID</Table.HeaderCell>
                                <Table.HeaderCell>Name</Table.HeaderCell>
                                <Table.HeaderCell>Vote Count</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {this.renderCandidates()}
                        </Table.Body>
                    </Table>
                </Message>
                <Divider />
                <Segment raised>
                    {this.renderForm()}
                </Segment>
                <Divider />
                <Segment raised>Your Account is: <strong>{this.props.drizzleState.accounts[0]}</strong></Segment>
            </Container>
        );
    }
}

export default Election;
