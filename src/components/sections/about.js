import React, { useEffect, useRef } from 'react';
import { StaticImage } from 'gatsby-plugin-image';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';
import { email } from '@config';

const StyledAboutSection = styled.section`
  max-width: 900px;

  .inner {
    display: grid;
    grid-template-columns: 3fr 2fr;
    grid-gap: 50px;

    @media (max-width: 768px) {
      display: block;
    }
  }
`;
const StyledText = styled.div`
  ul.skills-list {
    display: grid;
    grid-template-columns: repeat(2, minmax(140px, 200px));
    grid-gap: 0 10px;
    padding: 0;
    margin: 20px 0 0 0;
    overflow: hidden;
    list-style: none;

    li {
      position: relative;
      margin-bottom: 10px;
      padding-left: 20px;
      font-family: var(--font-mono);
      font-size: var(--fz-xs);

      &:before {
        content: '▹';
        position: absolute;
        left: 0;
        color: var(--green);
        font-size: var(--fz-sm);
        line-height: 12px;
      }
    }
  }
`;
const StyledPic = styled.div`
  position: relative;
  max-width: 300px;

  @media (max-width: 768px) {
    margin: 50px auto 0;
    width: 70%;
  }

  .wrapper {
    ${({ theme }) => theme.mixins.boxShadow};
    display: block;
    position: relative;
    width: 100%;
    border-radius: var(--border-radius);
    background-color: var(--green);

    &:hover,
    &:focus {
      outline: 0;
      transform: translate(-4px, -4px);

      &:after {
        transform: translate(8px, 8px);
      }

      .img {
        filter: none;
        mix-blend-mode: normal;
      }
    }

    .img {
      position: relative;
      border-radius: var(--border-radius);
      mix-blend-mode: multiply;
      filter: grayscale(100%) contrast(1);
      transition: var(--transition);
    }

    &:before,
    &:after {
      content: '';
      display: block;
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: var(--border-radius);
      transition: var(--transition);
    }

    &:before {
      top: 0;
      left: 0;
      background-color: var(--navy);
      mix-blend-mode: screen;
    }

    &:after {
      border: 2px solid var(--green);
      top: 14px;
      left: 14px;
      z-index: -1;
    }
  }
`;

const About = () => {
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealContainer.current, srConfig());
  }, []);

  const skills = ['Python', 'Java', 'Go', 'Node.js', 'Angular', 'React', 'AWS', 'Azure', 'SQL', 'NoSQL'];

  return (
    <StyledAboutSection id="about" ref={revealContainer}>
      <h2 className="numbered-heading">About Me</h2>

      <div className="inner">
        <StyledText>
          <div>
            <p>
              Hello there! My name is Avaneesh and I am a software developer with a passion for technology and data.
              </p>
              <p>For me, software is more than just code. It's the power to create, innovate, and solve problems.</p>
              <p>
              Recently, I had the opportunity to intern at{' '}<a href="https://www.citizensfla.com/">Citizens Property Insurance Corporation</a>, 
              where I developed a Q&A chatbot powered by AI. Using Retrieval Augmented Generation (RAG) and large language models (LLMs), the chatbot allowed managers to ask complex questions in simple English that required real-time analysis 
              and aggregation of financial and budget data. It was rewarding to see the real-world impact of AI and its potential to drive change.
              </p>
              <p>
              Before this, I spent 3 years at{' '}
              <a href="https://www.tcs.com/">Tata Consultancy Services</a>. I worked as a Full Stack Developer for {' '}<a href="https://investor.vanguard.com/corporate-portal">The Vanguard Group</a>. 
              During my time at TCS, I earned my {' '}<a href="https://www.credly.com/badges/cfa8afa0-ee04-4491-9ed5-73b09b786cb9/public_url">AWS Developer Certification</a> and worked on 
              creating REST microservices and Angular UI applications on cloud replacing legacy systems with high-performance solutions. 
              I also built event-driven cloud applications like text notifications and data movement pipelines, and implemented multi-region cloud contingency for disaster recovery. 
              I led technical efforts as an interim technical lead, ensuring timely delivery of project milestones and trained new hires on technology and processes to improve team efficiency.              
            </p>
            <p>
              In addition to my primary pursuits,
              I have a keen interest in machine learning and data science. I have invested time and effort into executing various projects in these domains 
              including my capstone undergrad project at{' '}<a href="https://www.symphonytech.com/" target="_blank" rel="noreferrer">Symphony Technologies Private Limited</a>.
              There, I developed an application for defect detection in fuse box assemblies using object detection and neural networks.
            </p>
            <p>
              Outside of technology, I enjoy biking, am a huge Star Wars fan, and actively follow sports, especially football and Formula One racing..              
            </p>
            <p>
            What motivates me every day is the belief that software has the power to solve problems, simplify processes, and create new opportunities. I’m excited to continue growing in this field, always looking for ways to innovate and contribute to meaningful solutions. 
            If you’re looking for someone with strong technical skills and a genuine drive to make an impact,{' '}<a href={`mailto:${email}`}>let's connect!</a>
            </p>

            <p>Here are a few technologies I've been working with recently:</p>
          </div>

          <ul className="skills-list">
            {skills && skills.map((skill, i) => <li key={i}>{skill}</li>)}
          </ul>
        </StyledText>

        <StyledPic>
          <div className="wrapper">
            <StaticImage
              className="img"
              src="../../images/me.jpeg"
              width={500}
              quality={95}
              formats={['AUTO', 'WEBP', 'AVIF']}
              alt="Headshot"
            />
          </div>
        </StyledPic>
      </div>
    </StyledAboutSection>
  );
};

export default About;
