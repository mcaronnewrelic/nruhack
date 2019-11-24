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

    openDetails = (e) => {
        navigation.replaceNerdlet({
            id: e.target.innerHTML
        });
    }

    render() {
        const { labName, labDescription, labTitle } = this.props;
        return (
            <div className="labcard">
                <Button
                    type={Button.TYPE.NORMAL}
                    iconType={Button.ICON_TYPE.DATAVIZ__DATAVIZ__DASHBOARD }
                onClick={(e) => { this.openDetails(e); }} >
                {labName}
            </Button >
                <h3>{labTitle}</h3>
                <p>{labDescription}</p>
            </div>
        )

    }
}