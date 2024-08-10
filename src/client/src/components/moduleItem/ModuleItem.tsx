import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import testImg from "../../assets/images/online_article.svg";
import { IconPlayCircle } from "../../assets/icons";

function ModuleItem({
  _id,
  title,
  description,
  banner,
}: {
  _id: string;
  title: string;
  description: string;
  banner: string;
}): React.ReactElement {
  const navigate = useNavigate();
  return (
    <ModuleCard>
      <div className="image-cont">
        <IconPlayCircle
          className="icon"
          onClick={() => navigate(`/module/${_id}`)}
        />
        <img alt={title} src={banner} width={544} height={306} loading="lazy" />
      </div>
      <div className="">
        <h2>
          <Link to={`/module/${_id}`} aria-label={`Link to ${title}`}>
            {title}
          </Link>
        </h2>
        <p className="description">
          {`${description && description?.slice(0, 90)}...`}
        </p>
        <Link
          to={`/module/${_id}`}
          className="learn-more-link"
          aria-label={`Link to ${title}`}
        >
          Enroll &rarr;
        </Link>
      </div>
    </ModuleCard>
  );
}

export { ModuleItem };
const ModuleCard = styled.div`
  position: relative;
  margin: 0 auto;
  padding: 4px;
  width: 90%;
  max-width: 500px;

  .image-cont {
    height: 100%;
    overflow: hidden;
    border-radius: 8px;
    border: 1px solid #ededed;
    padding: 0px 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  .icon {
    height: 35px;
    width: 35px;
    fill: crimson;
    position: absolute;
    cursor: pointer;
  }
  img {
    height: 200px;
    object-fit: cover;
    object-position: center;
  }
  @media (max-width: 767px) {
  }
  .Modulecard-content {
    padding: 1.5rem;
  }
  .description {
    color: gray;
    line-clamp: 2;
    font-size: 1rem;
    padding-bottom: 10px;
  }
  .Modulecard-content h2 {
    margin-bottom: 1rem;
    font-size: 1.5rem;
    font-weight: bold;
    line-height: 1.25;
  }
  .Modulecard-content p {
    margin-bottom: 1rem;
    color: #666;
    max-width: none;
    font-size: 14px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .learn-more-link {
    font-size: 0.8rem;
    font-weight: medium;
    line-height: 1.5;
    color: #3498db;
    transition: color 0.2s ease-in-out;
  }

  .learn-more-link:hover {
    color: #176984;
  }
  &hover {
  }
`;
