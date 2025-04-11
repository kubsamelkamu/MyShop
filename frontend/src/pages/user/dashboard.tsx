import React from "react";
import UserLayout from "@/components/user/UserLayout"; 
import DashBoard from "@/components/user/DashBoard";

const Home = () => {
  return (
    <UserLayout>
      <div className="pt-20">
         <DashBoard/>
      </div>
    </UserLayout>
  );
};

export default Home;
