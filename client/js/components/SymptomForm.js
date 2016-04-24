import '../../css/app.css';
import React, { Component } from 'react';
import Relay from 'react-relay';
import { FormGroup, ControlLabel, FormControl, DropdownButton, MenuItem, Button, ButtonGroup }
    from 'react-bootstrap';

import createComponent from '../utils/createComponent';
import symptoms from '../utils/symptoms';
import AddReportedSymptomMutation from '../data/mutations/AddReportedSymptomMutation';
import { centerMap } from '../actions/WorldMapActions';

class SymptomForm extends Component {
  constructor() {
    super();

    this._onSubmit = this._onSubmit.bind(this);
    this._typeSelected = this._typeSelected.bind(this);
    this._categoySelected = this._categoySelected.bind(this);
    this._gradeChanged = this._gradeChanged.bind(this);
    this._onCenterMap = this._onCenterMapClick.bind(this);

    this.state = this.state || {
      category: 0,
      type: 0,
      grade: 1,
    };
  }

  _onSubmit() {
    const category = symptoms.categories[this.state.category];
    const name = symptoms.types.get(category)[this.state.type];
    const props = {
      category,
      name,
      lon: this.props.longitude,
      lat: this.props.latitude,
      grade: this.state.grade,
    };

    const areAllVluesSet = Object.keys(props).reduce((prev, key) => prev && !!props[key], true);
    if (areAllVluesSet) {
      Relay.Store.commitUpdate(new AddReportedSymptomMutation(props));
    }
  }

  _typeSelected(eventKey) {
    this.setState({ type: eventKey });
  }

  _categoySelected(index) {
    this.setState({
      category: index,
      type: 0,
    });
  }

  _gradeChanged(index) {
    this.setState({ grade: index + 1 });
  }

  _onCenterMapClick() {
    this.props.dispatch(centerMap());
  }

  render() {
    const category = symptoms.categories[this.state.category];
    const availableTypes = symptoms.types.get(category);

    return (
      <form className='symptom-form'>
        <FormGroup
          className='category'
          controlId='category'
        >
          <ButtonGroup>
          {
            symptoms.categories.map((cat, index) => {
              const active = index === this.state.category;
              const changed = this._categoySelected.bind(this, index);
              const bg = require(`../../assets/${cat}_transparent.svg`);
              const style = {
                backgroundImage: `url('${bg}')`,
              };
              return (
                <Button
                  active={ active }
                  key={ cat }
                  onClick={ changed }
                  style={ style }
                />
              );
            })
          }
          </ButtonGroup>
        </FormGroup>

        <FormGroup
          controlId='type'
          className='type'
        >
          <DropdownButton
            title={ availableTypes[this.state.type] }
            id='symptom-type'
            onSelect={ this._typeSelected }
          >
              {
                availableTypes.map((type, index) => {
                  const active = index === this.state.type;
                  return (
                    <MenuItem eventKey={index} active={ active } key={ type }>
                      {type}
                    </MenuItem>);
                })
              }
          </DropdownButton>
        </FormGroup>

        <FormGroup
          controlId='grade'
          className='grade'
        >
          <ControlLabel> Select intensity </ControlLabel>
          <ButtonGroup justified>
          {
            ['I', 'II', 'III'].map((grade, index) => {
              const active = index + 1 === this.state.grade;
              const changed = this._gradeChanged.bind(this, index);
              return (
                <Button
                  active={ active }
                  key={ `grade-${grade}` }
                  onClick={ changed }
                >
                  {grade}
                </Button>
              );
            })
          }
          </ButtonGroup>
        </FormGroup>

        <h4> Move pin on map to select location </h4>
        <div className='location row'>
          <FormControl type='text' value={ this.props.latitude } className='col-md5' />
          <FormControl type='text' value={ this.props.longitude } className='col-md5' />
          <div className='location-form-group col-md2'>
            <Button tpye='button' className='my-location' onClick={ this._onCenterMap } />
          </div>
        </div>
          <Button type='button' id='btn-report' className='btn-success'
            onClick={ this._onSubmit }> Report symptom
          </Button>
      </form>
    );
  }
}

export default createComponent(SymptomForm, {
  reduxConfig: {
    mapStateToProps: (state) => {
      const loc = state.WorldMap.Location.dropPin;
      return {
        latitude: loc && loc.lat || 0,
        longitude: loc && loc.lng || 0,
      };
    },
  },
});
