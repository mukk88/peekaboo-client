import * as React from 'react';
import { 
  getThumbnailFromS3,
  // getObjectFromS3,
} from '../AwsS3';
import {
  transformMapping
} from './Common';

interface IImageHolderProps {
    token: string;
    orientation: number;
    date: string;
    comment: string;
}

interface IImageHolderState {
  thumbNail: string;
}

const centerStyle: React.CSSProperties = {
  textAlign: 'center',
};

const daysSinceStyle: React.CSSProperties = {
  padding: '0.5em',
};

const livBirthday = new Date('2017-09-18');

export class ImageHolder extends React.Component<IImageHolderProps, IImageHolderState> {

  constructor(props: IImageHolderProps) {
    super(props);
    this.state = {
      thumbNail: '',
    };
  }

  async componentDidMount() {
    const thumbNail = await getThumbnailFromS3(`liv/thumbs/${this.props.token}.jpg`);
    this.setState({
      thumbNail,
    });
  }
  
  render() {

    const isRotated = this.props.orientation === 1 || this.props.orientation === 3;

    const marginTopStyle = !isRotated ? {
      marginTop: '50px',
    } : {};

    const rotateStyle: React.CSSProperties = {
      transform: `rotate(${transformMapping[this.props.orientation]}deg)`,
      width: '100%',
      ...marginTopStyle,
    };
    const containerStyle: React.CSSProperties = {
      height: isRotated ? 'auto' : screen.width,
      ...centerStyle
    };
    const rootStyle: React.CSSProperties = {
      paddingTop: '1em',
      ...centerStyle,
    };

    const mediaDate = new Date(this.props.date);

    const timeDiff = Math.abs(mediaDate.getTime() - livBirthday.getTime());
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 

    return (
      <div style={rootStyle}>
        <div style={daysSinceStyle}>
          {`Day ${diffDays}`}
        </div>
        <div style={containerStyle}>
          <img src={this.state.thumbNail} style={rotateStyle}/>
        </div>
      </div>
    );
  }
}