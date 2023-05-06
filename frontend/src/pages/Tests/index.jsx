import { useState, useEffect } from "react";
import { Spinner } from "flowbite-react";

const Tests = () => {
  const [tests, setTests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    
  });

  return (
    <>
      {isLoading ? (
        <div className="flex items-center justify-center w-full">
          <Spinner size="xl" />
        </div>
      ) : (
        <div className="flex gap-5">
          
        </div>
      )}
    </>
  );
};

export default Tests;
