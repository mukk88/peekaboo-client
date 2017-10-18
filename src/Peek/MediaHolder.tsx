import * as React from 'react';
import { grey400, lightBlue100 } from 'material-ui/styles/colors';
import FontIcon from 'material-ui/FontIcon';
import { 
  getPreSignedUrl,
} from '../AwsS3';
import { BabyData } from './BabyData';
import { EditMode } from './EditMode';
import {
  IMediaData,
  mediaStyle,
  rootStyle,
  playButtonStyle,
  daysSinceStyle,
  containerStyle,
  helperStyle
} from './Common';

enum VideoStates {
  NOT_SHOWING,
  LOADING,
  LOADED,
}

interface IMediaHolderProps2 {
    onLeftClick: Function;
    onRightClick: Function;
    canLeft: boolean;
    canRight: boolean;
    baby: string;
    thumb: string;
}

type IMediaHolderProps = IMediaHolderProps2 & IMediaData;

interface IMediaHolderState {
  thumbNail: string;
  editMode: boolean;
  babyBirthday: Date;
  videoState: VideoStates;
  videoUrl: string;
}
export class MediaHolder extends React.Component<IMediaHolderProps, IMediaHolderState> {

  constructor(props: IMediaHolderProps) {
    super(props);
    
    this.state = {
      thumbNail: '',
      editMode: false,
      babyBirthday: new Date(BabyData[this.props.baby].birthday),
      videoState: VideoStates.NOT_SHOWING,
      videoUrl: '',
    };
    this.loadVideo = this.loadVideo.bind(this);
  }

  changeEditMode = (editMode: boolean) => {
    this.setState({
      editMode
    });
  }

  async loadVideo() {
    const extension = this.props.name.split('.').pop();
    const videoUrl = await getPreSignedUrl(`${this.props.baby}/${this.props.token}.${extension}`);
    this.setState({
      videoState: VideoStates.LOADED,
      videoUrl,
    });
  }

  loadVideoAsync = () => {
    this.setState({
      videoState: VideoStates.LOADING,
      // tslint:disable-next-line
    }, this.loadVideo);
  }
  
  render() {
  
    if (this.state.editMode) {
      return (
        <EditMode 
          changeEditMode={this.changeEditMode}
          objData={this.props}
          baby={this.props.baby}
        />
      );
    }

    let displayedVideo = <div />;
    
    switch (this.state.videoState) {
      case VideoStates.NOT_SHOWING: {
        displayedVideo = (
          <img src={this.props.thumb} style={mediaStyle} onClick={this.loadVideoAsync} />
        );
        break;
      }
      case VideoStates.LOADING: {
        displayedVideo = (
          <img src={require(`../img/loading.gif`)} style={{...mediaStyle, marginTop: '50px'}}/>
        );
        break;
      }
      case VideoStates.LOADED: {
        displayedVideo = (
          <video src={this.state.videoUrl} style={mediaStyle} controls={true} autoPlay={true}/>
        );
        break;
      }
      default: {
        break;
      }
    }

    const displayedDiv = this.props.isVideo ? (
      displayedVideo
    ) : (
      <img src={this.props.thumb} style={mediaStyle}/>
    );

    const playButton = this.props.isVideo ? (
      <FontIcon className="material-icons" style={playButtonStyle}>play_arrow</FontIcon>
    ) : (
      <span />
    );

    const leftButton = (
      <FontIcon
        style={{marginRight: '1em'}}
        className="material-icons"
        color={this.props.canLeft ? lightBlue100 : grey400}
        onClick={() => this.props.onLeftClick()}
      >
        keyboard_arrow_left
      </FontIcon>
    );

    const rightButton = (
      <FontIcon
        style={{marginLeft: '1em'}}
        className="material-icons"
        color={this.props.canRight ? lightBlue100 : grey400}
        onClick={() => this.props.onRightClick()}
      >
        keyboard_arrow_right
      </FontIcon>
    );
    
    const mediaDate = new Date(this.props.date);
    const timeDiff = mediaDate.getTime() - this.state.babyBirthday.getTime();
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
    
    return (
      <div style={rootStyle} >
        <div style={{...daysSinceStyle, verticalAlign: 'middle'}}>
          {leftButton}
          <span>
            {`Day ${diffDays}, ${this.props.date.split('T')[0]}`}
          </span>
          <div 
            onClick={() => this.changeEditMode(true)}
            style={{verticalAlign: 'middle', display: 'inline-block'}}
          >
            <FontIcon
              className="material-icons"
              color={grey400}
              style={{margin: '0 0 0.3em 0.5em'}}
            >
              edit
            </FontIcon>
          </div>
          {rightButton}
        </div>
        <div style={containerStyle}>
          {playButton}
          <span style={helperStyle} />
          {displayedDiv}
        </div>
      </div>
    );
  }
}