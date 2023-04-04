import React from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import settings from "../settings/settings-Development";

const SEO = (props) => {
  const { title = 'CÔNG TY CỔ PHẦN TẬP ĐOÀN SHESHI', description = '', image = '' , href = '', children} = props;
  return (
    <Head>
      <link rel="icon" href={href}/>
      <title>{title}</title>
      <meta name="description" content={description} key="desc"/>
      <meta
        property="og:image"
        content={image}
      />
      <meta property="og:title" content={title} />
      <meta
        property="og:description"
        content={description}
      />
      {children}
    </Head>
  );
};

// SEO.defaultProps = {
//   title: settings && settings.meta && settings.meta.title,
//   description: settings && settings.meta && settings.meta.description,
//   image:
//     settings &&
//     settings.meta &&
//     settings.meta.social.graphic,
// };

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
};

export default SEO;
