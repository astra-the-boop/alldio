const spotifySecret = ""//!! PLEASE ENTER YOUR SPOTIFY API SECRET HERE !!;
const spotifyID = ""//!! PLEASE ENTER YOUR SPOTIFY API ID HERE !!;
const BASE_URL = "https://www.googleapis.com/youtube/v3/search";
const youtubeKey = ""//!! PLEASE ENTER YOUR YOUTUBE API KEY HERE !!;



const credentials = btoa(`${spotifyID}:${spotifySecret}`);

// =========== SPOTIFY ===========
let spotifyTracks = [[]//track name
    , []                     //link
    , []                     //artist
    , []];                   //album
let youtubeTracks = [[]//name
    , []                    //link
    , []                    //artist
];

alert("If you're visiting for the first time, please make sure you add your API keys!! Once you have, you can remove this message on line 20 of index.js. Check README.md for more info")

let spotifyAlbums = [[], //name
[],                             //link
[],                             //artist
[]];                            //cover

let spotifyArtists = [[],//name
[],                            //link
[],                            //follower
[]];                           //cover

let youtubeArtists = [[],//name
    [],                         //link
    [],                         //description
    []];                        //cover

let spotifyPlaylists = [[],//NAME
    [],                          //link
    [],                          //description
    [],                          //owner
];

let youtubePlaylists = [[],//NAME
    [],                          //LINK
    [],                          //DESCRIPTION
    []];                         //OWNER

async function search() {

    var url = `https://api.spotify.com/v1/search?q=${document.getElementById("searchbar").value}&type=album,playlist,artist,track&limit=${document.getElementById("amtsearch").value}`;

    fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${credentials}`,
        },
        body: 'grant_type=client_credentials',
    })
        .then(response => response.json())
        .then(data => {
            const accessToken = data.access_token;
            searchSpotify(accessToken);
        })
        .catch(error => {
            console.error('Error getting access token:', error);
        });

    async function searchSpotify(accessToken) {
        fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                spotifyTracks=[[],[],[],[]];
                spotifyAlbums=[[],[],[],[]];
                spotifyArtists=[[],[],[],[]];
                spotifyPlaylists=[[],[],[],[]];
                // Populate spotifyTracks array
                data.tracks.items.forEach((item) => {
                    let artists = item.artists.map((artist) => artist.name).join(", ");
                    spotifyTracks[0].push(item.name); // Track name
                    spotifyTracks[1].push(item.external_urls.spotify); // Link
                    spotifyTracks[2].push(artists); // Artists
                    spotifyTracks[3].push(item.album.name); // Album
                });

                data.albums.items.forEach((item) => {
                    let artists = item.artists.map((artist) => artist.name).join(", ");
                    spotifyAlbums[0].push(item.name); // Track name
                    spotifyAlbums[1].push(item.external_urls.spotify); // Link
                    spotifyAlbums[2].push(artists); // Artists
                    spotifyAlbums[3].push(item.images[0].url); // Cover
                });

                data.artists.items.forEach((item) => {
                    spotifyArtists[0].push(item.name); // Track name
                    spotifyArtists[1].push(item.external_urls.spotify); // Link
                    spotifyArtists[2].push(item.followers.total); // Followers
                    spotifyArtists[3].push(item.images[0].url); //image
                });

                for (let i = 0; i < data.playlists.items.length; i += 2) {
                    const item = data.playlists.items[i];
                    spotifyPlaylists[0].push(item.name); // Track name
                    spotifyPlaylists[1].push(item.external_urls.spotify); // Link
                    spotifyPlaylists[2].push(item.description); // Description
                    spotifyPlaylists[3].push(item.owner.display_name); // Owner
                }


                console.log("Updated table:", spotifyTracks);
            })
            .catch(error => {
                console.error('Error during search:', error);
            });
    }



    // ==========YOUTUBE=========
    const searchYouTube = async (query, type = "video", maxResults = document.getElementById("amtsearch").value) => {
        const url = `${BASE_URL}?part=snippet&q=${encodeURIComponent(query)}&type=${type}&maxResults=${maxResults}&key=${youtubeKey}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.items) {
                youtubeTracks = [[],[],[]];
                // Log search results
                data.items.forEach((item) => {
                    youtubeTracks[0].push(item.snippet.title);
                    youtubeTracks[1].push("https://youtube.com/watch?v="+item.id.videoId);
                    youtubeTracks[2].push(item.snippet.channelTitle);
                });
            } else {
                console.error("No results found:", data.error || data);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    //==========YOUTUBE=========
    const searchYouTubeChannels = async (query, type = "channel", maxResults = document.getElementById("amtsearch").value) => {
        const url = `${BASE_URL}?part=snippet&q=${encodeURIComponent(query)}&type=${type}&maxResults=${maxResults}&key=${youtubeKey}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.items) {
                youtubeArtists = [[],[],[],[]];
                // Log search results
                data.items.forEach((item) => {
                    youtubeArtists[0].push(item.snippet.channelTitle);
                    youtubeArtists[1].push("https://youtube.com/channel/"+item.snippet.channelId);
                    youtubeArtists[2].push(item.snippet.description);
                    youtubeArtists[3].push(item.snippet.thumbnails.default.url);
                });
            } else {
                console.error("No results found:", data.error || data);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    //==========YOUTUBE=========
    const searchYouTubePlaylists = async (query, type = "playlist", maxResults = document.getElementById("amtsearch").value) => {
        const url = `${BASE_URL}?part=snippet&q=${encodeURIComponent(query)}&type=${type}&maxResults=${maxResults}&key=${youtubeKey}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.items) {
                youtubePlaylists = [[],[],[],[]];
                // Log search results
                data.items.forEach((item) => {
                    youtubePlaylists[0].push(item.snippet.title);
                    youtubePlaylists[1].push("https://youtube.com/playlist?list="+item.id.playlistId);
                    youtubePlaylists[2].push(item.snippet.description);
                    youtubePlaylists[3].push(item.snippet.channelTitle);
                });
            } else {
                console.error("No results found:", data.error || data);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };



    searchYouTube(document.getElementById("searchbar").value, "video", document.getElementById("amtsearch").value);
    searchYouTubeChannels(document.getElementById("searchbar").value, "channel", document.getElementById("amtsearch").value);
    searchYouTubePlaylists(document.getElementById("searchbar").value, "playlist", document.getElementById("amtsearch").value);
    // Update table dynamically
    const tableBody = document.getElementById("trackstable");
    tableBody.innerHTML = "";
    const tableBody2 = document.getElementById("albumstable");
    const tableBody3 = document.getElementById("artiststable");
    const tableBody4 = document.getElementById("playliststable");
    tableBody2.innerHTML = "";
    tableBody3.innerHTML = "";
    tableBody4.innerHTML = "";
    for (let k = 0; k < spotifyTracks[0].length; k++) {
        tableBody.innerHTML += `
              <tr>
                  <td style="border: solid 10px green; background-color: navajowhite; border-right: none; color: #45351c"><a style="color: #45351c" href="${spotifyTracks[1][k]}" target="_blank"><h1>${spotifyTracks[0][k]}</h1</a></td>
                  <td style="border: solid 10px green; background-color: navajowhite; border-left: none; border-right:none; color: #45351c">${spotifyTracks[2][k]}</td>
                  <td style="border: solid 10px green; background-color: navajowhite; border-left: none; border-right:none; color: #45351c">${spotifyTracks[3][k]}</td>
                  <td style="border: solid 10px green; background-color: navajowhite; border-left:none; color: #45351c"><img src="spotify.png" style="width: 70px"></td>
              </tr>`
            if(youtubeTracks[1] != ""){
                tableBody.innerHTML += `<tr>
                   <td style="border: solid 10px darkred; background-color: navajowhite; border-right: none; color: #45351c"><a style="color: #45351c" href="${youtubeTracks[1][k]}" target="_blank"><h1>${youtubeTracks[0][k]}</h1</a></td>
                  <td colspan="2" style="border: solid 10px darkred; background-color: navajowhite; border-left: none; border-right:none; color: #45351c">${youtubeTracks[2][k]}</td>
                  <td style="border: solid 10px darkred; background-color: navajowhite; border-left:none; color: #45351c"><img src="youtube.png" style="width: 70px"></td>
              </tr>`;
            }
    }

    for (let k = 0; k < spotifyAlbums[0].length; k++) {
        tableBody2.innerHTML += `
              <tr>
                  <td style="border: solid 10px green; background-color: navajowhite; border-right: none; color: #45351c"><img src="${spotifyAlbums[3][k]}" style="width: 70px"></td>
                  <td style="border: solid 10px green; background-color: navajowhite; border-left: none; border-right: none; color: #45351c"><a style="color: #45351c" href="${spotifyAlbums[1][k]}" target="_blank"><h1>${spotifyAlbums[0][k]}</h1</a></td>
                  <td style="border: solid 10px green; background-color: navajowhite; border-left: none; border-right:none; color: #45351c">${spotifyAlbums[2][k]}</td>
                  <td style="border: solid 10px green; background-color: navajowhite; border-left:none; color: #45351c"><img src="spotify.png" style="width: 70px"></td>
              </tr>`
    }


    for (let k = 0; k < spotifyArtists[0].length; k++) {
        tableBody3.innerHTML += `
              <tr>
                  <td style="border: solid 10px green; background-color: navajowhite; border-right: none; color: #45351c"><img src="${spotifyArtists[3][k]}" style="width: 70px"></td>
                  <td style="border: solid 10px green; background-color: navajowhite; border-left: none; border-right: none; color: #45351c"><a style="color: #45351c" href="${spotifyArtists[1][k]}" target="_blank"><h1>${spotifyArtists[0][k]}</h1</a></td>
                  <td style="border: solid 10px green; background-color: navajowhite; border-left: none; border-right:none; color: #45351c">${spotifyArtists[2][k]} followers</td>
                  <td style="border: solid 10px green; background-color: navajowhite; border-left:none; color: #45351c"><img src="spotify.png" style="width: 70px"></td>
              </tr>`
        if(youtubeArtists[1] != ""){
            tableBody3.innerHTML += `
              <tr>
                  <td style="border: solid 10px darkred; background-color: navajowhite; border-right: none; color: #45351c"><img src="${youtubeArtists[3][k]}" style="width: 70px"></td>
                  <td style="border: solid 10px darkred; background-color: navajowhite; border-left: none; border-right: none; color: #45351c"><a style="color: #45351c" href="${youtubeArtists[1][k]}" target="_blank"><h1>${youtubeArtists[0][k]}</h1</a></td>
                  <td style="border: solid 10px darkred; background-color: navajowhite; border-left: none; border-right:none; color: #45351c"><b>Description: </b>${youtubeArtists[2][k]}</td>
                  <td style="border: solid 10px darkred; background-color: navajowhite; border-left:none; color: #45351c"><img src="youtube.png" style="width: 70px"></td>
              </tr>`
        }
    }

    for (let k = 0; k < document.getElementById("amtsearch").value; k++) {
        if(spotifyPlaylists[0][k] != undefined) {
            tableBody4.innerHTML += `
              <tr>
                  <td style="border: solid 10px green; background-color: navajowhite; border-right: none; color: #45351c"><a style="color: #45351c" href="${spotifyPlaylists[1][k]}" target="_blank"><h1>${spotifyPlaylists[0][k]}</h1</a></td>
                  <td style="border: solid 10px green; background-color: navajowhite; border-left: none; border-right:none; color: #45351c"><b>Description: </b>${spotifyPlaylists[2][k]}</td>
                  <td style="border: solid 10px green; background-color: navajowhite; border-left: none; border-right:none; color: #45351c">${spotifyPlaylists[3][k]}</td>
                  <td style="border: solid 10px green; background-color: navajowhite; border-left:none; color: #45351c"><img src="spotify.png" style="width: 70px"></td>
              </tr>`
        }
        if(youtubePlaylists[0][k] != undefined) {
            console.log(youtubePlaylists[0][k]);
            tableBody4.innerHTML += `
              <tr>
                  <td style="border: solid 10px darkred; background-color: navajowhite; border-right: none; color: #45351c"><a style="color: #45351c" href="${youtubePlaylists[1][k]}" target="_blank"><h1>${youtubePlaylists[0][k]}</h1</a></td>
                  <td style="border: solid 10px darkred; background-color: navajowhite; border-left: none; border-right:none; color: #45351c"><b>Description: </b>${youtubePlaylists[2][k]}</td>
                  <td style="border: solid 10px darkred; background-color: navajowhite; border-left: none; border-right:none; color: #45351c">${youtubePlaylists[3][k]}</td>
                  <td style="border: solid 10px darkred; background-color: navajowhite; border-left:none; color: #45351c"><img src="spotify.png" style="width: 70px"></td>
              </tr>`
        }
    }
}



function openTab(evt, tabName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

