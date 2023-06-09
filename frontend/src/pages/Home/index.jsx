import { useSelector } from "react-redux";
import { selectId } from "../../store/reducers/userSlice";
import faqs from "../../data/FAQ";

import { Accordion } from "flowbite-react";
import GoogleLoginButton from "../../components/ui/GoogleLoginButton";
import { MdMoneyOff } from "react-icons/md";
import { BsInfoLg } from "react-icons/bs";
import { ImStatsBars2 } from "react-icons/im";

function Home() {
  const id = useSelector(selectId);

  return (
    <div className="w-full">
      <div className="w-ful relative h-96 overflow-hidden rounded">
        <div className="relative overflow-hidden">
          <img
            className="w-full"
            src="https://daily.jstor.org/wp-content/uploads/2015/05/standardizedtests.jpg"
            alt="test"
          />
          <div className="absolute bottom-0 left-0 right-0 top-0 bg-gray-800 bg-opacity-60"></div>
        </div>

        <div className="absolute left-1/2 top-1/2 my-5 flex -translate-x-1/2 -translate-y-1/2 transform flex-col items-center justify-center rounded font-bold text-white">
          <h1>
            Welcome to <span className="font-extrabold">That1Tests</span>
          </h1>
          <p className="mb-3 text-xl">
            your new tool for creating and managing tests
          </p>
          {!id && (
            <GoogleLoginButton
              text={"Start creating test "}
              showG={false}
              size="md"
            />
          )}
        </div>
      </div>
      <div>
        <h2 className="my-5 text-center text-2xl font-bold">
          Why should you choos us?
        </h2>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col items-center gap-1">
            <MdMoneyOff size={30} />
            <h2>Start Free</h2>
            <p className="text-center">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. In eu
              nisi in elit cursus mattis id ut nisi. Phasellus aliquet velit
              lectus, at dictum nisi ullamcorper eu
            </p>
          </div>
          <div className="flex flex-col items-center gap-1">
            <ImStatsBars2 size={30} />
            <h2>View test ans answeres statistics</h2>
            <p className="text-center">
              Donec sed lectus eget nibh venenatis placerat. Ut faucibus, sem
              sit amet malesuada ornare, diam urna cursus urna, vitae luctus
              tortor odio eget magna
            </p>
          </div>
          <div className="flex flex-col items-center gap-1">
            <BsInfoLg size={30} />
            <h2>View student logs</h2>
            <p className="text-center">
              Vestibulum rhoncus ex tincidunt elit laoreet vestibulum. Quisque
              vitae libero ac mi posuere interdum ac a quam. Cras venenatis
              neque nibh, vitae ultrices diam auctor id
            </p>
          </div>
        </div>
      </div>
      <div>
        <h2 className="my-5 text-center text-2xl font-bold">FAQ</h2>
        <Accordion alwaysOpen={true} collapseAll={true}>
          {faqs.map((faq, index) => (
            <Accordion.Panel key={index}>
              <Accordion.Title className="focus:!ring-0 dark:focus:ring-0">
                {faq.question}
              </Accordion.Title>
              <Accordion.Content>{faq.answer}</Accordion.Content>
            </Accordion.Panel>
          ))}
        </Accordion>
      </div>
    </div>
  );
}

export default Home;
