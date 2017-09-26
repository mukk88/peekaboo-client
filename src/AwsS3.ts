import * as AWS from 'aws-sdk';
import { ListObjectsOutput } from 'aws-sdk/clients/s3';

var albumBucketName = 'peekaboos';
var bucketRegion = 'ap-southeast-1';
var IdentityPoolId = 'ap-southeast-1:d1e44f27-050b-4d53-b38d-8ce553977bef';

AWS.config.update({
  region: bucketRegion,
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: IdentityPoolId
  })
});

const s3 = new AWS.S3({
  apiVersion: '2012-10-17',
  params: {Bucket: albumBucketName}
});

export const s3Endpoint = 'https://s3-ap-southeast-1.amazonaws.com/peekaboos/';

export function getObjectsFromS3(): Promise<ListObjectsOutput> {
  return new Promise((resolve, reject) => {
    s3.listObjects({Bucket: albumBucketName}, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
}

export function getObjectUrlFromS3(key: string): string {
  const params = {Bucket: albumBucketName, Key: key, Expires: 60};
  const url = s3.getSignedUrl('getObject', params);
  return url;
}

export function uploadObject(key: string, obj: string | Blob) {
  return new Promise((resolve, reject) => {
    s3.upload({Bucket: albumBucketName, Key: key, Body: obj}, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
}

export function getPreSignedUrl(key: string) {
  const params = {
    Bucket: albumBucketName, 
    Key: key
   };
  return s3.getSignedUrl('getObject', params);
}

export function getObjectFromS3(key: string) {  
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: albumBucketName, 
      Key: key
     };
    s3.getObject(params, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
}

export async function getThumbnailFromS3(key: string) {

  const data = await getObjectFromS3(key);
  // tslint:disable-next-line
  const data2 = data as any;
  return data2.Body;
}
