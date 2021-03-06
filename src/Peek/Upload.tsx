import * as React from 'react';
import * as _ from 'lodash';
import { RouteComponentProps, withRouter } from 'react-router';
import FlatButton from 'material-ui/FlatButton'; 
import TextField from 'material-ui/TextField';
import * as Dropzone from 'react-dropzone';
import { ImageFile } from 'react-dropzone';
import { baseUri } from '../Config';
import {
  uploadObject,
} from '../AwsS3';
import {
  IMediaData,
  transformMapping,
} from './Common';

declare function require(path: string): IExif;
const exif = require('../../node_modules/exif-js/exif.js');

interface IExif {
  getData: Function;
  getAllTags: Function;
  exifdata: { [s: string]: string; };
}

interface IExifData {
  orientation: number;
  dateString: string;
}

interface IUploadState {
  mediaData: IMediaData[];
  uploadingStatus: string;
}

function isVideoType(fileName: string) {
  const ext = fileName.split('.').pop();
  if (ext === 'jpg' || ext === 'png' ||
      ext === 'JPG' || ext === 'PNG' ||
      ext === 'JPEG' || ext === 'jpeg') {
    return false;
  } 
  return true;
}

function getExifData(file: ImageFile): Promise<IExifData> {
  return new Promise((resolve, reject) => {
      exif.getData(file, function(this: IExif) {
        const orientation = this.exifdata.Orientation ? parseInt(this.exifdata.Orientation, 10) : 1;
        // tslint:disable-next-line
        if(this.exifdata.DateTimeOriginal) {
          resolve({
            orientation,
            dateString: this.exifdata.DateTimeOriginal,
          });
        } else {
          // resolve with todays date
          resolve({
            orientation,
            dateString: (new Date()).toISOString().split('T')[0],
          });
        }
      });
  });
}

function readFile(file: ImageFile): Promise<Blob> {
  return new Promise(resolve => {
    const reader = new FileReader();
    // tslint:disable-next-line
    reader.onload = function(event: any) {
      const blob = new Blob([event.target.result]);
      resolve(blob);
    };
    reader.readAsArrayBuffer(file);
  });
}

async function postPeekaboo(baby: string, data: IMediaData) {
  const dataToSend = {
    baby,
    ...data
  };
  let response;
  try {
    response = await fetch(`${baseUri}/peekaboo`, {
      method: 'POST',
      body: JSON.stringify(dataToSend),
    });
    if (response.status !== 200) {
      return null;
    }
  } catch (error) {
    return null;
  }
  const body = await response.json();
  return body.Token;
}

async function generatePeekabooThumb(baby: string, data: IMediaData, token: string) {
  const dataToSend = {
    baby,
    ...data
  };
  let response;
  try {
    response = await fetch(`${baseUri}/peekaboo/${token}/thumb`, {
      method: 'POST',
      body: JSON.stringify(dataToSend),
    });
    if (response.status !== 200) {
      return false;
    }
  } catch (error) {
    return false;
  }
  return true;
}

const dropZoneStyle: React.CSSProperties = {
  height: '1.5em',
  width: '200px',
  border: '1px solid black',
  margin: '5px',
};

const uploadButtonStyle: React.CSSProperties = {
  float: 'right',
  marginTop: '-5px',
};

class Upload extends React.Component<RouteComponentProps<{baby: string}>, IUploadState> {

  constructor(props: RouteComponentProps<{baby: string}>) {
    super(props);
    this.state = {
      mediaData: [],
      uploadingStatus: '',
    };
    this.onDropFiles = this.onDropFiles.bind(this);
    this.uploadFiles = this.uploadFiles.bind(this);
  }

  async uploadFiles() {
    const totalToUpload = this.state.mediaData.length;
    let uploadedSoFar = 0;
    for (let i = 0; i < this.state.mediaData.length; i++) {
      const data = this.state.mediaData[i];
      const commentInput = document.getElementById(`cmt-${data.name}`) as HTMLInputElement;
      if (commentInput) {
        data.comment = commentInput.value;
      }
      this.setState({
        uploadingStatus: `uploading ${i + 1} of ${this.state.mediaData.length}..`
      });
      const token = await postPeekaboo(this.props.match.params.baby, data);
      if (!token) {
        alert('could not upload, please try again');
        continue;
      }
      const extension = data.name.split('.').pop();
      const response = await uploadObject(
        `${this.props.match.params.baby}/${token}.${extension}`, data.blob || new Blob());
      console.log(response);
      const generatedThumb = await generatePeekabooThumb(this.props.match.params.baby, data, token);
      if (!generatedThumb) {
        alert('could not generated thumbnail, please try again');
        continue;
      }
      uploadedSoFar = i + 1;
    }
    this.setState({
      uploadingStatus: `uploaded ${uploadedSoFar}/${totalToUpload}`,
      mediaData: [],
    });
  }

  async onDropFiles(files: ImageFile[]) {
    const blobs = [];
    for (let i = 0; i < files.length; i++) {
      const exifData = await getExifData(files[i]);
      const dateString = exifData.dateString.split(' ')[0].split(':').join('-');
      const blob = await readFile(files[i]);
      const isVideo = isVideoType(files[i].name);
      blobs.push({
        blob,
        name: files[i].name,
        date: `${dateString}T00:00:00Z`,
        isVideo,
        comment: '',
        orientation: exifData.orientation,
        token: '',
      });
    }
    this.setState({
      mediaData: this.state.mediaData.concat(blobs),
    });
  }

  render() {

    const imgs = _.map(this.state.mediaData, data => {
      const rotateStyle: React.CSSProperties = {
        WebkitTransform: `rotate(${transformMapping[data.orientation]}deg)`,
      };

      const visibleThumb = data.isVideo ? (
        <video
          src={window.URL.createObjectURL(data.blob)}
          height={'250px'}
          style={rotateStyle}
          controls={true}
        />
      ) : (
        <img
          src={window.URL.createObjectURL(data.blob)}
          height={'250px'}
          style={rotateStyle}
        />
      );
      
      return (
        <div key={data.name} style={{textAlign: 'center'}}>
          <div style={{overflow: 'hidden'}}>
            {visibleThumb}
          </div>
          <div>
            <TextField
              hintText="Enter comment"
              id={`cmt-${data.name}`}
            />
          </div>
        </div>
      );
    });

    return (
      <div>
        <div>{this.state.uploadingStatus}</div>
        <FlatButton
          onTouchTap={this.uploadFiles}
          label="Upload files"
          style={uploadButtonStyle}
        />
        <Dropzone 
          onDrop={this.onDropFiles} 
          style={dropZoneStyle}
        >
          Choose file(s)
        </Dropzone>
        
        {imgs}
      </div>
    );
  }
}

export default withRouter(Upload);