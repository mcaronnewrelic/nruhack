import React, { Component } from 'react'
import PropTypes from 'prop-types';
//import appropriate NR1 components
import { Button, navigation } from 'nr1';

export default class LabButton extends Component {
    static propTypes = {
        labName: PropTypes.string, 
        labDescription: PropTypes.string, 
        labTitle: PropTypes.string
    }

    openDetails = (e, lab) => {
        //Some labs only work with an Entity, this is a hack
        //Browse to an Entity to see the navigation integration
        const labsToAddFakeEntity = ['lab7', 'lab8', 'lab9'];
        //resetting the state, just in case
        var urlState = { entityGuid: ""}
        if (labsToAddFakeEntity.includes(lab.labName)) {
            urlState = { entityGuid: "MTAzODI4N3xBUE18QVBQTElDQVRJT058MTEwNzQ2NDc" }
        }
        //this is just to demonstrate the multiple ways that Nerdlets can be opened. StackedNerdlets are useful when you don't need access to the time picker.
        switch (lab.labName)
        {
            case 'lab1':
                navigation.openStackedNerdlet({
                    id: e.target.id,
                    urlState
                });
                break;
            default:
                navigation.openNerdlet({
                    id: e.target.id,
                    urlState
                });
        }
    }

    render() {
        const { labName, labDescription, labTitle } = this.props;
        return (
            <div className="labcard" >
                <button id={labName}
                    onClick={(e) => { this.openDetails(e, { labName }); }}
                 >
                {labName}
            </button >
                <h3>{labTitle}</h3>
                <p>{labDescription}</p>
            </div>
        )

    }
}