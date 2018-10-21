import React from 'react';
import { Router, Route, Link } from 'react-router-dom';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';

export default class MusiQCreate extends React.Component {
    render() {
        return (
            <Form>
                <div className="form">
                    <FormGroup>
                        <Label for="room">Room Name</Label>
                        <Input type="" name="roomName" id="exampleEmail" placeholder="LA Fitness Public" />
                    </FormGroup>
                    <FormGroup>
                        <Label for="roomPassword">Password</Label>
                        <Input type="password" name="roomPassword" id="examplePassword" placeholder="GymLyf321" />
                    </FormGroup>
                    <div className="button-space">
                        {/* <Router> */}
                            <Button>Create Room</Button>
                            {/*tag={Link} to="/Q" */}
                        {/* </Router> */}

                    </div>
                </div>
            </Form>
        );
    }
}