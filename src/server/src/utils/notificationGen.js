import { v4 as uuidv4 } from "uuid";

const generateNotification = (type, context) => {
  const baseNotification = {
    _id: uuidv4(),
    type,
    date: Date.now(),
    avatar: context?.avatar?.url || context?.createdBy?.avatar?.url || "",
    slug: "",
    message: "",
  };

  switch (type) {
    case "NEW:USER":
      return {
        ...baseNotification,
        slug: "/profile/edit",
        message: `Welcome aboard, ${context?.username}!\nWe are thrilled to have you on board. To enhance your experience, take a moment to update your profile.`,
      };

    case "NEW:EVENT":
      return {
        ...baseNotification,
        slug: `/event/${context.slug}`,
        message: `New event from ${context?.createdBy?.username} in ${context?.category}: ${context?.description}`,
        eventFrom: context?.createdBy?.username,
        image: context?.avatar?.url,
      };

    case "ONGOING:EVENT":
      return {
        ...baseNotification,
        slug: `/event/${context.slug}`,
        message: `${context?.title} in ${context?.category} is commencing today.`,
        eventFrom: context?.createdBy?.username,
        image: context?.avatar?.url,
      };

    case "NEW:ARTICLE":
      return {
        ...baseNotification,
        slug: `/blog/article/${context.slug}`,
        message: `New article from ${context?.postedBy?.username} in ${context?.category}: "${context?.title}"`,
        articleFrom: context?.postedBy?.username,
        image: context?.image?.url,
      };

    case "UPDATED:PROFILE":
      return {
        ...baseNotification,
        slug: "/profile/",
        message: "You have just updated your profile successfully!",
      };

    case "NEW:SUBSCRIPTION":
      return {
        ...baseNotification,
        slug: "/profile",
        message: `Subscription made successfully! Thank you, ${context?.username}.`,
        username: context?.username,
      };
    case "SUBSCRIPTION:INVITE":
      return {
        ...baseNotification,
        slug: "/biller",
        message: `Upgrade to premium and unlock unlimited downloads of past questions, answers, and course materials. Get full access to our AI-powered features, enjoy an ad-free experience, and benefit from enhanced personalization options crafted just for you. Start making the most of your learning journey with all the tools and resources at your fingertips!`,
        username: context?.username,
      };
    case "SUBSCRIPTION:DUE_REMINDER":
      return {
        ...baseNotification,
        slug: "/subscription",
        message: `Hi ${context?.username}, your subscription will be due soon. Please renew to continue enjoying premium benefits.`,
      };

    case "SUBSCRIPTION:RENEWAL":
      return {
        ...baseNotification,
        slug: "/profile",
        message: `Thank you, ${context?.username}, for renewing your subscription! Enjoy another term of premium benefits.`,
      };

    case "SUBSCRIPTION:DOWNGRADE":
      return {
        ...baseNotification,
        slug: "/subscription",
        message: `Your subscription has been downgraded to Free. Please renew to regain access to premium features.`,
      };

    case "ARTICLE:LIKE":
      return {
        ...baseNotification,
        slug: `/blog/article/${context?.slug}`,
        message: `${context?.username} likes your article "${context?.title}"`,
        username: context?.username,
        image: context?.image?.url,
      };

    case "ARTICLE:COMMENT":
      return {
        ...baseNotification,
        slug: `/blog/article/${context?.slug}`,
        message: `${context?.username} commented on your article "${context?.title}"`,
        username: context?.username,
        image: context?.image?.url,
      };

    case "ARTICLE:COMMENT:REPLY":
      return {
        ...baseNotification,
        slug: `/blog/article/${context?.slug}`,
        message: `${context?.username} replied to your comment on "${context?.title}"`,
        username: context?.username,
        image: context?.image?.url,
      };

    default:
      return {
        ...baseNotification,
        message: null,
      };
  }
};

export { generateNotification };
