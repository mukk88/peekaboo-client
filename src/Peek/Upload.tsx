import * as React from 'react';
import * as _ from 'lodash';
import FlatButton from 'material-ui/FlatButton'; 
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import * as Dropzone from 'react-dropzone';
import { ImageFile } from 'react-dropzone';
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
  if (ext === 'jpg' || ext === 'png') {
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

async function postPeekaboo(data: IMediaData) {
  const dataToSend = {
    baby: 'Liv',
    ...data
  };
  let response;
  try {
    response = await fetch('http://localhost:6060/peekaboo', {
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

export class Upload extends React.Component<{}, IUploadState> {

  constructor() {
    super();
    this.state = {
      mediaData: [],
      uploadingStatus: '',
    };
    this.onDropFiles = this.onDropFiles.bind(this);
    this.uploadFiles = this.uploadFiles.bind(this);
  }

  async uploadFiles() {
    for (let i = 0; i < this.state.mediaData.length; i++) {
      const data = this.state.mediaData[i];
      const commentInput = document.getElementById(`cmt-${data.name}`) as HTMLInputElement;
      if (commentInput) {
        data.comment = commentInput.value;
      }
      const dateInput = document.getElementById(`date-${data.name}`) as HTMLInputElement;
      if (dateInput) {
        data.date = `${dateInput.value}T00:00:00Z`;
      }
      const canvas = document.createElement('canvas');
      const img = document.getElementById(data.name) as HTMLVideoElement;
      const extension = data.name.split('.').pop();
      if (img) {
        canvas.width = data.isVideo ? img.videoWidth : img.width;
        canvas.height = data.isVideo ? img.videoHeight : img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const blob = canvas.toDataURL('image/jpeg');
          this.setState({
            uploadingStatus: `uploading ${i + 1} of ${this.state.mediaData.length}..`
          });
          const token = await postPeekaboo(data);
          if (!token) {
            alert('could not upload, please try again');
            continue;
          }
          let response = await uploadObject(`liv/thumbs/${token}.jpg`, blob);
          // check for errors
          console.log(response);
          response = await uploadObject(`liv/${token}.${extension}`, data.blob);
          console.log(response);
        }
      } 
    }
    this.setState({
      uploadingStatus: '',
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
        transform: `rotate(${transformMapping[data.orientation]}deg)`,
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

      const invisibleThumb = data.isVideo ? (
        <video
          id={data.name}
          src={window.URL.createObjectURL(data.blob)}
          height={'425px'}
          style={{...rotateStyle}}
          controls={true}
        />
      ) : (
        <img
          id={data.name}
          src={window.URL.createObjectURL(data.blob)}
          height={'425px'}
          style={{...rotateStyle}}
        />
      );

      return (
        <div key={data.name} style={{textAlign: 'center'}}>
          <div style={{overflow: 'hidden'}}>
            <div style={{overflow: 'hidden', height: '0px'}}>
              {invisibleThumb}
            </div>
            {visibleThumb}
          </div>
          <div>
            <TextField
              hintText="Enter comment"
              id={`cmt-${data.name}`}
            />
            <DatePicker
              id={`date-${data.name}`}
              autoOk={true}
              defaultDate={new Date(data.date)}
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