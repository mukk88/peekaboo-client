import * as React from 'react';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
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

interface IEditModeState {
  newBaby: string;
}

async function updatePeekaboo(baby: string, data: IMediaData) {
  const dataToSend = {
    ...data,
    baby,
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
    ...data,
    baby,
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

export class EditMode extends React.Component<IEditModeProps, IEditModeState> {

  constructor(props: IEditModeProps) {
    super(props);
    this.state = {
      newBaby: props.baby,
    };
    this.submitSave.bind(this);
    this.submitDelete.bind(this);
  }

  async submitSave() {
    const dataToSave = {
      ...this.props.objData
    };
    const commentInput = document.getElementById(`text-${this.props.objData.token}`) as HTMLInputElement;
    if (commentInput) {
      dataToSave.comment = commentInput.value;
    }
    const dateInput = document.getElementById(`date-${this.props.objData.token}`) as HTMLInputElement;
    if (dateInput) {
      dataToSave.date = `${dateInput.value}T00:00:00Z`;
    }
    const updated = await updatePeekaboo(this.state.newBaby, dataToSave);
    if (updated === true) {
      // reload page for now, todo make it better
      location.reload();
      // props.changeEditMode(false);
    } else {
      alert('failed to update! please try again');
    }

  }

  async submitDelete() {
    const deleted = await deletePeekaboo(this.props.objData.token, this.props.baby, this.props.objData);
    if (deleted === true) {
      // reload page for now, todo make it better
      location.reload();
      // props.changeEditMode(false);
    } else {
      alert('failed to update! please try again');
    }
  }

  // tslint:disable-next-line
  changeBaby = (event: any, index: number, newBaby: string) => {
    this.setState({
      newBaby,
    });
  }

  render() {
    return (
      <div style={rootStyle}>
        <div style={daysSinceStyle}>
          <RaisedButton
            style={optionButtonStyle}
            onClick={() => this.submitSave()}
            label="Save"
          />
          <RaisedButton
            style={optionButtonStyle}
            onClick={() => this.props.changeEditMode(false)}
            label="Cancel"
          />
          <RaisedButton
            style={optionButtonStyle}
            onClick={() => this.submitDelete()}
            label="Delete"
          />
        </div>
        <div style={containerStyle}>
          <div>
            {`Token: ${this.props.objData.token}`}
          </div>
          <TextField
            id={`text-${this.props.objData.token}`}
            hintText="Edit comment"
            defaultValue={this.props.objData.comment}
          />
          <DatePicker
            id={`date-${this.props.objData.token}`}
            autoOk={true}
            defaultDate={new Date(this.props.objData.date.split('T')[0])}
          />
          <SelectField
            value={this.state.newBaby}
            onChange={this.changeBaby}
          >
            <MenuItem value={'liv'} primaryText="Liv" />
            <MenuItem value={'lexie'} primaryText="Lexie" />
            <MenuItem value={'family'} primaryText="Family" />
          </SelectField>
        </div>
      </div>
    );
  }
}