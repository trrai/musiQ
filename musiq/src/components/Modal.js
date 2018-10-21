import React, { Component } from 'react';
import {
    Card, CardImg, CardText, CardBody,
    CardTitle, Label, Button, Input, Form, FormGroup
} from 'reactstrap';
import '../App.css';
import { Router, Link, Redirect } from 'react-router-dom';

class Modal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roomPassword: "",
        }; //initialize state

    }

    handleJoin(event){
        event.preventDefault();
        console.log(this.props);
        if(this.state.roomPassword == this.props.room.password){
            this.props.history.push("room/" + this.props.room.id);
        }else{
            console.log("incorrect password");
        }
    }

    handleChange(event) {
        console.log(event.target.value);
        this.setState({ [event.target.name]: event.target.value });
    }

    render() {
        return (
            <div>
                <Card className="roomCards">
                    <CardBody>
                        <CardTitle>{this.props.room.name}</CardTitle>
                        <Label className="label" >Room Password:</Label>
                        <Input type="password" name="roomPassword" placeholder="password" onChange={(event) => this.handleChange(event)}/>
                        <Button type="button" onClick={(event) => this.handleJoin(event)}>Join Room</Button>
                    </CardBody>
                </Card>
            </div>
        );
    }
}

export default Modal;