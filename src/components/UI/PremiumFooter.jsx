import { useTranslation } from 'react-i18next';

const PremiumFooter = () => {
  const { t } = useTranslation();

  return (
    <footer style={{
        position: 'relative',
        width: '100%',
        padding: 'clamp(15px, 3vh, 40px) 15px clamp(10px, 2vh, 25px)',
        background: 'transparent',
        borderTop: '1px solid var(--glass-border)',
        overflow: 'hidden',
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none'
      }}
    >
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '0 10px' }}>
        <p style={{
          fontSize: 'clamp(0.55rem, 0.9vw, 0.75rem)',
          color: 'var(--text-muted)',
          fontFamily: "'Space Mono', monospace",
          letterSpacing: '3px',
          textTransform: 'uppercase',
          opacity: 0.5
        }}>
          &copy; {new Date().getFullYear()} {t('footer.copyright')}
        </p>
      </div>
    </footer>
  );
};

export default PremiumFooter;
