import * as React from 'react';
import TextField from 'material-ui/TextField';
import FontIcon from 'material-ui/FontIcon';
import { 
  getPreSignedUrl,
} from '../AwsS3';
import { BabyData } from './BabyData';

enum VideoStates {
  NOT_SHOWING,
  LOADING,
  LOADED,
}

interface IMediaHolderProps {
    token: string;
    orientation: number;
    date: string;
    comment: string;
    baby: string;
    isVideo: boolean;
    name: string;
}

interface IMediaHolderState {
  thumbNail: string;
  editMode: boolean;
  babyBirthday: Date;
  videoState: VideoStates;
  videoUrl: string;
}

const centerStyle: React.CSSProperties = {
  textAlign: 'center',
};

const daysSinceStyle: React.CSSProperties = {
  padding: '0.5em',
};

const mediaStyle: React.CSSProperties = {
  maxWidth: '100%',
  maxHeight: '425px',
  verticalAlign: 'middle',
};

const helperStyle: React.CSSProperties = {
  display: 'inline-block',
  height: '100%',
  verticalAlign: 'middle',
};

const containerStyle: React.CSSProperties = {
  height: '425px',
  ...centerStyle,
  whiteSpace: 'nowrap',
  margin: '1em 0',
};

const rootStyle: React.CSSProperties = {
  paddingTop: '1em',
  ...centerStyle,
};

const playButtonStyle: React.CSSProperties = {
  cursor: 'pointer',
  zIndex: 99,
  color: 'white',
  fontSize: '3em',
  position: 'absolute',
  opacity: 0.85,
};

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

  async componentDidMount() {
    const thumbNail = await getPreSignedUrl(`${this.props.baby}/thumbs/${this.props.token}.jpg`);
    this.setState({
      thumbNail,
    });
  }

  toEditMode = () => {
    this.setState({
      editMode: true
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
    let displayedVideo = <div />;
    
    switch (this.state.videoState) {
      case VideoStates.NOT_SHOWING: {
        displayedVideo = (
          <img src={this.state.thumbNail} style={mediaStyle} onClick={this.loadVideoAsync} />
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
    ) : this.state.editMode ? (
      <div>
        <TextField
          hintText="Edit comment"
          value={this.props.comment}
        />
      </div>
    ) : (
      <img src={this.state.thumbNail} style={mediaStyle}/>
    );

    const playButton = this.props.isVideo ? (
      <FontIcon className="material-icons" style={playButtonStyle}>play_arrow</FontIcon>
    ) : (
      <span />
    );
    
    const mediaDate = new Date(this.props.date);
    const timeDiff = mediaDate.getTime() - this.state.babyBirthday.getTime();
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
    
    return (
      <div onDoubleClick={this.toEditMode} style={rootStyle}>
        <div style={daysSinceStyle}>
          {`Day ${diffDays}`}
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