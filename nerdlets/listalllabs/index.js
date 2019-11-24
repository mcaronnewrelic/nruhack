import React from 'react';
import { PlatformStateContext, NerdletStateContext } from 'nr1';
import ListalllabsNerdlet from './main';

export default class Wrapper extends React.PureComponent {

    render() {
        return <PlatformStateContext.Consumer>
            {(platformUrlState) => (
                <NerdletStateContext.Consumer>
                    {(nerdletUrlState) => {
                        return <ListalllabsNerdlet
                            launcherUrlState={platformUrlState}
                            nerdletUrlState={nerdletUrlState}
                        />          
                    }}
                </NerdletStateContext.Consumer>
            )}
        </PlatformStateContext.Consumer>
    }
}

