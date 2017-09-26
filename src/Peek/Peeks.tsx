import * as React from 'react';
import * as _ from 'lodash';
import FontIcon from 'material-ui/FontIcon';
import { LoadingStates, Loading, LoadingError } from '../Loading/Loading';
import { grey500 } from 'material-ui/styles/colors';
import {
  IMediaData
} from './Common';
import { MediaGroup } from './MediaGroup';

interface IPeeksState {
  mediaData: IMediaData[][];
  loadingState: LoadingStates;
}

const birthIconStyle: React.CSSProperties = {
  marginTop: '0.5em',
  fontSize: '2em',
};

async function getAllPeeks(): Promise<IMediaData[]> {
  try {
    const response = await fetch('http://localhost:6060/peekaboo');
    if (response.status !== 200) {
      return [];
    }
    return await response.json();
  } catch (error) {
    return [];
  }
}

export class Peeks extends React.Component<{}, IPeeksState> {

  constructor() {
    super();
    this.state = {
      mediaData: [],
      loadingState: LoadingStates.LOADING,
    };
  }

  async componentDidMount() {

    const response = await getAllPeeks();
    const groupedMediaData: IMediaData[][] = [[]];
    _.each(response, mediaData => {
      if (groupedMediaData[0].length === 0) {
        groupedMediaData[0].push(mediaData);
        return;
      }
      const lastArray = groupedMediaData[groupedMediaData.length - 1];
      const lastItem = lastArray[lastArray.length - 1];
      if (lastItem.date === mediaData.date) {
        lastArray.push(mediaData);
      } else {
        groupedMediaData.push([mediaData]);
      }
    });
    // const groupedMediaData = _.groupBy<IMediaData, string>(response, mediaData => mediaData.date);
    this.setState({
      mediaData: groupedMediaData,
      loadingState: LoadingStates.LOAD_SUCCESS,
    });
  }

  render() {
    if (this.state.loadingState === LoadingStates.LOADING) {
      return (
        <Loading />
      );
    } else if (this.state.loadingState === LoadingStates.LOAD_FAILED) {
      return (
        <LoadingError msg={'Load failed, please try again.'}/>
      );
    }

    const images = _.map(this.state.mediaData, mediaDataArray => {
      return (
        <MediaGroup
          mediaData={mediaDataArray}
        />
      );
    });

    return (
      <div>
        {images}
        <div style={{textAlign: 'center'}}>
          <FontIcon className="material-icons" color={grey500} style={birthIconStyle}>child_care</FontIcon>
          <div style={{fontSize: '1.2em'}}>
            Liv was born.
          </div>
        </div>
        <div style={{height: '2em'}} />
      </div>
    );
  }
}