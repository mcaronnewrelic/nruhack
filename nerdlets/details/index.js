import React from 'react';
import PropTypes from 'prop-types';
//import the needed summary stats
import SummaryBar from '../../components/summary-bar';
//import the appropriate NR1 components
import { Grid, GridItem, TableChart, AutoSizer, Spinner, PlatformStateContext, NerdletStateContext, EntityByGuidQuery, BlockText } from 'nr1';

export default class DetailsNerdlet extends React.Component {

    render() {
        return <PlatformStateContext.Consumer>
            {(platformUrlState) => (
                <NerdletStateContext.Consumer>
                    {(nerdletUrlState) => (
                        <AutoSizer>
                            {({ height, width }) => (<EntityByGuidQuery entityGuid={nerdletUrlState.entityGuid}>
                                {({ data, loading, error }) => {
                                    console.debug("EntityByGuidQuery", [loading, data, error]); //eslint-disable-line
                                    if (loading) {
                                        return <Spinner fillContainer />;
                                    }
                                    if (error) {
                                        return <BlockText>{error.message}</BlockText>
                                    }
                                    const { regionCode, countryCode, appName } = nerdletUrlState;

                                    const entity = data.entities[0];
                                    const { accountId } = entity;
                                    const { duration } = platformUrlState.timeRange;
                                    const durationInMinutes = duration / 1000 / 60;
                                    const nrqlWhere = countryCode ? ` WHERE countryCode  = '${countryCode}' ${regionCode ? ` AND regionCode = '${regionCode}' ` : ''}` : '';
                                    return (<Grid>
                                        <GridItem columnStart={1} columnEnd={12}>
                                            <SummaryBar {...nerdletUrlState} launcherUrlState={platformUrlState} />
                                        </GridItem>
                                        <GridItem columnStart={1} columnEnd={12}>
                                            <TableChart
                                                style={{ height: height - 75, width: '100%' }}
                                                accountId={accountId}
                                                query={`SELECT userAgentName, session, deviceType, backendDuration, networkDuration, domProcessingDuration,pageRenderingDuration  from PageView WHERE appName = '${appName}' ${nrqlWhere} SINCE ${durationInMinutes} MINUTES AGO LIMIT 2000 `}
                                            />
                                        </GridItem>
                                    </Grid>);
                                }}
                            </EntityByGuidQuery>)}
                        </AutoSizer>
                    )}
                </NerdletStateContext.Consumer>
            )}
        </PlatformStateContext.Consumer>;
    }
}