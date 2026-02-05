export interface PageTemplate {
    id: string;
    name: string;
    description: string;
    content: string;
}

export const PAGE_TEMPLATES: PageTemplate[] = [
    {
        id: 'meeting-notes',
        name: 'Meeting Notes',
        description: 'Structure for recording outcomes and actions.',
        content: `# Meeting Notes: [Title]
**Date:** [Date]
**Participants:** [List]

## Agenda
- Item 1
- Item 2

## Discussion
* Point A
* Point B

## Action Items
- [ ] Action 1
- [ ] Action 2

## Next Steps
[Description]`
    },
    {
        id: 'project-plan',
        name: 'Project Plan',
        description: 'High-level overview of goals and milestones.',
        content: `# Project Plan: [Project Name]

## 1. Overview
Briefly describe the project goals.

## 2. Objectives
* Objective 1
* Objective 2

## 3. Milestones
| Milestone | Target Date | Owner |
|-----------|-------------|-------|
| Q1 Launch | 2024-03-31  | @user |
| Review    | 2024-04-15  | @team |

## 4. Risks & Mitigations
[Content here]`
    },
    {
        id: 'technical-spec',
        name: 'Technical Specification',
        description: 'Detailed architecture and design document.',
        content: `# Technical Spec: [System Name]

## 1. Context
Provide background and problem statement.

## 2. Proposed Solution
High-level description of the fix or feature.

## 3. Architecture
### Components
- Component A
- Component B

### Data Model
\`\`\`sql
-- Schema details
\`\`\`

## 4. Implementation Plan
- Phase 1
- Phase 2

## 5. Security & Performance
- Rate limiting
- Data encryption`
    }
];
