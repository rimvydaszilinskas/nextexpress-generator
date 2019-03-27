import Head from 'next/head';
import React from 'react';

class Index extends React.Component {
    render() {
        return (
            <React.Fragment>
                <Head>
                    <title>Application title</title>
                </Head>
                <div>
                    <p>Hello world from ReactJS</p>
                </div>
            </React.Fragment>
        )
    }
}

export default Index;