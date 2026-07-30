import { useEffect } from "react";
import { Mail, Phone, MapPin, CheckCircle2, Download } from "lucide-react";

const RESUME = {
  personalInfo: {
    name: "Elazar Greisman",
    title: "Restaurant Operations & Management Specialist",
    email: "elazar.greisman@outlook.com",
    phone: "201-321-6587",
    location: "Passaic, NJ",
    website: "elazaros.com",
  },
  summary:
    "Dedicated management professional with 4+ years of experience driving efficiency and service excellence in the food service industry. Proven expertise in team leadership, inventory control, and customer relations, consistently delivering operational improvements. Committed to fostering positive environments that enhance both staff performance and guest satisfaction.",
  skills: [
    "Team Leadership",
    "Inventory Management",
    "Operational Efficiency",
    "Customer Relations",
    "Staff Training",
    "Procurement",
    "Vendor Relations",
    "Schedule Management",
    "Conflict Resolution",
    "Quality Assurance",
  ],
  experience: [
    {
      company: "King of Delancey Restaurant",
      role: "General Manager",
      dates: "June 2022 – August 2026",
      location: "Passaic, NJ",
      achievements: [
        "Orchestrated daily restaurant operations, ensuring strict adherence to service standards and food quality protocols.",
        "Directed front- and back-of-house teams, managing schedules and optimizing staff allocation for peak efficiency.",
        "Streamlined procurement processes and inventory control, significantly reducing waste and maintaining cost-effectiveness.",
        "Cultivated lasting customer relationships to drive repeat business and elevate overall guest satisfaction.",
      ],
    },
    {
      company: "King of Delancey Restaurant",
      role: "Assistant Manager",
      dates: "January 2022 – June 2022",
      location: "Passaic, NJ",
      achievements: [
        "Assisted in training new hires and implementing operational improvements to streamline service flow.",
        "Supported senior management in daily oversight, administrative tasks, and conflict resolution.",
      ],
    },
  ],
  otherExperience: [
    {
      role: "Study Program Coordinator",
      organization: "Volunteer",
      description:
        "Founded and coordinated a community study group, managing scheduling and learning materials to ensure consistent participation.",
    },
    {
      role: "Lifeguard / Swim Instructor",
      organization: "Part-Time",
      description:
        "Instructed individuals in swimming techniques and water safety while enforcing rigorous pool regulations.",
    },
  ],
  education: {
    school: "Mesivta North Jersey",
    degree: "High School Diploma",
    year: "2021",
    location: "Passaic, NJ",
  },
};

export default function ResumePDF() {
  useEffect(() => {
    document.title = "Elazar Greisman — Resume";
  }, []);

  const handlePrint = () => window.print();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: 'Inter', sans-serif;
          color: #1a1a1a;
          background: #f4f4f5;
        }

        .page-wrapper {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 32px 16px 64px;
          background: #f4f4f5;
        }

        .toolbar {
          width: 100%;
          max-width: 780px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .toolbar-label {
          font-size: 13px;
          color: #71717a;
        }

        .print-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #18181b;
          color: #fff;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          transition: background 0.15s;
        }

        .print-btn:hover { background: #3f3f46; }

        .resume {
          width: 100%;
          max-width: 780px;
          background: #ffffff;
          padding: 52px 56px;
          box-shadow: 0 4px 32px rgba(0,0,0,0.10);
          border-radius: 4px;
        }

        /* Header */
        .header { border-bottom: 2px solid #18181b; padding-bottom: 18px; margin-bottom: 24px; }
        .header h1 { font-size: 26px; font-weight: 700; letter-spacing: -0.3px; color: #18181b; }
        .header .title { font-size: 13px; font-weight: 500; color: #52525b; margin-top: 3px; letter-spacing: 0.3px; text-transform: uppercase; }
        .contact-row { display: flex; flex-wrap: wrap; gap: 16px; margin-top: 10px; }
        .contact-item { display: flex; align-items: center; gap: 5px; font-size: 12.5px; color: #52525b; }

        /* Sections */
        .section { margin-bottom: 24px; }
        .section-title {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.2px;
          color: #18181b;
          border-bottom: 1px solid #e4e4e7;
          padding-bottom: 5px;
          margin-bottom: 12px;
        }

        /* Summary */
        .summary-text { font-size: 13px; line-height: 1.7; color: #3f3f46; }

        /* Experience */
        .job { margin-bottom: 18px; }
        .job:last-child { margin-bottom: 0; }
        .job-header { display: flex; justify-content: space-between; align-items: baseline; }
        .job-role { font-size: 14px; font-weight: 700; color: #18181b; }
        .job-dates { font-size: 12px; color: #71717a; white-space: nowrap; }
        .job-company { font-size: 13px; color: #52525b; font-weight: 500; margin-top: 1px; }
        .job-location { font-size: 12px; color: #a1a1aa; margin-top: 1px; margin-bottom: 8px; }
        .achievements { list-style: none; padding: 0; }
        .achievements li {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 12.5px;
          color: #3f3f46;
          line-height: 1.6;
          margin-bottom: 5px;
        }
        .bullet { width: 5px; height: 5px; border-radius: 50%; background: #71717a; flex-shrink: 0; margin-top: 7px; }

        /* Skills */
        .skills-grid { display: flex; flex-wrap: wrap; gap: 6px; }
        .skill-tag {
          background: #f4f4f5;
          border: 1px solid #e4e4e7;
          border-radius: 4px;
          padding: 4px 10px;
          font-size: 12px;
          color: #3f3f46;
          font-weight: 500;
        }

        /* Volunteer */
        .vol-item { margin-bottom: 10px; }
        .vol-item:last-child { margin-bottom: 0; }
        .vol-role { font-size: 13.5px; font-weight: 700; color: #18181b; }
        .vol-org { font-size: 12px; color: #71717a; font-weight: 500; display: inline-block; margin-left: 6px; }
        .vol-desc { font-size: 12.5px; color: #52525b; margin-top: 3px; line-height: 1.6; }

        /* Education */
        .edu-row { display: flex; justify-content: space-between; align-items: baseline; }
        .edu-school { font-size: 13.5px; font-weight: 700; color: #18181b; }
        .edu-year { font-size: 12px; color: #71717a; }
        .edu-degree { font-size: 13px; color: #52525b; margin-top: 2px; }

        /* Print styles */
        @media print {
          body { background: #fff !important; }
          .page-wrapper { padding: 0 !important; background: #fff !important; }
          .toolbar { display: none !important; }
          .resume {
            box-shadow: none !important;
            border-radius: 0 !important;
            padding: 36px 44px !important;
            max-width: 100% !important;
          }
          @page { margin: 0.5in; size: letter; }
        }
      `}</style>

      <div className="page-wrapper">
        <div className="toolbar">
          <span className="toolbar-label">Elazar Greisman — Resume Preview</span>
          <button className="print-btn" onClick={handlePrint}>
            <Download size={15} />
            Save as PDF
          </button>
        </div>

        <div className="resume">
          {/* Header */}
          <div className="header">
            <h1>{RESUME.personalInfo.name}</h1>
            <div className="title">{RESUME.personalInfo.title}</div>
            <div className="contact-row">
              <span className="contact-item">
                <Mail size={12} /> {RESUME.personalInfo.email}
              </span>
              <span className="contact-item">
                <Phone size={12} /> {RESUME.personalInfo.phone}
              </span>
              <span className="contact-item">
                <MapPin size={12} /> {RESUME.personalInfo.location}
              </span>
              <span className="contact-item">
                🌐 {RESUME.personalInfo.website}
              </span>
            </div>
          </div>

          {/* Summary */}
          <div className="section">
            <div className="section-title">Professional Summary</div>
            <p className="summary-text">{RESUME.summary}</p>
          </div>

          {/* Experience */}
          <div className="section">
            <div className="section-title">Experience</div>
            {RESUME.experience.map((job, i) => (
              <div className="job" key={i}>
                <div className="job-header">
                  <span className="job-role">{job.role}</span>
                  <span className="job-dates">{job.dates}</span>
                </div>
                <div className="job-company">{job.company}</div>
                <div className="job-location">{job.location}</div>
                <ul className="achievements">
                  {job.achievements.map((a, j) => (
                    <li key={j}>
                      <span className="bullet" />
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Skills */}
          <div className="section">
            <div className="section-title">Skills & Expertise</div>
            <div className="skills-grid">
              {RESUME.skills.map((s, i) => (
                <span className="skill-tag" key={i}>{s}</span>
              ))}
            </div>
          </div>

          {/* Volunteer & Leadership */}
          <div className="section">
            <div className="section-title">Volunteer & Leadership</div>
            {RESUME.otherExperience.map((v, i) => (
              <div className="vol-item" key={i}>
                <div>
                  <span className="vol-role">{v.role}</span>
                  <span className="vol-org">· {v.organization}</span>
                </div>
                <div className="vol-desc">{v.description}</div>
              </div>
            ))}
          </div>

          {/* Education */}
          <div className="section">
            <div className="section-title">Education</div>
            <div className="edu-row">
              <span className="edu-school">{RESUME.education.school}</span>
              <span className="edu-year">{RESUME.education.year} · {RESUME.education.location}</span>
            </div>
            <div className="edu-degree">{RESUME.education.degree}</div>
          </div>
        </div>
      </div>
    </>
  );
}
