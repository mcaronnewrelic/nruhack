import React from 'react';
import { AutoSizer, Spinner, HeadingText, EntityByGuidQuery, PlatformStateContext, NerdletStateContext } from 'nr1';
import Lab7 from './main';

export default class Wrapper extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            entityGuid: 'MTAzODI4N3xBUE18QVBQTElDQVRJT058MTEwNzQ2NDc',
            height: 90,
            width: 90
        }
    }

    render() {
        return <PlatformStateContext.Consumer>
            {(platformUrlState) => (
                <NerdletStateContext.Consumer>
                    {(nerdletUrlState) => {
                        return (<EntityByGuidQuery entityGuid={this.state.entityGuid}>
                            {({ data, loading, error }) => {
                                console.debug("EntityByGuidQuery", [loading, data, error]); //eslint-disable-line
                                if (loading) {
                                    return <Spinner fillContainer />;
                                }
                                if (error) {
                                    return <BlockText>{error.message}</BlockText>
                                }
                                const entity = data.entities[0];
                                return <Lab7
                                    launcherUrlState={platformUrlState}
                                    nerdletUrlState={nerdletUrlState}
                                    height={this.state.height}
                                    width={this.state.width}
                                    entity={entity}
                                />
                            }}
                        </EntityByGuidQuery>)
                    }}
                </NerdletStateContext.Consumer>
            )}
        </PlatformStateContext.Consumer>
    }
}