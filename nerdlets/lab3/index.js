import React from 'react';
import Lab3Nerdlet from './main';
import { PlatformStateContext, NerdletStateContext } from 'nr1';


export default class Wrapper extends React.PureComponent {
    render() {
        return (
            <PlatformStateContext.Consumer>
                {platformUrlState => (
                    <NerdletStateContext.Consumer>
                        {nerdletUrlState => (
                            <Lab3Nerdlet
                                launcherUrlState={platformUrlState}
                                nerdletUrlState={nerdletUrlState}
                            />
                        )}
                    </NerdletStateContext.Consumer>
                )}
            </PlatformStateContext.Consumer>
        );
    }
}
