import React from 'react';
import {
    Card, CardImg, CardText, CardBody,
    CardTitle, Label, Button, Input, Form, FormGroup
} from 'reactstrap';
import '../App.css';

const Modal = (props) => {
    return (
        <div>
            <Card className="roomCards">
                <CardBody>
                    <CardTitle>{props.name}</CardTitle>
                    <Label className="label" >Room Password:</Label>
                    <Input type="password" name="roomPassword" placeholder="password" />
                    <Button>Join Room</Button>
                </CardBody>
            </Card>
        </div>
    );
};

export default Modal;