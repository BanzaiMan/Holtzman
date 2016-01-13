import { Component, PropTypes} from "react"
import { connect } from "react-redux"
import ReactMixin from "react-mixin"

import { Link } from "react-router"

import { Split, Left, Right } from "../../../../core/client/layouts/split"

import LikesList from "./home.likesList"


const map = (state) => ({ auth: state.onBoard.authorized, person: state.onBoard.person })

@connect(map)
export default class Home extends Component {

  componentWillMount() {
    Meteor.subscribe("people")
  }

  settings = () => {
    return (
      <Link to="/profile/settings" className="text-light-primary plain soft overlay__item locked-top locked-right">
        <i className="icon-settings h4"></i>
      </Link>
    )
  }

  render () {

    const { person } = this.props
    const { PhotoUrl } = person

    let photo = PhotoUrl ? `//core-rock.newspring.cc/${PhotoUrl}` : null
    return (
      <Split nav={true}>

        <Right
          mobile={true}
          classes={["floating", "overlay--solid-dark"]}
          ratioClasses={["floating__item", "overlay__item", "one-whole", "text-center"]}
          background={photo}
          blur={true}
          outsideRatio={this.settings}
        >
          <div className="soft one-whole">
            <div
              className="background--fill ratio--square round two-fifths display-inline-block"
              style={{ backgroundImage: `url(${photo})`}}
            ></div>
            <h4 className="text-light-primary soft-half-top flush-bottom">{person.FirstName} {person.LastName}</h4>
            <p className="text-light-primary flush"><em>{person.Home.City}</em></p>
          </div>

        </Right>

        <Left scroll={true} >
          <div className="soft soft-double@lap-and-up push-double@lap-wide-and-up">

            <LikesList />

          </div>
        </Left>

      </Split>

    )
  }
}
