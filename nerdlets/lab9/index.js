import React from 'react';
import { AutoSizer, Spinner, HeadingText, EntityByGuidQuery, PlatformStateContext, NerdletStateContext } from 'nr1';
import Lab9 from './main';

export default class Wrapper extends React.PureComponent {

    render() {
        return <PlatformStateContext.Consumer>
            {(platformUrlState) => (
                <NerdletStateContext.Consumer>
                    {(nerdletUrlState) => {
                        if (!nerdletUrlState || !nerdletUrlState.entityGuid) {
                            return <HeadingText>Go find a Service or Browser App to compare</HeadingText>
                        }
                        return (<EntityByGuidQuery entityGuid={nerdletUrlState.entityGuid}>
                            {({ data, loading, error }) => {
                                console.debug("EntityByGuidQuery", [loading, data, error]); //eslint-disable-line
                                if (loading) {
                                    return <Spinner fillContainer />;
                                }
                                if (error) {
                                    return <BlockText>{error.message}</BlockText>
                                }
                                const entity = data.entities[0];
                                return (<AutoSizer>
                                    {({ width, height }) => (
                                    <Lab9
                                        launcherUrlState={platformUrlState}
                                        nerdletUrlState={nerdletUrlState}
                                        height={height}
                                        width={width}
                                        entity={entity}/>
                                    )}
                                </AutoSizer>
                            )}}
                        </EntityByGuidQuery>)
                    }}
                </NerdletStateContext.Consumer>
            )}
        </PlatformStateContext.Consumer>
    }
}