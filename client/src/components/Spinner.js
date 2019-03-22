import React, { Component } from 'react';
import { Loader } from 'semantic-ui-react';
import toastr from 'toastr/build/toastr.min.js';

export default class Spinner extends Component {
    componentDidMount() {
        this.interval = setInterval(() => {
            toastr.info('Please make sure your dapp browser is connected to the ropsten testnet and reload the page.');
        }, 6000)
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        return (
            <Loader
                active
                inline="centered"
                size="massive"
            />
        );
    }
}
