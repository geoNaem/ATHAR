/**
 * PDF Infographic Document Component
 * Uses @react-pdf/renderer — pure layout/text/color, no external images.
 *
 * 5-zone A4 layout:
 *   Zone 1 — Header Band (teal)
 *   Zone 2 — Top Themes bar chart (left column)
 *   Zone 3 — Key Findings numbered callouts (right column)
 *   Zone 4 — Pull Quote (sand background, saffron border)
 *   Zone 5 — Footer Band (off-white)
 */

import React from 'react';
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
} from '@react-pdf/renderer';
import type { InfographicData } from './infographic-builder';

// ── Color palette (hex — react-pdf does not support oklch) ──────────────────
const C = {
  TEAL:           '#1A5C5A',
  SAFFRON:        '#C4930A',
  SAND:           '#FFF8EC',
  LIGHT_TEAL_BG:  '#EAF4F3',
  OFF_WHITE:      '#F5F5F0',
  DARK_TEXT:      '#1A1A1A',
  GRAY_TEXT:      '#6B6B6B',
  WHITE:          '#FFFFFF',
  BORDER:         '#E0E0E0',
  TEAL_MUTED:     '#B2D8D7',
  SEPARATOR:      '#E8E8E8',
} as const;

// ── Shared styles ─────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: C.WHITE,
    fontFamily: 'Helvetica',
    fontSize: 9,
  },

  // Zone 1 — Header
  headerBand: {
    backgroundColor: C.TEAL,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: { flex: 1 },
  headerRight: { alignItems: 'flex-end' },
  headerTitle: { fontSize: 13, color: C.WHITE, fontFamily: 'Helvetica-Bold' },
  headerSubtitle: { fontSize: 9, color: C.TEAL_MUTED, marginTop: 3 },
  headerBrand: { fontSize: 14, color: C.WHITE, fontFamily: 'Helvetica-Bold', textAlign: 'right' },
  headerDate: { fontSize: 8, color: C.TEAL_MUTED, marginTop: 2, textAlign: 'right' },

  // Zone 2+3 — Middle row
  middleRow: { flexDirection: 'row', flex: 1 },

  // Zone 2 — Themes
  themesCol: {
    flex: 1,
    padding: 14,
    backgroundColor: C.WHITE,
    borderRight: `1pt solid ${C.BORDER}`,
  },
  sectionLabel: {
    fontSize: 8,
    color: C.TEAL,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 0.8,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  sectionSubLabel: {
    fontSize: 7,
    color: C.GRAY_TEXT,
    marginBottom: 10,
  },
  themeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 7,
  },
  themeName: {
    fontSize: 8,
    color: C.DARK_TEXT,
    width: 90,
    flexShrink: 0,
  },
  barContainer: {
    flex: 1,
    height: 10,
    backgroundColor: C.LIGHT_TEAL_BG,
    borderRadius: 3,
    marginHorizontal: 6,
  },
  barFreq: {
    fontSize: 8,
    color: C.GRAY_TEXT,
    width: 20,
    textAlign: 'right',
  },
  additionalThemes: {
    fontSize: 7,
    color: C.GRAY_TEXT,
    marginTop: 6,
    fontStyle: 'italic',
  },

  // Zone 3 — Findings
  findingsCol: {
    flex: 1.1,
    padding: 14,
    backgroundColor: C.WHITE,
  },
  findingRow: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  findingNumBox: {
    width: 22,
    height: 22,
    backgroundColor: C.LIGHT_TEAL_BG,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    flexShrink: 0,
  },
  findingNum: {
    fontSize: 9,
    color: C.TEAL,
    fontFamily: 'Helvetica-Bold',
  },
  findingText: {
    fontSize: 8.5,
    color: C.DARK_TEXT,
    lineHeight: 1.4,
    flex: 1,
  },
  findingSeparator: {
    height: 0.5,
    backgroundColor: C.SEPARATOR,
    marginBottom: 10,
  },

  // Zone 4 — Pull Quote
  quoteZone: {
    backgroundColor: C.SAND,
    borderLeft: `4pt solid ${C.SAFFRON}`,
    padding: '12 16',
  },
  quoteText: {
    fontSize: 10,
    color: C.DARK_TEXT,
    fontStyle: 'italic',
    lineHeight: 1.5,
  },
  quoteAttribution: {
    fontSize: 8,
    color: C.GRAY_TEXT,
    marginTop: 6,
  },

  // Zone 4 RTL variant
  quoteZoneRtl: {
    backgroundColor: C.SAND,
    borderRight: `4pt solid ${C.SAFFRON}`,
    padding: '12 16',
  },

  // Zone 5 — Footer
  footerBand: {
    backgroundColor: C.OFF_WHITE,
    borderTop: `1pt solid ${C.TEAL}`,
    padding: '8 12',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  footerCol: { flex: 1 },
  footerCenter: { flex: 1, alignItems: 'center' },
  footerRight: { flex: 1, alignItems: 'flex-end' },
  footerStat: { fontSize: 7.5, color: C.GRAY_TEXT },
  footerBrand: { fontSize: 11, color: C.TEAL, fontFamily: 'Helvetica-Bold', textAlign: 'center' },
  footerRetention: { fontSize: 7, color: C.GRAY_TEXT, fontStyle: 'italic' },
  footerUrl: { fontSize: 7, color: C.TEAL },
});

// ── Zone 2: Theme bars ────────────────────────────────────────────────────────

function ThemeBars({ data, rtl }: { data: InfographicData; rtl: boolean }) {
  return (
    <View style={styles.themesCol}>
      <Text style={styles.sectionLabel}>Key Themes Identified</Text>
      <Text style={styles.sectionSubLabel}>By frequency of mention</Text>
      {data.top5themes.map((theme, idx) => {
        const barPct = (theme.frequency / (theme.maxFrequency || 1)) * 100;
        return (
          <View key={idx} style={[styles.themeRow, rtl ? { flexDirection: 'row-reverse' } : {}]}>
            <Text style={[styles.themeName, rtl ? { textAlign: 'right' } : {}]}>{theme.name}</Text>
            <View style={styles.barContainer}>
              <View
                style={{
                  width: `${barPct}%`,
                  backgroundColor: C.TEAL,
                  height: 10,
                  borderRadius: 3,
                }}
              />
            </View>
            <Text style={styles.barFreq}>×{theme.frequency}</Text>
          </View>
        );
      })}
      {data.additionalThemeCount > 0 && (
        <Text style={styles.additionalThemes}>
          + {data.additionalThemeCount} additional theme{data.additionalThemeCount !== 1 ? 's' : ''}
        </Text>
      )}
    </View>
  );
}

// ── Zone 3: Key Findings ──────────────────────────────────────────────────────

function KeyFindings({ data, rtl }: { data: InfographicData; rtl: boolean }) {
  return (
    <View style={styles.findingsCol}>
      <Text style={[styles.sectionLabel, rtl ? { textAlign: 'right' } : {}]}>Key Findings</Text>
      {data.top4findings.map((finding, idx) => (
        <React.Fragment key={idx}>
          <View style={[styles.findingRow, rtl ? { flexDirection: 'row-reverse' } : {}]}>
            <View style={styles.findingNumBox}>
              <Text style={styles.findingNum}>{String(idx + 1).padStart(2, '0')}</Text>
            </View>
            <Text style={[styles.findingText, rtl ? { textAlign: 'right' } : {}]}>
              {finding}
            </Text>
          </View>
          {idx < data.top4findings.length - 1 && <View style={styles.findingSeparator} />}
        </React.Fragment>
      ))}
    </View>
  );
}

// ── Main Document Component ───────────────────────────────────────────────────

interface InfographicPDFProps {
  data: InfographicData;
  language?: 'en' | 'ar';
}

export function InfographicPDF({ data, language = 'en' }: InfographicPDFProps) {
  const rtl = language === 'ar';

  return (
    <Document
      title="Qualitative Analysis Summary — Athar"
      author="Athar أثر"
      creator="Athar أثر · athar.ai"
    >
      <Page size="A4" style={styles.page}>

        {/* ── Zone 1: Header ── */}
        <View style={styles.headerBand}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Qualitative Analysis Summary</Text>
            <Text style={styles.headerSubtitle}>
              {data.sector} · {data.transcript_type} · {data.methodology}
            </Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.headerBrand}>Athar أثر</Text>
            <Text style={styles.headerDate}>{data.date}</Text>
          </View>
        </View>

        {/* ── Zones 2+3: Middle row ── */}
        <View style={styles.middleRow}>
          {rtl ? (
            <>
              <KeyFindings data={data} rtl={rtl} />
              <ThemeBars data={data} rtl={rtl} />
            </>
          ) : (
            <>
              <ThemeBars data={data} rtl={rtl} />
              <KeyFindings data={data} rtl={rtl} />
            </>
          )}
        </View>

        {/* ── Zone 4: Pull Quote ── */}
        <View style={rtl ? styles.quoteZoneRtl : styles.quoteZone}>
          <Text style={[styles.quoteText, rtl ? { textAlign: 'right' } : {}]}>
            "{data.pullQuote}"
          </Text>
          <Text style={[styles.quoteAttribution, rtl ? { textAlign: 'right' } : {}]}>
            — Participant, {data.transcript_type}
          </Text>
        </View>

        {/* ── Zone 5: Footer ── */}
        <View style={styles.footerBand}>
          <View style={styles.footerCol}>
            <Text style={styles.footerStat}>Words analyzed: {data.wordCount.toLocaleString()}</Text>
            <Text style={styles.footerStat}>Methodology: {data.methodology}</Text>
            <Text style={styles.footerStat}>Sector: {data.sector}</Text>
          </View>
          <View style={styles.footerCenter}>
            <Text style={styles.footerBrand}>Athar أثر</Text>
          </View>
          <View style={styles.footerRight}>
            <Text style={styles.footerRetention}>Files processed in memory only.</Text>
            <Text style={styles.footerUrl}>Nothing stored. · athar.ai</Text>
          </View>
        </View>

      </Page>
    </Document>
  );
}
