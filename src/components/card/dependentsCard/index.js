import React from "react";
import { Card } from "../card";
import "./dependentsCard.css";
import { RightChevron } from "../../../assets";
import { useHistory } from "react-router-dom";
import { EmptyDependentState } from "../../emptyStates";


const DependentsCard = ({ dependents }) => {
  const history = useHistory();

  const truncateWithAsteriks = (word) => {
    let firstWordPart = word.slice(word.length - word.length, word.length - 4);
    return word.replace(firstWordPart, "******");
  };

const validator = dependents[0]?.message;

  return (
    <>
      <Card>
        { !validator ? (
          <p className="dependents_card_title mb-1">Select Dependent</p>
        ) : (
          <></>
        )}
        {!validator ? (
          dependents?.map((dependent, index) => (
            <React.Fragment key={index}>
              <div
                className="d-flex justify-content-between dependents"
                onClick={() =>
                  history.push(`/my-dependents/single/${dependent.userid}`, {
                    index: index,
                  })
                }
              >
                <div className="d-flex justify-content-center dependents_info_wrapper my-auto">
                  <div className="dependent_image">
                    <img
                      src={`https://v1.ibib.io:7070/1/png/${dependent.ninHash}.png`}
                      alt={"Dependent"}
                    />
                  </div>
                  <div className="dependent_info">
                    <p className="dependent_name p-0 m-0">{`${dependent?.fn ?? ""} ${dependent?.mn ?? ""} ${dependent?.sn ?? ""}`}</p>
                    <p className="dependent_number p-0 m-0">
                      {dependent.mainidnumber && truncateWithAsteriks(dependent.mainidnumber)}
                    </p>
                  </div>
                </div>
                <p className="pr-1 my-auto">
                  <RightChevron />
                </p>
              </div>
            </React.Fragment>
          ))
        ) : validator ? (
          <>
            <EmptyDependentState />
          </>
        ) : (
          <>Loading....</>
        )}
      </Card>
    </>
  );
};

export { DependentsCard };
