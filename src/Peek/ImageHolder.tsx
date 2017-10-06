import * as React from 'react';
import { 
  getPreSignedUrl,
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
    const thumbNail = await getPreSignedUrl(`liv/thumbs/${this.props.token}.jpg`);
    this.setState({
      thumbNail,
    });
  }
  
  render() {

    const rotateStyle: React.CSSProperties = {
      WebkitTransform: `rotate(${transformMapping[this.props.orientation]}deg)`,
      maxWidth: '100%',
      maxHeight: '425px',
      marginTop: '50px',
    };
    const containerStyle: React.CSSProperties = {
      height: '425px',
      overflowY: 'hidden',
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