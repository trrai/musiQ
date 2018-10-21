import React, { Component } from 'react';
import { Card, Button, CardTitle } from 'reactstrap';
import { Link } from 'react-router-dom';

class MusiQHome extends Component {
    render() {
        return (
            <div className="Home">
                <h1>Musi<span id="Q">Q</span></h1>
                <p id="subtitle">Collaboratively listen to music with your peers.</p>
                <Card body className="getStartedCard">
                    <CardTitle>Create a room and start building your music queue with the people around you.</CardTitle>
                    <Link to="/create"><Button id="getStartedButton">Get started</Button></Link>
                </Card>
                <Card body className="getStartedCard">
                    <CardTitle>Find a room created by your friends, peers, or an establishment.</CardTitle>
                    <Link to="/joinroom"><Button id="getStartedButton">Find a room</Button></Link>
                </Card>
            </div>
        );
    }
}

export default MusiQHome;