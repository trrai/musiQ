import React from 'react';
import { Router, Route, Link } from 'react-router-dom';
import searchIcon from '../img/search.svg';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import Modal from './Modal';
import firebase, { storage } from 'firebase/app';

export default class MusiQJoin extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: '',
            availableRooms: [],
            found: [],
            searchRes: [],
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSearchBar = this.handleSearchBar.bind(this);
    }

    componentDidMount() {
        this.roomRef = firebase.database().ref('rooms'); //gets reference to all messages in conversation
        this.roomRef.on('value', (snapshot) => {
            if (snapshot.val() != null) {
                console.log(snapshot.val());
                this.setState({ availableRooms: snapshot.val() });
            }
        });
    }

    componentWillUnmount() {
        this.roomRef.off();
    }

    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    handleSearchBar(event) {
        event.preventDefault();
        
        console.log(this.state.availableRooms);
        let arr = Object.keys(this.state.availableRooms);
        console.log(arr);
        let newFound = [];
        let txt = this.state.value;
        for (let i = 0; i < arr.length; i++) {
            console.log(arr[i]);
            console.log(this.state.availableRooms[arr[i]]);
            let currentName = this.state.availableRooms[arr[i]]["name"];

            if (currentName.toLowerCase().includes(txt.toLowerCase())) {
                newFound.push({
                    name: this.state.availableRooms[arr[i]]["name"],
                    password: this.state.availableRooms[arr[i]]["password"],
                    id: arr[i]
                });
            }
        }
        this.setState({ found: newFound });
    }

    render() {
        return (
            <div>
                <Form>
                    <div className="search">
                        <FormGroup>
                            <Label id="searchName" for="search">Search for a room</Label>
                            <div className="searchBar">
                                <Input type="search" name="searchBar" id="searchBar" placeholder="Find your room(s)"
                                    onChange={this.handleChange} value={this.state.value} />
                                <Button type="submit" value="search" onClick={this.handleSearchBar} id="searchButton"><img src={searchIcon} alt="search icon" /></Button>
                            </div>
                        </FormGroup>
                        {this.state.found.map((room) => {
                            return <Modal {...this.props} key={room.id} room={room} />
                        })}
                    </div>
                </Form>
            </div>
        );
    }
}