import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useTestsApi from "../../api/testsApi";

import parseError from "../../utils/parseError";
import trim from "../../utils/trim";
import { formatDateTime } from "../../utils/formatDateTime";

import { Link } from "react-router-dom";

import { toast } from "react-toastify";

import { Spinner, Tabs, Button } from "flowbite-react";

const Groups = () => {
  const testsApi = useTestsApi();
  const navigate = useNavigate();

  const [isLoadingTests, setIsLoadingTests] = useState(true);

  const [tests, setTests] = useState([]);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        setIsLoadingTests(true);
        const res = await testsApi.listCreated();
        setTests(res);
        setIsLoadingTests(false);
      } catch (error) {
        navigate("/");
      }
    };

    fetchTests();
  }, []);

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
            <div className="mt-2 flex gap-2 flex-wrap">
              {tests.map((test) => (
                <div
                  key={test.id}
                  className="rounded-md border border-gray-500 p-2 transition-colors hover:border-gray-700 hover:text-gray-700 dark:border-gray-400 dark:hover:border-white dark:hover:text-white"
                >
                  <Link to={`/tests/${test.id}`}>
                    <span>{trim(test.name)}</span>
                    <p>Craeted: {formatDateTime(test.created_at)}</p>
                  </Link>
                </div>
              ))}
            </div>
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
