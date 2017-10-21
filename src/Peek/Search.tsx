import * as React from 'react';
import FontIcon from 'material-ui/FontIcon';
import Paper from 'material-ui/Paper';
import DatePicker from 'material-ui/DatePicker';
import RaisedButton from 'material-ui/RaisedButton';
import { grey400 } from 'material-ui/styles/colors';

declare function require(path: string): Function;
const scrollIntoView = require('scroll-into-view');

interface ISearchProps {
  dates: Date[];
  birthday: Date;
}

interface ISearchState {
  opened: boolean;
  chosenDate: Date;
}

const searchStyle: React.CSSProperties = {
  position: 'fixed',
  bottom: '20px',
  right: '20px',
  fontSize: '2em',
};

const paperStyle: React.CSSProperties = {
  height: '100%',
  width: '40%',
  position: 'fixed',
  padding: '1em',
  paddingTop: '5em',
  top: 0,
  zIndex: 99,
};

const dateStyle: React.CSSProperties = {
  width: '100%'
};

const searchButtonStyle: React.CSSProperties = {
  float: 'right',
  marginRight: '1em',
};

const paddingStyle: React.CSSProperties = {
  padding: '0.2em'
};

function getMonths(d2: Date, d1: Date) {
  let months;
  months = (d2.getFullYear() - d1.getFullYear()) * 12;
  months -= d1.getMonth() + 1;
  months += d2.getMonth();
  return months <= 0 ? 0 : months;
}

export class Search extends React.Component<ISearchProps, ISearchState> {

  constructor(props: ISearchProps) {
    super(props);
    this.state = {
      opened: false,
      chosenDate: new Date(),
    };
  }

  toggleOpened = () => {
    this.setState({
      opened: !this.state.opened
    });
  }

  search = () => {
    const selectedDate = this.state.chosenDate;
    let lowestIndex = 0;
    let largestDiff = Math.abs(this.props.dates[0].getTime() - selectedDate.getTime());
    // iterate all for now
    this.props.dates.forEach((date, index) => {
      const timeDiff = Math.abs(date.getTime() - selectedDate.getTime());
      if (timeDiff < largestDiff) {
        largestDiff = timeDiff;
        lowestIndex = index;
      }
    });
    const e = document.getElementById(`media${lowestIndex}`);
    scrollIntoView(e);
    this.setState({
      opened: false,
    });
  }

  onDateSelected = (years: number, months: number) => {
    const startingDate = new Date(this.props.birthday);
    var chosenDate = new Date(
      startingDate.getFullYear() + years,
      startingDate.getMonth() + months,
      startingDate.getDate()
    );
    this.setState(
      {
        chosenDate
      }, 
      this.search
    );
  }

  // tslint:disable-next-line
  onDateChanged = (event: any, chosenDate: Date) => {
    this.setState({
      chosenDate
    });
  }

  render() {

    const possibleDates: boolean[][] = [];
    this.props.dates.forEach((date) => {
      const monthsApart = getMonths(date, this.props.birthday);
      const yearsApart = Math.floor(monthsApart / 12);
      const monthsLeftApart = monthsApart % 12;
      if (!possibleDates[yearsApart]) {
        possibleDates[yearsApart] = [];
      }
      possibleDates[yearsApart][monthsLeftApart] = true;
    });

    return (
      <div>
        {this.state.opened &&
          <Paper
            style={paperStyle}
            zDepth={5}
          >
            <DatePicker
              autoOk={true}
              defaultDate={new Date()}
              floatingLabelText="By Date"
              name="picker"
              textFieldStyle={dateStyle}
              value={this.state.chosenDate}
              onChange={this.onDateChanged}
            />
            <div style={{height: '1em'}} />
            <div style={{overflowY: 'scroll'}}>
              {possibleDates.map((year, index) => {
                return (
                  <div
                    key={`year${index}`}
                  >
                    <div
                      onClick={() => { this.onDateSelected(index, 0); }}
                      style={paddingStyle}
                    >
                      {`year ${index}`}
                    </div>
                    {year.map((month, mIndex) => {
                      if (month) {
                        return (
                          <div
                            style={{...paddingStyle, marginLeft: '1em'}}
                            key={`month${mIndex}`}
                            onClick={() => { this.onDateSelected(index, mIndex); }}
                          >
                            {`${mIndex} month`}
                          </div>
                        );
                      } else {
                        return <span />;
                      } 
                    })}
                  </div>
                );
              })}
            </div>
            <div style={{height: '1em'}} />
            <RaisedButton
              label="Search"
              onClick={this.search}
              style={searchButtonStyle}
            />
          </Paper>
        }
        <FontIcon
          style={searchStyle}
          className="material-icons"
          color={grey400}
          onClick={this.toggleOpened}
        >
          search
        </FontIcon>
      </div>
    );
  }
}
