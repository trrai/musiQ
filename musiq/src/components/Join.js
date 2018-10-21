import React from 'react';
import { Router, Route, Link } from 'react-router-dom';
import searchIcon from '../img/search.svg';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import Modal from './Modal';

export default class MusiQJoin extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: '',
            found: []
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSearchBar = this.handleSearchBar.bind(this);
    }

    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    handleSearchBar(event) {
        event.preventDefault();
        let arr = ["Test1", "Test2", "Test3", "Test4"];
        let newFound = [];
        let txt = this.state.value;
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].toLowerCase().includes(txt.toLowerCase())) {
                newFound.push(arr[i]);
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
                            return <Modal key={room} name={room} />
                        })}
                    </div>
                </Form>
            </div>
        );
    }
}