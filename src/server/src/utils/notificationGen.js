import { v4 as uuidv4 } from "uuid";

const generateNotification = (type, entity) => {
  switch (type) {
    case "NEW:USER":
      return {
        _id: uuidv4(),
        user: entity?.username,
        type: "NEW:USER",
        slug: "/profile/edit",
        message: `Welcome aboard!\nwe are thrilled to have you on board. To enhance your experience\n
      take a moment to update your profile.`,
        date: Date.now(),
      };

    case "NEW:EVENT":
      return {
        _id: uuidv4(),
        type: "NEW:EVENT",
        slug: `/event/${entity.slug}`,
        eventFrom: entity?.createdBy?.username,
        message: `New event from ${entity?.createdBy?.username} in ${entity?.category}: \n ${entity?.description} `,
        avatar: entity?.createdBy.avatar?.url,
        image: entity?.avatar?.url,
        date: Date.now(),
      };
    case "ONGOING:EVENT":
      return {
        _id: uuidv4(),
        type: "ONGOING:EVENT",
        slug: `/event/${entity.slug}`,
        eventFrom: entity?.createdBy?.username,
        message: `${entity.title} in ${entity?.category} is commencing today `,
        avatar: entity?.createdBy.avatar?.url,
        image: entity?.avatar?.url,
        date: Date.now(),
      };
    case "NEW:ARTICLE":
      return {
        _id: uuidv4(),
        type: "NEW:ARTICLE",
        slug: `/blog/article/${entity.slug}`,
        articleFrom: entity?.postedBy?.username,
        message: `New from ${entity?.postedBy?.username} in ${entity?.category}:\n "${entity?.title}" `,
        avatar: entity?.postedBy?.avatar?.url,
        image: entity?.image?.url,
        date: Date.now(),
      };

    case "UPDATED:PROFILE":
      return {
        _id: uuidv4(),
        type: "UPDATED:PROFILE",
        slug: "/profile/",
        message: "You have just updated your profile successfully!",
        avatar: "",
        date: Date.now(),
      };

    case "NEW:SUBSCRIPTION":
      return {
        _id: uuidv4(),
        type: "NEW:SUBSCRIPTION",
        username: entity?.username,
        slug: "/profile",
        message: "Subscription made successfully!",
        avatar: "",
        date: Date.now(),
      };

    case "ARTICLE:LIKE":
      return {
        _id: uuidv4(),
        type: "ARTICLE:LIKE",
        username: entity?.username,
        image: entity?.image?.url,
        avatar: entity?.avatar?.url,
        slug: `/blog/article/${entity?.slug}`,
        message: `${entity?.username} likes your article "${entity?.title}"`,
        date: Date.now(),
      };

    case "ARTICLE:COMMENT":
      return {
        _id: uuidv4(),
        type: "ARTICLE:COMMENT",
        username: entity?.username,
        avatar: entity?.avatar?.url,
        image: entity?.image?.url,
        slug: `/blog/article/${entity?.slug}`,
        message: `${entity?.username} commented on your article ${entity?.title}`,
        date: Date.now(),
      };
    case "ARTICLE:COMMENT:REPLY":
      return {
        _id: uuidv4(),
        type: "ARTICLE:COMMENT:REPLY",
        username: entity?.username,
        avatar: entity?.avatar?.url,
        image: entity?.image?.url,
        slug: `/blog/article/${entity?.slug}`,
        message: `${entity?.username} reply to your comment on  ${entity?.title}`,
        date: Date.now(),
      };

    default:
      return {};
  }
};

export {generateNotification};
