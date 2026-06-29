'use server'

import React from 'react'
import { Html, Body, Container, Head, Hr, Link, Preview, Row, Section, Text } from '@react-email/components'

interface WeeklyDigestEmailProps {
  userName: string
  newResumeScore?: number
  jobMatches: number
  careerTipTitle: string
  careerTipContent: string
  dashboardUrl: string
}

export const WeeklyDigestEmail = ({
  userName,
  newResumeScore,
  jobMatches,
  careerTipTitle,
  careerTipContent,
  dashboardUrl,
}: WeeklyDigestEmailProps) => (
  <Html>
    <Head />
    <Preview>Your weekly CareerPilot digest is ready!</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Header */}
        <Section style={header}>
          <Text style={logo}>CareerPilot AI</Text>
          <Text style={headerSubtitle}>Weekly Career Digest</Text>
        </Section>

        {/* Content */}
        <Section style={content}>
          <Text style={greeting}>Hi {userName},</Text>

          <Text style={paragraph}>
            Here's your weekly career update. Keep up the momentum in your job search!
          </Text>

          {/* Stats */}
          <Section style={statsContainer}>
            {newResumeScore && (
              <Row style={statsRow}>
                <Section style={statBox}>
                  <Text style={statValue}>{newResumeScore}</Text>
                  <Text style={statLabel}>Resume Score</Text>
                </Section>
              </Row>
            )}
            <Row style={statsRow}>
              <Section style={statBox}>
                <Text style={statValue}>{jobMatches}</Text>
                <Text style={statLabel}>New Job Matches</Text>
              </Section>
            </Row>
          </Section>

          {/* Career Tip */}
          <Section style={tipBox}>
            <Text style={tipTitle}>{careerTipTitle}</Text>
            <Text style={tipContent}>{careerTipContent}</Text>
          </Section>

          {/* CTA */}
          <Section style={ctaSection}>
            <Link style={ctaButton} href={dashboardUrl}>
              View Your Dashboard
            </Link>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            Questions? Chat with our AI Career Coach anytime for personalized advice.
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
  padding: '32px',
  textAlign: 'center' as const,
}

const logo = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0',
}

const headerSubtitle = {
  color: '#c7d2fe',
  fontSize: '14px',
  margin: '8px 0 0 0',
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
  margin: '0 0 24px 0',
}

const statsContainer = {
  margin: '24px 0',
}

const statsRow = {
  marginBottom: '16px',
}

const statBox = {
  backgroundColor: '#f3f4f6',
  padding: '20px',
  borderRadius: '8px',
  textAlign: 'center' as const,
}

const statValue = {
  fontSize: '28px',
  fontWeight: 'bold',
  color: '#6366f1',
  margin: '0',
}

const statLabel = {
  fontSize: '13px',
  color: '#6b7280',
  margin: '8px 0 0 0',
}

const tipBox = {
  backgroundColor: '#eff6ff',
  borderLeft: '4px solid #3b82f6',
  padding: '20px',
  borderRadius: '6px',
  margin: '24px 0',
}

const tipTitle = {
  fontSize: '15px',
  fontWeight: 'bold',
  color: '#1e40af',
  margin: '0 0 8px 0',
}

const tipContent = {
  fontSize: '13px',
  color: '#1e3a8a',
  lineHeight: '1.6',
  margin: '0',
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
