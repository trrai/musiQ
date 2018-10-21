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
            return prev;
            
        }, function (err) {
            console.error(err);
        });

        return prev;
    }

}

export default controller;