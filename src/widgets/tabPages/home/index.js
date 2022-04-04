import React from "react";
import { Print, Purchase, VerificationHistory } from "../../../assets";
import { HomeCard } from "../../../components";
import "./home.css";

const Home = () => {
  return (
    <>
      <h3 className="home_welcome mx-auto">Welcome to NIMC</h3>
      <p className="mx-auto home_subtitle">
        Easily manage your public Identity via our web and mobile service. What
        would you like to do today?
      </p>

      <div className="col-12 d-flex card_wrapper justify-content-center flex-wrap">
        <HomeCard
          icon={<Print />}
          description={"Quickly print your Premium NIN slip and use anywhere."}
          buttonText={"Print Premium Slip"}
          to={"/premium-slip"}
          iconType={"print"}
        />
        <HomeCard
          icon={<Purchase />}
          description={"Purchase credits to verify credentials with."}
          buttonText={"Purchase Credits"}
          to={"/purchase-plan"}
          iconType={"pSubscription"}
        />
        <HomeCard
          icon={<VerificationHistory />}
          description={"This lists all your credential verification history."}
          buttonText={"View History"}
          to={"/verification-history"}
          iconType={"vHistory"}
        />
      </div>
    </>
  );
};

export { Home };
