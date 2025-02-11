import { describe, it } from "node:test";

import TestRenderer from "react-test-renderer";

import Link from "next/link";

import "@testing-library/jest-dom/";
import { render, screen } from "@testing-library/react";

import ChromePage from "../../src/app/(chrome)/newtab/page";
import Footer from "../../src/app/(site)/footer";
import LayoutProvider, { useLayout } from "../../src/app/(site)/layoutContext";
import Navbar from "../../src/app/(site)/navbar";
import LandingPage from "../../src/app/(site)/page";
import SupabaseProvider from "../../src/components/supabase-provider";
import { StandardLink } from "../../src/components/ui";

describe("Footer", () => {
  it("footer contains string footer", () => {
    render(
      <LayoutProvider
        sidebar={0}
        setSidebar={() => {}}
        showSidebar={false}
        setShowSidebar={() => {}}
        showFooter={true}
        setShowFooter={() => {}}
      >
        <Footer />
      </LayoutProvider>
    );
    const header = screen.getByTestId("footer");
    const headerText = "Tempo";
    expect(header).toHaveTextContent(headerText);
  });
});

describe("ParentComponent", () => {
  test("contains Link component", () => {
    const testRenderer = TestRenderer.create(<StandardLink href="/random">Test</StandardLink>);
    const testInstance = testRenderer.root;

    // Find all instances of Link in the rendered tree
    const links = testInstance.findAllByType(Link);

    // Assert that at least one instance of Link was found
    expect(links.length).toBeGreaterThan(0);
  });
});

describe("Page", () => {
  it("renders the component correctly", () => {
    render(<ChromePage />);
    const title = screen.getByText("Clockwork Chrome Extension");
    expect(title).toBeInTheDocument();
  });
});

describe("LayoutProvider", () => {
  it("should render children", () => {
    const { getByText } = render(
      <LayoutProvider
        sidebar={0}
        setSidebar={() => {}}
        showSidebar={false}
        setShowSidebar={() => {}}
        showFooter={true}
        setShowFooter={() => {}}
      >
        <div>Hello, World!</div>
      </LayoutProvider>
    );
    const childElement = getByText("Hello, World!");
    expect(childElement).toBeInTheDocument();
  });

  it("should return layout context when used inside LayoutProvider", () => {
    const TestComponent = () => {
      const layout = useLayout();
      return <div>{layout.sidebar}</div>;
    };
    const { getByText } = render(
      <LayoutProvider
        sidebar={1}
        setSidebar={() => {}}
        showSidebar={true}
        setShowSidebar={() => {}}
        showFooter={true}
        setShowFooter={() => {}}
      >
        <TestComponent />
      </LayoutProvider>
    );
    expect(getByText("1")).toBeInTheDocument();
  });
});

describe("useLayout", () => {
  it("throws an error if used outside LayoutProvider", () => {
    const Component = () => {
      useLayout();
      return null;
    };

    expect(() => render(<Component />)).toThrow("useLayout must be used inside LayoutProvider");
  });

  it("should return the context values from LayoutProvider", () => {
    const Component = () => {
      const { sidebar, setSidebar, showSidebar, setShowSidebar, showFooter, setShowFooter } =
        useLayout();
      return (
        <>
          <div data-testid="sidebar">{sidebar}</div>
          <div data-testid="showSidebar">{showSidebar.toString()}</div>
          <div data-testid="showFooter">{showFooter.toString()}</div>
        </>
      );
    };

    const { getByTestId } = render(
      <LayoutProvider
        sidebar={1}
        setSidebar={() => {}}
        showSidebar={true}
        setShowSidebar={() => {}}
        showFooter={false}
        setShowFooter={() => {}}
      >
        <Component />
      </LayoutProvider>
    );

    expect(getByTestId("sidebar")).toHaveTextContent("1");
    expect(getByTestId("showSidebar")).toHaveTextContent("true");
    expect(getByTestId("showFooter")).toHaveTextContent("false");
  });
});
