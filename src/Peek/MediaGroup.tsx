import * as React from 'react';
import * as _ from 'lodash';
import Swipe from 'react-swipe-component';
import { IMediaData } from './Common';
import { MediaHolder } from './MediaHolder';
import { getPreSignedUrl } from '../AwsS3';

interface IMediaGroupProps {
  mediaData: IMediaData[];
  baby: string;
} 

interface IMediaGroupState {
  index: number;
  thumbNails: string[];
}

export class MediaGroup extends React.Component<IMediaGroupProps, IMediaGroupState> {
    
  constructor(props: IMediaGroupProps) {
    super(props);
    this.state = {
      index: 0,
      thumbNails: _.map(this.props.mediaData, data => ''),
    };
  }
  async componentDidMount() {

    const thumbNails = [];
    for (let i = 0; i < this.props.mediaData.length; i++) {
      const data = this.props.mediaData[i];
      const thumbNail = await getPreSignedUrl(`${this.props.baby}/thumbs/${data.token}.jpg`); 
      thumbNails.push(thumbNail);
    }
    
    this.setState({
      thumbNails,
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
      />
    );

    return (
      <div
      >
        <Swipe
          onSwipedLeft={this.onRightTap}
          onSwipedRight={this.onLeftTap}
          preventDefaultEvent={false}
        >
          {mediaDiv}
        </Swipe>
      </div>
    );
  }
}    