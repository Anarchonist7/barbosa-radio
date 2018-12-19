import React, { Component } from 'react';
import Player from './Player';
import { View, Text, AppRegistry } from 'react-native';
import RNFS from 'react-native-fs';
import shorthash from 'shorthash';

const socketServer = require('socket.io-client')('http://localhost:3003');

// const serverData = [
//   {
//     id: 1,
//     title: 'Stressed Out',
//     artist: 'Twenty One Pilots',
//     albumArtUrl: "http://36.media.tumblr.com/14e9a12cd4dca7a3c3c4fe178b607d27/tumblr_nlott6SmIh1ta3rfmo1_1280.jpg",
//     audioUrl: 'http://localhost:8080/tune3.mp3'
//   },
//   {
//     id: 2,
//     title: 'Iron Lion Zion',
//     artist: 'Bob Marley',
//     albumArtUrl: "http://36.media.tumblr.com/14e9a12cd4dca7a3c3c4fe178b607d27/tumblr_nlott6SmIh1ta3rfmo1_1280.jpg",
//     audioUrl: 'http://localhost:8080/tune4.mp3'
//   }
// ]

// function asyncRequest() {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve(serverData)
//     }, 3000)
//   })
// }

export default class App extends Component {

  // constructor(props){
  //   super(props)
  //   this.
    
    state = {
      tracks: [
        // {
        //   id: 1,
        //   title: '',
        //   artist: '',
        //   albumArtUrl: '',
        //   audioUrl: ''
        // }
      ],
      loading: true,
      socket: socketServer
    }

  loadFile = ( id, path )=> {
    const index = this.state.tracks.findIndex(track => track.id === id)
    console.log(id, index, path)
    const start = this.state.tracks.slice(0, index)
    const end = this.state.tracks.slice(index + 1)
    this.setState({
      tracks: [
        ...start,
        {
          ...this.state.tracks[index],
          localFile: path
        },
        ...end
      ]
    }, () => console.log(this.state.tracks))
  }


  downloadFile = (id, uri,path) => {

    RNFS.downloadFile({fromUrl:uri, toFile: path}).promise
        .then(res => {
          if(res.statusCode === 200) { 
            this.loadFile(id, path)
          } else {
            console.log(res.statusCode)
          }
        });
  }

  componentDidMount(){
    // Wait three seconds, then create a tracks object from the response data passed by the function
    // Fill that tracks object with each track, and add a 'null' local file to each track
    
      const ship1 = "http://localhost:8080/ships/1";
      let tracks = []

    // console.log(fetch(ship1));
    
      let getTracks = new Promise((resolve, reject) => {
        fetch(ship1, {
        method: 'GET'
        }).then((responseData, error) => {
          if (error){
            throw new Error("Error: ", error);
          } else {
            tracksResponse = JSON.parse(responseData._bodyText);
            tracks = tracksResponse.map(track => {
              return {
                ...track,
                localFile: null
              }
            })
          }
        })
      })
  
      getTrack.then((resolve, reject) => {
        if (reject){
          console.log("Erroring!!!!!!!!!!!!")
          throw new Error("Error: ", reject.message);
        } else {
          console.log(tracks);
          this.setState({
            tracks: tracks,
            loading: false
          })
        }  
      })

  
      tracks.forEach(song => {
        const uri  = song.audioUrl;
        const id = song.id
        const name = shorthash.unique(uri);
        // const extension = (Platform.OS === 'android') ? 'file://' : ''
        const path =`${RNFS.CachesDirectoryPath}/${name}.mp3`;
        RNFS.exists(path).then(exists => {
            // if(exists)this.loadFile(path);
          if(exists) {
            this.loadFile(id, path)
          } else {
            this.downloadFile(id, uri,path);
          }
        })
      })
    

    this.state.socket.on('connect', function(){
      console.log("Client side");
    });

    this.state.socket.on('message', function(data){
      console.log(data);

      // this.state.socket.on('disconnect', function(){
      //   console.log("Client disconnected");
      // });

    });
  }

  render() {
    if (this.state.loading === true) {
      return <Text>Loading...</Text>
    } else {
      return <Player tracks={this.state.tracks} socket={this.state.socket} />
    }
  }
}
