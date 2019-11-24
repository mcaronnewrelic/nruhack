import React from 'react';
import { Dropdown, DropdownItem, Spinner, Stack, StackItem, BillboardChart, PieChart, NerdGraphQuery, PlatformStateContext } from 'nr1';

export default class MyNerdlet extends React.Component {

    constructor(props) {
        super(props)
        this.selectAccount = this.selectAccount.bind(this)

        console.debug(props) // eslint-disable-line
        this.state = {
            accounts: null,
            selectedAccount: null
        }
    }

    /**
     * Build the array of NRQL statements based on the duration from the Time Picker.
     */
    nrqlChartData(platformUrlState) {
        const { duration } = platformUrlState.timeRange;
        const durationInMinutes = duration / 1000 / 60;
        return [
            {
                title: 'Total Transactions',
                nrql: `SELECT count(*) from Transaction SINCE ${durationInMinutes} MINUTES AGO`
            },
            {
                title: 'JavaScript Errors',
                nrql: `SELECT count(*) FROM JavaScriptError SINCE ${durationInMinutes} MINUTES AGO COMPARE WITH ${durationInMinutes * 2} MINUTES AGO`
            },
            {
                title: 'Mobile Users OS/Platform',
                nrql: `FROM MobileSession SELECT uniqueCount(uuid) FACET osName, osVersion SINCE ${durationInMinutes} MINUTES AGO`,
                chartType: 'pie'
            },
            {
                title: 'Infrastructure Count',
                nrql: `SELECT uniqueCount(entityGuid) as 'Host Count' from SystemSample SINCE ${durationInMinutes} MINUTES AGO COMPARE WITH ${durationInMinutes * 2} MINUTES AGO`
            }
        ];
    }

    componentDidMount() {
        //being verbose for demonstration purposes only
        const q = NerdGraphQuery.query({
            query: `{
            actor {
              accounts {
                id
                name
              }
            }
          }` });
        q.then(results => {
            //logged for learning purposes
            console.debug(results); //eslint-disable-line
            const accounts = results.data.actor.accounts.map(account => {
                return account;
            });
            const account = accounts.length > 0 && accounts[0];
            this.setState({ selectedAccount: account, accounts });
        }).catch((error) => { console.log(error); })
    }

    /**
    * Option contains a label, value, and the account object.
    * @param {Object} option
    */
    selectAccount(option) {
        this.setState({ selectedAccount: option });
    }

    render() {
        const { accounts, selectedAccount } = this.state;

        // Logic for filtering our account listing Dropdown
        const { filter } = (this.state || {})

        if (filter && filter.length > 0) {
            const re = new RegExp(filter, 'i')
            accounts = accounts.filter(a => {
                return a.name.match(re)
            })
        }

        if (accounts) {
            return <PlatformStateContext.Consumer>
                {(platformUrlState) => {
                    return <Stack
                        fullWidth
                        horizontalType={Stack.HORIZONTAL_TYPE.FILL}
                        gapType={Stack.GAP_TYPE.EXTRA_LOOSE}
                        directionType={Stack.DIRECTION_TYPE.VERTICAL}>
                        {selectedAccount &&
                            <StackItem>
                                <Dropdown title={selectedAccount.name} filterable label="Account"
                                    onChangeFilter={(event) => this.setState({ filter: event.target.value })}>
                                    {accounts.map(a => {
                                        return <DropdownItem key={a.id} onClick={() => this.selectAccount(a)}>
                                            {a.name}
                                        </DropdownItem>
                                    })}
                                </Dropdown>
                            </StackItem>
                        }
                        {selectedAccount &&
                            <StackItem>
                                <Stack
                                    fullWidth
                                    horizontalType={Stack.HORIZONTAL_TYPE.FILL}
                                    gapType={Stack.GAP_TYPE.EXTRA_LOOSE}
                                    directionType={Stack.DIRECTION_TYPE.HORIZONTAL}>
                                    {this.nrqlChartData(platformUrlState).map((d, i) => <StackItem key={i} shrink={true}>
                                        <h2>{d.title}</h2>
                                        {d.chartType == 'pie' ? <PieChart
                                            accountId={selectedAccount.id}
                                            query={d.nrql}
                                            className="chart"
                                        /> : <BillboardChart
                                                accountId={selectedAccount.id}
                                                query={d.nrql}
                                                className="chart"
                                            />}
                                    </StackItem>)}
                                </Stack>
                            </StackItem>
                        }
                    </Stack>
                }}
            </PlatformStateContext.Consumer>
        } else {
            return <Spinner />
        }
    }
}