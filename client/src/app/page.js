"use client"

import MalKabulForm from "@/components/malKabulForm/MalKabulForm";
import MalSatisForm from "@/components/malSatisForm/MalSatisForm";


function Home() {
  

    return (
        <div className="flex items-center justify-center space-x-10 pt-7">
        <div className="w-1/3">
        <MalKabulForm/>
        </div>
        <div className="w-1/3">
        <MalSatisForm/>
        </div>
           
           
        </div>
    );
}

export default Home;
