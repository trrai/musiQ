'use strict'
import React, { Component } from 'react';


let controller = {
    promises: [],

    search: function (searchText, count, s) {
        var prev = null;
        console.log("hit");
        
        //window.location = "http://localhost:8888/";
        
        prev = s.searchTracks(searchText, { limit: count });
        prev.then(function (data) {

            // clean the promise so it doesn't call abort
            prev = null;

            // ...render list of search results...
            console.log(data)

        }, function (err) {
            console.error(err);
        });
    }

}

export default controller;