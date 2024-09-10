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

  const skills = ['Python', 'Java', 'Node.js', 'Angular', 'Typescript', 'Spring Boot', 'AWS', 'NoSQL'];

  return (
    <StyledAboutSection id="about" ref={revealContainer}>
      <h2 className="numbered-heading">About Me</h2>

      <div className="inner">
        <StyledText>
          <div>
            <p>
              Hello there! My name is Avaneesh and I am a software developer with a passion for technology and data.
              </p>
              <p>
              This summer, I had the exciting opportunity to intern at{' '}<a href="https://www.citizensfla.com/">Citizens Property Insurance Corporation</a>, 
              where I leveraged my passion for AI to create a cutting-edge Retrieval Augmented Generation (RAG) Q&A chatbot powered by LLM. 
              This innovative chatbot was designed to transform the way financial and budget data is accessed and analyzed within the company enhancing real-time analysis capabilities.
              My work aimed to empower the organization with advanced AI tools, driving better business outcomes through intelligent data management.
              </p>
              <p>
              Prior to this, I spent 3 years at{' '}
              <a href="https://www.tcs.com/">Tata Consultancy Services</a>. I worked as a Full Stack Developer for {' '}<a href="https://investor.vanguard.com/corporate-portal">The Vanguard Group</a>. 
              While working there, I gained expertise in building cloud solutions
              and acquired the{' '}<a href="https://www.credly.com/badges/cfa8afa0-ee04-4491-9ed5-73b09b786cb9/public_url">AWS Developer Certification</a>.
              However, my interests and talents extend far beyond the realm of cloud computing.
            </p>
            <p>
              In addition to my primary pursuits,
              I have a keen interest in computer vision, neural networks, and data science.
              Fostering this interest, I have invested personal time and effort into executing various projects in these domains including
              my capstone undergrad project at{' '}<a href="https://www.symphonytech.com/" target="_blank" rel="noreferrer">Symphony Technologies Private Limited</a>.
              There, I developed an application for defect detection in fuse box assemblies using object detection and neural networks.
            </p>
            <p>
              Outside the tech world, I love biking, I am a huge Star Wars fan and actively follow sports.
              I am an avid football fan, with a heart devoted to FC Barcelona, and equally enthusiastic about Formula One racing.              
            </p>
            <p>
            I'm excited to bring my technical skills and passion for innovation to new challenges and opportunities. 
            If you're looking for someone who combines a strong technical foundation with a drive for cutting-edge solutions,{' '}<a href={`mailto:${email}`}>let's connect!</a>
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
