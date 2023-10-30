import React from "react";
import Page from "components/Page";
import { Col, Row } from "reactstrap";
import Card from "components/Card";
import "./../Blogs.scss";
import { Link } from "react-router-dom";
import { MediaLink } from "../component/MediaLink";

const Blog7 = () => {
  let title = "6 Ways to Recruit and Retain Practice Employees in 2023";
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
                src={require("assets/images/landing-pages/blog7.svg").default}
                alt="upload"
              />
            </div>
            <div className="description">
              <p>
                Besides the continued economic challenges of COVID-19, the
                dentistry industry is facing another challenge—
                <a
                  href="https://www.dentistryiq.com/practice-management/staffing/article/14209556/dental-staffing-shortage-huge-struggle-continues"
                  target="_blank"
                >
                  a severe dental workforce shortage
                </a>
                . According to a June 2021 report from the American Dental
                Association Health Policy Institute,{" "}
                <a
                  href="https://www.ada.org/publications/ada-news/2021/june/dentists-face-applicant-shortages-as-they-emerge-from-covid-19-pandemic"
                  target="_blank"
                >
                  more than 80% of hiring dentists
                </a>{" "}
                are having a very difficult time finding hygienists and dental
                assistants.
              </p>
              <p>
                Additional data from a{" "}
                <a
                  href="https://surveys.ada.org/reports/RC/public/YWRhc3VydmV5cy02MGE1MjUxOGNlYjEwNjAwMTA2OThjZjYtVVJfM3BaeGhzWm12TnNMdjB4"
                  target="_blank"
                >
                  May poll from the ADA Health Policy Institute
                </a>{" "}
                found that “35.8% of owner- dentists are recruiting dental
                assistants, 28.8% are seeking dental hygienists, 26.5% are
                looking to hire administrative staff, and 13.1% are in search of
                associate dentists—all four percentages representing a rise in
                recruitment since October 2020.”
              </p>
            </div>
            <h2 className="sub-title">Handling Staff Turnover</h2>
            <div className="description">
              {" "}
              <p>
                If you are presently dealing with staff turnover in your
                practice, it’s important to understand why people leave their
                jobs. According to an article on Indeed.com,{" "}
                <a
                  href="https://www.indeed.com/career-advice/career-development/reasons-employees-leave"
                  target="_blank"
                >
                  16 reasons employees leave their jobs,
                </a>{" "}
                money was the number two reason. Other reasons included lack of
                a challenge, poor management, lack of communication and
                training, not feeling valued, lack of recognition, lack of
                follow-through, no feedback, and no vision for the future.{" "}
              </p>
              <p>
                When facing staff turnover, it’s important to take a look at
                yourself or your hiring/personnel manager, the state of your
                practice and its existing team members, your
                leadership/management, and your communication skills. This
                self-examination will help you see your role regarding staff
                turnover. Are your expectations of your team unclear? Are you
                doing annual performance reviews? Are your team members feeling
                unappreciated and overworked?
                <Link
                  to="communication-with-your-team-how-to-be-hands-offand-still-be-hands-on"
                  target="_blank"
                >
                  {" "}
                  Do they have clarity on what they’re tasks are
                </Link>{" "}
                on a day to day basis?{" "}
              </p>
              <p>
                One of the best ways to learn why someone left your practice is
                to hold exit interviews. These meetings, as difficult as they
                may be, are an opportunity to gain information to help you
                improve your practice and retain your employees.
              </p>
            </div>
            <h2 className="sub-title">Recruiting Top Talent</h2>
            <div className="description">
              {" "}
              <p>
                Fortunately, when in search of and acquiring new talent, it’s
                kind of like dating. One must be attracted to another party
                because of certain qualities. Getting someone interested in you
                or your practice is the initial step in attracting and retaining
                talent. To have someone be attracted to you and your practice,
                you must ensure that your qualities are attractive, clearly
                stated, and communicated.
              </p>
              <p>
                Here are some{" "}
                <a
                  href="https://www.amazon.com/Strategy-Driven-Talent-Management-Leadership-Imperative/dp/0787988472/ref=sr_1_3?crid=1V9ZGKCNDJCRM&dchild=1&keywords=strategy-driven+talent+management+a+leadership+imperative&qid=1629558174&sprefix=strategy-driven+%2Cstripbooks%2C205&sr=8-3"
                  target="_blank"
                >
                  strategies
                </a>{" "}
                on how to attract new talent to your dental office:
              </p>
            </div>

            <h2 className="sub-title super-sub-title">
              1. Identify your talent acquisition strategy
            </h2>
            <div className="description">
              {" "}
              <p>
                It’s important to have an effective talent acquisition strategy
                to plan out what methods and approaches you will use to
                identify, source, and secure the best talent in the market.
                Identify where your competitors are finding talent. Ask your
                colleagues where they have more success in getting applicants.
                You can also leverage your fully integrated healthcare
                management solution’s ability to:{" "}
              </p>
              <p>
                <ul>
                  <li>
                    Integrate with online job boards to post and share job
                    opportunities at your practice
                  </li>
                  <li>
                    {" "}
                    Notify internal temporary candidates of new opportunities
                    that are available to extend their working time in your
                    practice
                  </li>
                  <li>
                    {" "}
                    Create and streamline your onboarding process to create
                    consistent training protocols and deliver on a positive
                    employee experience right from the start
                  </li>
                  <li>
                    {" "}
                    Track all of your interviewees and notes from your
                    conversations for future reference
                  </li>
                  <li>
                    {" "}
                    Implement, track and manage performance reviews, whatever
                    the frequency — monthly check-in’s, quarterly and/or annual
                  </li>
                </ul>{" "}
              </p>
              <p>
                Some additional proven talent acquisition strategies used by
                practices all over North America include hiring a recruiting
                company to help you find talent or a dental temp agency to full
                open positions until you find your ideal candidate; training and
                developing existing staff or asking for referrals from your
                existing employees; or contract with long-term temporary talent
                for higher wages and offer retention bonuses.
              </p>
            </div>
            <h2 className="sub-title super-sub-title">
              2. Highlight what’s different about your practice vs. a competing
              practice
            </h2>
            <div className="description">
              {" "}
              <p>
                Look at all the other job postings that your competitors have
                placed on job boards. Ask yourself, if you were a candidate,
                what would make you read a job advertisement? What qualities
                does your practice have that helps yours stand out?{" "}
              </p>
              <p>
                Many employees today prefer to work in a practice that is
                modernized with an integrated healthcare management solution.
                Top talent want their daily workflows to be streamlined and
                frictionless and don’t want to be burdened with disparate
                systems and applications, time consuming admin tasks and
                frustrating manual processes that make their jobs more
                difficult.{" "}
              </p>
              <p>
                It also helps to indicate the compensation range and any
                benefits you are offering. A recent survey conducted by{" "}
                <a
                  href="https://www.achievers.com/resources/white-papers/workforce-institute-2021-engagement-and-retention-report/"
                  target="_blank"
                >
                  Achievers Workers Institute
                </a>{" "}
                reported that 36% of employees leave their jobs for better
                compensation and benefits. Being clear and transparent up front
                will set the right expectations from the start.
              </p>
            </div>

            <h2 className="sub-title super-sub-title">
              3. Establish an employment brand for your practice
            </h2>
            <div className="description">
              {" "}
              <p>
                While practice modernization and benefits and compensation rank
                as top qualities employees look for in a new job, candidates
                also look for better recognition, appreciation, and values along
                with strong relationships and positive culture in the workplace.
                By establishing an employment brand, you can communicate all of
                these qualities and the type of office culture you have.
              </p>
              <p>
                Memorable employment brands are highly achievable both large and
                small practices. You can communicate your brand through the
                company website or social media accounts, which are great places
                where:
              </p>
              <p>
                <ul>
                  <li>
                    {" "}
                    Previous and current employees can post testimonials on what
                    life is like every day at work
                  </li>
                  <li>
                    {" "}
                    Current employees are featured and include what they like to
                    do for fun outside of the office, which also leads to the
                    recognition and appreciation staff is looking for
                  </li>
                  <li>
                    {" "}
                    You can tell a story of what it’s like to work in your
                    office, which will attract not only prospective employees
                    but also new patients
                  </li>
                  <li>
                    {" "}
                    You can display your mission statement and company values
                    which are consistent with your company and employment brand
                  </li>
                </ul>
              </p>
            </div>

            <h2 className="sub-title super-sub-title">
              4. What is your talent brand?
            </h2>
            <div className="description">
              {" "}
              <p>
                Once you have communicated how great your company is, the next
                step is to determine who you want to direct your message to.
                What kind of talent are you looking to work in your amazing
                office? Your talent brand should describe the kinds of talent
                your company seeks and the kinds of talent who succeed in your
                company.
              </p>
              <p>
                For example, if your brand focuses on customer service, your
                talent should naturally have the personality to meet your
                patients’ needs. Think back again on what makes your office
                different from your competitors. If you are an office that truly
                cares for the well-being of your patients and employees, that
                can be your employment and company brand.{" "}
              </p>
              <p>
                A great example would be to show pictures of a lunch-hour group
                walk that your employees participate in with other staff
                members. From that, you can develop your talent brand by
                thinking of what kinds of people are needed to make your
                business strategy successful. From the example given, you may be
                able to attract candidates who like to be physically active if
                they see that you value their wellness.
              </p>
            </div>

            <h2 className="sub-title super-sub-title">
              5. Determine the Most Productive Talent Channels
            </h2>
            <div className="description">
              {" "}
              <p>
                Nowadays, job seekers have so many options in which they could
                look for jobs. Make sure you have a comprehensive talent
                acquisition strategy that uses all the tools and channels
                available. However, be thoughtful about where you spend your
                dollars in finding talent.
              </p>
              <p>
                Ask your employees to refer friends and family in return for
                cash rewards. A more sophisticated approach is providing your
                employees with referral cards or pamphlets that they can give to
                any person they come across who gives excellent customer service
                or demonstrates interest in your practice. Another way is to
                have your current employees list names of talented people they
                may have previously worked with in the past. Then, the hiring
                manager in the office can follow up on these contacts.
              </p>
              <p>
                Another great source for acquiring talent is to tap into your
                healthcare management solution’s direct integration with online
                job boards and post and share job opportunities at your
                practice. Remember however that your ad should stand out from
                your competitors. If your ad looks just like your competitors,
                it is more likely it will be overlooked. Instead, write a catchy
                job description that clearly and succinctly states your brand
                and what makes you different from others.
              </p>
              <p>
                Lastly, create alliances with colleges and universities via
                online and offline connections. Through Linkedin and Facebook,
                you can find groups and forums for specific fields, industries,
                and universities. You can search for talent through these
                networks and invite them to check out your practice. If you have
                a social media presence, prospective talent can follow your
                social media account and check out your company website. It’s
                important you establish your business strategy, your employment,
                and your talent brand in order for you to attract the candidates
                you expect to succeed in your company.
              </p>
            </div>

            <h2 className="sub-title super-sub-title">
              6. Measure Your Success
            </h2>
            <div className="description">
              {" "}
              <p>
                Measuring the effectiveness of your attraction and recruitment
                efforts is important in determining which method works and how
                much you are spending on your investment. You won’t know which
                channel and strategy are more effective if you don’t measure.
              </p>
              <p>Here are just some of the ways to measure your success:</p>
              <p>
                <ul>
                  <li>Know how many applicants apply per job you posted</li>
                  <li>How long it took to fill the vacancy</li>
                  <li>The number of online visits to your career website</li>
                  <li>Cost per hire</li>
                  <li>Offer-to-acceptance ratio </li>
                </ul>{" "}
              </p>
              <p>
                Consistency in your message is the secret to having an effective
                talent acquisition strategy. Alignment in your company values,
                culture, branding, business strategy, and talent acquisition
                strategy is key. As with dating and relationships, you must be
                able to deliver what is promised. We all know that trust is an
                important driver in building relationships. If you establish a
                great reputation with your employees and clients, they are more
                likely to recommend your business to their friends and family.
              </p>
              <p>
                Choosing the best talent acquisition strategy depends on what
                you are willing and able to do. Always consider the pros and
                cons of each strategy. Most importantly, always think about how
                you can be effective with each strategy.
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

export default Blog7;
