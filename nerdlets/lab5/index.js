import React, { Fragment } from 'react';
import { NerdGraphQuery, EntityByGuidQuery, EntitiesByNameQuery, EntitiesByDomainTypeQuery, EntityCountQuery, Spinner, Stack, StackItem, HeadingText, BlockText, NerdletStateContext } from 'nr1';

export default class MyNerdlet extends React.Component {

    constructor(props) {
        super(props);
        console.debug(props); //eslint-disable-line
        this.state = {
            entityName: "New Relic Pet Clinic"
        };
    }

    _renderTable(data) {
        console.debug(JSON.stringify(data));
        const headings = Object.keys(data[0]).filter(k => k != '__typename' && k != 'id' && k != 'tags' && k != 'reporting');
        return <table className="table">
            <tbody>
                <tr>
                    {headings.map((name, i) => <th key={i}>{name}</th>)}
                </tr>
                {data.length > 1 ? data.map((item, i) => {
                    return <tr key={i}>
                        {headings.map((name, j) => <td key={j} className="table-data">{item[name]}</td>)}
                    </tr>
                }) : <tr>
                        {headings.map((name, j) => <td key={j} className="table-data">{data[0][name]}</td>)}
                    </tr>
                }
            </tbody>
        </table>
    }

    render() {
        return (<Stack fullWidth directionType={Stack.DIRECTION_TYPE.VERTICAL}>
            <StackItem className="container">
                <NerdGraphQuery query={`{actor {accounts {id name}}}`}>
                    {({ loading, error, data }) => {
                        console.debug([loading, data, error]); //eslint-disable-line
                        if (loading) {
                            return <Spinner />;
                        }
                        if (error) {
                            return <BlockText>{error.message}</BlockText>;
                        }

                        return <Fragment>
                            <HeadingText>Accounts</HeadingText>
                            {this._renderTable(data.actor.accounts)}
                        </Fragment>
                    }}
                </NerdGraphQuery>
            </StackItem>
            <StackItem className="container">
                <NerdletStateContext.Consumer>
                    {(nerdletUrlState) => {
                        return <EntityByGuidQuery entityGuid={nerdletUrlState.entityGuid}>
                            {({ loading, error, data }) => {
                                console.debug([loading, data, error]); //eslint-disable-line
                                if (loading) {
                                    return <Spinner />;
                                }
                                if (error) {
                                    return <HeadingText>{error.message}</HeadingText>;
                                }
                                return <Fragment className="fragment">
                                    <HeadingText>Entity by ID</HeadingText>
                                    {this._renderTable(data.entities)}
                                </Fragment>
                            }}
                        </EntityByGuidQuery>

                    }}
                </NerdletStateContext.Consumer>
            </StackItem>
            <StackItem className="container">
                <EntitiesByDomainTypeQuery entityDomain="BROWSER" entityType="APPLICATION">
                    {({ loading, error, data }) => {
                        console.debug([loading, data, error]); //eslint-disable-line
                        if (loading) {
                            return <Spinner />;
                        }
                        if (error) {
                            return <BlockText>{JSON.stringify(error)}</BlockText>;
                        }
                        return <Fragment>
                            <HeadingText>Entity by Domain Type</HeadingText>
                            {this._renderTable(data.entities)}
                        </Fragment>
                    }}
                </EntitiesByDomainTypeQuery>
            </StackItem>
            <StackItem className="container">
                <EntitiesByNameQuery name={this.state.entityName}>
                    {({ loading, error, data }) => {
                        console.debug([loading, data, error]); //eslint-disable-line
                        if (loading) {
                            return <Spinner />;
                        }
                        if (error) {
                            return <BlockText>{JSON.stringify(error)}</BlockText>;
                        }
                        return <Fragment>
                            <HeadingText>Entity by Name</HeadingText>
                            {this._renderTable(data.entities)}
                        </Fragment>
                    }}
                </EntitiesByNameQuery>
            </StackItem>
            <StackItem className="container">
                <EntityCountQuery>
                    {({ loading, error, data }) => {
                        console.debug([loading, data, error]); //eslint-disable-line
                        if (loading) {
                            return <Spinner />;
                        }
                        if (error) {
                            return <BlockText>{JSON.stringify(error)}</BlockText>;
                        }
                        return <Fragment>
                            <HeadingText>Entity Count</HeadingText>
                            {this._renderTable(data.types)}
                        </Fragment>

                    }}
                </EntityCountQuery>
            </StackItem>
        </Stack>);
    }
}