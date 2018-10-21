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
                this.setState({ currentSongId: snapshot.val()[Object.keys(snapshot.val())[0]]["id"] })
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

    pauseSong() {
        this.props.api.pause({
            device_id: "12bf54547387c7080517cec8b9675ffa6a57534b"
        });
    }

    playSong() {
        this.props.api.play({
            device_id: "12bf54547387c7080517cec8b9675ffa6a57534b",
            uris: [
                "spotify:track:" + this.state.currentSongId
            ],
        });
    }

    playbackState() {
        this.props.api.getMyCurrentPlaybackState({
            device_id: "12bf54547387c7080517cec8b9675ffa6a57534b"
        }).then(function (response) {
            console.log(response);
        });
    }

    updatePlaybackState() {
        console.log('here');
        var self = this;
        this.props.api.getMyCurrentPlaybackState({
            device_id: "12bf54547387c7080517cec8b9675ffa6a57534b"
        }).then(function (response) {
            if (response.item != null) {
                var currCompletion = response.progress_ms / response.item.duration_ms;
                
                if (currCompletion >= 0.07) {
                    firebase.database().ref('rooms/' + self.state.roomId + "/songs/" + Object.keys(self.state.ids)[0]).remove()
                        .then(function () {
                            self.setState({ playbackCompletion: 0 });
                            self.playSong();
                        });

                } else {
                    self.setState({ playbackCompletion: currCompletion });
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

                
                <form className="form-room">
                    <FormGroup>
                        <Label for="searchTerm">Search for music</Label>
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

                    <Button onClick={() => this.playSong()} >
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAJVSURBVGhD7Zo7aBRBHIdX8Y2IqCgoRA0GFR+NdmoqbZNGEQVJE9A2pPMBVgrBUrBUsFFLLUTQQrtopZ02SUREGwUFHxHB77eTCcOQPXa5ud2ZuB983NxyyfFn5zc7j8taWlqCsRPXmWbanMWPeDp/lzAq5NecT3E3JokKmcEBfIK/8RquxqSwhVhO4QecwiFdSAW/ELEWb+AffIg7MHrcQh7joGnmHMAX+AMv4QqMFreQPlxumtkqXIpLcAQ/41s8jlHiFjKMm00zu4ujppmzHm/hX7yHWzEq3EKu40HTnL8jYsOc4jC+wm84hsswChYKu4/yIS0q8AJ+xdd4BBunU9gXYgvuN828G95BdbfbuAkboyjsRShH6oIux/ANfsHzaLtkrRSFvQz6rP5GKCvj+B0n8RDWSlHYy6DP+ndnGz5AdbebqNGuFsqEvQwb8aJp5pzAd/gJz6GeRz2latiL8AsRK/EKambwHPdhz6ga9jKoAD1Q9Sr68RHO4gRqLhecbsJehEYtzQr80Uv/X9/1Hk/qQki6CXtZ1GW3m2a2BvU9Wvfo+i4MQqiwd0K587vsXnyGP/Eqdr2QCxX2qvS0kFBh70QtXStU2ItIPux2+NXSuZbhNzSNPRBDhr3RKUqIsEcxaewm7O40/iUmNY23RLewqoruXpRL3bJh9zcfjmLjVA273Q5SFqLdDuoUdneD7j4ms0FnSXLL1Ef7V3YT+zIms4ltcY8VNEfSOWP0+IXYg55pTPKgZ1EcvbmHoXswSVSIjqfP5O8SZtH8YKCl5f8jy/4BI7OhbNIoiAEAAAAASUVORK5CYII="></img></Button>
               
                </form>

                <div className="results">
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
                </div>
                <div className="queue">
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
                </div>
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