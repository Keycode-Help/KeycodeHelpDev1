import React from "react";
import { Users, Target, Database, Shield, Globe, Award } from "lucide-react";
import "../styles/policyPages.css";

const AboutUs = () => {
  return (
    <div className="policy-page-wrapper">
      <div className="policy-container">
        {/* Header */}
        <div className="policy-header">
          <div className="policy-icon-container">
            <Users className="policy-icon" />
          </div>
          <h1>About Us – Keycode Help (KCH)</h1>
          <p className="policy-subtitle">Built by locksmiths, for locksmiths</p>
        </div>

        {/* Who We Are */}
        <section className="policy-section">
          <h2>Who We Are</h2>
          <div className="policy-card">
            <div className="policy-card-header">
              <Users className="policy-card-icon" />
              <h3>Our Foundation</h3>
            </div>
            <p>
              Keycode Help (KCH) is a specialized Software-as-a-Service (SaaS)
              platform built by locksmiths, for locksmiths. Founded by
              professionals with years of hands-on experience in the automotive
              and security industry, we understand the challenges technicians
              face in quickly identifying, programming, and servicing modern
              vehicle keys.
            </p>
          </div>
        </section>

        {/* Our Mission */}
        <section className="policy-section">
          <h2>Our Mission</h2>
          <div className="policy-card">
            <div className="policy-card-header">
              <Target className="policy-card-icon" />
              <h3>Simplifying Key Programming</h3>
            </div>
            <p>
              We exist to simplify and professionalize key programming. Our
              mission is to give locksmiths, automotive techs, and security
              providers a reliable, fast, and legally compliant toolset that
              keeps pace with evolving vehicle technology.
            </p>
          </div>
        </section>

        {/* What We Do */}
        <section className="policy-section">
          <h2>What We Do</h2>
          <div className="policy-card">
            <div className="policy-card-header">
              <Database className="policy-card-icon" />
              <h3>Interactive VIN-to-Keycode Database</h3>
            </div>
            <p>
              KCH provides an interactive VIN-to-Keycode and Key-Type database,
              designed to:
            </p>
            <ul>
              <li>
                Instantly identify the correct transponder chip or system type
                for programming
              </li>
              <li>
                Cross-reference chip families with JMA, Silca, CN, PCF, XT, and
                OEM part numbers
              </li>
              <li>
                Provide locksmiths with real-time resources to reduce
                trial-and-error, cut job times, and improve profitability
              </li>
              <li>
                Offer subscription-based access to continuously updated data
                across makes, models, and years
              </li>
            </ul>
          </div>
        </section>

        {/* Why It Matters */}
        <section className="policy-section">
          <h2>Why It Matters</h2>
          <div className="policy-card">
            <div className="policy-card-header">
              <Shield className="policy-card-icon" />
              <h3>Industry Evolution</h3>
            </div>
            <p>
              The locksmith industry is evolving rapidly, with vehicles
              integrating encrypted transponders, rolling codes, and proprietary
              OEM systems. Many small businesses lack access to clean, organized
              reference data. KCH bridges that gap—delivering dealer-level
              accuracy in a platform tailored for independent locksmiths and
              mobile technicians.
            </p>
          </div>
        </section>

        {/* Our Vision */}
        <section className="policy-section">
          <h2>Our Vision</h2>
          <div className="policy-card">
            <div className="policy-card-header">
              <Globe className="policy-card-icon" />
              <h3>Leading Digital Resource Hub</h3>
            </div>
            <p>
              To be the leading digital resource hub for locksmiths
              worldwide—expanding beyond VIN and keycode lookups to include
              training resources, compliance tools, programming workflows, and
              integrations with industry hardware/software.
            </p>
          </div>
        </section>

        {/* Built with Integrity */}
        <section className="policy-section">
          <h2>Built with Integrity</h2>
          <div className="policy-card">
            <div className="policy-card-header">
              <Award className="policy-card-icon" />
              <h3>Partnerships & Compliance</h3>
            </div>
            <p>
              We partner with official data providers and industry organizations
              to ensure compliance, accuracy, and ethical use of sensitive
              vehicle keycode data. Our focus is on protecting both the
              technician and the consumer by raising standards in the locksmith
              profession.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
