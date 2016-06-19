import { Component, PropTypes} from "react"
import { connect } from "react-redux"

import { GraphQL } from "../../../core/graphql"
import Authorized from "../../../core/blocks/authorzied"
import { nav as navActions, modal as modalActions } from "../../../core/store"

import {
  transactions as transactionActions,
  give as giveActions
} from "../../store"

import Details from "./Details"
import Layout from "./Layout"
import Confirm from "./Details/Confirm"
import Recover from "./Recover"


function mapArrayToObj(array){
  let obj = {}
  for (let item of array) { obj[item.id] = item }
  return obj
}

function getSchedules(dispatch) {
  let query = `
    query ScheduledTransactions {
      transactions: allScheduledFinanicalTransactions(cache: false) {
        numberOfPayments
        next
        end
        id
        reminderDate
        code
        gateway
        start
        date
        details {
          amount
          account {
            name
            description
          }
        }
        payment {
          paymentType
          accountNumber
          id
        }
        schedule {
          value
          description
        }
      }
    }
  `
  return GraphQL.query(query)
    .then(({ transactions }) => {
      let mappedObj = {}

      for (const transaction of transactions) {
        mappedObj[transaction.id] = transaction
      }

      dispatch(transactionActions.addSchedule(mappedObj))

      return transactions
    })
}

function getAccounts(dispatch) {
  return GraphQL.query(`
      {
        accounts: allFinancialAccounts(limit: 100, ttl: 86400) {
          description
          name
          id
          summary
          image
          order
          images {
            fileName
            fileType
            fileLabel
            s3
            cloudfront
          }
        }
      }
    `).then(({accounts}) => {
      let accts = []
      for (let account of accounts) {
        account.formatedImage = {}
        if (account.images && account.images.length) {
          for (let image of account.images) {
            let img = image.cloudfront ? image.cloudfront : image.s3
            img || (img = account.image)
            account.formatedImage[image.fileLabel] = img
          }
        }
        accts.push(account)
      }

      const obj = mapArrayToObj(accts.filter((x) => (x.summary)))
      dispatch(giveActions.setAccounts(obj))
    })
}

const map = (store) => ({
  schedules: store.transactions.scheduledTransactions,
  give: store.give,
  person: store.accounts.person
})

@connect(map)
export default class Template extends Component {

  state = {
    loaded: true
  }

  static fetchData(getStore, dispatch) {

    return getAccounts(dispatch)
      .then((accounts) => {
        return getSchedules(dispatch)
            // .then(() => {
            //   this.setState({loaded: true})
            // })
        // this.setState({loaded: true})
      })
  }



  componentDidMount(){
    const { dispatch } = this.props

    this.setState({
      loaded: false
    })

    return getAccounts(dispatch)
      .then((accounts) => {

        return getSchedules(dispatch)
          .then(() => {
            this.setState({loaded: true})
          })
        this.setState({loaded: true})
      })

  }

  confirm = (e) => {
    const { dataset } = e.currentTarget
    const { id } = dataset
    this.props.dispatch(giveActions.setRecoverableSchedule(Number(id)))

    return true
  }

  cancel = (e) => {
    const { dataset } = e.currentTarget
    const { id } = dataset
    const { dispatch } = this.props

    this.props.dispatch(modalActions.render(Confirm, {
      onFinished: () => {
        dispatch(giveActions.deleteSchedule(id))

        Meteor.call("give/schedule/cancel", { id }, (err, response) => {
          console.log(err, response)
        })
      }
    }))

  }


  render () {
    const { schedules, give } = this.props
    const { accounts, recoverableSchedules } = give
    let transactions = []
    for (const transaction in schedules) {
      transactions.push(schedules[transaction])
    }

    transactions = _.sortBy(transactions, "start").reverse()

    let mappedAccounts = []
    for (const account in accounts) {
      mappedAccounts.push(accounts[account])
    }

    mappedAccounts = _.sortBy(mappedAccounts, "order")

    let recovers = []
    for (const recover in recoverableSchedules) {
      recovers.push(recoverableSchedules[recover])
    }

    return (
      <Layout
        ready={this.state.loaded}
        schedules={transactions}
        accounts={mappedAccounts}
        cancelSchedule={this.cancel}
        recoverableSchedules={recovers}
        confirm={this.confirm}
        person={this.props.person}
      />
    )
  }
}


const Routes = [
  { path: "schedules", component: Template },
  {
    path: "schedules/transfer",
    component: Authorized,
    indexRoute: { component: Recover }
  },
  {
    path: "schedules/:id",
    component: Authorized,
    indexRoute: { component: Details }
  }
]

export default {
  Template,
  Routes
}