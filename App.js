import React, { Component } from 'react';
import Player from './Player';
import { View, Text, AppRegistry } from 'react-native';
import RNFS from 'react-native-fs';
import shorthash from 'shorthash';



export default class App extends Component {


    state = { TRACKS: [
  {
    title: 'Stressed Out',
    artist: 'Twenty One Pilots',
    albumArtUrl: "http://36.media.tumblr.com/14e9a12cd4dca7a3c3c4fe178b607d27/tumblr_nlott6SmIh1ta3rfmo1_1280.jpg",
    audioUrl: `${RNFS.CachesDirectoryPath}/2fdiBj.mp3`
  },
] }





  // loadFile = ( path )=> {
  //       tracks[0].audioUrl = path
  //     }

  downloadFile = (uri,path) => {

    RNFS.downloadFile({fromUrl:uri, toFile: path}).promise
        .then(res =>this.loadFile(path));
  }

  componentDidMount(){
    const uri  = 'http://localhost:8080/tune.mp3';
    const name = shorthash.unique(uri);
    // const extension = (Platform.OS === 'android') ? 'file://' : ''
    const path =`${RNFS.CachesDirectoryPath}/${name}.mp3`;
    RNFS.exists(path).then( exists => {
          // if(exists)this.loadFile(path);
           this.downloadFile(uri,path);
        })
  }

  render() {
    return <Player tracks={this.state.TRACKS} />


  }
}