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
        const labToExclude = ['lab1','lab2', 'lab3', 'lab5'];
        var urlState = { entityGuid: "MTAzODI4N3xBUE18QVBQTElDQVRJT058MTEwNzQ2NDc"}
        if (labToExclude.includes(lab.labName)) {
            urlState = { entityGuid: "" }
        }
        navigation.openNerdlet({
            id: e.target.id,
            urlState
        });
    }

    render() {
        const { labName, labDescription, labTitle } = this.props;
        return (
            <div className="labcard">
            <button
                id={labName}
                onClick={(e) => { this.openDetails(e,{labName}); }} >
                {labName}
            </button >
                <h3>{labTitle}</h3>
                <p>{labDescription}</p>
            </div>
        )

    }
}