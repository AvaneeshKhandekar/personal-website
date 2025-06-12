import React, { useEffect, useRef, useState } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styled from 'styled-components';
import sr from '@utils/sr';
import { srConfig } from '@config';
import { usePrefersReducedMotion } from '@hooks';

const StyledRecommendationsSection = styled.section`
    max-width: 700px;
    margin: 100px auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;

    h2 {
        font-size: clamp(24px, 5vw, var(--fz-heading));
    }

    .recommendation-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 30px;
    margin-top: 50px;
    justify-content: center;
    margin-left: auto;
    margin-right: auto;
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
      color: var(--slate);
      font-size: 16px;
      line-height: 1.6;
      white-space: pre-line;
    }

    .name {
      font-weight: 600;
      color: var(--lightest-slate);
      margin-bottom: 4px;
    }

    .title {
      font-size: var(--fz-sm);
      color: var(--slate);
      margin-bottom: 10px;
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
  }
`;

const RECOMMENDATION_PREVIEW_LENGTH = 250;

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
            rawMarkdownBody
          }
        }
      }
    }
  `);

    const prefersReducedMotion = usePrefersReducedMotion();
    const revealTitle = useRef(null);
    const revealRefs = useRef([]);
    const [expandedIndices, setExpandedIndices] = useState([]);

    useEffect(() => {
        if (prefersReducedMotion) return;
        sr.reveal(revealTitle.current, srConfig());
        revealRefs.current.forEach((ref, i) => sr.reveal(ref, srConfig(i * 100)));
    }, []);

    const toggleExpand = (index) => {
        setExpandedIndices((prev) => {
            const isCurrentlyExpanded = prev.includes(index);
            let newExpanded;

            if (isCurrentlyExpanded) {
                newExpanded = prev.filter(i => i !== index);

                const el = revealRefs.current[index];
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            } else {
                newExpanded = [...prev, index];
            }

            return newExpanded;
        });
    };

    const recommendations = data.recommendations.edges.map(({ node }) => ({
        name: node.frontmatter.name,
        title: node.frontmatter.title,
        text: node.rawMarkdownBody.trim(),
    }));

    return (
        <StyledRecommendationsSection id="recommendations">
            <h2 className="numbered-heading" ref={revealTitle}>
                What People Say
            </h2>

            <div className="recommendation-grid">
                <TransitionGroup component={null}>
                    {recommendations.map((rec, i) => {
                        const { name, title, text } = rec;
                        const isExpanded = expandedIndices.includes(i);
                        const preview = text.slice(0, RECOMMENDATION_PREVIEW_LENGTH);

                        return (
                            <CSSTransition key={i} classNames="fadeup" timeout={300} exit={false}>
                                <div
                                    className="recommendation-card"
                                    ref={el => (revealRefs.current[i] = el)}>
                                    <div className="quote">
                                        {isExpanded ? text : preview + (text.length > RECOMMENDATION_PREVIEW_LENGTH ? '...' : '')}
                                    </div>
                                    {text.length > RECOMMENDATION_PREVIEW_LENGTH && (
                                        <span className="expand-toggle" onClick={() => toggleExpand(i)}>
                                            {isExpanded ? 'Show less' : 'Read more'}
                                        </span>
                                    )}
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
