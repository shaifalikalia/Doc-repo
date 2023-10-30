import React from "react";
import Page from "components/Page";
import { Col, Row } from "reactstrap";
import Card from "components/Card";
import "./../Blogs.scss";
import { MediaLink } from "../component/MediaLink";

const Blog4 = () => {
  let title =
    "Communication With Your Team: How to Be Hands Off and Still Be Hands On";
  return (
    <Page className={"static-blog "}>
      <Card
        className="static-blog-card"
        padding="70px"
        cursor="default"
        shadow="0 0 15px 0 rgba(0, 0, 0, 0.08)"
      >
        <Row>
          <Col lg="12">
            <div className="logo">
              <img
                src={require("assets/images/home-logo.svg").default}
                alt="img"
                class="img-fluid"
              />
            </div>
            <hr />
            <h1 className="title">{title}</h1>
            <div className="image-div">
              <img
                src={require("assets/images/landing-pages/blog4.svg").default}
                alt="upload"
              />
            </div>
            <div className="description">
              <p>
                Successful communication is a key component for a thriving
                dental practice. Effective internal, interoffice communication
                is essential for ensuring efficiency in your day-to-day
                operations. It allows for everyone—from the doctor, hygienists,
                office managers, practice administrators and assistants—to have
                a sense of what’s happening in the practice any time throughout
                the day. Staff knows exactly what needs to be done based on
                their specific role in the practice and can seamlessly operate
                in their function with ease.
              </p>
              <p>
                One way to achieve a hands-on approach with effective practice
                communication, while being completely hands off, is to implement
                an integrated healthcare management solution. With the digital
                automation these tools provide, communication with your team is
                simple, seamless and reliable.{" "}
              </p>
              <p>
                One key way these platforms accommodate this is through
                effective task management, assignment and notes to the team.
                Task management and notes automatically let you and your staff
                know what’s happening in the practice and what their
                responsibilities are.
              </p>
              <p>
                Team members are juggling multiple tasks in their workday. These
                manual tasks that team members participate in for a patient’s
                dental visit are typically characterized by data entry, followed
                by decision-making. With an automated solution, data entry is
                minimized and errors reduced in the practice with pre-built
                workflows. In return, your team saves time, no longer
                experiences unnecessary friction, and quality of patient care is
                improved as a result.
              </p>
              <p>
                Practice owners can manage all assigned tasks across the
                organization, tracking variables such as task status, due dates,
                and reminders. Notes with additional details can also be
                included for greater detail and context. This holistic approach
                to task management ensures everyone in the practice knows what
                they’re required to do for the day and results are easily
                communicated and shared between parties.{" "}
              </p>
              <p>For example, tasks can be assigned to:</p>
              <p>
                <ul>
                  <li>
                    Receptionists to follow-up with a patient or call the
                    insurance company
                  </li>
                  <li>
                    Office personnel to contact the IT team for technology
                    support or resolve a facility issue
                  </li>
                  <li>
                    Dental assistants to confirm adequate supply of materials
                    and tools for the upcoming month
                  </li>
                  <li>
                    Hygienists or dental assistants to conduct an oral health
                    assessment on a new patient, prepare and take x-rays, or
                    perform dental cleaning
                  </li>
                </ul>
              </p>
              <p>
                Important tasks no longer get missed or forgotten and your team
                feels empowered to hit the ground running the moment they clock
                in.
              </p>
              <p>
                There are other ways that an integrated healthcare management
                solution supports effective communication in your practice.{" "}
              </p>
              <p>
                Like practice owners and managers, dentists can communicate with
                personnel on different types of workflows, as well as easily
                assign and manage daily tasks for personnel across various job
                roles within the practice. They can also connect with and
                streamline their communication with other dentists or
                specialists for peer review processes, patient referrals, and
                other practice matters.
              </p>
              <p>
                Hygienists, dental assistants, office and admin staff can
                communicate with dentists and managers efficiently and reliably
                in return. They can access online HR forms and documents, such
                as contracts and proof of employment forms, eliminating the need
                to make a direct request for copies or get access to them. And
                all personnel across the organization can be viewed on one
                scheduler to create an event and invite employees; and view and
                apply for job postings. Plus, they can easily request leave or
                request to work on different dates/times in different offices
                (in a multi-office organization).{" "}
              </p>
              <p>
                This staff scheduling is a huge component of effective practice
                communications, but can be complex and time consuming. It
                doesn’t have to be complicated however. You can create and
                communicate schedules in just minutes and manage time off,
                availability and shift requests, track employee hours, and
                overtime scheduling with ease. In return, you will reduce
                absenteeism and late arrivals, and handle unexpected changes
                without adding unnecessary stress and frustration to your day.
              </p>
              <p>
                You can also streamline internal communication and create a
                collaborative environment no matter where your staff or
                colleagues are by sending messages in group or private
                conversations. This keeps everyone informed, gives employees a
                voice, and in return, builds a better company culture that
                fosters employee satisfaction and retention.
              </p>
              <p>
                Dental practices face the challenge of communicating efficiently
                between all levels of the organization: dentists, dental
                associates, pharmacists, peers (e.g., specialists), patients,
                administrative staff, and suppliers of goods and services.
                Without a streamlined, secure, and centralized communication
                system practices struggle to ensure dentists and staff have the
                resources they need to deliver high-quality patient care and
                manage the business requirements of the practice. With an
                integrated healthcare management solution, this is easily
                achieved.
              </p>
              <p>
                For more tips on practice automation and management, download
                our{" "}
                <a href="#">
                  Ultimate Guide to Creating Order from Chaos in Your Dental
                  Practice.
                </a>{" "}
              </p>
            </div>

            <hr />
            <div class="social-media-links text-center">
              <h5 className="links-heading mb-2 mb-md-3">Share this post</h5>
              <MediaLink title={title} />
            </div>
          </Col>
        </Row>
      </Card>
    </Page>
  );
};

export default Blog4;
