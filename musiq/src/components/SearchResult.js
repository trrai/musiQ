import React from 'react';
import {
    Card, CardImg, CardText, CardBody,
    CardTitle, Label, Button, Input, Form, FormGroup,
    CardSubtitle
} from 'reactstrap';
import '../App.css';


const SearchResult = (props) => {
    return (
        <div>
            <Card className="roomCards">
                <CardBody>
                    <CardTitle>{props.name}</CardTitle>
                    <CardSubtitle>{props.artist}</CardSubtitle>
                    {props.add &&
                    <Button onClick={props.callback}>Add</Button>
                    }
                </CardBody>
            </Card>
        </div>
    );
};

export default SearchResult;