import React, { useState, useEffect } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styled from 'styled-components';
import { navDelay, loaderDelay } from '@utils';
import { usePrefersReducedMotion } from '@hooks';
import { email } from '@config';

const StyledHeroSection = styled.section`
  ${({ theme }) => theme.mixins.flexCenter};
  flex-direction: column;
  align-items: flex-start;
  min-height: 100vh;
  padding: 0;

  @media (max-height: 700px) and (min-width: 700px), (max-width: 360px) {
    height: auto;
    padding-top: var(--nav-height);
  }

  h1 {
    margin: 0 0 30px 4px;
    color: var(--green);
    font-family: var(--font-mono);
    font-size: clamp(var(--fz-sm), 5vw, var(--fz-md));
    font-weight: 400;

    @media (max-width: 480px) {
      margin: 0 0 20px 2px;
    }
  }

  h3 {
    margin-top: 5px;
    color: var(--slate);
    line-height: 0.9;
  }

  p {
    margin: 20px 0 0;
    max-width: 540px;
  }

  .email-link {
    ${({ theme }) => theme.mixins.bigButton};
    margin-top: 50px;
  }

 .recommendations-container {
  margin-top: 40px;
  max-width: 540px;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.02);
  border-radius: var(--border-radius);
}

.recommendation {
  padding: 16px 0;
  border-bottom: 1px solid var(--lightest-navy);
}

.recommendation:last-child {
  border-bottom: none;
}

.recommendation-name {
  font-weight: 600;
  color: var(--lightest-slate);
  margin-bottom: 4px;
}

.recommendation-title {
  color: var(--slate);
  font-size: var(--fz-sm);
  margin-bottom: 10px;
}

.recommendation-text {
  color: var(--slate);
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 10px;
  white-space: pre-line;
}

.expand-toggle {
  color: var(--green);
  font-family: var(--font-mono);
  font-size: var(--fz-xs);
  cursor: pointer;
  user-select: none;
  display: inline-block;
  margin-top: 4px;
}
`;

const RECOMMENDATION_PREVIEW_LENGTH = 150;

const Hero = () => {
  const data = useStaticQuery(graphql`
        query {
      recommendations: allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/content/recommendations/" } }
        sort: { fields: [frontmatter___order], order: ASC }
        limit: 3
      ) {
        edges {
          node {
            frontmatter {
              name
              title
            }
            rawMarkdownBody
          }
        }
      }
    }
  `);

  const [isMounted, setIsMounted] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  const [expandedIndices, setExpandedIndices] = useState([]);

  const toggleExpand = (index) => {
    setExpandedIndices((prev) =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };


  useEffect(() => {
    if (prefersReducedMotion) return;

    const timeout = setTimeout(() => setIsMounted(true), navDelay);
    return () => clearTimeout(timeout);
  }, []);

  const recommendations = data.recommendations.edges.map(({ node }) => ({
    name: node.frontmatter.name,
    title: node.frontmatter.title,
    text: node.rawMarkdownBody.trim(),
  }));

  const renderRecommendation = ({ name, title, text }, index) => {
    const isExpanded = expandedIndices.includes(index);
    const preview = text.slice(0, RECOMMENDATION_PREVIEW_LENGTH);

    return (
      <div key={index} className="recommendation">
        <div className="recommendation-name">
          <strong>{name}</strong>
        </div>
        {title && <div className="recommendation-title">{title}</div>}
        <p className="recommendation-text">
          {isExpanded ? text : preview + (text.length > RECOMMENDATION_PREVIEW_LENGTH ? '...' : '')}
        </p>
        {text.length > RECOMMENDATION_PREVIEW_LENGTH && (
          <span className="expand-toggle" onClick={() => toggleExpand(index)}>
            {isExpanded ? 'Show less' : 'Read more'}
          </span>
        )}
      </div>
    );
  };


  const one = <h1>Hi, my name is</h1>;
  const two = <h2 className="big-heading">Avaneesh Khandekar</h2>;
  const three = (
    <h3 className="big-heading">
      SWE at{' '}
      <a href="https://www.kaseya.com/" target="_blank" rel="noreferrer">
        <u>Kaseya</u>
      </a>
    </h3>
  );
  const four = (
    <>
      <p>
        I'm a full-stack engineer with 3+ years building scalable, cloud-native, serverless applications. I help build{' '}
        <a href="https://saasalerts.com/" target="_blank" rel="noreferrer">
          SaaS Alerts
        </a>{' '}
        at{' '}
        <a href="https://www.kaseya.com/" target="_blank" rel="noreferrer">
          Kaseya
        </a>
        , enhancing real-time threat detection for MSPs. I also have a strong interest in applying AI and machine learning to solve real-world problems.
      </p>
    </>
  );
  const five = (
    <a className="email-link" href={`mailto:${email}`} target="_blank" rel="noreferrer">
      Get in touch!
    </a>
  );

  const recommendationsBlock =
    recommendations.length > 0 ? (
      <div className="recommendations-container" aria-label="Recommendations">
        <h4 style={{ marginBottom: '20px', color: 'var(--green)' }}>
          What people say about me
        </h4>
        {recommendations.map((rec, i) => renderRecommendation(rec, i))}
      </div>
    ) : null;

  const items = [one, two, three, four, five, recommendationsBlock];

  return (
    <StyledHeroSection>
      {prefersReducedMotion ? (
        <>
          {items.map((item, i) => (
            <div key={i}>{item}</div>
          ))}
        </>
      ) : (
        <TransitionGroup component={null}>
          {isMounted &&
            items.map((item, i) => (
              <CSSTransition key={i} classNames="fadeup" timeout={loaderDelay}>
                <div style={{ transitionDelay: `${i + 1}00ms` }}>{item}</div>
              </CSSTransition>
            ))}
        </TransitionGroup>
      )}
    </StyledHeroSection>
  );
};

export default Hero;
