
import React from 'react'
import { Html, Body, Container, Head, Hr, Link, Preview, Row, Section, Text } from '@react-email/components'

interface JobMatchEmailProps {
  userName: string
  jobTitle: string
  company: string
  matchScore: number
  matchReasons: string[]
  jobUrl: string
}

export const JobMatchEmail = ({
  userName,
  jobTitle,
  company,
  matchScore,
  matchReasons,
  jobUrl,
}: JobMatchEmailProps) => (
  <Html>
    <Head />
    <Preview>New job match: {jobTitle} at {company} - {matchScore}% match</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Header */}
        <Section style={header}>
          <Text style={logo}>CareerPilot AI</Text>
        </Section>

        {/* Content */}
        <Section style={content}>
          <Text style={greeting}>Hi {userName},</Text>

          <Text style={paragraph}>
            We found a great job match for you!
          </Text>

          {/* Job Card */}
          <Section style={jobCard}>
            <Row>
              <Text style={jobTitle2}>{jobTitle}</Text>
            </Row>
            <Text style={company2}>{company}</Text>
            <Row style={{ marginTop: '16px' }}>
              <Text style={matchBadge}>
                {matchScore}% Match
              </Text>
            </Row>
          </Section>

          {/* Why This Match */}
          <Text style={sectionTitle}>Why We Think It's a Great Fit</Text>
          <ul style={list}>
            {matchReasons.map((reason, index) => (
              <li key={index} style={listItem}>
                {reason}
              </li>
            ))}
          </ul>

          {/* CTA */}
          <Section style={ctaSection}>
            <Link style={ctaButton} href={jobUrl}>
              View Job Details
            </Link>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            Set your preferences to control how often you receive job matches, or use our AI Career Coach for interview preparation tips.
          </Text>
        </Section>

        {/* Footer */}
        <Section style={footerSection}>
          <Text style={footerText}>
            © 2024 CareerPilot AI. All rights reserved.
            <br />
            <Link href="https://careerpilot.ai/settings" style={footerLink}>
              Manage Preferences
            </Link>
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

const main = {
  backgroundColor: '#f4f4f4',
  fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '0',
  marginBottom: '64px',
}

const header = {
  backgroundColor: '#6366f1',
  padding: '24px 32px',
  textAlign: 'center' as const,
}

const logo = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0',
}

const content = {
  padding: '32px',
}

const greeting = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#1f2937',
  margin: '0 0 16px 0',
}

const paragraph = {
  fontSize: '14px',
  color: '#4b5563',
  lineHeight: '1.6',
  margin: '0 0 16px 0',
}

const jobCard = {
  backgroundColor: '#f3f4f6',
  padding: '24px',
  borderRadius: '8px',
  margin: '24px 0',
  borderLeft: '4px solid #6366f1',
}

const jobTitle2 = {
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#1f2937',
  margin: '0',
}

const company2 = {
  fontSize: '14px',
  color: '#6b7280',
  margin: '8px 0 0 0',
}

const matchBadge = {
  backgroundColor: '#dcfce7',
  color: '#15803d',
  padding: '8px 16px',
  borderRadius: '20px',
  fontSize: '13px',
  fontWeight: 'bold',
  display: 'inline-block',
}

const sectionTitle = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#1f2937',
  margin: '24px 0 12px 0',
}

const list = {
  margin: '0 0 16px 0',
  paddingLeft: '20px',
}

const listItem = {
  fontSize: '14px',
  color: '#4b5563',
  lineHeight: '1.8',
  margin: '0 0 8px 0',
}

const ctaSection = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const ctaButton = {
  backgroundColor: '#6366f1',
  color: '#ffffff',
  padding: '12px 32px',
  borderRadius: '6px',
  textDecoration: 'none',
  fontWeight: 'bold',
  fontSize: '14px',
  display: 'inline-block',
}

const hr = {
  borderColor: '#e5e7eb',
  margin: '24px 0',
}

const footer = {
  fontSize: '12px',
  color: '#6b7280',
  lineHeight: '1.6',
  margin: '0',
}

const footerSection = {
  backgroundColor: '#f9fafb',
  padding: '24px 32px',
  textAlign: 'center' as const,
}

const footerText = {
  fontSize: '12px',
  color: '#6b7280',
  margin: '0',
}

const footerLink = {
  color: '#6366f1',
  textDecoration: 'underline',
}
