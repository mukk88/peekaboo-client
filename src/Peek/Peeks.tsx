import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import * as _ from 'lodash';
import FontIcon from 'material-ui/FontIcon';
import { LoadingStates, Loading, LoadingError } from '../Loading/Loading';
import { grey500 } from 'material-ui/styles/colors';
import {
  IMediaData
} from './Common';
import { baseUri } from '../Config'; 
import { MediaGroup } from './MediaGroup';

interface IPeeksState {
  mediaData: IMediaData[][];
  loadingState: LoadingStates;
}

const birthIconStyle: React.CSSProperties = {
  marginTop: '0.5em',
  fontSize: '2em',
};

async function getAllPeeks(baby: string): Promise<IMediaData[]> {
  try {
    const response = await fetch(`${baseUri}/${baby}/peekaboo`);
    if (response.status !== 200) {
      return [];
    }
    return await response.json();
  } catch (error) {
    return [];
  }
}

class Peeks extends React.Component<RouteComponentProps<{ baby: string }>, IPeeksState> {

  constructor(props: RouteComponentProps<{ baby: string }>) {
    super(props);
    this.state = {
      mediaData: [],
      loadingState: LoadingStates.LOADING,
    };
  }

  async componentDidMount() {
    const response = await getAllPeeks(this.props.match.params.baby);
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

    const images = _.map(this.state.mediaData, (mediaDataArray, index) => {
      return (
        <MediaGroup
          key={`media${index}`}
          baby={this.props.match.params.baby}
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
            {this.props.match.params.baby} was born.
          </div>
        </div>
        <div style={{height: '2em'}} />
      </div>
    );
  }
}

export default withRouter(Peeks);