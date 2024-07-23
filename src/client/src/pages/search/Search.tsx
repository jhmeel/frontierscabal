import React from "react";
import EventItem from "../../components/eventItem/EventItem";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import toast from 'react-hot-toast'
import styled from "styled-components";
import UserItem from '../../components/userItem/UserItem'
import MetaData from "../../MetaData";
import SpinLoader from "../../components/loaders/SpinLoader";
import Footer from "../../components/footer/Footer";
import HorizontalArticleItem from "../../components/horizontalArticleItem/HorizontalArticleItem";
import StudyMaterialItem from "../../components/studyMaterialItem/StudyMaterialItem";

const Search = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState<string|null>("");

  useEffect(() => {
    const search = location.search;
    setSearchQuery(new URLSearchParams(search).get("query"));
    const handleSearch = async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance().get(
          `/api/v1/search-cabal?q=${searchQuery}`
        );

        setLoading(false);
        setSearchResult(data);
      } catch (err:any) {
        setLoading(false);
        toast.error(err.message);
      }
    };
    searchQuery && handleSearch();
  }, [location, searchQuery, toast]);

  return (
    <>
      <MetaData title="Search" />
      {loading && <SpinLoader />}

      <SearchRenderer>
        <div className="srh-res-holder">
          {searchResult?.articles?.length == 0 &&
            searchResult?.events?.length == 0 &&
            searchResult?.pastQuestions?.length == 0 &&
            searchResult?.courseMaterials?.length == 0 &&
            searchResult?.users?.length == 0 && (
              <div className="srh-res-notfound">
                <h3>{`No result found for "${searchQuery}"`}</h3>
                <p className="srh-res-p-notfound">
                  Try searching with a generic keyword!
                </p>
              </div>
            )}
          {searchResult?.users?.length > 0 && (
            <>
              <span className="srh-res-hd">People</span>
              {searchResult?.users.map((usr:any, i: number) => (
                <UserItem
                  key={i}
                  username={usr?.username}
                  bio={usr?.bio}
                  img={usr?.avatar?.url}
                />
              ))}
            </>
          )}{" "}
          {searchResult?.articles?.length > 0 && (
            <>
              <span className="srh-res-hd">Stories</span>
              {searchResult?.articles.map((art:any, i:number) => (
                <HorizontalArticleItem
                  id={art._id}
                  title={art.title}
                  slug={art.slug}
                  image={art.image?.url}
                  caption={art.sanitizedHtml}
                  category={art.category}
                  postedBy={art.postedBy}
                  readDuration={art.readDuration}
                  key={i}
                />
              ))}
            </>
          )}
          {searchResult?.events?.length > 0 && (
            <>
              <span className="srh-res-hd">Events</span>
              {searchResult?.events.map((eve:any, i:number) => (
                <EventItem
                  key={i}
                  id={eve?._id}
                  slug={eve?.slug}
                  title={eve?.title}
                  avatar={eve?.avatar.url}
                  description={eve?.description}
                  category={eve?.category}
                  createdBy={eve?.createdBy.username}
                />
              ))}
            </>
          )}
          {searchResult?.pastQuestions?.length > 0 && (
            <>
              <span className="srh-res-hd">PQ&A</span>
              {searchResult?.pastQuestions.map((pq:any, i: number) => (
                <StudyMaterialItem
                  key={i}
                  _id={pq?._id}
                  tag={pq?.courseCode}
                  courseTitle={pq?.courseTitle}
                  sch={pq?.school}
                  session={pq?.session}
                  downloads={pq?.downloads}
                  postedBy={pq?.postedBy}
                />
              ))}
            </>
          )}
          {searchResult?.courseMaterials?.length > 0 && (
            <>
              <span className="srh-res-hd">Course Materials</span>
              {searchResult?.courseMaterials.map((cm: any, i:number) => (
                <StudyMaterialItem
                  key={i}
                   _id={cm?._id}
                  tag={cm?.courseCode}
                  courseTitle={cm?.courseTitle}
                  session={cm?.session}
                  downloads={cm?.downloads}
                  postedBy={cm?.postedBy}
                  type="Course Material"
                />
              ))}
            </>
          )}
          {!loading && !searchResult && (
            <span className="srh-res-ept">
              Try searching for people, stories, event, pastquestion, module, lesson or course
              Material...
            </span>
          )}
        </div>
      </SearchRenderer>
      <Footer />
    </>
  );
};

export default Search;


const SearchRenderer = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;


.srh-res-holder {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.srh-res-hd {
  text-align: left;
  color: black;
  font-size: medium;
  font-weight: 700;
  padding: 5px;
}
.srh-res-notfound {
  text-align: center;
}
.srh-res-p-notfound {
  color: #176984;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}
.srh-rec{
  margin-top: 10px;
  display: flex;
  flex-direction: column;
}
.srh-rec-ul{
  list-style:circle;
  cursor: pointer;
}
.srh-res-ept{
  font-size: 12px;
  color: grey;
  margin-top: 5px;
  text-align: center;
  padding: 0 5px;
}


`