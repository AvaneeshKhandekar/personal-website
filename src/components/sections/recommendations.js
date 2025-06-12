import React, { useEffect, useRef } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styled from 'styled-components';
import sr from '@utils/sr';
import { srConfig } from '@config';
import { usePrefersReducedMotion } from '@hooks';

const StyledRecommendationsSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 100px 0;

  h2 {
    font-size: clamp(24px, 5vw, var(--fz-heading));
  }

  .recommendation-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 30px;
    margin-top: 50px;
  }

  .recommendation-card {
    background: var(--light-navy);
    border-radius: var(--border-radius);
    padding: 1.75rem;
    box-shadow: var(--box-shadow);
    color: var(--light-slate);
    font-size: var(--fz-md);
    position: relative;
    transition: var(--transition);

    &:hover {
      transform: translateY(-5px);
    }

    .quote {
      font-style: italic;
      margin-bottom: 1rem;
    }

    .name {
      font-weight: bold;
      color: var(--lightest-slate);
    }

    .title {
      font-size: var(--fz-sm);
      color: var(--slate);
    }
  }
`;

const Recommendations = () => {
    const data = useStaticQuery(graphql`
    query {
      recommendations: allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/content/recommendations/" } }
        sort: { fields: [frontmatter___order], order: ASC }
      ) {
        edges {
          node {
            frontmatter {
              name
              title
            }
            html
          }
        }
      }
    }
  `);

    const prefersReducedMotion = usePrefersReducedMotion();
    const revealTitle = useRef(null);
    const revealRefs = useRef([]);

    useEffect(() => {
        if (prefersReducedMotion) return;
        sr.reveal(revealTitle.current, srConfig());
        revealRefs.current.forEach((ref, i) => sr.reveal(ref, srConfig(i * 100)));
    }, []);

    const recommendations = data.recommendations.edges;

    return (
        <StyledRecommendationsSection id="recommendations">
            <h2 className="numbered-heading" ref={revealTitle}>
                What People Say
            </h2>

            <div className="recommendation-grid">
                <TransitionGroup component={null}>
                    {recommendations.map(({ node }, i) => {
                        const { name, title } = node.frontmatter;
                        const html = node.html;

                        return (
                            <CSSTransition key={i} classNames="fadeup" timeout={300} exit={false}>
                                <div
                                    className="recommendation-card"
                                    ref={el => (revealRefs.current[i] = el)}
                                >
                                    <div className="quote" dangerouslySetInnerHTML={{ __html: html }} />
                                    <div className="name">{name}</div>
                                    <div className="title">{title}</div>
                                </div>
                            </CSSTransition>
                        );
                    })}
                </TransitionGroup>
            </div>
        </StyledRecommendationsSection>
    );
};

export default Recommendations;
