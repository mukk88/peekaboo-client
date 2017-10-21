import * as React from 'react';
import * as _ from 'lodash';
import Swipe from 'react-swipe-component';
import VisibilitySensor from 'react-visibility-sensor';
import { IMediaData } from './Common';
import { MediaHolder } from './MediaHolder';
import { getPreSignedUrl } from '../AwsS3';

interface IMediaGroupProps {
  mediaData: IMediaData[];
  baby: string;
  index: number;
} 

interface IMediaGroupState {
  index: number;
  thumbNails: string[];
  visible: boolean;
  loaded: boolean;
}

export class MediaGroup extends React.Component<IMediaGroupProps, IMediaGroupState> {
    
  constructor(props: IMediaGroupProps) {
    super(props);
    this.state = {
      index: 0,
      thumbNails: _.map(this.props.mediaData, data => ''),
      visible: false,
      loaded: false,
    };
    this.load.bind(this);
  }

  async load() {
    const thumbNails = [];
    for (let i = 0; i < this.props.mediaData.length; i++) {
      const data = this.props.mediaData[i];
      const thumbNail = await getPreSignedUrl(`${this.props.baby}/thumbs/${data.token}.jpg`); 
      thumbNails.push(thumbNail);
    }
    
    this.setState({
      thumbNails,
      loaded: true
    });
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

  onVisibleChanged = (visible: boolean) => {
    this.setState(
      {
        visible,
      }, 
      () => {
        if (this.state.visible && !this.state.loaded) {
          this.load();
        }
      }
    );
  }

  render() {

    const currentMedia = this.props.mediaData[this.state.index];
    const currentThumb = this.state.thumbNails[this.state.index];

    if (!currentMedia) {
      return <div />;
    }

    const mediaDiv = (
      <MediaHolder
        {...currentMedia}
        onLeftClick={this.onLeftTap}
        onRightClick={this.onRightTap}
        canLeft={this.state.index > 0}
        canRight={this.state.index < this.props.mediaData.length - 1}
        key={currentMedia.token}
        baby={this.props.baby}
        thumb={currentThumb}
        visible={this.state.visible}
      />
    );

    return (
      <div
        id={`media${this.props.index}`}
      >
        <VisibilitySensor
            onChange={this.onVisibleChanged}
            partialVisibility={true}
        >
          <Swipe
            onSwipedLeft={this.onRightTap}
            onSwipedRight={this.onLeftTap}
            preventDefaultEvent={false}
          >
            {mediaDiv}
          </Swipe>
        </VisibilitySensor>
      </div>
    );
  }
}    