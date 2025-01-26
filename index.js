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

alert("If you're visiting for the first time, please make sure you add your API keys!! Once you have, you can remove this message on line 20 of index.js")

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
                // Populate spotifyTracks array
                data.tracks.items.forEach((item) => {
                    let artists = item.artists.map((artist) => artist.name).join(", ");
                    spotifyTracks[0].push(item.name); // Track name
                    spotifyTracks[1].push(item.external_urls.spotify); // Link
                    spotifyTracks[2].push(artists); // Artists
                    spotifyTracks[3].push(item.album.name); // Artists
                });



                console.log("Updated table:", spotifyTracks);
            })
            .catch(error => {
                console.error('Error during search:', error);
            });
    }



    // ==========YOUTUBE=========
    const searchYouTube = async (query, type = "video", maxResults = 5) => {
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
    searchYouTube(document.getElementById("searchbar").value, "video", document.getElementById("amtsearch").value);
    // Update table dynamically
    const tableBody = document.getElementById("trackstable");
    tableBody.innerHTML = ""; // Clear previous rows
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

