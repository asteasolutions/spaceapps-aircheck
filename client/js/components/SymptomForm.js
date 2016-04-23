import React, { Component } from 'react';
import Relay from 'react-relay';
import { FormGroup, Radio, ControlLabel, FormControl, DropdownButton, MenuItem, Button }
    from 'react-bootstrap';

import createComponent from '../utils/createComponent';
import symptoms from '../utils/symptoms';
import AddReportedSymptomMutation from '../data/mutations/AddReportedSymptomMutation';


class SymptomForm extends Component {
  constructor() {
    super();

    this._onSubmit = this._onSubmit.bind(this);
    this._typeSelected = this._typeSelected.bind(this);
    this._categoySelected = this._categoySelected.bind(this);
    this._gradeChanged = this._gradeChanged.bind(this);

    this.state = this.state || {
      category: 0,
      type: 0,
    };
  }

  _onSubmit() {
    const category = symptoms.categories[this.state.category];
    const name = symptoms.types.get(category)[this.state.type];
    const props = {
      category,
      name,
      lon: 180, // .refs.lon.valueAsNumber,
      lat: 23, // this.refs.lat.valueAsNumber,
      grade: grade.valueAsNumber, // this.state.grade,
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

  _gradeChanged(value) {
    this.setState({ grade: value.valueAsNumber });
  }

  render() {
    const category = symptoms.categories[this.state.category];
    const availableTypes = symptoms.types.get(category);

    return (
      <form>
        <FormGroup
          controlId='category'
        >
          {
            symptoms.categories.map((cat, index) => {
              const active = index === this.state.category;
              const changed = this._categoySelected.bind(this, index);
              return (
                <Radio inline checked={ active } key={ cat } onChange={ changed }>
                  {cat}
                </Radio>
              );
            })
          }
        </FormGroup>

        <FormGroup
          controlId='name'
        >
          <DropdownButton title='Select symptom' onSelect={ this._typeSelected } >
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

        <FormGroup controlId='grade'>
          <ControlLabel> Select intensity </ControlLabel>
          <FormControl type='number' min='1' max='3' step='1' onChange={ this._gradeChanged } />
        </FormGroup>

        <Button type='button' className='btn-success' onClick={ this._onSubmit }> Report </Button>

      </form>
    );
  }
}

export default createComponent(SymptomForm, {});
