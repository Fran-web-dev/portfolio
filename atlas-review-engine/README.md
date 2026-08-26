# Atlas Review Engine

AI-assisted code review platform concept that summarizes pull request diffs, classifies risk and turns feedback into tracked engineering actions.

## Recruiter Signal

- Developer tools mindset and familiarity with GitHub-based workflows.
- Practical AI product design focused on usefulness, not novelty.
- Strong frontend UX for review queues, risk labels and action tracking.

## Suggested Architecture

- Next.js application for dashboard and API routes.
- GitHub API integration for pull requests, files, comments and review status.
- OpenAI API for diff summaries, risk classification and reviewer guidance.
- Redis for caching repository metadata and repeated summaries.
- Background jobs for large PR analysis and status updates.

## Core Features

- Pull request overview with summary, ownership and risk areas.
- Risk labels for auth, data, security, accessibility and performance.
- Review queue sorted by impact, blocked status and reviewer availability.
- Comment-to-action tracker for follow-through after review.
- Prompt and evaluation notes for making AI output safer and more consistent.

## Portfolio Story

This project shows product thinking around how engineers actually work: reducing context switching, making review risk visible and improving collaboration without replacing human judgment.
