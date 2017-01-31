import { PropTypes } from "react";
import { Link } from "react-router";

import contentHelper from "../../../util/content";
import categories from "../../../util/categories";

import Hero from "../../@primitives/UI/hero";
import { MiniCard } from "../../@primitives/UI/cards";

function getImage(images, label = "2:1") {
  let selectedImage = "";

  for (const image of images) {
    if (image.fileLabel === label) {
      selectedImage = image.url;
      break;
    }
    selectedImage = image.url;
  }
  return selectedImage;
}


const Layout = ({ featuredItem, recommendedItems, textItems, publicLikes }) => (
  <div style={{ overflowY: "hidden", height: "100%" }} className="background--light-primary">

    <section className="hard background--light-secondary">
      <h6 className="push-left soft-half-bottom soft-top">Recommended by NewSpring</h6>
    </section>

    {(() => {
      if (!featuredItem) return null;

      const formattedObj = {
        content: featuredItem,
        hideDate: true,
      };

      return <Hero {...formattedObj} />;
    })()}

    <section className="soft-half background--light-secondary">
      <div className="grid flush">
        {recommendedItems.map((item, i) => {
          const formattedObj = {
            title: item.title,
            content: item,
            link: item.meta.urlTitle,
          };

          return (
            <div>
              <MiniCard {...formattedObj} key={i} />
            </div>
          );
        })}
      </div>
    </section>

    <div className="soft-half background--light-secondary">
      <div className="card soft one-whole">
        <div className="card__item">
          <p className="flush">
            <small>
              <em>
                Are you looking for&nbsp;
                {textItems.map((x, i) => {
                  let delimeter = ", ";
                  if (textItems[i].id === textItems[textItems.length - 1].id) {
                    delimeter = "";
                  } else if (textItems[i].id === textItems[textItems.length - 2].id) {
                    delimeter = " or ";
                  }

                  return (
                    <span key={i}>
                      <Link to={x.meta.urlTitle} >{x.title}</Link>
                      {delimeter}
                    </span>
                  );
                })}?
              </em>
            </small>

          </p>

        </div>
      </div>
    </div>

    <section className="soft-half background--light-secondary">
      <div className="one-whole text-center">
        <h5 className="flush soft-bottom">Recently Liked By Others</h5>
      </div>
      {publicLikes.map((item, i) => {
        let itemImage = getImage(item.content.images, "1:1");
        // XXX Need to revisit this when public group likes is available
        const itemIcon = categories.icon(item);
        const itemCategory = categories.name(item);

        if (item.parent) {
          itemImage = getImage(item.parent.content.images, "1:1");
        }

        const formattedObj = {
          title: item.title,
          image: itemImage,
          icon: itemIcon,
          category: itemCategory,
          link: contentHelper.links(item),
        };

        return (
          <MiniCard
            {...formattedObj}
            key={i}
          />
        );
      })}
    </section>

    {/*
    <section className="hard background--light-secondary">
      <h6 className="push-left soft-half-bottom soft-top">Popular Content</h6>
    </section>

    <section className="soft-half background--light-secondary">
      <div className="grid">
        {popularItems.map(function(item, i) {
          return (
            <div className="grid__item one-whole" key={i}>
              <PopularItem like={item} />
            </div>
          )
        })}
      </div>
    </section>
    */}
  </div>
);

Layout.propTypes = {
  featuredItem: PropTypes.object,
  recommendedItems: PropTypes.array,
  textItems: PropTypes.array,
  publicLikes: PropTypes.array,
};

export default Layout;

export {
  getImage,
};
