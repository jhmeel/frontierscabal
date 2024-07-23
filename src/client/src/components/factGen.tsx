import React, { useState, useEffect } from "react";
import Facts from "../utils/facts";
import FactItem from "./factItem/FactItem";

const FactGenerator = () => {
  const [fact, setFact] = useState("");
  const [currentFactsCategory, setCurrentFactsCategory] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const categories = [
        "Science",
        "Technology",
        "Medicine",
        "Fashion",
        "Health Tips",
      ];
      const randomCategory =
        categories[Math.floor(Math.random() * categories.length)];
      const categoryFacts = Facts.find(
        (item) => item.category === randomCategory
      )?.facts;
      const randomFact =
        categoryFacts[Math.floor(Math.random() * categoryFacts?.length)];
      setCurrentFactsCategory(randomCategory);
      setFact(randomFact);
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div>
      <FactItem category={currentFactsCategory} fact={fact} />
    </div>
  );
};

export default FactGenerator;
