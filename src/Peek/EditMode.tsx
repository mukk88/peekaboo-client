import * as React from 'react';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import RaisedButton from 'material-ui/RaisedButton';
import {
  rootStyle,
  daysSinceStyle,
  containerStyle,
  IMediaData,
} from './Common';
import {
  baseUri
} from '../Config';

const optionButtonStyle: React.CSSProperties = {
  margin: '0 5%',
};

interface IEditModeProps {
  changeEditMode: Function;
  objData: IMediaData;
  baby: string;
}

async function updatePeekaboo(baby: string, data: IMediaData) {
  const dataToSend = {
    baby,
    ...data
  };
  let response;
  try {
    response = await fetch(`${baseUri}/peekaboo`, {
      method: 'PUT',
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

async function deletePeekaboo(token: string, baby: string, data: IMediaData) {
  let response;
  const dataToSend = {
    baby,
    ...data
  };
  try {
    response = await fetch(`${baseUri}/${baby}/peekaboo/${token}`, {
      method: 'DELETE',
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

export function EditMode(props: IEditModeProps) {

  async function submitSave() {
    const dataToSave = {
      ...props.objData
    };
    const commentInput = document.getElementById(`text-${props.objData.token}`) as HTMLInputElement;
    if (commentInput) {
      dataToSave.comment = commentInput.value;
    }
    const dateInput = document.getElementById(`date-${props.objData.token}`) as HTMLInputElement;
    if (dateInput) {
      dataToSave.date = `${dateInput.value}T00:00:00Z`;
    }
    const updated = await updatePeekaboo(props.baby, dataToSave);
    if (updated === true) {
      // reload page for now, todo make it better
      location.reload();
      // props.changeEditMode(false);
    } else {
      alert('failed to update! please try again');
    }

  }

  async function submitDelete() {
    // alert('delete not implemented yet!');
    const deleted = await deletePeekaboo(props.objData.token, props.baby, props.objData);
    if (deleted === true) {
      // reload page for now, todo make it better
      location.reload();
      // props.changeEditMode(false);
    } else {
      alert('failed to update! please try again');
    }
  }

  return (
    <div style={rootStyle}>
      <div style={daysSinceStyle}>
        <RaisedButton
          style={optionButtonStyle}
          onClick={() => submitSave()}
          label="Save"
        />
        <RaisedButton
          style={optionButtonStyle}
          onClick={() => props.changeEditMode(false)}
          label="Cancel"
        />
        <RaisedButton
          style={optionButtonStyle}
          onClick={() => submitDelete()}
          label="Delete"
        />
      </div>
      <div style={containerStyle}>
        <div>
          {`Token: ${props.objData.token}`}
        </div>
        <TextField
          id={`text-${props.objData.token}`}
          hintText="Edit comment"
          defaultValue={props.objData.comment}
        />
        <DatePicker
          id={`date-${props.objData.token}`}
          autoOk={true}
          defaultDate={new Date(props.objData.date.split('T')[0])}
        />
      </div>
    </div>
  );
}