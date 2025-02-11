import { Calendar, Gauge, Note, Notebook, Settings } from "tabler-icons-react";

import { Navbar, Stack } from "@mantine/core";

import { Tooltip } from "../../../components/ui";
import { classnames } from "../../../utils/utils";
import { useLayout } from "../layoutContext";

interface NavbarLinkProps {
  icon: any;
  label: string;
  active?: boolean;
  onClick?(): void;
  testId?: string;
}

function NavbarLink({ icon: Icon, label, active, onClick, testId }: NavbarLinkProps) {
  return (
    <Tooltip label={label} position="right">
      <div
        test-id={testId}
        onClick={onClick}
        className={classnames(
          "w-12 h-12 rounded flex items-center justify-center cursor-pointer",
          active ? "bg-lightgray text-blue-500" : "text-gray-700 hover:bg-gray-50"
        )}
      >
        <Icon strokeWidth={1.5} size={24} />
      </div>
    </Tooltip>
  );
}
const Sidebar = () => {
  const { sidebar, setSidebar } = useLayout();

  return (
    <Navbar width={{ base: 80 }} p="md" className="h-full flex flex-col bg-beigegray">
      <Navbar.Section className="flex-grow">
        <Stack justify="center" spacing={1}>
          <NavbarLink
            icon={Gauge}
            label={"Dashboard"}
            key={"Dashboard"}
            active={sidebar === 0}
            onClick={() => setSidebar(0)}
          />
          <NavbarLink
            testId="calendar-page-button"
            icon={Calendar}
            label={"Calendar"}
            key={"Calendar"}
            active={sidebar === 1}
            onClick={() => setSidebar(1)}
          />
          <NavbarLink
            testId="labels-page-button"
            icon={Notebook}
            label={"Labels"}
            key={"Labels"}
            active={sidebar === 2}
            onClick={() => setSidebar(2)}
          />
          <NavbarLink
            icon={Note}
            label={"Scatchpad"}
            key={"Scatchpad"}
            active={sidebar === 3}
            onClick={() => setSidebar(3)}
          />
        </Stack>
      </Navbar.Section>
      <Navbar.Section className="py-12">
        <Stack justify="center" spacing={0} className="pb-7">
          <NavbarLink
            icon={Settings}
            label={"Settings"}
            key={"Settings"}
            active={sidebar === 4}
            onClick={() => setSidebar(4)}
          />
        </Stack>
      </Navbar.Section>
    </Navbar>
  );
};

export default Sidebar;
