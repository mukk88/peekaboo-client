import * as React from 'react';
import { 
  getPreSignedUrl,
} from '../AwsS3';
import FontIcon from 'material-ui/FontIcon';

declare function require(path: string): string;

enum VideoStates {
  NOT_SHOWING,
  LOADING,
  LOADED,
}

interface IVideoHolderProps {
  token: string;
  orientation: number;
  date: string;
  comment: string;
  name: string;
}

interface IVideoHolderState {
  thumbNail: string;
  videoState: VideoStates;
  videoUrl: string;
}

const centerStyle: React.CSSProperties = {
  textAlign: 'center',
};

const daysSinceStyle: React.CSSProperties = {
  padding: '0.5em',
};

const livBirthday = new Date('2017-09-18');

const playButtonStyle: React.CSSProperties = {
  cursor: 'pointer',
  zIndex: 99,
  color: 'white',
  fontSize: '3em',
  position: 'absolute',
  opacity: 0.85,
};

export class VideoHolder extends React.Component<IVideoHolderProps, IVideoHolderState> {

  constructor(props: IVideoHolderProps) {
    super(props);
    this.state = {
      thumbNail: '',
      videoState: VideoStates.NOT_SHOWING,
      videoUrl: '',
    };
    this.loadVideo = this.loadVideo.bind(this);
  }

  async componentDidMount() {
    const thumbNail = await getPreSignedUrl(`liv/thumbs/${this.props.token}.jpg`);
    this.setState({
      thumbNail,
    });
  }

  async loadVideo() {
    const extension = this.props.name.split('.').pop();
    const videoUrl = await getPreSignedUrl(`liv/${this.props.token}.${extension}`);
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

    const rotateStyle: React.CSSProperties = {
      maxHeight: '425px',
      maxWidth: '100%',
    };
    const containerStyle: React.CSSProperties = {
      height: '425px',
      ...centerStyle,
      position: 'relative',
    };
    const rootStyle: React.CSSProperties = {
      paddingTop: '1em',
      ...centerStyle,
    };

    const mediaDate = new Date(this.props.date);

    const timeDiff = Math.abs(mediaDate.getTime() - livBirthday.getTime());
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 

    let displayedMedia = <div />;
    
    switch (this.state.videoState) {
      case VideoStates.NOT_SHOWING: {
        displayedMedia = (
          <div onClick={this.loadVideoAsync}>
            <FontIcon className="material-icons" style={playButtonStyle}>play_arrow</FontIcon>
            <img src={this.state.thumbNail} style={rotateStyle} />
          </div>
        );
        break;
      }
      case VideoStates.LOADING: {
        displayedMedia = (
          <img src={require(`../img/loading.gif`)} style={{...rotateStyle, marginTop: '50px'}}/>
        );
        break;
      }
      case VideoStates.LOADED: {
        displayedMedia = (
          <video src={this.state.videoUrl} style={rotateStyle} controls={true} autoPlay={true}/>
        );
        break;
      }
      default: {
        break;
      }
    }

    return (
      <div style={rootStyle}>
        <div style={daysSinceStyle}>
          {`Day ${diffDays}`}
        </div>
        <div 
          style={containerStyle}
        >
          {displayedMedia}
        </div>
      </div>
    );
  }
}