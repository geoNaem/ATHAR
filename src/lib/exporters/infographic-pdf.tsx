import React from 'react';
import { 
  Document, 
  Page, 
  View, 
  Text, 
  StyleSheet, 
  Font 
} from '@react-pdf/renderer';
import { InfographicData } from './infographic-builder';

interface InfographicPDFProps {
  data: InfographicData;
  language?: 'en' | 'ar';
}

const SIENNA = '#C84B31';
const BONE = '#F5EDD9';
const DARK = '#2C1503';
const ACCENT = '#E8A87C';
const WHITE = '#FFFFFF';
const BONE_BORDER = '#D4C4A8';

const styles = StyleSheet.create({
  page: {
    backgroundColor: WHITE,
    padding: 0,
    fontFamily: 'Helvetica',
  },
  header: {
    backgroundColor: SIENNA,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    height: 60,
  },
  headerLeft: {
    flexDirection: 'column',
  },
  headerTitle: {
    fontSize: 14,
    color: WHITE,
    fontWeight: 'bold',
  },
  headerSub: {
    fontSize: 9,
    color: BONE,
    marginTop: 3,
  },
  headerBrand: {
    fontSize: 15,
    color: WHITE,
    fontWeight: 'bold',
  },
  headerDate: {
    fontSize: 8,
    color: BONE,
    marginTop: 2,
    textAlign: 'right',
  },
  middleRow: {
    flexGrow: 1,
    flexDirection: 'row',
  },
  themesSection: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: ACCENT,
    padding: 14,
  },
  findingsSection: {
    flex: 1.1,
    padding: 14,
  },
  sectionLabel: {
    fontSize: 7,
    color: SIENNA,
    fontWeight: 'bold',
    letterSpacing: 0.8,
    marginBottom: 3,
  },
  sectionSubLabel: {
    fontSize: 7,
    color: ACCENT,
    marginBottom: 10,
  },
  themeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  themeName: {
    fontSize: 8,
    color: DARK,
    width: 95,
  },
  barContainer: {
    flex: 1,
    height: 9,
    backgroundColor: BONE,
    borderRadius: 3,
    marginHorizontal: 5,
    overflow: 'hidden',
  },
  barFill: {
    height: 9,
    backgroundColor: SIENNA,
    borderRadius: 3,
  },
  themeCount: {
    fontSize: 8,
    color: ACCENT,
    width: 22,
    textAlign: 'right',
  },
  additionalThemes: {
    fontSize: 7,
    color: ACCENT,
    marginTop: 5,
    fontStyle: 'italic',
  },
  findingRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  numberCircle: {
    width: 20,
    height: 20,
    backgroundColor: BONE,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 7,
  },
  numberText: {
    fontSize: 9,
    color: SIENNA,
    fontWeight: 'bold',
  },
  findingText: {
    fontSize: 8,
    color: DARK,
    lineHeight: 1.45,
    flex: 1,
  },
  separator: {
    height: 0.5,
    backgroundColor: BONE,
    marginBottom: 8,
  },
  quoteSection: {
    backgroundColor: BONE,
    borderLeftWidth: 4,
    borderLeftColor: SIENNA,
    padding: 14,
    height: 65,
    justifyContent: 'center',
  },
  quoteText: {
    fontSize: 10,
    color: DARK,
    fontStyle: 'italic',
    lineHeight: 1.5,
  },
  quoteAttribution: {
    fontSize: 8,
    color: ACCENT,
    marginTop: 5,
  },
  footer: {
    backgroundColor: DARK,
    borderTopWidth: 1,
    borderTopColor: SIENNA,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 40,
  },
  footerCol: {
    flex: 1,
  },
  footerText: {
    fontSize: 7,
    color: ACCENT,
  },
  footerBrand: {
    fontSize: 12,
    color: SIENNA,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  footerRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  rtlText: {
    textAlign: 'right',
  },
  rtlRow: {
    flexDirection: 'row-reverse',
  }
});

export default function InfographicPDF({ data, language }: InfographicPDFProps) {
  const isAr = language === 'ar';
  const rowStyle = isAr ? [styles.middleRow, styles.rtlRow] : styles.middleRow;
  const themeRowStyle = isAr ? [styles.themeRow, styles.rtlRow] : styles.themeRow;
  const findingRowStyle = isAr ? [styles.findingRow, styles.rtlRow] : styles.findingRow;
  const headerStyle = isAr ? [styles.header, styles.rtlRow] : styles.header;
  const footerStyle = isAr ? [styles.footer, styles.rtlRow] : styles.footer;
  const quoteStyle = isAr 
    ? [styles.quoteSection, { borderLeftWidth: 0, borderRightWidth: 4, borderRightColor: SIENNA }] 
    : styles.quoteSection;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* HEADER */}
        <View style={headerStyle}>
          <View style={isAr ? { alignItems: 'flex-end' } : styles.headerLeft}>
            <Text style={styles.headerTitle}>{isAr ? 'ملخص التحليل النوعي' : 'Qualitative Analysis Summary'}</Text>
            <Text style={styles.headerSub}>{`${data.sector} · ${data.transcript_type} · ${data.methodology}`}</Text>
          </View>
          <View style={isAr ? { alignItems: 'flex-start' } : { alignItems: 'flex-end' }}>
            <Text style={styles.headerBrand}>Athar أثر</Text>
            <Text style={styles.headerDate}>{data.date}</Text>
          </View>
        </View>

        {/* CONTENT */}
        <View style={rowStyle}>
          {/* THEMES (Swap order for RTL) */}
          {isAr ? (
            <>
              <FindingsColumn data={data} isAr={isAr} style={styles.findingsSection} />
              <ThemesColumn data={data} isAr={isAr} style={[styles.themesSection, { borderRightWidth: 0, borderLeftWidth: 1, borderLeftColor: ACCENT }]} />
            </>
          ) : (
            <>
               <ThemesColumn data={data} isAr={isAr} style={styles.themesSection} />
               <FindingsColumn data={data} isAr={isAr} style={styles.findingsSection} />
            </>
          )}
        </View>

        {/* QUOTE */}
        <View style={quoteStyle}>
          <Text style={[styles.quoteText, isAr ? styles.rtlText : {}]}>"{data.pullQuote}"</Text>
          <Text style={[styles.quoteAttribution, isAr ? styles.rtlText : {}]}>
            {isAr ? `— مشارك، ${data.transcript_type}` : `— Participant, ${data.transcript_type}`}
          </Text>
        </View>

        {/* FOOTER */}
        <View style={footerStyle}>
          <View style={[styles.footerCol, isAr ? { alignItems: 'flex-end' } : {}]}>
            <Text style={styles.footerText}>{isAr ? `عدد الكلمات: ${data.wordCount}` : `Words analyzed: ${data.wordCount}`}</Text>
            <Text style={styles.footerText}>{isAr ? `المنهجية: ${data.methodology}` : `Methodology: ${data.methodology}`}</Text>
          </View>
          <Text style={styles.footerBrand}>Athar أثر</Text>
          <View style={[styles.footerCol, isAr ? { alignItems: 'flex-start' } : { alignItems: 'flex-end' }]}>
             <Text style={[styles.footerText, { fontStyle: 'italic' }]}>
              {isAr ? 'تمت معالجة الملفات في الذاكرة فقط.' : 'Files processed in memory only.'}
            </Text>
            <Text style={[styles.footerText, { color: SIENNA }]}>
              {isAr ? 'لم يتم تخزين أي شيء · athar.ai' : 'Nothing stored. · athar.ai'}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}

function ThemesColumn({ data, isAr, style }: { data: InfographicData, isAr: boolean, style: any }) {
  return (
    <View style={style}>
      <Text style={[styles.sectionLabel, isAr ? styles.rtlText : {}]}>{isAr ? 'المحاور الرئيسية' : 'KEY THEMES IDENTIFIED'}</Text>
      <Text style={[styles.sectionSubLabel, isAr ? styles.rtlText : {}]}>{isAr ? 'حسب تكرار الذكر' : 'By frequency of mention'}</Text>
      
      {data.top5themes.map((t, i) => (
        <View key={i} style={isAr ? [styles.themeRow, styles.rtlRow] : styles.themeRow}>
          <Text style={[styles.themeName, isAr ? styles.rtlText : {}, { width: 95 }]}>{t.name}</Text>
          <View style={styles.barContainer}>
            <View style={[styles.barFill, { width: `${(t.frequency / t.maxFrequency) * 100}%` }]} />
          </View>
          <Text style={[styles.themeCount, isAr ? { textAlign: 'left' } : { textAlign: 'right' }]}>×{t.frequency}</Text>
        </View>
      ))}

      {data.additionalThemeCount > 0 && (
        <Text style={[styles.additionalThemes, isAr ? styles.rtlText : {}]}>
          + {data.additionalThemeCount} {isAr ? 'محاور إضافية' : 'additional themes'}
        </Text>
      )}
    </View>
  );
}

function FindingsColumn({ data, isAr, style }: { data: InfographicData, isAr: boolean, style: any }) {
  return (
    <View style={style}>
      <Text style={[styles.sectionLabel, isAr ? styles.rtlText : {}]}>{isAr ? 'النتائج الرئيسية' : 'KEY FINDINGS'}</Text>
      
      {data.top4findings.map((finding, idx) => (
        <View key={idx}>
          <View style={isAr ? [styles.findingRow, styles.rtlRow] : styles.findingRow}>
            <View style={[styles.numberCircle, isAr ? { marginLeft: 7, marginRight: 0 } : { marginRight: 7 }]}>
              <Text style={styles.numberText}>0{idx + 1}</Text>
            </View>
            <Text style={[styles.findingText, isAr ? styles.rtlText : {}]}>{finding}</Text>
          </View>
          {idx < data.top4findings.length - 1 && <View style={styles.separator} />}
        </View>
      ))}
    </View>
  );
}
