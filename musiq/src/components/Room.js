import React, { Component } from 'react';
import { Card, Button, CardTitle, FormGroup, Input, Label } from 'reactstrap';
import { Router, Link, Redirect } from 'react-router-dom';
import SpotifyPlayer from 'react-spotify-player';
//API
import Controller from '../API.js'
import firebase, { storage } from 'firebase/app';

class MusiQRoom extends Component {

    constructor(props) {
        super(props);
        this.state = {
            searchTerm: undefined,
            ids: [],
            roomId: this.props.match.params.Id,
            searchRes: [],
        }; //initialize state

    }

    componentDidMount() {
        this.qRef = firebase.database().ref('rooms/' + this.state.roomId + "/songs/"); //gets reference to all messages in conversation
        this.qRef.on('value', (snapshot) => {
            if (snapshot.val() != null) {
                console.log(snapshot.val());
                this.setState({ ids: snapshot.val() });
            }
        });
    }

    componentWillUnmount() {
        this.qRef.off();
    }

    handleSearch(event) {
        event.preventDefault(); //don't submit
        let returned = Controller.search(this.state.searchTerm, 5, this.props.api)
        var ids = [];
        var self = this;
        returned.then(function (data) {
            data.tracks.items.forEach(element => {
               
                let song = {
                    name: element.name,
                    id: element.id,
                    artist: element.artists[0].name
                }
                ids.push(song);

            });
            return returned;
        }).then(function () {
            self.setState({ searchRes: ids });
        });

    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    addToQueue(newSong) {
        console.log(newSong);
        let dbSong = {
            name: newSong.name,
            id: newSong.id,
            artist: newSong.artist,
            time: firebase.database.ServerValue.TIMESTAMP
        };

        //gets a reference to messages of this conversation stored in firebase
        let groups = firebase.database().ref('rooms/' + this.state.roomId + "/songs/");

        //adds the new message to firebase
        groups.push(dbSong);
        console.log("PUSHED");

        console.log(this.state.roomId);
        console.log(newSong);
    }

    render() {
        if (this.props.user) {

            const size = {
                width: '100%',
                height: 300,
            };
            const view = 'list'; // or 'coverart'
            const theme = 'black'; // or 'white'

            return <div>
                <form>
                    <FormGroup>
                        <Label for="searchTerm">Search</Label>
                        <Input
                            role="textbox"
                            id="searchTerm"
                            type="input"
                            name="searchTerm"
                            onChange={(event) => this.handleChange(event)}
                        />
                    </FormGroup>

                    <FormGroup>
                        <Button
                            role="button"
                            color="success"
                            lassName="mr-2"
                            onClick={(e) => this.handleSearch(e)} >
                            Search
                        </Button>
                    </FormGroup>

                </form>

                <h2>Search Results: </h2>
                {
                    Object.keys(this.state.searchRes).map((objId) => {
                        return <div>
                            <p>{this.state.searchRes[objId]["name"]}</p>
                            <p>{this.state.searchRes[objId]["artist"]}</p>
                            <Button onClick={() => this.addToQueue(this.state.searchRes[objId])}>Add</Button>
                        </div>
                    })
                }
                <h2>In Queue: </h2>
                {
                    Object.keys(this.state.ids).map((objId) => {
                        return <div>
                            <p>{this.state.ids[objId]["name"]}</p>
                            <p>{this.state.ids[objId]["artist"]}</p>
                        </div>
                    })
                }

                <SpotifyPlayer
                    uri={"spotify:track:" + this.state.ids[0]}
                    size={size}
                    view={view}
                    theme={theme}
                />

            </div>

        } else {
            console.log("there is not a user");
            return <div></div>
            //return <Redirect to='/signin' />
        }
    }
}

export default MusiQRoom;