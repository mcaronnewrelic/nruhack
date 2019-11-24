import React from 'react';
import PropTypes from 'prop-types';
//import the appropriate NR1 components
import { Tabs, TabsItem, Spinner, Stack, StackItem, NrqlQuery, navigation, AutoSizer, PlatformStateContext, NerdletStateContext, EntityByGuidQuery } from 'nr1';
//import our 3rd party libraries for the geo mapping features
import { CircleMarker, Map, TileLayer } from 'react-leaflet';
import SummaryBar from '../../components/summary-bar';
import JavaScriptErrorSummary from './javascript-error-summary';

const COLORS = [
    "#2dc937",
    "#99c140",
    "#e7b416",
    "#db7b2b",
    "#cc3232"
];

export default class lab8 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            center: [10.5731, -7.5898],
            zoom: 2
        }
        this.openDetails = this.openDetails.bind(this);
    }

    _getColor(value) {
        value = Math.round(value / 3);
        value = value < 0 ? 0 : value >= 5 ? 4 : value;
        return COLORS[value];
    }

    openDetails(pt, accountId) {
        navigation.openStackedNerdlet({
            id: 'details',
            urlState: {
                regionCode: pt.name[0],
                countryCode: pt.name[1],
                appName: this.state.entity.name,
                accountId
            }
        });
    }

    render() {
        const { zoom, center } = this.state;
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
                                    const entity = data.entities[0];
                                    const { accountId } = entity;
                                    const { duration } = platformUrlState.timeRange;
                                    const durationInMinutes = duration / 1000 / 60;
                                    return (<Tabs>
                                        <TabsItem label={`Page Views`} value={1}>
                                            <Stack
                                                fullWidth
                                                horizontalType={Stack.HORIZONTAL_TYPE.FILL}
                                                directionType={Stack.DIRECTION_TYPE.VERTICAL}
                                                gapType={Stack.GAP_TYPE.TIGHT}>
                                                <StackItem>
                                                    <SummaryBar appName={entity.name} accountId={accountId} launcherUrlState={platformUrlState} />
                                                </StackItem>
                                                <StackItem>
                                                    <NrqlQuery
                                                        formatType={NrqlQuery.FORMAT_TYPE.RAW}
                                                        accountId={accountId}
                                                        query={`SELECT count(*) as x, average(duration) as y, sum(asnLatitude)/count(*) as lat, sum(asnLongitude)/count(*) as lng FROM PageView WHERE appName = '${entity.name}' facet regionCode, countryCode SINCE ${durationInMinutes} MINUTES AGO limit 2000`}>
                                                        {results => {
                                                            console.debug(results);
                                                            if (results.loading) {
                                                                return <Spinner />
                                                            } else {
                                                                console.debug(results.data.facets);
                                                                return <Map
                                                                    className="containerMap"
                                                                    style={{ height: `${height - 125}px` }}
                                                                    center={center}
                                                                    zoom={zoom}
                                                                    zoomControl={true}
                                                                    ref={(ref) => { this.mapRef = ref }}>
                                                                    <TileLayer
                                                                        attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                                                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                                    />
                                                                    {results.data.facets.map((facet, i) => {
                                                                        const pt = facet.results;
                                                                        return <CircleMarker
                                                                            key={`circle-${i}`}
                                                                            center={[pt[2].result, pt[3].result]}
                                                                            color={this._getColor(pt[1].average)}
                                                                            radius={Math.log(pt[0].count) * 3}
                                                                            onClick={() => { this.openDetails(facet, entity); }}>
                                                                        </CircleMarker>
                                                                    })}
                                                                </Map>
                                                            }
                                                        }}
                                                    </NrqlQuery>
                                                </StackItem>
                                            </Stack>
                                        </TabsItem>
                                        <TabsItem label={`JavaScript Errors`} value={2}>
                                            <JavaScriptErrorSummary height={height} entity={entity} accountId={accountId} launcherUrlState={platformUrlState} />
                                        </TabsItem>
                                    </Tabs>);
                                }}
                            </EntityByGuidQuery>)}
                        </AutoSizer>
                    )}
                </NerdletStateContext.Consumer>
            )}
        </PlatformStateContext.Consumer>;
    }
}