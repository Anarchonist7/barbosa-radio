import React, { Component } from 'react';
import Player from './Player';
import { View, Text, AppRegistry } from 'react-native';
import RNFS from 'react-native-fs';
import shorthash from 'shorthash';

const socketServer = require('socket.io-client')('http://localhost:3003');

export default class App extends Component {
    
  state = {
    tracks: [],
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

      const ship1 = "http://localhost:8080/ships/1";
    
      const getTracks = new Promise((resolve, reject) => {
        fetch(ship1, {
        method: 'GET'
        }).then((responseData, error) => {
          if (error){
            throw new Error("Error: ", error);
          } else {
            tracksResponse = JSON.parse(responseData._bodyText);
            const tracks = tracksResponse.map(track => {
              return {
                ...track,
                localFile: null
              }
            })
            resolve(tracks);
          }
        })
      })

      const downloadTracks = (tracks) => {
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
      };

      getTracks.then((tracks) => {
        this.setState({
          tracks: tracks,
          loading: false
        })
        downloadTracks(tracks);
      });


    this.state.socket.on('connect', client => {
      console.log("Client connected");

      this.state.socket.on('disconnect', function(){
        console.log("Client disconnected");
      });
    })
  }

  render() {
    if (this.state.loading === true) {
      return <Text>Loading...</Text>
    } else {
      return <Player tracks={this.state.tracks} socket={this.state.socket} />
    }
  }
}
