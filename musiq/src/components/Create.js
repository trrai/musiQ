import React from 'react';
import { Router, Route, Link } from 'react-router-dom';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import firebase, { storage } from 'firebase/app';
export default class MusiQCreate extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            newRoomName: undefined,
            newRoomPassword: undefined,
        }; //initialize state
    }

    handleRoomClick(event) {
        event.preventDefault(); //don't submit
        let avatar = this.state.avatar;//assign default if undefined
        this.createNewRoom(this.state.newRoomName, this.state.newRoomPassword);
    }

    createNewRoom(groupName, pass) {
        let newGroup = {
            name: groupName,
            password: pass,
            time: firebase.database.ServerValue.TIMESTAMP
        };

        //gets a reference to messages of this conversation stored in firebase
        let groups = firebase.database().ref('rooms/');

        //adds the new message to firebase
        groups.push(newGroup);
        console.log("PUSHED");
        
        window.location = "/";

    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
        console.log(this.state[event.target.name]);
    }

    render() {
        return (
            <Form>
                <div className="form">
                    <FormGroup>
                        <Label for="newRoomName">Room Name</Label>
                        <Input 
                        type="" 
                        name="newRoomName" 
                        id="newRoomName" 
                        onChange={(event) => this.handleChange(event)}
                        placeholder="LA Fitness Public" />
                    </FormGroup>
                    <FormGroup>
                        <Label for="newRoomPassword">Password</Label>
                        <Input 
                        type="password" 
                        name="newRoomPassword" 
                        id="newRoomPassword" 
                        onChange={(event) => this.handleChange(event)}
                        placeholder="GymLyf321" />
                    </FormGroup>
                    <div className="button-space">
                        {/* <Router> */}
                        <Button
                        onClick={(e) => this.handleRoomClick(e)}>
                        Create Room
                        </Button>
                        {/*tag={Link} to="/Q" */}
                        {/* </Router> */}

                    </div>
                </div>
            </Form>
        );
    }
}