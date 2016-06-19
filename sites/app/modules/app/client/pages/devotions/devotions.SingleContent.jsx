import { Component, PropTypes } from "react";


import Helpers from "app/client/helpers"
import Components from "app/client/components"


export default class DevotionsSingleContent extends Component {

  static propTypes = {
    devotion: PropTypes.object.isRequired
  }

  render() {

    const devotion = this.props.devotion;

    return (
        <section className="hard-sides hard-top background--light-primary">
          <div
            className="one-whole ratio--square background--fill"
            style={Helpers.backgrounds.styles(devotion)}>
          </div>
          <div className="soft push-top">
            <h1 className="capitalize">{devotion.title}</h1>
            {() => {
              if (devotion.content.scripture !== "") {
                return (
                  <a
                    href="#"
                    className="h4 soft-bottom display-block text-center"
                    onClick={this.props.onClickLink}
                    >{Helpers.scriptures.list(devotion)}</a>
                );
              }
            }()}

            <div dangerouslySetInnerHTML={Helpers.react.markup(devotion)}></div>

          </div>
        </section>
      );
    }

}