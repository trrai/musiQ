import React, { Component } from 'react';
import { Card, Button, CardTitle, FormGroup, Input, Label } from 'reactstrap';
import { Router, Link, Redirect } from 'react-router-dom';
import SpotifyPlayer from 'react-spotify-player';
//API
import Controller from '../API.js'
import firebase, { storage } from 'firebase/app';

import SearchResult from './SearchResult';
import Spotify from 'spotify-web-api-js';

import BToken from '../API_TOKEN.js'

class MusiQRoom extends Component {

    constructor(props) {
        super(props);
        this.state = {
            searchTerm: undefined,
            ids: [],
            roomId: this.props.match.params.Id,
            searchRes: [],
            playbackCompletion: 0,
            currentSongId: "",
        }; //initialize state

    }

    componentDidMount() {
        this.qRef = firebase.database().ref('rooms/' + this.state.roomId + "/songs/"); //gets reference to all messages in conversation
        this.qRef.on('value', (snapshot) => {
            if (snapshot.val() != null) {
                console.log(snapshot.val());
                this.setState({ ids: snapshot.val() });
                this.setState({ currentSongId: snapshot.val()[Object.keys(snapshot.val())[0]]["id"]})
                this.playSong();
            }
        });
        this.interval = setInterval(() => this.updatePlaybackState(), 3000);
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

    pauseSong(){
        this.props.api.pause({
            device_id:"12bf54547387c7080517cec8b9675ffa6a57534b"
        });
    }

    playSong() {
        this.props.api.play({
            device_id:"12bf54547387c7080517cec8b9675ffa6a57534b",
            uris: [
                "spotify:track:" + this.state.currentSongId
              ],
        });
    }

    playbackState(){
        this.props.api.getMyCurrentPlaybackState({
            device_id:"12bf54547387c7080517cec8b9675ffa6a57534b"
        }).then(function(response){
            console.log(response);
        });
    }

    updatePlaybackState(){
        console.log('here');
        var self = this;
        this.props.api.getMyCurrentPlaybackState({
            device_id:"12bf54547387c7080517cec8b9675ffa6a57534b"
        }).then(function(response){
            if(response.item != null){
                var currCompletion = response.progress_ms/response.item.duration_ms;
                console.log(currCompletion);
                console.log(currCompletion >= 0.10);
                if(currCompletion >= 0.10){
                    firebase.database().ref('rooms/' + self.state.roomId + "/songs/" + Object.keys(self.state.ids)[0]).remove()
                    .then(function(){
                        self.setState({playbackCompletion : 0});
                        self.playSong();
                    });
                    
                }else{
                    self.setState({playbackCompletion : currCompletion});
                }
            }
        });
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

                <Button onClick={() => this.playSong()} >PLAY</Button>
                <Button onClick={() => this.pauseSong()} >PAUSE</Button>
                <Button onClick={() => this.playbackState()} >STATE</Button>
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
                        return <SearchResult
                            name={this.state.searchRes[objId]["name"]}
                            artist={this.state.searchRes[objId]["artist"]}
                            callback={() => this.addToQueue(this.state.searchRes[objId])}
                            add={true}
                        />
                    })
                }
                <h2>In Queue: </h2>
                {
                    Object.keys(this.state.ids).map((objId) => {
                        return <SearchResult
                            name={this.state.ids[objId]["name"]}
                            artist={this.state.ids[objId]["artist"]}
                            add={false}
                        />
                    })
                }
                {/* 
                {Object.keys(this.state.ids).length > 0 && 
                <SpotifyPlayer
                    uri={"spotify:track:" + this.state.ids[Object.keys(this.state.ids)[0]]["id"]}
                    size={size}
                    view={view}
                    theme={theme}
                />
                }
                */}

            </div>

        } else {
            console.log("there is not a user");
            return <div></div>
            //return <Redirect to='/signin' />
        }
    }
}

export default MusiQRoom;