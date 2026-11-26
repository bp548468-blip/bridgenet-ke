import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { BridgeNetApp } from "@/routes/index";

describe("BridgeNet", () => {
  it("loads Amina, finds the three requested jobs, and sends an application", () => {
    render(<BridgeNetApp />);

    fireEvent.click(screen.getByRole("button", { name: "Load Sample Profile: Amina" }));

    expect(screen.getByLabelText("Name")).toHaveValue("Amina");
    expect(screen.getByLabelText("Country")).toHaveValue("Democratic Republic of the Congo");
    expect(screen.getByLabelText("Target Role")).toHaveValue("Clinic Nurse");

    fireEvent.click(screen.getByRole("button", { name: "Find My Matches" }));

    expect(screen.getByText("Clinic Nurse")).toBeInTheDocument();
    expect(screen.getByText("Garissa Hospital")).toBeInTheDocument();
    expect(screen.getByText(/% Match$/)).toBeInTheDocument();
    expect(screen.getByText("KES 45,000")).toBeInTheDocument();
    expect(screen.queryByText("Junior Developer")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Apply for Clinic Nurse" }));
    expect(screen.getByText("Application Sent!")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Application sent for Clinic Nurse" })).toBeDisabled();
  });

  it("advances mentor progress from 60 to 80 to 100 and messages Grace", () => {
    render(<BridgeNetApp />);

    fireEvent.click(screen.getByRole("tab", { name: "Mentor Tracker" }));
    expect(screen.getByText("Grace Wanjiru")).toBeInTheDocument();
    expect(screen.getByText("Senior Nurse")).toBeInTheDocument();
    expect(screen.getByText("Nairobi Hospital")).toBeInTheDocument();
    expect(screen.getByText("60%")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Mock Interview" }));
    expect(screen.getByRole("region", { name: "Mock Interview instructions" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Mark Task Complete" }));
    expect(screen.getByText("80%")).toBeInTheDocument();
    expect(screen.getByRole("progressbar", { name: "Mentorship progress" })).toHaveAttribute(
      "aria-valuenow",
      "80",
    );

    fireEvent.click(screen.getByRole("button", { name: "Mark Task Complete" }));
    expect(screen.getByText("100%")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "All Tasks Complete" })).toBeDisabled();

    fireEvent.click(screen.getByRole("button", { name: "Message Mentor" }));
    expect(screen.getByText("Message Sent to Grace!")).toBeInTheDocument();
  });

  it("submits paid trial applications and accepts the full-time offer", () => {
    render(<BridgeNetApp />);

    fireEvent.click(screen.getByRole("tab", { name: "Returnship Marketplace" }));
    expect(screen.getByText("2-Week Clinic Assistant")).toBeInTheDocument();
    expect(screen.getByText("KES 15,000")).toBeInTheDocument();
    expect(screen.getByText("2-Week Data Entry")).toBeInTheDocument();
    expect(screen.getByText("KES 12,000")).toBeInTheDocument();
    expect(screen.getByText("4-Week Junior Developer")).toBeInTheDocument();
    expect(screen.getByText("KES 25,000")).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Apply for Trial: 2-Week Clinic Assistant" }),
    );
    expect(screen.getByText("Trial Application Submitted!")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "View My Offer" }));
    expect(
      screen.getByText("Offer: Full-Time Clinic Nurse KES 45,000/month - Accept?"),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Accept Offer" }));
    expect(screen.getByText("Offer Accepted! Welcome to the team.")).toBeInTheDocument();
  });

  it("lets talent start a blank profile and employers open the marketplace", () => {
    render(<BridgeNetApp />);

    fireEvent.click(screen.getByRole("button", { name: "I am Talent" }));
    expect(screen.getByLabelText("Name")).toHaveValue("");
    expect(screen.getByRole("tab", { name: "Matching Engine" })).toHaveAttribute(
      "aria-selected",
      "true",
    );

    fireEvent.click(screen.getByRole("tab", { name: "Home" }));
    fireEvent.click(screen.getByRole("button", { name: "I am Employer / Mentor" }));
    expect(screen.getByRole("tab", { name: "Returnship Marketplace" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("matches a software developer only to developer work and offers that exact job", () => {
    render(<BridgeNetApp />);
    fireEvent.click(screen.getByRole("button", { name: "I am Talent" }));
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Beatrice" } });
    fireEvent.change(screen.getByLabelText("Country"), { target: { value: "Kenya" } });
    fireEvent.change(screen.getByLabelText("Target Role"), {
      target: { value: "Junior Software Developer" },
    });
    fireEvent.change(screen.getByLabelText(/Skills/), {
      target: { value: "Python, HTML, CSS, JavaScript, Git, GitHub, Problem Solving" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Find My Matches" }));

    expect(screen.getByText("Junior Developer")).toBeInTheDocument();
    expect(screen.queryByText("Clinic Nurse")).not.toBeInTheDocument();
    expect(screen.queryByText("Data Entry")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Apply for Junior Developer" }));

    fireEvent.click(screen.getByRole("tab", { name: "Returnship Marketplace" }));
    expect(screen.queryByText("2-Week Clinic Assistant")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Apply for Trial: 4-Week Junior Developer" }));
    fireEvent.click(screen.getByRole("button", { name: "View My Offer" }));
    expect(
      screen.getByText("Offer: Full-Time Junior Developer KES 50,000/month - Accept?"),
    ).toBeInTheDocument();
    expect(screen.queryByText(/Nurse/)).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Accept Offer" }));
    expect(screen.getByText("Offer Accepted! Welcome to the team.")).toBeInTheDocument();
  });
});
