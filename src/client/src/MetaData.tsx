import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import Config from "./config/Config";

const MetaData = ({
  title,
  description,
  img,
  url,
}: {
  title: string;
  description?: string;
  img?: string | Array<string>;
  url?: string;
}) => {
  return (
    <HelmetProvider>
      <Helmet>
        <title>{title ? title + " | Frontierscabal" : "Frontierscabal"}</title>
        <meta name="robots" content="follow, index" />
        <meta name="description" content={description} />
        <meta property="og:url" content={`${Config.HOST}/#/${url}`} />
        <meta property="og:type" content={"website"} />
        <meta property="og:site_name" content={"Frontierscabal"} />
        <meta property="og:description" content={description} />
        <meta property="og:title" content={title} />
        {Array.isArray(img) ? (
          img.map((uri) => <meta property="og:image" content={uri} key={uri} />)
        ) : (
          <meta property="og:image" content={img} key={img} />
        )}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content={Config.SOCIALS.twitter.url} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <link rel="canonical" href={Config.HOST} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@frontierscabal" />
      </Helmet>
    </HelmetProvider>
  );
};

export default MetaData;
