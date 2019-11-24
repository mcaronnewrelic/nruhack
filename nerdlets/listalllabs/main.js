import React from 'react';
import { List, ListItem } from 'nr1';   
import PropTypes from 'prop-types';
import LabButton from '../../components/lab-button'
import data from './data'

// https://docs.newrelic.com/docs/new-relic-programmable-platform-introduction

export default class ListalllabsNerdlet extends React.Component {
    static propTypes = {
        nerdletUrlState: PropTypes.object.isRequired,
        launcherUrlState: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            labs: data.labs,  
        }
    }

    render() {
        const labs = this.state.labs.map((lab) => <ListItem key={lab.id}><LabButton
            labName={lab.id}
            labDescription={lab.description}
            labTitle={lab.title}
        />
        </ListItem>);    
        return (
            <List fullHeight fullWidth>
                {labs ? labs : <li>
                    No labs available.
                  </li>}
            </List>
        )}
}
