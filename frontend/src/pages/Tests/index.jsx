import { useState, useEffect, useRef } from "react";

import useTestsApi from "../../api/testsApi";

import parseError from "../../utils/parseError";

import { Link } from "react-router-dom";

import { toast } from "react-toastify";

import { Spinner, Tabs, Button } from "flowbite-react";

const Groups = () => {
  const testsApi = useTestsApi();

  const [isLoadingTests, setIsLoadingTests] = useState(true);


  return (
    <>
      <Tabs.Group aria-label="Tabs with underline" style="underline">
        <Tabs.Item title="Created tests" onClick>
          <Link to={"/tests/create"}>
            <Button>Create new test</Button>
          </Link>
          {isLoadingTests ? (
            <div className="grid w-full place-items-center">
              <Spinner size="xl" />
            </div>
          ) : (
            <div></div>
          )}
        </Tabs.Item>
        <Tabs.Item title="Tests to complete">
          {isLoadingTests ? (
            <div className="grid w-full place-items-center">
              <Spinner aria-label="Loading spinner" size="xl" />
            </div>
          ) : (
            <div>asdfasdfasdfasdfasdf</div>
          )}
        </Tabs.Item>
        <Tabs.Item title="Completed tests">
          <>completed tests</>
        </Tabs.Item>
      </Tabs.Group>
    </>
  );
};

export default Groups;
