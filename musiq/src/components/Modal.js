import React from 'react';
import {Card, CardBody, CardTitle, Label, Button, Input} from 'reactstrap';
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