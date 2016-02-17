// Generated by LiveScript 1.3.1
import React from 'react';

import api from '../../api/api';

import {Grid, CrudActions} from '../../components/NewTable';
import Header from '../../components/PageHeader';
import { loadPeople } from '../../redux/modules/person';

import {AccountBtn, PersonBtn} from '../../molecules/ModalButtons';
import {filter} from 'prelude-ls';
import { connect } from 'react-redux';

const customActions = ({row}) => (
    <AccountBtn primary icon person_id={row.id}>
      <i className="icon settings"/>
    </AccountBtn>
);

const cols = [
  {
    key: 'first_name',
    display: 'First Name'
  }, {
    key: 'middle_name',
    display: 'Middle Name'
  }, {
    key: 'last_name',
    display: 'Last Name'
  }, {
    key: 'types',
    display: 'Types'
  }, {
    display: '',
    resourceType: 'person',
    renderer: CrudActions,
    linkTo: 'people',
    className: 'text-right',
    tdClassName: 'text-right',
    customActions: customActions
  }
];
let PeopleList = React.createClass({
  getInitialState(){
    return {
      currentFilter: 'All',
    };
  },
  componentWillMount(){
    this.props.loadPeople();
    // this.getPeople();
  },
  modal(){
    return CreatePersonModal(null);
  },
  renderFilterButton: function(name){
    var isActive, btnClassName, setActive, this$ = this;
    isActive = this.state.currentFilter === name;
    btnClassName = (function(){
      switch (isActive) {
      case true:
        return 'btn btn-default active';
      default:
        return 'btn btn-default';
      }
    }());
    setActive = function(){
      return this$.setState({
        currentFilter: name
      });
    };
    return (
      <div className={btnClassName} onClick={setActive}>
        {name}
      </div>
    );
  },
  renderGridTop(){
    return (
      <div className="btn-toolbar" role="toolbar">
        <div className="btn-group">
          {this.renderFilterButton('All')}
          {this.renderFilterButton('Students')}
          {this.renderFilterButton('Teachers')}
          {this.renderFilterButton('Parents')}
          {this.renderFilterButton('Admins')}
        </div>
        <PersonBtn
          className="btn btn-primary pull-right"
          label="New" />
      </div>
    );
  },
  // filteredData(){
  //   var format, this$ = this;
  //   format = function(){
  //     return function(it){
  //       return it.slice(0, -1);
  //     }(
  //     this$.state.currentFilter);
  //   };
  //   if (this.state.currentFilter === 'All') {
  //     return this.state.people;
  //   } else {
  //     return filter(function(it){
  //       return in$(format(this$.state.currentFilter), it.types);
  //     })(
  //     this.state.people);
  //   }
  // },
  render(){
    const {people} = this.props;
    return (
      <div>
        <Header primary="All People"/>
        <div>
          <div>
            {this.renderGridTop()}
          </div>
          {
            people ?
            <Grid columns={cols} data={people}/> :
            <div>Loading...</div>
          }
        </div>
      </div>
    )
  }
});

export default connect(state => ({
  people: state.person.people
}),{loadPeople})(PeopleList);

function in$(x, xs){
  var i = -1, l = xs.length >>> 0;
  while (++i < l) if (x === xs[i]) return true;
  return false;
}
