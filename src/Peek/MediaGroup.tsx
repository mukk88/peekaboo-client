import * as React from 'react';
import FontIcon from 'material-ui/FontIcon';
import { grey500, lightBlue100 } from 'material-ui/styles/colors';
import { IMediaData } from './Common';
import { ImageHolder } from './ImageHolder';
import { VideoHolder } from './VideoHolder';

interface IMediaGroupProps {
  mediaData: IMediaData[];
} 

interface IMediaGroupState {
  index: number;
}

const selectIconStyle: React.CSSProperties = {
  fontSize: '2em',
  margin: '0 1em',
};

export class MediaGroup extends React.Component<IMediaGroupProps, IMediaGroupState> {
    
  constructor(props: IMediaGroupProps) {
    super(props);
    this.state = {
      index: 0,
    };
  }

  onLeftTap = () => {
    this.setState({
      index: Math.max(0, this.state.index - 1),
    });
  }

  onRightTap = () => {
    this.setState({
      index: Math.min(this.props.mediaData.length - 1, this.state.index + 1),
    });
  }

  render() {

    const currentMedia = this.props.mediaData[this.state.index];

    if (!currentMedia) {
      return <div />;
    }

    const mediaDiv = currentMedia.isVideo ? (
      <VideoHolder
        token={currentMedia.token}
        orientation={currentMedia.orientation}
        date={currentMedia.date}
        comment={currentMedia.comment}
        name={currentMedia.name}
      />
    ) : (
      <ImageHolder
        token={currentMedia.token}
        orientation={currentMedia.orientation}
        date={currentMedia.date}
        comment={currentMedia.comment}
      />
    );

    const selectorDiv = this.props.mediaData.length > 1 ? (
      <div style={{textAlign: 'center'}}>
        <FontIcon
          className="material-icons"
          color={this.state.index === 0 ? grey500 : lightBlue100}
          style={selectIconStyle}
          onClick={this.onLeftTap}
        >
          keyboard_arrow_left
        </FontIcon>
        <FontIcon
          className="material-icons"
          color={this.state.index === this.props.mediaData.length - 1 ? grey500 : lightBlue100}
          style={selectIconStyle}
          onClick={this.onRightTap}
        >
          keyboard_arrow_right
        </FontIcon>
      </div>
    ) : (
      <div />
    );

    return (
      <div>
        {mediaDiv}
        {selectorDiv}
      </div>
    );
  }
}    