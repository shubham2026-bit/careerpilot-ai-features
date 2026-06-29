import React from 'react'
import { Html, Body, Container, Head, Hr, Img, Link, Preview, Row, Section, Text } from '@react-email/components'

interface ResumeAnalysisEmailProps {
  userName: string
  resumeName: string
  overallScore: number
  topStrengths: string[]
  keyImprovements: string[]
  analysisUrl: string
}

export const ResumeAnalysisEmail = ({
  userName,
  resumeName,
  overallScore,
  topStrengths,
  keyImprovements,
  analysisUrl,
}: ResumeAnalysisEmailProps) => (
  <Html>
    <Head />
    <Preview>Your resume analysis is ready - Score: {overallScore}/100</Preview>
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
            Your resume <strong>{resumeName}</strong> has been analyzed! Here's your comprehensive breakdown:
          </Text>

          {/* Score Card */}
          <Section style={scoreCard}>
            <Text style={scoreTitle}>Overall Score</Text>
            <Text style={scoreValue}>{overallScore}/100</Text>
          </Section>

          {/* Strengths */}
          <Text style={sectionTitle}>Top Strengths</Text>
          <ul style={list}>
            {topStrengths.map((strength, index) => (
              <li key={index} style={listItem}>
                {strength}
              </li>
            ))}
          </ul>

          {/* Improvements */}
          <Text style={sectionTitle}>Key Improvements</Text>
          <ul style={list}>
            {keyImprovements.map((improvement, index) => (
              <li key={index} style={listItem}>
                {improvement}
              </li>
            ))}
          </ul>

          {/* CTA */}
          <Section style={ctaSection}>
            <Link style={ctaButton} href={analysisUrl}>
              View Full Analysis
            </Link>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            Need help? Our AI Career Coach is available 24/7 to answer your questions about improving your resume.
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

const sectionTitle = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#1f2937',
  margin: '24px 0 12px 0',
}

const scoreCard = {
  backgroundColor: '#f3f4f6',
  padding: '24px',
  borderRadius: '8px',
  margin: '24px 0',
  textAlign: 'center' as const,
}

const scoreTitle = {
  fontSize: '14px',
  color: '#6b7280',
  margin: '0',
}

const scoreValue = {
  fontSize: '32px',
  fontWeight: 'bold',
  color: '#6366f1',
  margin: '8px 0 0 0',
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
